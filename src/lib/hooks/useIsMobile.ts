import { useSyncExternalStore } from 'react';

/** Matches Tailwind `lg` (1024px): compact nav + sheet below this width. */
const MOBILE_MQ = '(max-width: 1023px)';

const getSnapshot = () =>
	typeof window !== 'undefined' && window.matchMedia(MOBILE_MQ).matches;
const getServerSnapshot = () => false;
const subscribe = (callback: () => void) => {
	const mql = window.matchMedia(MOBILE_MQ);
	mql.addEventListener('change', callback);
	return () => mql.removeEventListener('change', callback);
};

export function useIsMobile() {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
