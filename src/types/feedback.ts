export type FeedbackType = "bug" | "suggestion" | "content_issue" | "general";
export type FeedbackStatus = "new" | "read" | "resolved";
export type ExperienceCategory = "shopping_experience" | "product_quality" | "delivery" | "customer_service" | "website_usability" | "other";
export type RecommendChoice = "yes" | "no" | "maybe";
export type HeardFrom = "social_media" | "friend_family" | "search_engine" | "advertisement" | "influencer" | "other";

export interface FeedbackWidgetForm {
  type: FeedbackType;
  rating?: number;
  message: string;
  email?: string;
  contactPermission: boolean;
  pageUrl: string;
}

export interface FeedbackDetailedForm {
  type: FeedbackType;
  subject: string;
  experienceCategory: ExperienceCategory;
  rating?: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  orderId?: string;
  wouldRecommend?: RecommendChoice;
  heardFrom?: HeardFrom;
  contactPermission: boolean;
  pageUrl: string;
}

export interface FeedbackAuth {
  loggedIn: boolean;
  name: string;
  email: string;
  phone: string;
  city: string;
}

export interface AdminFeedback {
  id: string;
  type: FeedbackType;
  subject: string | null;
  experienceCategory: string | null;
  rating: number | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string;
  customerEmail: string | null;
  orderId: string | null;
  wouldRecommend: string | null;
  heardFrom: string | null;
  contactPermission: boolean;
  pageUrl: string;
  status: FeedbackStatus;
  notifiedAt: string | null;
  createdAt: string;
}
