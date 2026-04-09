import crypto from 'crypto';
import { TAppConfig, TCloudinaryConfig, TGlobalOption, TNavigationItem, TPaymentConfig, TSiteSettings } from './settings.interface';
import { Settings } from './settings.model';

const getSiteSettings = async (): Promise<TSiteSettings> => {
    let settings = await Settings.findOne({ type: 'site' });
    if (!settings) {
        // Create default if none exists
        settings = await Settings.create({
            type: 'site',
            site: {
                siteName: 'ImmiAccount',
                brandName: 'Australian Government',
                departmentName: 'Department of Home Affairs',
                footerLinks: [
                    { label: 'Accessibility', href: '/legal#accessibility' },
                    { label: 'Copyright', href: '/legal#copyright' },
                    { label: 'Disclaimer', href: '/legal#disclaimer' },
                    { label: 'Privacy', href: '/legal#privacy' },
                    { label: 'Security', href: '/legal#security' },
                ],
                contactEmail: 'support@homeaffairs.gov.au',
                contactPhone: '+61 2 6196 0196',
                address: 'Department of Home Affairs, Australia',
                logoUrl: 'https://seeklogo.com/images/A/australian-government-logo-B138092B08-seeklogo.com.png',
                themeColor: '#00264d'
            }
        });
    }
    return {
        siteName: settings.site?.siteName || 'ImmiAccount',
        brandName: settings.site?.brandName || 'Australian Government',
        departmentName: settings.site?.departmentName || 'Department of Home Affairs',
        footerLinks: settings.site?.footerLinks || [],
        contactEmail: settings.site?.contactEmail || 'support@homeaffairs.gov.au',
        contactPhone: settings.site?.contactPhone || '+61 2 6196 0196',
        address: settings.site?.address || 'Department of Home Affairs, Australia',
        logoUrl: settings.site?.logoUrl || 'https://seeklogo.com/images/A/australian-government-logo-B138092B08-seeklogo.com.png',
        themeColor: settings.site?.themeColor || '#00264d'
    } as TSiteSettings;
};

const updateSiteSettings = async (data: TSiteSettings) => {
    return await Settings.findOneAndUpdate(
        { type: 'site' },
        { $set: { site: data } },
        { new: true, upsert: true }
    );
};

const roleHierarchy: Record<string, number> = {
    superAdmin: 4,
    admin: 3,
    agent: 2,
    applicant: 1,
};

const getNavigation = async (role?: string) => {
    let settings = await Settings.findOne({ type: 'navigation' });
    const defaultNav: TNavigationItem[] = [
        { name: 'Dashboard', href: '/dashboard', role: 'applicant', sortOrder: 1 },
        { name: 'Payments', href: '/payments', role: 'agent', sortOrder: 2 },
        { name: 'Manage Admins', href: '/manage-admins', role: 'superAdmin', sortOrder: 3 },
        { name: 'Manage Agents', href: '/manage-agents', role: 'superAdmin', sortOrder: 4 },
        { name: 'Visa Types', href: '/manage-visa-types', role: 'admin', sortOrder: 5 },
        { name: 'Transit Countries', href: '/manage-transit-countries', role: 'admin', sortOrder: 6 },
        { name: 'Manage Payments', href: '/manage-payments', role: 'admin', sortOrder: 7 },
        { name: 'Global Applications', href: '/applications', role: 'admin', sortOrder: 8 },
        { name: 'System Settings', href: '/settings', role: 'admin', sortOrder: 9 },
        { name: 'Manage Fees', href: '/manage-fees', role: 'admin', sortOrder: 10 },
        { name: 'User Passwords', href: '/manage-user-passwords', role: 'admin', sortOrder: 11 },
        { name: 'Reports', href: '/reports', role: 'admin', sortOrder: 12 },
        { name: 'Enquiries', href: '/manage-enquiries', role: 'admin', sortOrder: 13 },
    ];

    if (!settings) {
        settings = await Settings.create({ type: 'navigation', navigation: defaultNav });
    } else {
        // Ensure core navigation items are present
        const currentNav = settings.navigation as unknown as TNavigationItem[];
        let hasChanges = false;

        const essentialHrefs = ['/payments', '/manage-payments', '/manage-fees', '/manage-user-passwords', '/reports', '/manage-enquiries'];

        for (const href of essentialHrefs) {
            if (!currentNav.some(item => item.href === href)) {
                const itemToAdd = defaultNav.find(item => item.href === href);
                if (itemToAdd) {
                    currentNav.push(itemToAdd);
                    hasChanges = true;
                }
            }
        }

        if (hasChanges) {
            settings.markModified('navigation');
            await settings.save();
        }
    }

    if (role) {
        const userLevel = roleHierarchy[role] || 0;
        return (settings.navigation as unknown as TNavigationItem[])
            .filter((item) => {
                const itemLevel = roleHierarchy[item.role] || 0;
                return userLevel >= itemLevel;
            })
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }
    return settings.navigation;
};

const updateNavigation = async (data: TNavigationItem[]) => {
    return await Settings.findOneAndUpdate(
        { type: 'navigation' },
        { $set: { navigation: data } },
        { new: true, upsert: true }
    );
};

const getGlobalOptions = async () => {
    let settings = await Settings.findOne({ type: 'global_option' });
    const defaultOptions: TGlobalOption[] = [
        { key: 'legal_status', label: 'Legal Status', options: ['Citizen', 'Permanent resident', 'Temporary visa holder', 'Other'] },
        { key: 'relationship_status', label: 'Relationship Status', options: ['Single', 'Married', 'De facto', 'Divorced', 'Widowed', 'Separated'] },
        { key: 'gender', label: 'Gender', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
        { key: 'passport_type', label: 'Passport Type', options: ['Ordinary', 'Diplomatic', 'Official', 'Service', 'Other'] },
        { key: 'travel_reason', label: 'Reason for Travel', options: ['Tourism', 'Business', 'Study', 'Medical', 'Family', 'Other'] },
        { key: 'employment_status', label: 'Employment Status', options: ['Employed', 'Self-employed', 'Unemployed', 'Student', 'Retired'] }
    ];

    if (!settings) {
        settings = await Settings.create({ type: 'global_option', globalOptions: defaultOptions });
    } else {
        // Ensure core categories are present
        const currentOptions = settings.globalOptions as unknown as TGlobalOption[];
        let hasChanges = false;

        for (const defOpt of defaultOptions) {
            if (!currentOptions.some(opt => opt.key === defOpt.key)) {
                currentOptions.push(defOpt);
                hasChanges = true;
            }
        }

        if (hasChanges) {
            settings.markModified('globalOptions');
            await settings.save();
        }
    }
    return settings.globalOptions;
};

const updateGlobalOptions = async (data: TGlobalOption[]) => {
    return await Settings.findOneAndUpdate(
        { type: 'global_option' },
        { $set: { globalOptions: data } },
        { new: true, upsert: true }
    );
};

// ── Payment Config Helpers ──────────────────────────────────────────────────────

const ALGO = 'aes-256-cbc';
const IV_LEN = 16;

const getEncKey = (): Buffer => {
    const raw = process.env.PAYMENT_CONFIG_ENCRYPTION_KEY || 'default_encryption_key_32_chars!';
    return Buffer.from(raw.padEnd(32, '0').slice(0, 32));
};

const encryptField = (text: string): string => {
    if (!text) return '';
    const iv = crypto.randomBytes(IV_LEN);
    const cipher = crypto.createCipheriv(ALGO, getEncKey(), iv);
    const enc = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return iv.toString('hex') + ':' + enc.toString('hex');
};

const decryptField = (enc: string): string => {
    if (!enc || !enc.includes(':')) return enc;
    const [ivHex, data] = enc.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGO, getEncKey(), iv);
    return Buffer.concat([decipher.update(Buffer.from(data, 'hex')), decipher.final()]).toString('utf8');
};

const maskKey = (value?: string): string => {
    if (!value || value.length < 8) return value ? '****' : '';
    return value.slice(0, 6) + '****' + value.slice(-4);
};

const defaultPaymentConfig: TPaymentConfig = {
    activeGateway: 'stripe',
    stripe: { mode: 'test', testSecretKey: '', testPublishableKey: '', liveSecretKey: '', livePublishableKey: '', isEnabled: true },
    sslcommerz: { mode: 'test', testStoreId: '', testStorePassword: '', liveStoreId: '', liveStorePassword: '', isEnabled: true },
};

/** Returns payment config with sensitive fields MASKED for frontend display */
const getPaymentConfig = async (): Promise<TPaymentConfig> => {
    const settings = await Settings.findOne({ type: 'payment_config' });
    if (!settings?.paymentConfig) return defaultPaymentConfig;

    const pc = settings.paymentConfig as unknown as TPaymentConfig;
    return {
        activeGateway: pc.activeGateway || 'stripe',
        stripe: {
            mode: pc.stripe?.mode || 'test',
            testSecretKey: maskKey(pc.stripe?.testSecretKey ? decryptField(pc.stripe.testSecretKey) : ''),
            testPublishableKey: pc.stripe?.testPublishableKey || '',
            liveSecretKey: maskKey(pc.stripe?.liveSecretKey ? decryptField(pc.stripe.liveSecretKey) : ''),
            livePublishableKey: pc.stripe?.livePublishableKey || '',
            isEnabled: pc.stripe?.isEnabled ?? true,
        },
        sslcommerz: {
            mode: pc.sslcommerz?.mode || 'test',
            testStoreId: pc.sslcommerz?.testStoreId || '',
            testStorePassword: maskKey(pc.sslcommerz?.testStorePassword ? decryptField(pc.sslcommerz.testStorePassword) : ''),
            liveStoreId: pc.sslcommerz?.liveStoreId || '',
            liveStorePassword: maskKey(pc.sslcommerz?.liveStorePassword ? decryptField(pc.sslcommerz.liveStorePassword) : ''),
            isEnabled: pc.sslcommerz?.isEnabled ?? true,
        },
    };
};

/** Returns payment config with DECRYPTED keys — for internal gateway use only */
const getDecryptedPaymentConfig = async (): Promise<TPaymentConfig> => {
    const settings = await Settings.findOne({ type: 'payment_config' });
    if (!settings?.paymentConfig) return defaultPaymentConfig;

    const pc = settings.paymentConfig as unknown as TPaymentConfig;
    return {
        activeGateway: pc.activeGateway || 'stripe',
        stripe: {
            mode: pc.stripe?.mode || 'test',
            testSecretKey: pc.stripe?.testSecretKey ? decryptField(pc.stripe.testSecretKey) : '',
            testPublishableKey: pc.stripe?.testPublishableKey || '',
            liveSecretKey: pc.stripe?.liveSecretKey ? decryptField(pc.stripe.liveSecretKey) : '',
            livePublishableKey: pc.stripe?.livePublishableKey || '',
            isEnabled: pc.stripe?.isEnabled ?? true,
        },
        sslcommerz: {
            mode: pc.sslcommerz?.mode || 'test',
            testStoreId: pc.sslcommerz?.testStoreId || '',
            testStorePassword: pc.sslcommerz?.testStorePassword ? decryptField(pc.sslcommerz.testStorePassword) : '',
            liveStoreId: pc.sslcommerz?.liveStoreId || '',
            liveStorePassword: pc.sslcommerz?.liveStorePassword ? decryptField(pc.sslcommerz.liveStorePassword) : '',
            isEnabled: pc.sslcommerz?.isEnabled ?? true,
        },
    };
};

/**
 * Update payment config — encrypts sensitive fields before storing.
 * If a field value looks like a masked value (contains '****'), skip updating it
 * so the admin can save without overwriting keys they didn't touch.
 */
const updatePaymentConfig = async (data: TPaymentConfig) => {
    const existing = await Settings.findOne({ type: 'payment_config' });
    const existPc = (existing?.paymentConfig as unknown as TPaymentConfig) || defaultPaymentConfig;

    const resolveSecret = (newVal: string | undefined, existingEncrypted: string | undefined): string => {
        if (!newVal || newVal.includes('****')) return existingEncrypted || '';
        return encryptField(newVal);
    };

    const payload = {
        activeGateway: data.activeGateway,
        stripe: {
            mode: data.stripe?.mode,
            testSecretKey: resolveSecret(data.stripe?.testSecretKey, existPc.stripe?.testSecretKey),
            testPublishableKey: data.stripe?.testPublishableKey || existPc.stripe?.testPublishableKey || '',
            liveSecretKey: resolveSecret(data.stripe?.liveSecretKey, existPc.stripe?.liveSecretKey),
            livePublishableKey: data.stripe?.livePublishableKey || existPc.stripe?.livePublishableKey || '',
            isEnabled: data.stripe?.isEnabled ?? true,
        },
        sslcommerz: {
            mode: data.sslcommerz?.mode,
            testStoreId: data.sslcommerz?.testStoreId || existPc.sslcommerz?.testStoreId || '',
            testStorePassword: resolveSecret(data.sslcommerz?.testStorePassword, existPc.sslcommerz?.testStorePassword),
            liveStoreId: data.sslcommerz?.liveStoreId || existPc.sslcommerz?.liveStoreId || '',
            liveStorePassword: resolveSecret(data.sslcommerz?.liveStorePassword, existPc.sslcommerz?.liveStorePassword),
            isEnabled: data.sslcommerz?.isEnabled ?? true,
        },
    };

    return await Settings.findOneAndUpdate(
        { type: 'payment_config' },
        { $set: { paymentConfig: payload } },
        { new: true, upsert: true },
    );
};

// ── Cloudinary Config Helpers ──────────────────────────────────────────────────

const defaultCloudinaryConfig: TCloudinaryConfig = {
    cloudName: '',
    apiKey: '',
    apiSecret: '',
};

const getCloudinaryConfig = async (): Promise<TCloudinaryConfig> => {
    const settings = await Settings.findOne({ type: 'cloudinary_config' });
    if (!settings?.cloudinaryConfig) return defaultCloudinaryConfig;

    const cc = settings.cloudinaryConfig as unknown as TCloudinaryConfig;
    return {
        cloudName: cc.cloudName || '',
        apiKey: cc.apiKey || '',
        apiSecret: maskKey(cc.apiSecret ? decryptField(cc.apiSecret) : ''),
    };
};

const getDecryptedCloudinaryConfig = async (): Promise<TCloudinaryConfig> => {
    const settings = await Settings.findOne({ type: 'cloudinary_config' });
    if (!settings?.cloudinaryConfig) return defaultCloudinaryConfig;

    const cc = settings.cloudinaryConfig as unknown as TCloudinaryConfig;
    return {
        cloudName: cc.cloudName || '',
        apiKey: cc.apiKey || '',
        apiSecret: cc.apiSecret ? decryptField(cc.apiSecret) : '',
    };
};

const updateCloudinaryConfig = async (data: TCloudinaryConfig) => {
    const existing = await Settings.findOne({ type: 'cloudinary_config' });
    const existCc = (existing?.cloudinaryConfig as unknown as TCloudinaryConfig) || defaultCloudinaryConfig;

    const resolveSecret = (newVal: string | undefined, existingEncrypted: string | undefined): string => {
        if (!newVal || newVal.includes('****')) return existingEncrypted || '';
        return encryptField(newVal);
    };

    const payload = {
        cloudName: data.cloudName || existCc.cloudName || '',
        apiKey: data.apiKey || existCc.apiKey || '',
        apiSecret: resolveSecret(data.apiSecret, existCc.apiSecret),
    };

    return await Settings.findOneAndUpdate(
        { type: 'cloudinary_config' },
        { $set: { cloudinaryConfig: payload } },
        { new: true, upsert: true },
    );
};

// ── App Config Helpers ─────────────────────────────────────────────────────────

const defaultAppConfig: TAppConfig = {
    clientSiteUrl: '',
    backendBaseUrl: '',
    resetPassUiLink: '',
};

const getAppConfig = async (): Promise<TAppConfig> => {
    const settings = await Settings.findOne({ type: 'app_config' });
    if (!settings?.appConfig) return defaultAppConfig;
    return settings.appConfig as unknown as TAppConfig;
};

const updateAppConfig = async (data: TAppConfig) => {
    return await Settings.findOneAndUpdate(
        { type: 'app_config' },
        { $set: { appConfig: data } },
        { new: true, upsert: true },
    );
};

export const SettingsServices = {
    getSiteSettings,
    updateSiteSettings,
    getNavigation,
    updateNavigation,
    getGlobalOptions,
    updateGlobalOptions,
    getPaymentConfig,
    updatePaymentConfig,
    getDecryptedPaymentConfig,
    getCloudinaryConfig,
    getDecryptedCloudinaryConfig,
    updateCloudinaryConfig,
    getAppConfig,
    updateAppConfig,
};
