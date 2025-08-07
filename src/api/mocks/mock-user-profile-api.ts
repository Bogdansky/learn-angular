import { UserProfile } from "../../shared/models/user-profile.interface";
import { GetUserProfileRequest } from "../requests/GetUserProfileRequest";
import { defaultUserProfile } from '../../data/defaultuserprofile'
import { IUserProfileApiClient } from "../base-user-profile-api";

export class MockUserProfileApi implements IUserProfileApiClient {
    private readonly defaultUserProfile: UserProfile = defaultUserProfile;

    getUserProfile(req: GetUserProfileRequest): Promise<UserProfile> {
        console.log(req);

        return new Promise(res => {
            setTimeout(() => {
                res(this.defaultUserProfile);
            }, 10); 
        });
    }

    setUserProfile(req: UserProfile): Promise<void> {
        console.log(req);

        return new Promise(res => {
            setTimeout(() => { res(); }, 10); 
        });
    }
}