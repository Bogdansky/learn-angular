import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { MockAuthApi } from '../api/mocks/mock-auth-api';
import { MockLookupApi } from '../api/mocks/mock-lookup-api';
import { MockUserProfileApi } from '../api/mocks/mock-user-profile-api';

import { API_CLIENT_TOKEN } from '../api/base-auth-api';
import { LOOKUP_API_CLIENT_TOKEN } from '../api/base-lookup-api';
import { USER_PROFILE_API_CLIENT_TOKEN } from '../api/base-user-profile-api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: API_CLIENT_TOKEN, useClass: MockAuthApi },
    { provide: LOOKUP_API_CLIENT_TOKEN, useClass: MockLookupApi },
    { provide: USER_PROFILE_API_CLIENT_TOKEN, useClass: MockUserProfileApi }
  ]
};
