export function isAuthenticated(): boolean {
	if (typeof window === "undefined") return false;
	const user = localStorage.getItem("user");
	if (!user) return false;
	try {
		const parsed = JSON.parse(user) as { id?: string };
		return Boolean(parsed?.id);
	} catch {
		return false;
	}
}
