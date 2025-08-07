import { InjectionToken } from '@angular/core';
import { AuthRequest } from './auth-request';

export interface AuthResponse {};

export interface IApiClient {
    login(req: AuthRequest): Promise<AuthResponse>;
    register(req: AuthRequest): Promise<AuthResponse>;
    logout(): Promise<void>;
}

export const API_CLIENT_TOKEN = new InjectionToken<IApiClient>('API_CLIENT_TOKEN');