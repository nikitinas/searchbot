/**
 * Language detection utilities
 * Detects language from text input or uses browser language as fallback
 */

/**
 * Simple language detection based on character patterns
 * Returns ISO 639-1 language code
 */
export function detectLanguage(text: string): string {
  if (!text || text.trim().length < 3) {
    // Too short to detect, use browser language
    return getBrowserLanguage();
  }

  const normalizedText = text.toLowerCase().trim();

  // Check for common language patterns
  // Spanish: common words and characters
  if (/[áéíóúñü]/.test(normalizedText) || 
      /\b(el|la|los|las|de|que|y|a|en|un|una|es|son|con|por|para)\b/i.test(normalizedText)) {
    return 'es';
  }

  // French: common words and characters
  if (/[àâäéèêëïîôùûüÿç]/.test(normalizedText) ||
      /\b(le|la|les|de|du|des|et|est|un|une|dans|pour|avec|sur)\b/i.test(normalizedText)) {
    return 'fr';
  }

  // German: common words and characters
  if (/[äöüß]/.test(normalizedText) ||
      /\b(der|die|das|und|ist|sind|mit|für|von|zu|auf|in)\b/i.test(normalizedText)) {
    return 'de';
  }

  // Russian: Cyrillic characters
  if (/[а-яё]/i.test(normalizedText)) {
    return 'ru';
  }

  // Chinese: Chinese characters
  if (/[\u4e00-\u9fff]/.test(normalizedText)) {
    return 'zh';
  }

  // Japanese: Hiragana/Katakana/Kanji
  if (/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]/.test(normalizedText)) {
    return 'ja';
  }

  // Korean: Hangul
  if (/[\uac00-\ud7a3]/.test(normalizedText)) {
    return 'ko';
  }

  // Arabic: Arabic script
  if (/[\u0600-\u06ff]/.test(normalizedText)) {
    return 'ar';
  }

  // Portuguese: common words
  if (/\b(o|a|os|as|de|do|da|dos|das|e|é|são|com|para|por|em|um|uma)\b/i.test(normalizedText)) {
    return 'pt';
  }

  // Italian: common words
  if (/\b(il|la|lo|gli|le|di|del|della|dei|delle|e|è|sono|con|per|in|un|una)\b/i.test(normalizedText)) {
    return 'it';
  }

  // Default to English or browser language
  return getBrowserLanguage();
}

/**
 * Get browser language as ISO 639-1 code
 */
export function getBrowserLanguage(): string {
  if (typeof navigator === 'undefined') {
    return 'en'; // Default fallback
  }

  // Get browser language (e.g., 'en-US' -> 'en')
  const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
  return browserLang.split('-')[0].toLowerCase();
}

/**
 * Get language name from ISO code
 */
export function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    ja: 'Japanese',
    ko: 'Korean',
    zh: 'Chinese',
    ar: 'Arabic',
    hi: 'Hindi',
  };
  return names[code] || 'English';
}

