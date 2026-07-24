/**
 * ThesisFrame — Tauri Desktop Integration
 * 
 * Provides utilities to detect and interact with the Tauri desktop environment.
 * Safe to use in web browser — all calls are no-ops when not in Tauri.
 */

import { invoke } from '@tauri-apps/api/core';

/**
 * Returns true if running inside a Tauri WebView (desktop app).
 */
export function isDesktop(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

/**
 * Get the app version from Tauri (Rust side).
 * Falls back to package.json version on web.
 */
export async function getAppVersion(): Promise<string> {
  if (!isDesktop()) {
    return process.env.NEXT_PUBLIC_APP_VERSION || '0.2.0';
  }
  try {
    return await invoke<string>('get_app_version');
  } catch {
    return '0.2.0';
  }
}

/**
 * Get the platform-specific documents directory.
 */
export async function getDocumentsDir(): Promise<string | null> {
  if (!isDesktop()) return null;
  try {
    return await invoke<string>('get_documents_dir');
  } catch {
    return null;
  }
}

/**
 * Get the platform-specific desktop directory.
 */
export async function getDesktopDir(): Promise<string | null> {
  if (!isDesktop()) return null;
  try {
    return await invoke<string>('get_desktop_dir');
  } catch {
    return null;
  }
}

/**
 * Get a user-friendly platform string.
 */
export function getPlatformInfo(): { isDesktop: boolean; isWeb: boolean; platform: string } {
  const desktop = isDesktop();
  return {
    isDesktop: desktop,
    isWeb: !desktop,
    platform: desktop ? 'desktop' : 'web',
  };
}
