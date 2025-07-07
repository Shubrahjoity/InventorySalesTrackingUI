import { ApplicationConfig } from "@angular/core";
import { routes } from "./app.routes";
import { provideRouter } from "@angular/router";
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { provideHttpClient } from "@angular/common/http";
export const appConfig:ApplicationConfig={
    providers:[
      provideHttpClient(),
        provideRouter(routes),
        {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        lang: 'en',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '430574682715-tu1ehg54d0m06e54g8tuuam7hts67092.apps.googleusercontent.com',{
                prompt:"select_account",
                oneTapEnabled:false
              }
            )
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
    ]
}