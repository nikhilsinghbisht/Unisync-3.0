export interface Referral {
  postId: number;
  referrerId: number;
  company?: string;
  jobTitle?: string;
  notes?: string;
  link?: string;
  applicantId?: Array<number>;
  status:string;
}

export interface ReferralApplication {
  applicantUserId: string;
  link: string;
  referrerId: number;
}

