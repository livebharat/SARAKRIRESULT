
export interface JobPost {
  id: string;
  title: string;
  category: JobCategory;
  shortDescription: string;
  importantDates: string;
  applicationFee: string;
  ageLimit: string;
  vacancyDetails: string;
  eligibility: string;
  howToApply: string;
  usefulLinks: {
    applyOnline: string;
    downloadNotification: string;
    officialWebsite: string;
  };
  createdAt: number;
}

export interface AIJobResponse {
  title: string;
  shortDescription: string;
  importantDates: string;
  applicationFee: string;
  ageLimit: string;
  vacancyDetails: string;
  eligibility: string;
  howToApply: string;
  applyOnlineLink: string;
  notificationLink: string;
  officialWebsiteLink: string;
}

export enum JobCategory {
  RESULT = 'Result',
  ADMIT_CARD = 'Admit Card',
  LATEST_JOB = 'Latest Job',
  ANSWER_KEY = 'Answer Key',
  SYLLABUS = 'Syllabus',
  ADMISSION = 'Admission',
  CERTIFICATE = 'Certificate Verification',
  IMPORTANT = 'Important',
  OTHER = 'Other'
}
