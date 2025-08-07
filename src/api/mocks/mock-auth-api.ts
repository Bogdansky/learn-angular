import { AuthResponse, IApiClient } from "../base-auth-api";
import { AuthRequest } from "../auth-request"

export class MockAuthApi implements IApiClient {
    private readonly defaultAuthResponse = {};

    login(req: AuthRequest): Promise<AuthResponse> {
        console.log(req);

        return new Promise(res => {
            setTimeout(() => {
                res(this.defaultAuthResponse);
            }, 10); 
        });
    }

    register(req: AuthRequest): Promise<AuthResponse> {
        console.log(req);

        return new Promise(res => {
            setTimeout(() => {
                res(this.defaultAuthResponse);
            }, 10); 
        });
    }

    logout(): Promise<void> {
        // this is just to emulate sending a request to expire a token
        return new Promise(() => {
            setTimeout(() => { }, 10);
        });
    }
}