import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ProjectPoint,
  Partner,
  ClaimApplication,
  ProgressUpdate,
  CheckIn,
  AuditLog,
  PointStatus,
  ReviewStatus,
} from "@/types";
import {
  seedPoints,
  seedPartners,
  seedClaims,
  seedProgress,
  seedCheckIns,
} from "@/data/seed";
import { generateToken } from "@/lib/utils";

interface PlatformState {
  // 数据
  points: ProjectPoint[];
  partners: Partner[];
  claims: ClaimApplication[];
  progress: ProgressUpdate[];
  checkIns: CheckIn[];
  auditLogs: AuditLog[];

  // ========== 点位管理 ==========
  addPoint: (point: Omit<ProjectPoint, "id" | "createdAt" | "status">) => void;
  updatePoint: (id: string, patch: Partial<ProjectPoint>) => void;
  removePoint: (id: string) => void;
  /** 发布/下架点位 */
  setPointStatus: (id: string, status: PointStatus) => void;
  /** 生成或重置点位专属访问链接 */
  regenerateAccessToken: (pointId: string) => string;
  /** 失效专属链接 */
  revokeAccessToken: (pointId: string) => void;

  // ========== 认领流程 ==========
  submitClaim: (
    pointId: string,
    data: Omit<ClaimApplication, "id" | "pointId" | "status" | "createdAt">,
  ) => ClaimApplication;
  reviewClaim: (
    claimId: string,
    approve: boolean,
    note?: string,
  ) => void;

  // ========== 进展动态 ==========
  publishProgress: (update: Omit<ProgressUpdate, "id" | "publishedAt" | "published">) => void;

  // ========== 老师打卡 ==========
  submitCheckIn: (data: Omit<CheckIn, "id" | "status" | "submittedAt">) => void;
  reviewCheckIn: (
    checkInId: string,
    approve: boolean,
    note?: string,
  ) => void;

  // ========== 工具方法 ==========
  getPointById: (id: string) => ProjectPoint | undefined;
  getPartnerByToken: (token: string) => { partner: Partner; point: ProjectPoint } | null;
  getPointBySchoolCode: (code: string) => ProjectPoint | undefined;
  getCheckInsBySchoolCode: (code: string) => CheckIn[];
  resetToSeed: () => void;

  /** 记录一次超期未打卡提醒（写入操作留痕） */
  sendOverdueReminder: (pointId: string, detail: string) => void;

  // ========== 审核队列统计 ==========
  pendingClaimCount: () => number;
  pendingCheckInCount: () => number;
}

function now() {
  return new Date().toISOString().slice(0, 10);
}

function createAuditLog(
  state: PlatformState,
  action: string,
  targetType: string,
  targetId: string,
  detail: string,
): AuditLog {
  const log: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    action,
    targetType,
    targetId,
    detail,
    operator: "机构管理员",
    createdAt: new Date().toISOString(),
  };
  state.auditLogs = [log, ...state.auditLogs];
  return log;
}

export const usePlatformStore = create<PlatformState>()(
  persist(
    (set, get) => ({
      points: [...seedPoints],
      partners: [...seedPartners],
      claims: [...seedClaims],
      progress: [...seedProgress],
      checkIns: [...seedCheckIns],
      auditLogs: [],

      // ========== 点位 ==========
      addPoint: (pointData) => {
        const state = get();
        const p: ProjectPoint = {
          ...pointData,
          id: `pt-${Date.now().toString().slice(-6)}`,
          status: pointData.partnerId ? "in_progress" : "pending_claim",
          createdAt: now(),
        };
        set({ points: [p, ...state.points] });
        createAuditLog(
          get(),
          "新建点位",
          "point",
          p.id,
          `创建点位「${p.name}」（${p.region}）`,
        );
      },

      updatePoint: (id, patch) => {
        set((s) => ({
          points: s.points.map((p) =>
            p.id === id ? { ...p, ...patch } : p,
          ),
        }));
      },

      removePoint: (id) => {
        const state = get();
        set({ points: state.points.filter((p) => p.id !== id) });
        createAuditLog(get(), "删除点位", "point", id, `删除点位 ${id}`);
      },

      setPointStatus: (id, status) => {
        set((s) => ({
          points: s.points.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status,
                  completedAt:
                    status === "completed" ? now() : p.completedAt,
                }
              : p,
          ),
        }));
      },

      regenerateAccessToken: (pointId) => {
        const token = generateToken(24);
        set((s) => ({
          points: s.points.map((p) =>
            p.id === pointId
              ? { ...p, accessToken: token, tokenRevoked: false }
              : p,
          ),
        }));
        createAuditLog(
          get(),
          "重新生成专属链接",
          "point",
          pointId,
          `点位 ${pointId} 专属访问链接已重置`,
        );
        return token;
      },

      revokeAccessToken: (pointId) => {
        set((s) => ({
          points: s.points.map((p) =>
            p.id === pointId ? { ...p, tokenRevoked: true } : p,
          ),
        }));
        createAuditLog(
          get(),
          "失效专属链接",
          "point",
          pointId,
          `点位 ${pointId} 专属访问链接已失效`,
        );
      },

      // ========== 认领 ==========
      submitClaim: (pointId, data) => {
        const state = get();
        const claim: ClaimApplication = {
          id: `cl-${Date.now().toString().slice(-6)}`,
          pointId,
          ...data,
          status: "pending",
          createdAt: now(),
        };
        // 锁定点位
        const updatedPoints = state.points.map((p) =>
          p.id === pointId ? { ...p, status: "claim_pending" as PointStatus } : p,
        );
        set({
          claims: [claim, ...state.claims],
          points: updatedPoints,
        });
        return claim;
      },

      reviewClaim: (claimId, approve, note) => {
        const state = get();
        const claim = state.claims.find((c) => c.id === claimId);
        if (!claim) return;

        const status: ReviewStatus = approve ? "approved" : "rejected";
        let updatedPoints = state.points;
        let updatedPartners = state.partners;

        if (approve) {
          // 审核通过：绑定合作方，点位进入进行中，生成专属 token
          const partnerId = `p-${Date.now().toString().slice(-6)}`;
          const newPartner: Partner = {
            id: partnerId,
            name: claim.partnerName,
            type: claim.partnerType,
            contactPerson: claim.contactPerson,
            contactPhone: claim.contactPhone,
            contactEmail: claim.contactEmail,
            points: [claim.pointId],
          };
          updatedPartners = [newPartner, ...state.partners];

          const token = generateToken(24);
          updatedPoints = state.points.map((p) =>
            p.id === claim.pointId
              ? {
                  ...p,
                  status: "in_progress" as PointStatus,
                  partnerId,
                  accessToken: token,
                  tokenRevoked: false,
                }
              : p,
          );
        } else {
          // 审核驳回：解锁点位，恢复待认领
          updatedPoints = state.points.map((p) =>
            p.id === claim.pointId
              ? { ...p, status: "pending_claim" as PointStatus }
              : p,
          );
        }

        set({
          claims: state.claims.map((c) =>
            c.id === claimId
              ? {
                  ...c,
                  status,
                  reviewNote: note,
                  reviewedAt: now(),
                }
              : c,
          ),
          points: updatedPoints,
          partners: updatedPartners,
        });
        createAuditLog(
          get(),
          approve ? "认领审核通过" : "认领审核驳回",
          "claim",
          claimId,
          `${claim.partnerName} 申请认领点位（${claim.pointId}）${approve ? "审核通过，已绑定合作方" : `驳回（${note ?? "无备注"}）`}`,
        );
      },

      // ========== 进展 ==========
      publishProgress: (updateData) => {
        const update: ProgressUpdate = {
          ...updateData,
          id: `pr-${Date.now().toString().slice(-6)}`,
          published: true,
          publishedAt: now(),
        };
        set((s) => ({ progress: [update, ...s.progress] }));
      },

      // ========== 打卡 ==========
      submitCheckIn: (data) => {
        const checkIn: CheckIn = {
          ...data,
          id: `ci-${Date.now().toString().slice(-6)}`,
          status: "pending",
          submittedAt: now(),
        };
        set((s) => ({ checkIns: [checkIn, ...s.checkIns] }));
      },

      reviewCheckIn: (checkInId, approve, note) => {
        const state = get();
        const checkIn = state.checkIns.find((c) => c.id === checkInId);
        if (!checkIn) return;

        set({
          checkIns: state.checkIns.map((c) =>
            c.id === checkInId
              ? {
                  ...c,
                  status: approve ? "approved" : "rejected",
                  reviewNote: note,
                  reviewedAt: now(),
                }
              : c,
          ),
        });
        createAuditLog(
          get(),
          approve ? "打卡审核通过" : "打卡审核驳回",
          "checkin",
          checkInId,
          `${checkIn.teacherName}（${checkIn.schoolName}）提交的「${checkIn.courseName}」${approve ? "审核通过，已汇入素材池" : `驳回（${note ?? "无备注"}）`}`,
        );
      },

      // ========== 工具方法 ==========
      getPointById: (id) => get().points.find((p) => p.id === id),

      getPartnerByToken: (token) => {
        const state = get();
        const point = state.points.find(
          (p) => p.accessToken === token && !p.tokenRevoked,
        );
        if (!point || !point.partnerId) return null;
        const partner = state.partners.find((p) => p.id === point.partnerId);
        if (!partner) return null;
        return { partner, point };
      },

      getPointBySchoolCode: (code) =>
        get().points.find(
          (p) => p.schoolCode === code && p.status === "in_progress",
        ),

      getCheckInsBySchoolCode: (code) =>
        get()
          .checkIns.filter((c) => c.schoolCode === code)
          .sort(
            (a, b) =>
              new Date(b.submittedAt).getTime() -
              new Date(a.submittedAt).getTime(),
          ),

      resetToSeed: () => {
        set({
          points: [...seedPoints],
          partners: [...seedPartners],
          claims: [...seedClaims],
          progress: [...seedProgress],
          checkIns: [...seedCheckIns],
          auditLogs: [],
        });
      },

      sendOverdueReminder: (pointId, detail) => {
        const state = get();
        createAuditLog(
          state,
          "发送超期未打卡提醒",
          "point",
          pointId,
          detail,
        );
        set({ auditLogs: [...state.auditLogs] });
      },

      pendingClaimCount: () =>
        get().claims.filter((c) => c.status === "pending").length,

      pendingCheckInCount: () =>
        get().checkIns.filter((c) => c.status === "pending").length,
    }),
    {
      name: "aiqianxing-platform-store",
    },
  ),
);
