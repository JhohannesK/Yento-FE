/**
 * Auth session (OWASP-aligned for SPA without a BFF):
 * - Access JWT: memory only (not localStorage — avoids persistent XSS token theft).
 * - Refresh token: sessionStorage (tab-scoped; survives reload; still XSS-readable — mitigate with strict CSP).
 * - Never log token values.
 */

const REFRESH_STORAGE_KEY = 'yento_rt';

let accessTokenMemory: string | null = null;

export function setSessionTokens(access: string, refresh: string): void {
	accessTokenMemory = access;
	try {
		sessionStorage.setItem(REFRESH_STORAGE_KEY, refresh);
	} catch {
		// Quota / private mode: user may need to sign in again after reload.
	}
}

export function getAccessToken(): string | null {
	return accessTokenMemory;
}

export function getRefreshToken(): string | null {
	try {
		return sessionStorage.getItem(REFRESH_STORAGE_KEY);
	} catch {
		return null;
	}
}

export function clearSession(): void {
	accessTokenMemory = null;
	try {
		sessionStorage.removeItem(REFRESH_STORAGE_KEY);
	} catch {
		// ignore
	}
}

/** Restore access token after full page load using refresh token (if present). */
export async function bootstrapAuth(): Promise<void> {
	const rt = getRefreshToken();
	if (!rt) return;

	const { axiosInstance } = await import('../api/axios');
	try {
		const { data } = await axiosInstance.post<{
			data?: { accessToken?: string; refreshToken?: string };
		}>('/auth/refresh', { refreshToken: rt });
		const d = data?.data;
		if (d?.accessToken && d?.refreshToken) {
			setSessionTokens(d.accessToken, d.refreshToken);
		} else {
			clearSession();
		}
	} catch {
		clearSession();
	}
}
