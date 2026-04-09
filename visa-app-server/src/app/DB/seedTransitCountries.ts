import { TransitCountry } from '../modules/transitCountry/transitCountry.model';

const seedTransitCountries = async () => {
    const countries = [
        {
            name: 'India',
            code: 'IN',
            flagEmoji: '🇮🇳',
            isActive: true,
            sortOrder: 1,
            surcharge: 50,
            currency: 'INR',
            exchangeRate: 55.5
        },
        {
            name: 'Bangladesh',
            code: 'BD',
            flagEmoji: '🇧🇩',
            isActive: true,
            sortOrder: 2,
            surcharge: 20,
            currency: 'BDT',
            exchangeRate: 72.8
        },
        {
            name: 'United States',
            code: 'US',
            flagEmoji: '🇺🇸',
            isActive: true,
            sortOrder: 3,
            surcharge: 100,
            currency: 'USD',
            exchangeRate: 0.65
        },
        {
            name: 'United Kingdom',
            code: 'GB',
            flagEmoji: '🇬🇧',
            isActive: true,
            sortOrder: 4,
            surcharge: 80,
            currency: 'GBP',
            exchangeRate: 0.52
        },
        {
            name: 'China',
            code: 'CN',
            flagEmoji: '🇨🇳',
            isActive: true,
            sortOrder: 5,
            surcharge: 45,
            currency: 'CNY',
            exchangeRate: 4.7
        },
        {
            name: 'Malaysia',
            code: 'MY',
            flagEmoji: '🇲🇾',
            isActive: true,
            sortOrder: 6,
            surcharge: 30,
            currency: 'MYR',
            exchangeRate: 3.1
        },
        {
            name: 'Singapore',
            code: 'SG',
            flagEmoji: '🇸🇬',
            isActive: true,
            sortOrder: 7,
            surcharge: 40,
            currency: 'SGD',
            exchangeRate: 0.88
        },
        {
            name: 'New Zealand',
            code: 'NZ',
            flagEmoji: '🇳🇿',
            isActive: true,
            sortOrder: 8,
            surcharge: 0,
            currency: 'NZD',
            exchangeRate: 1.08
        },
        {
            name: 'Canada',
            code: 'CA',
            flagEmoji: '🇨🇦',
            isActive: true,
            sortOrder: 9,
            surcharge: 60,
            currency: 'CAD',
            exchangeRate: 0.88
        },
        {
            name: 'South Africa',
            code: 'ZA',
            flagEmoji: '🇿🇦',
            isActive: true,
            sortOrder: 10,
            surcharge: 25,
            currency: 'ZAR',
            exchangeRate: 12.5
        }
    ];

    for (const country of countries) {
        const isExist = await TransitCountry.findOne({ code: country.code });
        if (!isExist) {
            await TransitCountry.create(country);
        }
    }
};

export default seedTransitCountries;
