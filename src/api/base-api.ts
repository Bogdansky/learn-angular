export interface AuthRequest {};
export interface AuthResponse {};

export interface IApiClient {
    login(req: AuthRequest): Promise<AuthResponse>;
    logout(): void;
}