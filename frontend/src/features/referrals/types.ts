export interface Referral {
  postId: number;
  referrerId: number;
  company?: string;
  jobTitle?: string;
  notes?: string;
  jobLink?: string;
  applicantId?: Array<number>;
  status:string;
}

export interface ReferralApplication {
  applicantUserId: string;
  jobLink: string;
  referrerId: number;
}

