/**
 * ThesisFrame — Tauri Desktop Integration
 * All calls gracefully degrade when not running inside Tauri.
 */

export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return '__TAURI_INTERNALS__' in window;
}

export async function getAppVersion(): Promise<string> {
  if (typeof window === 'undefined' || !('__TAURI_INTERNALS__' in window)) {
    return '0.3.0-web';
  }
  const { invoke } = await import('@tauri-apps/api/core');
  try {
    return await invoke<string>('get_app_version');
  } catch {
    return '0.3.0';
  }
}

export async function getDocumentsDir(): Promise<string | null> {
  if (typeof window === 'undefined' || !('__TAURI_INTERNALS__' in window)) {
    return null;
  }
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    return await invoke<string>('get_documents_dir');
  } catch {
    return null;
  }
}

export async function getDesktopDir(): Promise<string | null> {
  if (typeof window === 'undefined' || !('__TAURI_INTERNALS__' in window)) {
    return null;
  }
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    return await invoke<string>('get_desktop_dir');
  } catch {
    return null;
  }
}

export function getPlatformInfo(): { isDesktop: boolean; isWeb: boolean; platform: string } {
  const desktop = isDesktop();
  return {
    isDesktop: desktop,
    isWeb: !desktop,
    platform: desktop ? 'windows' : 'web',
  };
}
