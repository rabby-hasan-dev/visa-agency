/* eslint-disable no-console */
import { VisaType } from '../modules/visaType/visaType.model';
import { Question } from '../modules/question/question.model';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const q = (
    stepNumber: number,
    stepLabel: string,
    fieldKey: string,
    label: string,
    fieldType: string,
    extra: Record<string, unknown> = {},
) => ({
    stepNumber,
    stepLabel,
    fieldKey,
    label,
    fieldType,
    isRequired: false,
    sortOrder: 0,
    ...extra,
});

const COUNTRIES_OPTIONS: { label: string; value: string }[] = [
    { label: 'Afghanistan', value: 'Afghanistan' },
    { label: 'Albania', value: 'Albania' },
    { label: 'Algeria', value: 'Algeria' },
    { label: 'Australia', value: 'Australia' },
    { label: 'Austria', value: 'Austria' },
    { label: 'Bangladesh', value: 'Bangladesh' },
    { label: 'Belgium', value: 'Belgium' },
    { label: 'Brazil', value: 'Brazil' },
    { label: 'Canada', value: 'Canada' },
    { label: 'China', value: 'China' },
    { label: 'Denmark', value: 'Denmark' },
    { label: 'Egypt', value: 'Egypt' },
    { label: 'Finland', value: 'Finland' },
    { label: 'France', value: 'France' },
    { label: 'Germany', value: 'Germany' },
    { label: 'Greece', value: 'Greece' },
    { label: 'Hong Kong', value: 'Hong Kong' },
    { label: 'India', value: 'India' },
    { label: 'Indonesia', value: 'Indonesia' },
    { label: 'Iran', value: 'Iran' },
    { label: 'Iraq', value: 'Iraq' },
    { label: 'Ireland', value: 'Ireland' },
    { label: 'Italy', value: 'Italy' },
    { label: 'Japan', value: 'Japan' },
    { label: 'Jordan', value: 'Jordan' },
    { label: 'Kenya', value: 'Kenya' },
    { label: 'Malaysia', value: 'Malaysia' },
    { label: 'Mexico', value: 'Mexico' },
    { label: 'Myanmar', value: 'Myanmar' },
    { label: 'Nepal', value: 'Nepal' },
    { label: 'Netherlands', value: 'Netherlands' },
    { label: 'New Zealand', value: 'New Zealand' },
    { label: 'Nigeria', value: 'Nigeria' },
    { label: 'Norway', value: 'Norway' },
    { label: 'Pakistan', value: 'Pakistan' },
    { label: 'Philippines', value: 'Philippines' },
    { label: 'Poland', value: 'Poland' },
    { label: 'Portugal', value: 'Portugal' },
    { label: 'Russia', value: 'Russia' },
    { label: 'Saudi Arabia', value: 'Saudi Arabia' },
    { label: 'Singapore', value: 'Singapore' },
    { label: 'South Africa', value: 'South Africa' },
    { label: 'South Korea', value: 'South Korea' },
    { label: 'Spain', value: 'Spain' },
    { label: 'Sri Lanka', value: 'Sri Lanka' },
    { label: 'Sweden', value: 'Sweden' },
    { label: 'Switzerland', value: 'Switzerland' },
    { label: 'Thailand', value: 'Thailand' },
    { label: 'Turkey', value: 'Turkey' },
    { label: 'United Arab Emirates', value: 'United Arab Emirates' },
    { label: 'United Kingdom', value: 'United Kingdom' },
    { label: 'United States', value: 'United States' },
    { label: 'Vietnam', value: 'Vietnam' },
];

const SEX_OPTIONS = [
    { label: 'Female', value: 'Female' },
    { label: 'Male', value: 'Male' },
    { label: 'Other', value: 'Other' },
];

const LEGAL_STATUS_OPTIONS = [
    { label: 'Citizen', value: 'Citizen' },
    { label: 'Permanent resident', value: 'Permanent resident' },
    { label: 'Temporary visa holder', value: 'Temporary visa holder' },
    { label: 'Other', value: 'Other' },
];

const RELATIONSHIP_OPTIONS = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'De facto', value: 'De facto' },
    { label: 'Divorced', value: 'Divorced' },
    { label: 'Widowed', value: 'Widowed' },
    { label: 'Separated', value: 'Separated' },
];

// ─── Shared question builders ─────────────────────────────────────────────────

const passportSection = (stepNumber: number, stepLabel: string) => [
    q(stepNumber, stepLabel, '_passportHeader', 'Passport details', 'section-header', { sortOrder: 1 }),
    q(stepNumber, stepLabel, 'familyName', 'Family name', 'text', { isRequired: true, sortOrder: 2, placeholder: 'As shown in passport' }),
    q(stepNumber, stepLabel, 'givenNames', 'Given names', 'text', { isRequired: true, sortOrder: 3, placeholder: 'As shown in passport' }),
    q(stepNumber, stepLabel, 'sex', 'Sex', 'radio', { isRequired: true, sortOrder: 4, options: SEX_OPTIONS }),
    q(stepNumber, stepLabel, 'dateOfBirth', 'Date of birth', 'date', { isRequired: true, sortOrder: 5 }),
    q(stepNumber, stepLabel, 'passportNumber', 'Passport number', 'text', { isRequired: true, sortOrder: 6 }),
    q(stepNumber, stepLabel, 'countryOfPassport', 'Country of passport', 'country', { isRequired: true, sortOrder: 7 }),
    q(stepNumber, stepLabel, 'nationality', 'Nationality of passport holder', 'country', { isRequired: true, sortOrder: 8 }),
    q(stepNumber, stepLabel, 'dateOfIssue', 'Date of issue', 'date', { sortOrder: 9 }),
    q(stepNumber, stepLabel, 'dateOfExpiry', 'Date of expiry', 'date', { isRequired: true, sortOrder: 10 }),
    q(stepNumber, stepLabel, 'placeOfIssue', 'Place of issue / issuing authority', 'text', { sortOrder: 11 }),
    q(stepNumber, stepLabel, '_grantHeader', 'Australian visa grant number', 'section-header', { sortOrder: 12 }),
    q(stepNumber, stepLabel, 'hasAusGrantNum', 'Has an Australian visa grant number from a previous application?', 'boolean', { sortOrder: 13 }),
    q(stepNumber, stepLabel, '_nationalIdHeader', 'National identity card', 'section-header', { sortOrder: 14 }),
    q(stepNumber, stepLabel, 'hasNationalId', 'Has a national identity card?', 'boolean', { sortOrder: 15 }),
    q(stepNumber, stepLabel, '_birthHeader', 'Place of birth', 'section-header', { sortOrder: 16 }),
    q(stepNumber, stepLabel, 'birthTown', 'Town / City', 'text', { isRequired: true, sortOrder: 17 }),
    q(stepNumber, stepLabel, 'birthState', 'State / Province', 'text', { sortOrder: 18 }),
    q(stepNumber, stepLabel, 'countryOfBirth', 'Country of birth', 'country', { isRequired: true, sortOrder: 19 }),
    q(stepNumber, stepLabel, '_relationshipHeader', 'Relationship status', 'section-header', { sortOrder: 20 }),
    q(stepNumber, stepLabel, 'relationshipStatus', 'Relationship status', 'select', { isRequired: true, sortOrder: 21, options: RELATIONSHIP_OPTIONS }),
    q(stepNumber, stepLabel, '_otherNamesHeader', 'Other names / spellings', 'section-header', { sortOrder: 22 }),
    q(stepNumber, stepLabel, 'hasOtherNames', 'Currently, or ever known by any other names?', 'boolean', { sortOrder: 23 }),
    q(stepNumber, stepLabel, '_citizenshipHeader', 'Citizenship', 'section-header', { sortOrder: 24 }),
    q(stepNumber, stepLabel, 'citizenOfPassportCountry', 'Citizen of country of passport?', 'boolean', { sortOrder: 25 }),
    q(stepNumber, stepLabel, 'citizenOtherCountry', 'Citizen of any other country?', 'boolean', { sortOrder: 26 }),
    q(stepNumber, stepLabel, '_healthExamHeader', 'Health examination', 'section-header', { sortOrder: 27 }),
    q(stepNumber, stepLabel, 'healthExam', 'Undertaken a health examination for an Australian visa in the last 12 months?', 'boolean', { sortOrder: 28 }),
];

const contactSection = (stepNumber: number, stepLabel: string) => [
    q(stepNumber, stepLabel, '_contactHeader', 'Contact details', 'section-header', { sortOrder: 1 }),
    q(stepNumber, stepLabel, '_residenceHeader', 'Country of residence', 'section-header', { sortOrder: 2 }),
    q(stepNumber, stepLabel, 'countryOfResidence', 'Usual country of residence', 'country', { isRequired: true, sortOrder: 3 }),
    q(stepNumber, stepLabel, '_addressHeader', 'Residential address', 'section-header', { sortOrder: 4 }),
    q(stepNumber, stepLabel, 'address1', 'Address line 1', 'text', { isRequired: true, sortOrder: 5 }),
    q(stepNumber, stepLabel, 'address2', 'Address line 2', 'text', { sortOrder: 6 }),
    q(stepNumber, stepLabel, 'suburb', 'Suburb / Town', 'text', { sortOrder: 7 }),
    q(stepNumber, stepLabel, 'state', 'State / Province', 'text', { sortOrder: 8 }),
    q(stepNumber, stepLabel, 'postcode', 'Postal code', 'text', { sortOrder: 9 }),
    q(stepNumber, stepLabel, 'country', 'Country', 'country', { isRequired: true, sortOrder: 10 }),
    q(stepNumber, stepLabel, '_phoneHeader', 'Phone', 'section-header', { sortOrder: 11 }),
    q(stepNumber, stepLabel, 'phone', 'Phone number', 'phone', { isRequired: true, sortOrder: 12, placeholder: '+880 1XXXXXX' }),
    q(stepNumber, stepLabel, '_emailHeader', 'Email', 'section-header', { sortOrder: 13 }),
    q(stepNumber, stepLabel, 'email', 'Email address', 'email', { isRequired: true, sortOrder: 14 }),
];

const authorisedRecipientSection = (stepNumber: number, stepLabel: string) => [
    q(stepNumber, stepLabel, '_recipientHeader', 'Authorised recipient of written correspondence', 'section-header', { sortOrder: 1 }),
    q(stepNumber, stepLabel, 'hasAuthorisedRecipient', 'Authorise another person to receive written correspondence on their behalf?', 'boolean', { sortOrder: 2 }),
    q(stepNumber, stepLabel, 'recipientFamilyName', 'Family name', 'text', { sortOrder: 3, showIf: { field: 'hasAuthorisedRecipient', value: 'true' } }),
    q(stepNumber, stepLabel, 'recipientGivenNames', 'Given names', 'text', { sortOrder: 4, showIf: { field: 'hasAuthorisedRecipient', value: 'true' } }),
    q(stepNumber, stepLabel, 'recipientPhone', 'Phone number', 'phone', { sortOrder: 5, showIf: { field: 'hasAuthorisedRecipient', value: 'true' } }),
    q(stepNumber, stepLabel, 'recipientEmail', 'Email', 'email', { sortOrder: 6, showIf: { field: 'hasAuthorisedRecipient', value: 'true' } }),
];

const healthDeclarationSection = (stepNumber: number, stepLabel: string) => [
    q(stepNumber, stepLabel, '_healthHeader', 'Health declarations', 'section-header', { sortOrder: 1 }),
    q(stepNumber, stepLabel, 'visitedOutsidePassport', 'In the last five years, has any applicant visited, or lived, outside their country of passport, for more than 3 consecutive months? (Do not include time spent in Australia)', 'boolean', { sortOrder: 2 }),
    q(stepNumber, stepLabel, 'intendHospital', 'Does any applicant intend to enter a hospital or a health care facility (including nursing homes) while in Australia?', 'boolean', { sortOrder: 3 }),
    q(stepNumber, stepLabel, 'hasTB', 'Has any applicant: ever had, or currently have, tuberculosis? been in close contact with a family member that has active tuberculosis? ever had a chest x-ray which showed an abnormality?', 'boolean', { sortOrder: 4 }),
    q(stepNumber, stepLabel, 'expectMedicalCosts', 'During their proposed visit to Australia, does any applicant expect to incur medical costs or require treatment or medical follow up for: blood disorder, cancer, heart disease, hepatitis, HIV, kidney disease, mental illness, pregnancy, respiratory disease, or other?', 'boolean', { sortOrder: 5 }),
];

const characterDeclarationSection = (stepNumber: number, stepLabel: string) => [
    q(stepNumber, stepLabel, '_characterHeader', 'Character declarations', 'section-header', { sortOrder: 1 }),
    q(stepNumber, stepLabel, 'criminalOffence', 'Has any applicant ever been convicted of a criminal offence in any country?', 'boolean', { sortOrder: 2 }),
    q(stepNumber, stepLabel, 'chargedWithOffence', 'Has any applicant ever been charged with a criminal offence that is currently awaiting legal action?', 'boolean', { sortOrder: 3 }),
    q(stepNumber, stepLabel, 'acquittedOffence', 'Has any applicant ever been acquitted of a criminal offence on the grounds of mental illness, insanity or unsoundness of mind?', 'boolean', { sortOrder: 4 }),
    q(stepNumber, stepLabel, 'removedDeported', 'Has any applicant ever been removed, deported or excluded from any country (including Australia)?', 'boolean', { sortOrder: 5 }),
    q(stepNumber, stepLabel, 'visaRefused', 'Has any applicant ever had a visa for any country (including Australia) cancelled or refused?', 'boolean', { sortOrder: 6 }),
    q(stepNumber, stepLabel, 'overstayed', 'Has any applicant ever overstayed a visa in any country (including Australia)?', 'boolean', { sortOrder: 7 }),
];

const finalDeclarationsSection = (stepNumber: number, stepLabel: string) => [
    q(stepNumber, stepLabel, '_declarationsHeader', 'Final declarations', 'section-header', { sortOrder: 1 }),
    q(stepNumber, stepLabel, 'readUnderstood', 'Have read and understood the information provided to them in this application.', 'boolean', { isRequired: true, sortOrder: 2 }),
    q(stepNumber, stepLabel, 'truthfulComplete', 'Understand that the giving of false or misleading information is a serious offence.', 'boolean', { isRequired: true, sortOrder: 3 }),
    q(stepNumber, stepLabel, 'authoriseDisclosure', 'Authorise the Department to make enquiries to verify the information provided in this application.', 'boolean', { isRequired: true, sortOrder: 4 }),
    q(stepNumber, stepLabel, 'consentCollection', 'Give consent for the collection, use and disclosure of the applicant\'s personal information.', 'boolean', { isRequired: true, sortOrder: 5 }),
    q(stepNumber, stepLabel, 'consentLawEnforcement', 'Give consent to Australian law enforcement agencies disclosing the applicant\'s biometric, biographical and criminal record information to the Department.', 'boolean', { sortOrder: 6 }),
    q(stepNumber, stepLabel, 'readHealthInformation', 'Have read and understood the health requirements for a visa to Australia.', 'boolean', { sortOrder: 7 }),
    q(stepNumber, stepLabel, 'consentHealthService', 'Give consent to the Department and its health service providers to collect and use health information for the purpose of assessing the applicant\'s health.', 'boolean', { sortOrder: 8 }),
];

const termsSection = (stepNumber: number, stepLabel: string) => [
    q(stepNumber, stepLabel, '_termsHeader', 'Terms and Conditions', 'section-header', { sortOrder: 1 }),
    q(stepNumber, stepLabel, 'agreed', 'I have read and agree to the terms and conditions', 'boolean', { isRequired: true, sortOrder: 2 }),
];

// ─── Seed Function ────────────────────────────────────────────────────────────

const seedVisaTypesAndQuestions = async () => {
    // ── 1. Check if already seeded ─────────────────────────────────────────────
    const existingCount = await VisaType.countDocuments({});
    if (existingCount > 0) {
        console.log('✅ Visa types already seeded — skipping.');
        return;
    }

    console.log('🌱 Seeding visa types and questions...');

    // ── 2. Transit Visa (771) ──────────────────────────────────────────────────
    const transit = await VisaType.create({
        name: 'Transit Visa (771)',
        code: '771',
        category: 'Visitor',
        description: 'For passengers transiting through Australia.',
        totalSteps: 12,
        isActive: true,
        sortOrder: 1,
        sidebarLinks: [],
    });

    const transitQuestions = [
        ...termsSection(1, 'Terms & Conditions'),

        // Step 2 – Application Context (Transit)
        q(2, 'Application Context', '_contextHeader', 'Application context', 'section-header', { sortOrder: 1 }),
        q(2, 'Application Context', '_locationHeader', 'Current location', 'section-header', { sortOrder: 2 }),
        q(2, 'Application Context', 'currentLocation', 'Current location', 'country', { isRequired: true, sortOrder: 3 }),
        q(2, 'Application Context', 'legalStatus', 'Legal status', 'select', { sortOrder: 4, options: LEGAL_STATUS_OPTIONS }),
        q(2, 'Application Context', '_transitHeader', 'Transit details', 'section-header', { sortOrder: 5 }),
        q(2, 'Application Context', 'arrivalDate', 'Proposed arrival date', 'date', { isRequired: true, sortOrder: 6 }),
        q(2, 'Application Context', 'transitPurpose', 'Purpose of transit', 'radio', {
            sortOrder: 7,
            options: [
                { label: 'Depart as passenger on a flight', value: 'passenger' },
                { label: 'Depart as crew on a non-military ship', value: 'crew' },
            ],
        }),
        q(2, 'Application Context', 'transit72hrs', 'Will the applicant transit or enter and depart Australia in less than 72 hours?', 'boolean', { sortOrder: 8 }),

        // Step 3 – Applicant Details (shared)
        ...passportSection(3, 'Applicant Details'),

        // Step 4 – Data Confirmation
        q(4, 'Data Confirmation', '_dataConfirmHeader', 'Data Confirmation', 'section-header', { sortOrder: 1 }),
        q(4, 'Data Confirmation', 'dataConfirmed', 'I confirm that the information provided above is accurate and complete.', 'boolean', { isRequired: true, sortOrder: 2 }),

        // Step 5 – Contact Details (shared)
        ...contactSection(5, 'Contact Details'),

        // Step 6 – Authorised Recipient (shared)
        ...authorisedRecipientSection(6, 'Authorised Recipient'),

        // Step 7 – Transit Details
        q(7, 'Transit Details', '_transitDetailHeader', 'Transit details', 'section-header', { sortOrder: 1 }),
        q(6, 'Educational Background', 'qualificationCountry', 'Country where qualification was obtained', 'country', { isRequired: true, sortOrder: 3 }),
        q(7, 'Transit Details', 'airlineName', 'Airline name', 'text', { sortOrder: 3 }),
        q(7, 'Transit Details', 'flightNumber', 'Flight number', 'text', { sortOrder: 4 }),
        q(7, 'Transit Details', 'departureDate', 'Departure date from Australia', 'date', { isRequired: true, sortOrder: 5 }),
        q(7, 'Transit Details', 'intendStayOutsidePort', 'Will applicant leave the transit area of the airport or seaport?', 'boolean', { sortOrder: 6 }),

        // Step 8 – Health Declarations (shared)
        ...healthDeclarationSection(8, 'Health Declarations'),

        // Step 9 – Character Declarations (shared)
        ...characterDeclarationSection(9, 'Character Declarations'),

        // Step 10 – Visa History
        q(10, 'Visa History', '_visaHistoryHeader', 'Visa history', 'section-header', { sortOrder: 1 }),
        q(10, 'Visa History', 'previousAusVisa', 'Has the applicant previously held an Australian visa?', 'boolean', { sortOrder: 2 }),
        q(10, 'Visa History', 'previousVisaType', 'Type of previous Australian visa', 'text', { sortOrder: 3, showIf: { field: 'previousAusVisa', value: 'true' } }),
        q(10, 'Visa History', 'previousVisaGrantNum', 'Grant number of previous visa', 'text', { sortOrder: 4, showIf: { field: 'previousAusVisa', value: 'true' } }),

        // Step 11 – Transit Declarations
        q(11, 'Transit Declarations', '_transitDeclHeader', 'Transit declarations', 'section-header', { sortOrder: 1 }),
        q(11, 'Transit Declarations', 'transitDeclConfirmed', 'The applicant declares they are transiting through Australia and will not remain beyond the period authorised.', 'boolean', { isRequired: true, sortOrder: 2 }),
        q(11, 'Transit Declarations', 'certifyInfo', 'The applicant certifies that all information given is true and correct.', 'boolean', { isRequired: true, sortOrder: 3 }),

        // Step 12 – Final Declarations (shared)
        ...finalDeclarationsSection(12, 'Final Declarations'),
    ];

    await Question.insertMany(
        transitQuestions.map((qq) => ({ ...qq, visaTypeId: transit._id })),
    );

    console.log(`   ✅ Transit Visa (771): ${transitQuestions.length} questions`);

    // ── 3. Visitor Visa (600) ──────────────────────────────────────────────────
    const visitor = await VisaType.create({
        name: 'Visitor Visa (600)',
        code: '600',
        category: 'Visitor',
        description: 'For tourists and family visitors to Australia.',
        totalSteps: 10,
        isActive: true,
        sortOrder: 2,
        sidebarLinks: [
            'Subclass 600 information',
            'Visitor visa (subclass 600)',
            'Health requirements',
            'Visa Pricing Estimator',
        ],
    });

    const visitorQuestions = [
        ...termsSection(1, 'Terms & Conditions'),

        // Step 2 – Visitor Context
        q(2, 'Application Context', '_visitContextHeader', 'Visitor application context', 'section-header', { sortOrder: 1 }),
        q(2, 'Application Context', 'currentLocation', 'Current location', 'select', { isRequired: true, sortOrder: 2, options: COUNTRIES_OPTIONS }),
        q(2, 'Application Context', 'legalStatus', 'Legal status in current location', 'select', { sortOrder: 3, options: LEGAL_STATUS_OPTIONS }),
        q(2, 'Application Context', 'purposeOfVisit', 'Primary purpose of visit', 'radio', {
            isRequired: true,
            sortOrder: 4,
            options: [
                { label: 'Tourism', value: 'Tourism' },
                { label: 'Business visitor', value: 'Business visitor' },
                { label: 'Visit family or friends', value: 'Visit family or friends' },
            ],
        }),
        q(2, 'Application Context', 'proposedArrivalDate', 'Proposed arrival date in Australia', 'date', { isRequired: true, sortOrder: 5 }),
        q(2, 'Application Context', 'proposedStayDuration', 'Proposed duration of stay (days)', 'number', { isRequired: true, sortOrder: 6, placeholder: 'e.g. 30' }),
        q(2, 'Application Context', 'intendToWork', 'Does the applicant intend to engage in any work in Australia?', 'boolean', { sortOrder: 7 }),

        // Step 3 – Applicant Details (shared)
        ...passportSection(3, 'Applicant Details'),

        // Step 4 – Contact Details
        ...contactSection(4, 'Contact Details'),

        // Step 5 – Authorised Recipient
        ...authorisedRecipientSection(5, 'Authorised Recipient'),

        // Step 6 – Non-accompanying Family
        q(6, 'Non-accompanying Family', '_nonAccompHeader', 'Non-accompanying family members', 'section-header', { sortOrder: 1 }),
        q(6, 'Non-accompanying Family', 'hasNonAccompFamily', 'Does the applicant have a spouse / de facto partner or dependent children who are not also applying?', 'boolean', { sortOrder: 2 }),
        q(6, 'Non-accompanying Family', 'nonAccompSpouseName', 'Spouse / Partner full name', 'text', { sortOrder: 3, showIf: { field: 'hasNonAccompFamily', value: 'true' } }),
        q(6, 'Non-accompanying Family', 'nonAccompChildrenCount', 'Number of dependent children not applying', 'number', { sortOrder: 4, showIf: { field: 'hasNonAccompFamily', value: 'true' } }),

        // Step 7 – Previous Travel
        q(7, 'Previous Travel', '_prevTravelHeader', 'Previous travel to Australia', 'section-header', { sortOrder: 1 }),
        q(7, 'Previous Travel', 'previouslyInAus', 'Has the applicant previously been to Australia?', 'boolean', { sortOrder: 2 }),
        q(7, 'Previous Travel', 'lastVisitDate', 'Date of last visit to Australia', 'date', { sortOrder: 3, showIf: { field: 'previouslyInAus', value: 'true' } }),
        q(7, 'Previous Travel', 'lastVisitDuration', 'Duration of last visit (days)', 'number', { sortOrder: 4, showIf: { field: 'previouslyInAus', value: 'true' } }),
        q(7, 'Previous Travel', 'previousAusVisa', 'Type of previous Australian visa held', 'text', { sortOrder: 5, showIf: { field: 'previouslyInAus', value: 'true' } }),

        // Step 8 – Health Declarations (shared)
        ...healthDeclarationSection(8, 'Health Declarations'),

        // Step 9 – Character Declarations (shared)
        ...characterDeclarationSection(9, 'Character Declarations'),

        // Step 10 – Final Declarations (shared)
        ...finalDeclarationsSection(10, 'Final Declarations'),
    ];

    await Question.insertMany(
        visitorQuestions.map((qq) => ({ ...qq, visaTypeId: visitor._id })),
    );

    console.log(`   ✅ Visitor Visa (600): ${visitorQuestions.length} questions`);

    // ── 4. Student Visa (500) ──────────────────────────────────────────────────
    const student = await VisaType.create({
        name: 'Student Visa (500)',
        code: '500',
        category: 'Student',
        description: 'For students enrolled in registered courses in Australia.',
        totalSteps: 11,
        isActive: true,
        sortOrder: 3,
        sidebarLinks: [
            'Subclass 500 information',
            'Checklist for Student visa',
            'GTE requirements',
            'Financial requirements',
        ],
    });

    const studentQuestions = [
        ...termsSection(1, 'Terms & Conditions'),

        // Step 2 – Student Context
        q(2, 'Application Context', '_studentContextHeader', 'Student application context', 'section-header', { sortOrder: 1 }),
        q(2, 'Application Context', 'currentLocation', 'Current location', 'select', { isRequired: true, sortOrder: 2, options: COUNTRIES_OPTIONS }),
        q(2, 'Application Context', 'legalStatus', 'Legal status in current location', 'select', { sortOrder: 3, options: LEGAL_STATUS_OPTIONS }),
        q(2, 'Application Context', 'proposedArrivalDate', 'Proposed arrival date in Australia', 'date', { isRequired: true, sortOrder: 4 }),
        q(2, 'Application Context', 'courseStartDate', 'Course commencement date', 'date', { isRequired: true, sortOrder: 5 }),
        q(2, 'Application Context', 'courseEndDate', 'Course completion date', 'date', { isRequired: true, sortOrder: 6 }),
        q(2, 'Application Context', 'institutionName', 'Name of education provider', 'text', { isRequired: true, sortOrder: 7 }),
        q(2, 'Application Context', 'courseName', 'Name of course / qualification', 'text', { isRequired: true, sortOrder: 8 }),
        q(2, 'Application Context', 'coeNumber', 'Confirmation of Enrolment (CoE) number', 'text', { isRequired: true, sortOrder: 9, placeholder: 'As shown on CoE' }),

        // Step 3 – Applicant Details (shared)
        ...passportSection(3, 'Applicant Details'),

        // Step 4 – Contact Details
        ...contactSection(4, 'Contact Details'),

        // Step 5 – Authorised Recipient
        ...authorisedRecipientSection(5, 'Authorised Recipient'),

        // Step 6 – Educational Background
        q(6, 'Educational Background', '_eduHeader', 'Educational background', 'section-header', { sortOrder: 1 }),
        q(6, 'Educational Background', 'highestQualification', 'Highest qualification held', 'select', {
            isRequired: true,
            sortOrder: 2,
            options: [
                { label: 'Secondary school / High school', value: 'Secondary' },
                { label: 'Certificate / Diploma', value: 'Certificate' },
                { label: 'Bachelor degree', value: 'Bachelor' },
                { label: 'Postgraduate', value: 'Postgraduate' },
                { label: 'Doctorate (PhD)', value: 'PhD' },
            ],
        }),
        q(6, 'Educational Background', 'qualificationCountry', 'Country where qualification was obtained', 'country', { isRequired: true, sortOrder: 3 }),
        q(6, 'Educational Background', 'qualificationYear', 'Year qualification was completed', 'text', { sortOrder: 4, placeholder: 'e.g. 2022' }),
        q(6, 'Educational Background', 'gteStatement', 'Genuine Temporary Entrant (GTE) statement — explain your intention to genuinely study and return home after completing your course', 'textarea', { isRequired: true, sortOrder: 5, placeholder: 'Describe your study plans and future intentions...' }),

        // Step 7 – English Proficiency
        q(7, 'English Proficiency', '_englishHeader', 'English language proficiency', 'section-header', { sortOrder: 1 }),
        q(7, 'English Proficiency', 'englishTestType', 'English proficiency test', 'select', {
            isRequired: true,
            sortOrder: 2,
            options: [
                { label: 'IELTS', value: 'IELTS' },
                { label: 'TOEFL iBT', value: 'TOEFL' },
                { label: 'PTE Academic', value: 'PTE' },
                { label: 'Cambridge C1/C2', value: 'Cambridge' },
                { label: 'Exempt (native English speaker)', value: 'Exempt' },
            ],
        }),
        q(7, 'English Proficiency', 'englishTestScore', 'Overall test score', 'text', { sortOrder: 3, showIf: { field: 'englishTestType', value: 'IELTS' }, placeholder: 'e.g. 6.5' }),
        q(7, 'English Proficiency', 'englishTestDate', 'Test date', 'date', { sortOrder: 4 }),
        q(7, 'English Proficiency', 'englishTestRefNum', 'Test reference / TRF number', 'text', { sortOrder: 5 }),

        // Step 8 – Health Insurance (OSHC)
        q(8, 'Health Insurance (OSHC)', '_oshcHeader', 'Overseas Student Health Cover (OSHC)', 'section-header', { sortOrder: 1 }),
        q(8, 'Health Insurance (OSHC)', 'hasOshc', 'Does the applicant have Overseas Student Health Cover (OSHC)?', 'boolean', { isRequired: true, sortOrder: 2 }),
        q(8, 'Health Insurance (OSHC)', 'oshcProvider', 'OSHC provider name', 'text', { sortOrder: 3, showIf: { field: 'hasOshc', value: 'true' } }),
        q(8, 'Health Insurance (OSHC)', 'oshcPolicyNumber', 'OSHC policy number', 'text', { sortOrder: 4, showIf: { field: 'hasOshc', value: 'true' } }),
        q(8, 'Health Insurance (OSHC)', 'oshcStartDate', 'OSHC start date', 'date', { sortOrder: 5, showIf: { field: 'hasOshc', value: 'true' } }),
        q(8, 'Health Insurance (OSHC)', 'oshcEndDate', 'OSHC end date', 'date', { sortOrder: 6, showIf: { field: 'hasOshc', value: 'true' } }),

        // Step 9 – Health Declarations (shared)
        ...healthDeclarationSection(9, 'Health Declarations'),

        // Step 10 – Character Declarations (shared)
        ...characterDeclarationSection(10, 'Character Declarations'),

        // Step 11 – Final Declarations (shared)
        ...finalDeclarationsSection(11, 'Final Declarations'),
    ];

    await Question.insertMany(
        studentQuestions.map((qq) => ({ ...qq, visaTypeId: student._id })),
    );

    console.log(`   ✅ Student Visa (500): ${studentQuestions.length} questions`);

    const total = transitQuestions.length + visitorQuestions.length + studentQuestions.length;
    console.log(`🎉 Seed complete — 3 visa types, ${total} questions total.`);
};

export default seedVisaTypesAndQuestions;
