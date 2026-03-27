export type ResumeContact = {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location: string;
};

export type ExperienceItem = {
  company: string;
  location?: string;
  role: string;
  period: string;
  bullets: string[];
};

export type ProjectItem = {
  name: string;
  description: string;
  stack?: string[];
};

export type EducationItem = {
  course: string;
  institution?: string;
  status?: string;
};

export type ResumeStructured = {
  fullName: string;
  targetRole: string;
  summary: string;
  contact: ResumeContact;
  skills: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
};

export type ResumeAnalysis = {
  keywords: string[];
  atsScoreEstimate: string;
  tips: string[];
};

export type ResumeResponse = {
  markdown: string;
  html: string;
  structured: ResumeStructured;
  analysis: ResumeAnalysis;
};
