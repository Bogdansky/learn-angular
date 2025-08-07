import { Injectable, inject } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { API_CLIENT_TOKEN, IApiClient } from "../../api/base-auth-api";
import { AuthRequest } from '../../api/auth-request'
import { UserProfileService } from './user-profile.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _isAuthenticated = new BehaviorSubject<boolean>(false);
    private apiClient: IApiClient = inject(API_CLIENT_TOKEN);
    private userProfileService = inject(UserProfileService);

    get isAuthenticated$() {
        return this._isAuthenticated.asObservable();
    }

    get isAuthenticated() {
        return this._isAuthenticated.value;
    }

    private async setIsAuthenticated(val: boolean) {
        this._isAuthenticated.next(val);
        
        // Load user profile when user gets authenticated
        if (val) {
            try {
                await this.userProfileService.loadUserProfile();
            } catch (error) {
                console.error('Failed to load user profile:', error);
                // Don't fail authentication if profile loading fails
            }
        }
    }

    async auth(request: AuthRequest): Promise<void> {
        try {
            await this.apiClient.login(request);
            await this.setIsAuthenticated(true);
        } catch (error) {
            await this.setIsAuthenticated(false);
            throw error;
        }
    }

    async register(request: AuthRequest): Promise<void> {
        try {
            await this.apiClient.register(request);
            await this.setIsAuthenticated(true);
        } catch (error) {
            await this.setIsAuthenticated(false);
            throw error;
        }
    }

    async logout(): Promise<void> {
        try {
            await this.apiClient.logout();
        } catch (error) {
            throw error;
        } finally {
            await this.setIsAuthenticated(false);
        }
    }
}