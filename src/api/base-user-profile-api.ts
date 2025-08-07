import { InjectionToken } from '@angular/core';
import { UserProfile } from '../shared/models/index';
import { GetUserProfileRequest } from './requests/GetUserProfileRequest';

// UserProflie will be replaced with actual DTO
export interface IUserProfileApiClient {
    getUserProfile(req: GetUserProfileRequest): Promise<UserProfile>;
    setUserProfile(userProfile: UserProfile): Promise<void>;
}

export const USER_PROFILE_API_CLIENT_TOKEN = new InjectionToken<IUserProfileApiClient>('USER_PROFILE_API_CLIENT_TOKEN');
