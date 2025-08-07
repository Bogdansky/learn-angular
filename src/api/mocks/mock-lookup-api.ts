import { ILookupApiClient } from "../base-lookup-api";
import { Country } from "../country";

export class MockLookupApi implements ILookupApiClient {
    private readonly euCountries: Country[] = [
        { isoCode: 'AT', displayName: 'Austria' },
        { isoCode: 'BE', displayName: 'Belgium' },
        { isoCode: 'BG', displayName: 'Bulgaria' },
        { isoCode: 'HR', displayName: 'Croatia' },
        { isoCode: 'CY', displayName: 'Cyprus' },
        { isoCode: 'CZ', displayName: 'Czech Republic' },
        { isoCode: 'DK', displayName: 'Denmark' },
        { isoCode: 'EE', displayName: 'Estonia' },
        { isoCode: 'FI', displayName: 'Finland' },
        { isoCode: 'FR', displayName: 'France' },
        { isoCode: 'DE', displayName: 'Germany' },
        { isoCode: 'GR', displayName: 'Greece' },
        { isoCode: 'HU', displayName: 'Hungary' },
        { isoCode: 'IE', displayName: 'Ireland' },
        { isoCode: 'IT', displayName: 'Italy' },
        { isoCode: 'LV', displayName: 'Latvia' },
        { isoCode: 'LT', displayName: 'Lithuania' },
        { isoCode: 'LU', displayName: 'Luxembourg' },
        { isoCode: 'MT', displayName: 'Malta' },
        { isoCode: 'NL', displayName: 'Netherlands' },
        { isoCode: 'PL', displayName: 'Poland' },
        { isoCode: 'PT', displayName: 'Portugal' },
        { isoCode: 'RO', displayName: 'Romania' },
        { isoCode: 'SK', displayName: 'Slovakia' },
        { isoCode: 'SI', displayName: 'Slovenia' },
        { isoCode: 'ES', displayName: 'Spain' },
        { isoCode: 'SE', displayName: 'Sweden' }
    ];

    loadCountries(): Promise<Country[]> {
        console.log('MockLookupApi: Starting to load countries...');
        
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(`MockLookupApi: Loaded ${this.euCountries.length} EU countries`);
                resolve([...this.euCountries]);
            }, 300); // Increased delay to better demonstrate async behavior
        });
    }
}
