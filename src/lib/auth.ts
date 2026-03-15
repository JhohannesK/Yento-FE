export function isAuthenticated(): boolean {
	return Boolean(typeof window !== 'undefined' && localStorage.getItem('token'));
}
