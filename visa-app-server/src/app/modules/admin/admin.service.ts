import { VisaApplication } from '../visaApplication/visaApplication.model';
import { User } from '../user/user.model';
import { Invoice } from '../invoice/invoice.model';
import { VISA_APPLICATION_STATUS } from '../visaApplication/visaApplication.constant';

const getDashboardStats = async () => {
    const totalAgents = await User.countDocuments({ role: 'agent' });
    const totalApplications = await VisaApplication.countDocuments({ isDeleted: false });
    const pendingApplications = await VisaApplication.countDocuments({
        status: { $in: [VISA_APPLICATION_STATUS.DRAFT, VISA_APPLICATION_STATUS.SUBMITTED] },
        isDeleted: false
    });

    const invoices = await Invoice.find({ status: 'paid', isDeleted: false });
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);

    return {
        totalAgents,
        totalApplications,
        pendingApplications,
        totalRevenue
    };
};

const getAgentPerformance = async () => {
    // Aggregate applications by agent
    const performance = await User.aggregate([
        { $match: { role: 'agent' } },
        {
            $lookup: {
                from: 'visaapplications', // Mongoose usually lowercases and plurals
                localField: '_id',
                foreignField: 'createdByAgentId',
                as: 'applications'
            }
        },
        {
            $project: {
                email: 1,
                name: 1,
                status: 1,
                createdAt: 1,
                totalApplications: { $size: '$applications' },
                submittedApplications: {
                    $size: {
                        $filter: {
                            input: '$applications',
                            as: 'app',
                            cond: { $eq: ['$$app.status', VISA_APPLICATION_STATUS.SUBMITTED] }
                        }
                    }
                },
                approvedApplications: {
                    $size: {
                        $filter: {
                            input: '$applications',
                            as: 'app',
                            cond: { $eq: ['$$app.status', VISA_APPLICATION_STATUS.GRANTED] }
                        }
                    }
                }
            }
        }
    ]);

    return performance;
};

const getAllAdminsFromDB = async () => {
    const admins = await User.aggregate([
        { $match: { role: 'admin', isDeleted: false } },
        {
            $lookup: {
                from: 'staffprofiles',
                localField: '_id',
                foreignField: 'userId',
                as: 'profile'
            }
        },
        { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } }
    ]);

    return admins;
};

const updateAdminStatusInDB = async (id: string, status: 'active' | 'blocked') => {
    const result = await User.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );
    return result;
};

const deleteAdminFromDB = async (id: string) => {
    const result = await User.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    );
    return result;
};

export const AdminServices = {
    getDashboardStats,
    getAgentPerformance,
    getAllAdminsFromDB,
    updateAdminStatusInDB,
    deleteAdminFromDB
};
