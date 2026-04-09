export interface TUser {
  id: string;
  email: string;
  name?: string;
  role?: 'superAdmin' | 'admin' | 'agent' | 'user';
  profileImg?: string;
  phone?: string;
  mobilePhone?: string;
  secretQuestions?: Array<{ question: string; answer: string }>;
}

export interface TProfile {
  id: string;
  userId: string;
  title?: string;
  givenNames?: string;
  familyName?: string;
  streetAddress?: string;
  businessAddress?: string;
  city?: string;
  stateProvince?: string;
  state?: string;
  zipPostalCode?: string;
  country?: string;
  companyName?: string;
  marn?: string;
  licenseNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  alertPassword?: boolean;
  alertUserDetails?: boolean;
}
