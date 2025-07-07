import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-googlelogin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './googlelogin.html',
  styleUrl: './googlelogin.css'
})
export class Googlelogin {
  private router = inject(Router);

  ngOnInit() {
    const isLoggedIn = sessionStorage.getItem('email');
    if (isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  googleSignIn() {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: '430574682715-tu1ehg54d0m06e54g8tuuam7hts67092.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/spreadsheets.readonly openid email profile',
      callback: (tokenResponse: any) => {
        console.log('tokenResponse', tokenResponse);

        // The access token
        const accessToken = tokenResponse.access_token;
        sessionStorage.setItem('accessToken', accessToken);

        // Optional: fetch user info
        this.fetchUserInfo(accessToken);
      }
    });

    // This triggers the popup
    client.requestAccessToken();
  }

  fetchUserInfo(accessToken: string) {
    // Fetch profile info from Google People API
    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(profile => {
        console.log('User profile:', profile);
        sessionStorage.setItem('email', profile.email);
        sessionStorage.setItem('name', profile.name);
        sessionStorage.setItem('photoUrl', profile.picture);

        this.router.navigate(['/dashboard']);
      });
  }
}
