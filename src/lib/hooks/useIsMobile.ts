import { useSyncExternalStore } from 'react';

const getSnapshot = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
const getServerSnapshot = () => false;
const subscribe = (callback: () => void) => {
	const mql = window.matchMedia('(max-width: 767px)');
	mql.addEventListener('change', callback);
	return () => mql.removeEventListener('change', callback);
};

export function useIsMobile() {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
