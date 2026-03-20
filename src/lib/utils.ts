import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const loadFromLocalStorage = ({ key }: { key: string }) => {
  try {
    const serializedState = localStorage.getItem(key)
    if (serializedState === null) return false
    return JSON.parse(serializedState)
  } catch (e) {
    console.log(e)
    return undefined
  }
}

export const saveToLocalStorage = <T>({
  state,
  key,
}: {
  key: string
  state: T
}) => {
  try {
    // if (localStorage.getItem(key)) return
    const serializedState = JSON.stringify(state)
    localStorage.setItem(key, serializedState)
  } catch (e) {
    console.log(e)
  }
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

const DEFAULT_POST_AUTH_REDIRECT = '/shop/home'

/**
 * Only allow in-app paths under /shop or /auth (blocks open redirects like //evil.com, javascript:, etc.).
 */
export function sanitizeInternalRedirect(
  redirect: string | null | undefined
): string {
  if (redirect == null || redirect === '') return DEFAULT_POST_AUTH_REDIRECT
  let decoded: string
  try {
    decoded = decodeURIComponent(redirect.trim())
  } catch {
    return DEFAULT_POST_AUTH_REDIRECT
  }
  if (
    !decoded.startsWith('/') ||
    decoded.startsWith('//') ||
    decoded.includes('://') ||
    decoded.includes('\\') ||
    decoded.includes('\0') ||
    decoded.includes('@')
  ) {
    return DEFAULT_POST_AUTH_REDIRECT
  }
  const allowed = /^\/(shop|auth)(\/|$)/i
  if (!allowed.test(decoded)) return DEFAULT_POST_AUTH_REDIRECT
  return decoded
}