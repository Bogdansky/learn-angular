import { AuthRequest, AuthResponse, IApiClient } from "../base-api";

export class MockAuthApi implements IApiClient {
    private readonly defaultAuthResponse = {};

    login(req: AuthRequest): Promise<AuthResponse> {
        console.log(req);

        return new Promise(res => 
            {
                setTimeout(() => {}, 10); 
                return this.defaultAuthResponse;
            })
    }

    logout(): void {
        setTimeout(() => {}, 10);
    }
}