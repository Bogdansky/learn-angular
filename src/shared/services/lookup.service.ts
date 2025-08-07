import { Injectable, inject } from "@angular/core";
import { LOOKUP_API_CLIENT_TOKEN, ILookupApiClient } from "../../api/base-lookup-api";
import { Country } from "../../api/country";

@Injectable({
    providedIn: 'root'
})
export class LookupService {
    private lookupApiClient: ILookupApiClient = inject(LOOKUP_API_CLIENT_TOKEN);

    async loadCountries(): Promise<Country[]> {
        try {
            return await this.lookupApiClient.loadCountries();
        } catch (error) {
            console.error('Failed to load countries:', error);
            throw error;
        }
    }
}
