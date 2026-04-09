import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_pass: process.env.DEFAULT_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASSWORD,
  client_site_url: process.env.CLIENT_SITE_URL,
  backend_base_url: process.env.BACKEND_BASE_URL,
  mailgun_smtp_user: process.env.MAILGUN_SMTP_USER,
  mailgun_smtp_password: process.env.MAILGUN_SMTP_PASSWORD,
  mailgun_from_email_address: process.env.MAILGUN_FROM_EMAIL_ADDRESS,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  sslcommerz_store_id: process.env.SSLCOMMERZ_STORE_ID,
  sslcommerz_store_passwd: process.env.SSLCOMMERZ_STORE_PASSWD,
  sslcommerz_is_live: process.env.SSLCOMMERZ_IS_LIVE === 'true',
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  upload_max_file_size: 10 * 1024 * 1024, // 10MB default
  file_types: {
    IMAGES: ['image/jpeg', 'image/png', 'image/webp'] as const,
    DOCUMENTS: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ] as const,
    ANY: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ] as const,
  },
};
