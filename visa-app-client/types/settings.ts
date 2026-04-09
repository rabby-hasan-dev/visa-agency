export type TNavigationItem = {
  _id?: string;
  name: string;
  href: string;
  role: 'superAdmin' | 'admin' | 'agent' | 'applicant';
  sortOrder: number;
  submenu?: { name: string; href: string }[];
  active?: boolean;
};

export type TSiteSettings = {
  siteName: string;
  brandName: string;
  departmentName: string;
  footerLinks: { label: string; href: string; isExternal?: boolean }[];
  contactEmail: string;
  contactPhone: string;
  address: string;
  logoUrl?: string;
  themeColor?: string;
};

export type TGlobalOption = {
  key: string;
  label: string;
  options: string[];
};

export type TStripeConfig = {
  mode: 'test' | 'live';
  testSecretKey?: string;
  testPublishableKey?: string;
  liveSecretKey?: string;
  livePublishableKey?: string;
  isEnabled: boolean;
};

export type TSSLCommerzConfig = {
  mode: 'test' | 'live';
  testStoreId?: string;
  testStorePassword?: string;
  liveStoreId?: string;
  liveStorePassword?: string;
  isEnabled: boolean;
};

export type TPaymentConfig = {
  activeGateway: 'stripe' | 'sslcommerz';
  stripe: TStripeConfig;
  sslcommerz: TSSLCommerzConfig;
};

export type TCloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

export type TAppConfig = {
  clientSiteUrl: string;
  backendBaseUrl: string;
  resetPassUiLink: string;
};
