/** 点位类型 */
export type PointType = "music_classroom" | "basketball_classroom" | "street_light" | "other";

/** 点位生命周期状态 */
export type PointStatus = "pending_claim" | "claim_pending" | "in_progress" | "completed";

/** 合作方主体类型 */
export type PartnerType = "enterprise" | "creator" | "artist";

/** 审核状态 */
export type ReviewStatus = "pending" | "approved" | "rejected";

/** 点位资产 */
export interface ProjectPoint {
  id: string;
  name: string;
  type: PointType;
  status: PointStatus;
  region: string; // 所在地区
  description: string;
  coverImage?: string;
  partnerId?: string; // 已认领合作方
  schoolName?: string; // 关联学校
  schoolCode?: string; // 学校专属访问码
  longTerm: boolean; // 长期(3年运维) vs 短期(一次性)
  createdAt: string;
  completedAt?: string;
  /** 点位专属链接 token（合作方专属访问用） */
  accessToken?: string;
  /** 链接是否已失效 */
  tokenRevoked?: boolean;
}

/** 合作方 */
export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  points: string[]; // 关联点位 id 列表
}

/** 合作方认领申请 */
export interface ClaimApplication {
  id: string;
  pointId: string;
  partnerName: string;
  partnerType: PartnerType;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  message?: string;
  status: ReviewStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

/** 进展动态 */
export interface ProgressUpdate {
  id: string;
  pointId: string;
  title: string;
  content: string;
  images: string[];
  videos: string[];
  publishedAt: string;
  /** 是否对外发布（否则是草稿） */
  published: boolean;
}

/** 老师打卡记录 */
export interface CheckIn {
  id: string;
  pointId: string;
  schoolCode: string;
  schoolName: string;
  teacherName: string;
  courseName: string;
  content: string;
  images: string[];
  videos: string[];
  status: ReviewStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

/** 审核/操作留痕记录 */
export interface AuditLog {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  detail: string;
  operator: string;
  createdAt: string;
}
