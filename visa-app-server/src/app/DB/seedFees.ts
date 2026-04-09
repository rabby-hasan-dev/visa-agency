import { FeeSetting } from '../modules/fee/fee.model';

const seedFees = async () => {
    const fees = [
        {
            name: 'Document Processing Fee',
            key: 'DOCUMENT_PROCESSING_FEE',
            amount: 50,
            currency: 'AUD',
            description: 'Fee per document attached to the application',
            isActive: true
        },
        {
            name: 'Express Processing Fee',
            key: 'EXPRESS_PROCESSING_FEE',
            amount: 150,
            currency: 'AUD',
            description: 'Additional fee for priority processing',
            isActive: true
        },
        {
            name: 'Courier Fee',
            key: 'COURIER_FEE',
            amount: 35,
            currency: 'AUD',
            description: 'Passport return courier fee',
            isActive: true
        },
        {
            name: 'Translation Fee (Per Page)',
            key: 'TRANSLATION_FEE_PER_PAGE',
            amount: 25,
            currency: 'AUD',
            description: 'Fee for document translation services',
            isActive: true
        },
        {
            name: 'Agency Consultation Fee',
            key: 'AGENCY_CONSULTATION_FEE',
            amount: 100,
            currency: 'AUD',
            description: 'Fixed agency service/consultation commission',
            isActive: true
        }
    ];

    for (const fee of fees) {
        const isExist = await FeeSetting.findOne({ key: fee.key });
        if (!isExist) {
            await FeeSetting.create(fee);
        }
    }
};

export default seedFees;
