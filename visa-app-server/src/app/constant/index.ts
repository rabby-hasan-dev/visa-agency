// =====================================================
//  Visa Application System User Roles
// =====================================================
export const USER_ROLE = {
    superAdmin: 'superAdmin',      // Full platform control
    admin: 'admin',                // System administrator
    staff: 'staff',                // Internal staff managing applications
    agent: 'agent',                // External agents/middlemen
    applicant: 'applicant',        // Individuals applying for visas
    user: 'user',                  // Generic base user
} as const;

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

// =====================================================
//  Cloudinary / Storage Folder Map for Visa System
// =====================================================
// Organized by core modules: Applications, Profiles, Documents, etc.
export const FOLDERS = {
    // USER & PROFILE MANAGEMENT
    PROFILES: "profiles",               // Avatars for applicants, agents, and staff
    APPLICANT_DOCS: "applicant_docs",   // Specific docs for applicants (ID, Passport)
    AGENT_DOCS: "agent_docs",           // Agent registration/verification docs
    STAFF_DOCS: "staff_docs",           // Internal staff records
    
    // VISA APPLICATION MODULES
    VISA_APPLICATIONS: "visa_applications", // Main visa application attachments
    PASSPORTS: "passports",                 // Passport scans
    SUPPORTING_DOCS: "supporting_docs",     // Additional evidence/documents
    
    // FINANCE & PAYMENTS
    INVOICES: "invoices",               // Generated invoices
    PAYMENTS: "payments",               // Payment proof/receipts
    FEES: "fees",                       // Fee structures or related docs
    
    // ORGANIZATION & SETTINGS
    ORGANIZATION: "organization",       // Organization-specific assets (logos, etc.)
    APP_SETTINGS: "app_settings",       // Site branding, banners, icons
    LOGOS: "logos",                     // Main application logos
    
    // COMMUNICATION
    MESSAGES: "messages",               // Chat/Message attachments
    EMAILS: "emails",                   // Email templates/attachments
    
    // SYSTEM & MISC
    MEDIA: "media",                     // General media uploads
    TEMP: "temp",                       // Temporary file storage
    DOCUMENTS: "documents",             // Miscellaneous documents
    LOGS: "logs"                        // System or debug logs
} as const;

export type TFolder = (typeof FOLDERS)[keyof typeof FOLDERS];
