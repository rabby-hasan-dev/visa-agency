export interface TEnquiry {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'pending' | 'responded' | 'archived';
}
