export interface Referral {
  postId: number;
  referrerId: number;
  company?: string;
  jobTitle?: string;
  notes?: string;
  link?: string;
  applicantId?: Array<number>;
  status: string;
}

export interface ReferralApplication {
  applicantUserId: string;
  link: string;
  referrerId: number;
}

export interface Applicant {
  id: number;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  resumeLink?: string;
  status?: "Pending" | "Shortlisted" | "Rejected" | "Hired"; 
}

export interface Props {
  userId: number;
  postId: number;
}
