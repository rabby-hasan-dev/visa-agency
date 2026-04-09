import config from '../config';
import { USER_ROLE } from '../modules/user/user.constant';
import { User } from '../modules/user/user.model';
import { UserPasswordService } from '../modules/userPassword/userPassword.service';

const seedSuperAdmin = async () => {
    // Seed Super Admin
    const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin });

    if (!isSuperAdminExists) {
        const superAdmin = {
            name: 'Super Admin',
            email: config.super_admin_email,
            password: config.super_admin_password,
            role: USER_ROLE.superAdmin,
            status: 'active',
            isDeleted: false,
        };

        const result = await User.create(superAdmin);
        
        // Store non-encrypted password in UserPassword collection
        await UserPasswordService.upsertUserPassword({
            userId: result._id,
            email: config.super_admin_email as string,
            password: config.super_admin_password as string,
        });
    }

    // Seed Admin
    const isAdminExists = await User.findOne({ role: USER_ROLE.admin });

    if (!isAdminExists) {
        const admin = {
            name: 'Admin',
            email: config.admin_email,
            password: config.admin_password,
            role: USER_ROLE.admin,
            status: 'active',
            isDeleted: false,
        };

        const result = await User.create(admin);
        
        // Store non-encrypted password in UserPassword collection
        await UserPasswordService.upsertUserPassword({
            userId: result._id,
            email: config.admin_email as string,
            password: config.admin_password as string,
        });
    }
};

export default seedSuperAdmin;
