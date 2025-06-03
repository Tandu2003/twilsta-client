class TokenManager {
  private static instance: TokenManager;
  private refreshPromise: Promise<boolean> | null = null;
  private isRefreshing = false;
  private refreshAttempts = 0;
  private maxRefreshAttempts = 3;
  private lastRefreshTime = 0;
  private minRefreshInterval = 5000; // 5 seconds minimum between refresh attempts

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  async refreshToken(): Promise<boolean> {
    const now = Date.now();

    // Prevent too frequent refresh attempts
    if (now - this.lastRefreshTime < this.minRefreshInterval) {
      console.warn('Refresh token attempted too frequently, skipping...');
      return false;
    }

    // If already refreshing, return the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    // Check if we've exceeded max attempts
    if (this.refreshAttempts >= this.maxRefreshAttempts) {
      console.error('Max refresh attempts exceeded, redirecting to login...');
      this.redirectToLogin();
      return false;
    }

    this.isRefreshing = true;
    this.refreshAttempts++;
    this.lastRefreshTime = now;

    this.refreshPromise = this.performRefresh();

    try {
      const result = await this.refreshPromise;
      if (result) {
        // Reset attempts on successful refresh
        this.refreshAttempts = 0;
      }
      return result;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<boolean> {
    try {
      // Use fetch instead of axios to avoid interceptor loop
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === 'Token refreshed successfully') {
          return true;
        }
      }

      throw new Error(`Refresh failed with status: ${response.status}`);
    } catch (error) {
      console.error('Refresh token request failed:', error);
      throw error;
    }
  }

  isCurrentlyRefreshing(): boolean {
    return this.isRefreshing;
  }

  resetState(): void {
    this.isRefreshing = false;
    this.refreshPromise = null;
    this.refreshAttempts = 0;
    this.lastRefreshTime = 0;
  }

  private redirectToLogin(): void {
    if (typeof window !== 'undefined') {
      // Clear any remaining tokens
      this.resetState();
      window.location.href = '/login';
    }
  }

  // Check if we should attempt refresh based on error
  shouldRefresh(error: any): boolean {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error?.message || '';

    return (
      status === 401 &&
      (message.includes('expired') || message.includes('invalid')) &&
      !message.includes('refresh') && // Don't refresh if it's already a refresh token error
      this.refreshAttempts < this.maxRefreshAttempts
    );
  }
}

export default TokenManager.getInstance();
