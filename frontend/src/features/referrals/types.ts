export interface Referral {
  postId: number;
  referrerId: number;
  company?: string;
  jobTitle?: string;
  notes?: string;
  link?: string;
  applicantId?: Array<number>;
  status: string;
  applicationStatus?: string;
}

export interface ReferralApplication {
  applicantUserId: string;
  link: string;
  referrerId: number;
  
}

export interface Applicant {
  id: number;
  postId:number;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  resumeLink?: string;
  applicationStatus?: string;
}

export interface Props {
  userId: number;
  postId: number;
}
