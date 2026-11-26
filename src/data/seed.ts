import type {
  ProjectPoint,
  Partner,
  ClaimApplication,
  ProgressUpdate,
  CheckIn,
} from "@/types";

/** 点位类型中文名映射 */
export const POINT_TYPE_LABEL: Record<string, string> = {
  music_classroom: "音乐教室",
  basketball_classroom: "篮球教室",
  street_light: "太阳能路灯",
  other: "其他",
};

/** 点位状态中文名映射 */
export const POINT_STATUS_LABEL: Record<string, string> = {
  pending_claim: "待认领",
  claim_pending: "认领审核中",
  in_progress: "进行中",
  completed: "已结项",
};

/** 合作方类型中文名映射 */
export const PARTNER_TYPE_LABEL: Record<string, string> = {
  enterprise: "企业",
  creator: "达人团队",
  artist: "艺人工作室",
};

/** 审核状态中文名映射 */
export const REVIEW_STATUS_LABEL: Record<string, string> = {
  pending: "待审核",
  approved: "已通过",
  rejected: "已驳回",
};

/** 种子数据：合作方 */
export const seedPartners: Partner[] = [
  {
    id: "p-001",
    name: "腾讯音乐娱乐公益基金会",
    type: "enterprise",
    contactPerson: "张经理",
    contactPhone: "13800138001",
    contactEmail: "zhangsan@tme.com",
    points: ["pt-001", "pt-002"],
  },
  {
    id: "p-002",
    name: "知名达人@乡村小飞",
    type: "creator",
    contactPerson: "经纪人李姐",
    contactPhone: "13900139002",
    points: ["pt-003"],
  },
  {
    id: "p-003",
    name: "某艺人工作室",
    type: "artist",
    contactPerson: "王助理",
    contactPhone: "13700137003",
    contactEmail: "wang@studio.com",
    points: ["pt-004"],
  },
];

/** 种子数据：点位 */
export const seedPoints: ProjectPoint[] = [
  {
    id: "pt-001",
    name: "黔东南从江县加鸠镇音乐教室",
    type: "music_classroom",
    status: "in_progress",
    region: "贵州省·黔东南州·从江县",
    description:
      "位于从江县加鸠镇中心小学，配备数码钢琴、吉他、尤克里里等乐器，覆盖周边 5 所村小的音乐教学需求，运维周期 3 年。",
    partnerId: "p-001",
    schoolName: "从江县加鸠镇中心小学",
    schoolCode: "SCH001",
    longTerm: true,
    createdAt: "2025-03-15",
    accessToken: "aBcDeFgHiJkLmNoPqRsTuVwX",
  },
  {
    id: "pt-002",
    name: "黔西南兴义市三江口镇音乐教室",
    type: "music_classroom",
    status: "in_progress",
    region: "贵州省·黔西南州·兴义市",
    description:
      "位于三江口镇中心小学，已完成首期乐器捐赠与教室翻新，后续每月组织一次乡村音乐启蒙课程。",
    partnerId: "p-001",
    schoolName: "兴义市三江口镇中心小学",
    schoolCode: "SCH002",
    longTerm: true,
    createdAt: "2025-05-20",
    accessToken: "zYxWvUtSrQpOnMlKjIhGfEdC",
  },
  {
    id: "pt-003",
    name: "毕节纳雍县龙场镇篮球教室",
    type: "basketball_classroom",
    status: "in_progress",
    region: "贵州省·毕节市·纳雍县",
    description:
      "塑胶操场 + 篮球架 + 体育器材，每周开展 2 次乡村少年篮球训练。",
    partnerId: "p-002",
    schoolName: "纳雍县龙场镇第一小学",
    schoolCode: "SCH003",
    longTerm: true,
    createdAt: "2025-06-10",
    accessToken: "bCdEfGhIjKlMnOpQrStUvWxY",
  },
  {
    id: "pt-004",
    name: "遵义习水县乡村太阳能路灯工程",
    type: "street_light",
    status: "completed",
    region: "贵州省·遵义市·习水县",
    description:
      "15 个行政村主干道安装太阳能路灯 320 盏，改善乡村夜间出行安全。",
    partnerId: "p-003",
    longTerm: false,
    createdAt: "2025-02-01",
    completedAt: "2025-04-20",
    accessToken: "qRsTuVwXyZbCdEfGhIjKlMnO",
  },
  {
    id: "pt-005",
    name: "铜仁石阡县待认领音乐教室",
    type: "music_classroom",
    status: "pending_claim",
    region: "贵州省·铜仁市·石阡县",
    description:
      "石阡县本庄镇中心小学拟新建音乐教室，等待冠名合作方，乐器清单已就绪。",
    schoolName: "石阡县本庄镇中心小学",
    longTerm: true,
    createdAt: "2025-10-01",
  },
  {
    id: "pt-006",
    name: "黔南荔波县待认领篮球教室",
    type: "basketball_classroom",
    status: "pending_claim",
    region: "贵州省·黔南州·荔波县",
    description:
      "荔波县茂兰镇希望小学拟升级篮球场地，铺设塑胶 + 更换篮球架。",
    schoolName: "荔波县茂兰镇希望小学",
    longTerm: true,
    createdAt: "2025-10-15",
  },
  {
    id: "pt-007",
    name: "安顺镇宁县待认领路灯工程",
    type: "street_light",
    status: "pending_claim",
    region: "贵州省·安顺市·镇宁县",
    description:
      "镇宁县丁旗街道 8 个自然村主干道，预计安装太阳能路灯 180 盏。",
    longTerm: false,
    createdAt: "2025-11-01",
  },
  {
    id: "pt-008",
    name: "六盘水水城区待认领音乐教室",
    type: "music_classroom",
    status: "claim_pending",
    region: "贵州省·六盘水市·水城区",
    description:
      "水城区阿戛镇小学音乐教室，已有合作方提交认领申请，等待机构审核中。",
    schoolName: "水城区阿戛镇小学",
    longTerm: true,
    createdAt: "2025-11-10",
  },
];

/** 种子数据：认领申请 */
export const seedClaims: ClaimApplication[] = [
  {
    id: "cl-001",
    pointId: "pt-008",
    partnerName: "某教育科技公司",
    partnerType: "enterprise",
    contactPerson: "赵总",
    contactPhone: "13600136008",
    message: "希望冠名音乐教室，助力山区孩子的艺术梦。",
    status: "pending",
    createdAt: "2025-11-18",
  },
];

/** 种子数据：进展动态 */
export const seedProgress: ProgressUpdate[] = [
  {
    id: "pr-001",
    pointId: "pt-001",
    title: "乐器全部到位，新学期开课啦！",
    content:
      "加鸠镇中心小学音乐教室已于 9 月正式投入使用。首期捐赠的 20 台数码钢琴、30 把吉他和尤克里里全部完成安装调试。学校的李老师已经开始为孩子们上课，第一次课就吸引了 80 多名孩子报名参加。",
    images: [
      "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800",
      "https://images.unsplash.com/photo-1519683109743-a93f673ca50e?w=800",
    ],
    videos: [],
    publishedAt: "2025-09-15",
    published: true,
  },
  {
    id: "pr-002",
    pointId: "pt-001",
    title: "教室翻新完工，乐器清单已确认",
    content:
      "从江县加鸠镇中心小学音乐教室翻新工程于 8 月 20 日完工，墙面、地板、隔音设备全部到位。我们与学校共同确认了乐器清单，将在开学前完成捐赠。",
    images: [
      "https://images.unsplash.com/photo-1503803548689-c96517591332?w=800",
    ],
    videos: [],
    publishedAt: "2025-08-22",
    published: true,
  },
  {
    id: "pr-003",
    pointId: "pt-002",
    title: "三江口镇音乐教室启动筹备",
    content:
      "三江口镇中心小学音乐教室选址完成，正在进行设计方案评审。预计 6 月启动建设。",
    images: [],
    videos: [],
    publishedAt: "2025-05-28",
    published: true,
  },
  {
    id: "pr-004",
    pointId: "pt-004",
    title: "路灯工程竣工验收完成",
    content:
      "习水县 15 个行政村 320 盏太阳能路灯全部安装完毕，经过连续 7 天雨天测试，所有路灯均能正常充放电。当地村民自发组织了感谢活动。",
    images: [
      "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?w=800",
    ],
    videos: [],
    publishedAt: "2025-04-20",
    published: true,
  },
];

/** 种子数据：老师打卡 */
export const seedCheckIns: CheckIn[] = [
  {
    id: "ci-001",
    pointId: "pt-001",
    schoolCode: "SCH001",
    schoolName: "从江县加鸠镇中心小学",
    teacherName: "李冬梅",
    courseName: "第一堂音乐课：认识钢琴",
    content:
      "今天是音乐教室启用后的第一堂课，孩子们第一次见到真正的钢琴，都非常兴奋。我们学习了中央 C 音，还有《小星星》的旋律。",
    images: [
      "https://images.unsplash.com/photo-1524691576862-f971c62e8f4c?w=800",
    ],
    videos: [],
    status: "approved",
    submittedAt: "2025-09-16",
    reviewedAt: "2025-09-17",
  },
  {
    id: "ci-002",
    pointId: "pt-003",
    schoolCode: "SCH003",
    schoolName: "纳雍县龙场镇第一小学",
    teacherName: "王建国",
    courseName: "篮球基础训练第 8 期",
    content:
      "今天重点练习运球和投篮的基本动作，孩子们进步很大！有几个孩子已经可以定点投篮命中了。",
    images: [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
    ],
    videos: [],
    status: "pending",
    submittedAt: "2025-11-20",
  },
];
