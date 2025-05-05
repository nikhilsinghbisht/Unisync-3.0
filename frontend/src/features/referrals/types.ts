export interface Referral {
    id?: number;
    company: string;
    position: string;
    description: string;
    postedByUserId: string;
  }
  
  export interface ReferralApplication {
    applicantUserId: string;
    resumeLink: string;
    referralId: number;
  }
  