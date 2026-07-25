/**
 * ThesisFrame — Tauri Desktop Integration
 * All calls are no-ops when not running inside Tauri.
 */

export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return '__TAURI_INTERNALS__' in window;
}

export async function getAppVersion(): Promise<string> {
  return '0.2.0';
}

export async function getDocumentsDir(): Promise<string | null> {
  return null;
}

export async function getDesktopDir(): Promise<string | null> {
  return null;
}

export function getPlatformInfo(): { isDesktop: boolean; isWeb: boolean; platform: string } {
  return {
    isDesktop: false,
    isWeb: true,
    platform: 'web',
  };
}
