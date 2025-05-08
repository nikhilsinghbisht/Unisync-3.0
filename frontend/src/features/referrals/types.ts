export interface Referral {
  postId: number;
  referrerId: number;
  company?: string;
  jobTitle?: string;
  notes?: string;
  jobLink?: string;
  applicantId?: Array<number>;
}

export interface ReferralApplication {
  applicantUserId: string;
  jobLink: string;
  referrerId: number;
}

