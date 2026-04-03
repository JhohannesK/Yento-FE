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

/** Matches API / JWT role for admin-only routes (e.g. get-all-products-by-user). */
export function isAdmin(): boolean {
	if (typeof window === "undefined") return false;
	const raw = localStorage.getItem("user");
	if (!raw) return false;
	try {
		const parsed = JSON.parse(raw) as { role?: string };
		return parsed?.role === "Admin";
	} catch {
		return false;
	}
}
