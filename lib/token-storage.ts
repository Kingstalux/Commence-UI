interface TokenData {
  token: string;
  expiresAt: number;
  user?: any;
}

const TOKEN_KEY = "authToken";
const TOKEN_DATA_KEY = "authTokenData";

export class TokenStorage {
  /**
   * Migrate existing token from old storage format
   */
  static migrateExistingToken(): void {
    if (typeof window === "undefined") return;

    try {
      const existingToken = localStorage.getItem(TOKEN_KEY);
      const existingTokenData = localStorage.getItem(TOKEN_DATA_KEY);

      // If we have an old token but no new token data, migrate it
      if (existingToken && !existingTokenData) {
        console.log("Migrating existing token to new format");
        this.setToken(existingToken, null, 24); // Set with 24 hour expiration
      }
    } catch (error) {
      console.error("Failed to migrate existing token:", error);
    }
  }

  /**
   * Store token with expiration (default 24 hours)
   */
  static setToken(
    token: string,
    user?: any,
    expirationHours: number = 24
  ): void {
    if (typeof window === "undefined") return;

    const expiresAt = Date.now() + expirationHours * 60 * 60 * 1000;
    const tokenData: TokenData = {
      token,
      expiresAt,
      user,
    };

    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(TOKEN_DATA_KEY, JSON.stringify(tokenData));
    } catch (error) {
      console.error("Failed to store token:", error);
    }
  }

  /**
   * Get token if it exists and hasn't expired
   */
  static getToken(): string | null {
    if (typeof window === "undefined") return null;

    try {
      const tokenDataStr = localStorage.getItem(TOKEN_DATA_KEY);
      if (!tokenDataStr) {
        // Fallback to old token storage method
        return localStorage.getItem(TOKEN_KEY);
      }

      const tokenData: TokenData = JSON.parse(tokenDataStr);

      // Check if token has expired
      if (Date.now() > tokenData.expiresAt) {
        this.clearToken();
        return null;
      }

      return tokenData.token;
    } catch (error) {
      console.error("Failed to retrieve token:", error);
      // Fallback to simple token retrieval
      return localStorage.getItem(TOKEN_KEY);
    }
  }

  /**
   * Get stored token data including user info
   */
  static getTokenData(): TokenData | null {
    if (typeof window === "undefined") return null;

    try {
      const tokenDataStr = localStorage.getItem(TOKEN_DATA_KEY);
      if (!tokenDataStr) return null;

      const tokenData: TokenData = JSON.parse(tokenDataStr);

      // Check if token has expired
      if (Date.now() > tokenData.expiresAt) {
        this.clearToken();
        return null;
      }

      return tokenData;
    } catch (error) {
      console.error("Failed to retrieve token data:", error);
      return null;
    }
  }

  /**
   * Check if token exists and is valid
   */
  static isTokenValid(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Get token expiration time in milliseconds
   */
  static getTokenExpiration(): number | null {
    if (typeof window === "undefined") return null;

    try {
      const tokenDataStr = localStorage.getItem(TOKEN_DATA_KEY);
      if (!tokenDataStr) return null;

      const tokenData: TokenData = JSON.parse(tokenDataStr);
      return tokenData.expiresAt;
    } catch (error) {
      console.error("Failed to get token expiration:", error);
      return null;
    }
  }

  /**
   * Check if token will expire soon (within 1 hour)
   */
  static isTokenExpiringSoon(): boolean {
    const expiration = this.getTokenExpiration();
    if (!expiration) return false;

    const oneHour = 60 * 60 * 1000;
    return expiration - Date.now() < oneHour;
  }

  /**
   * Clear all token data
   */
  static clearToken(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_DATA_KEY);
    } catch (error) {
      console.error("Failed to clear token:", error);
    }
  }

  /**
   * Refresh token expiration (extend by another 24 hours)
   */
  static refreshTokenExpiration(expirationHours: number = 24): boolean {
    const tokenData = this.getTokenData();
    if (!tokenData) return false;

    const newExpiresAt = Date.now() + expirationHours * 60 * 60 * 1000;
    const updatedTokenData: TokenData = {
      ...tokenData,
      expiresAt: newExpiresAt,
    };

    try {
      localStorage.setItem(TOKEN_DATA_KEY, JSON.stringify(updatedTokenData));
      return true;
    } catch (error) {
      console.error("Failed to refresh token expiration:", error);
      return false;
    }
  }
}
