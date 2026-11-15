import { formatShort, type DateKey } from './date';

/**
 * Text zum Teilen, z. B.
 *   TagesQuiz 15.11.2026
 *   📰 4/5  📜 ✅  🌍 3 Versuche
 *   🔥 Serie: 6 Tage
 */
export function buildShareText(today: DateKey, lines: string[], streak: number, url?: string): string {
  const out = [`TagesQuiz ${formatShort(today)}`, lines.join('  '), `🔥 Serie: ${streak} ${streak === 1 ? 'Tag' : 'Tage'}`];
  if (url) out.push(url);
  return out.join('\n');
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback für ältere Browser
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}
