import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  saveTokens(accessToken: string, refreshToken: string) {
    if (this.isBrowser) {
      console.log("Saving tokens:", accessToken, refreshToken);  // Debug
      window.localStorage.setItem(this.accessTokenKey, accessToken);
      window.localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }  
  getAccessToken(): string | null {
    if (this.isBrowser) {
      const token = window.localStorage.getItem(this.accessTokenKey);
      console.log("Getting access token:", token);  // Debug
      return token;
    }
    return null;
  }
  

  getRefreshToken(): string | null {
    if (this.isBrowser) {
      return window.localStorage.getItem(this.refreshTokenKey);
    }
    return null;
  }

  destroyTokens() {
    if (this.isBrowser) {
      console.log("Destroying tokens");  // Debug
      window.localStorage.removeItem(this.accessTokenKey);
      window.localStorage.removeItem(this.refreshTokenKey);
      console.clear(); 
    }
  }
}
