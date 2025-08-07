import { InjectionToken } from '@angular/core';
import { Country } from './country';

export interface ILookupApiClient {
    loadCountries(): Promise<Country[]>;
}

export const LOOKUP_API_CLIENT_TOKEN = new InjectionToken<ILookupApiClient>('LOOKUP_API_CLIENT_TOKEN');
