import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { UserProfile, Gender } from '../../shared/models';
import { USER_PROFILE_API_CLIENT_TOKEN } from "../../api/base-user-profile-api";

@Injectable({
    providedIn: 'root'
})
export class UserProfileService {
    private _userProfile = new BehaviorSubject<UserProfile>({} as UserProfile);
    private readonly userProfileApiClient = inject(USER_PROFILE_API_CLIENT_TOKEN);

    get userProfile() {
        return this._userProfile.asObservable();
    }

    async loadUserProfile() {
        // TODO: re-work it
        await this.userProfileApiClient
                .getUserProfile({id: "someid"})
                .then(res => this._userProfile.next(res));
    }

    async setUserProfile(profile: UserProfile): Promise<void> {
        await this.userProfileApiClient.setUserProfile(profile);
        this._userProfile.next(profile);
    }
}