import { franc } from 'franc';
import { translate } from '@vitalets/google-translate-api';

export const SUPPORTED_LANGUAGES = new Map([
  ['eng', { name: 'English', code: 'en' }],
  ['cmn', { name: 'Chinese', code: 'zh' }],
  ['spa', { name: 'Spanish', code: 'es' }],
  ['hin', { name: 'Hindi', code: 'hi' }],
  ['ara', { name: 'Arabic', code: 'ar' }],
  ['ben', { name: 'Bengali', code: 'bn' }],
  ['por', { name: 'Portuguese', code: 'pt' }],
  ['rus', { name: 'Russian', code: 'ru' }],
  ['jpn', { name: 'Japanese', code: 'ja' }],
  ['kor', { name: 'Korean', code: 'ko' }],
  ['fra', { name: 'French', code: 'fr' }],
  ['deu', { name: 'German', code: 'de' }],
  ['ita', { name: 'Italian', code: 'it' }],
  ['vie', { name: 'Vietnamese', code: 'vi' }],
  ['tha', { name: 'Thai', code: 'th' }]
]);

export async function detectLanguage(text: string): Promise<{
  code: string;
  name: string;
  confidence: number;
}> {
  const detectedLangCode = franc(text);
  const language = SUPPORTED_LANGUAGES.get(detectedLangCode);

  if (!language) {
    return {
      code: 'eng',
      name: 'English',
      confidence: 0.5
    };
  }

  return {
    code: language.code,
    name: language.name,
    confidence: 0.8 // franc provides high confidence detections
  };
}

export async function translateText(
  text: string,
  targetLang: string = 'en'
): Promise<{
  translatedText: string;
  sourceLang: string;
  success: boolean;
}> {
  try {
    const result = await translate(text, { to: targetLang });
    return {
      translatedText: result.text,
      sourceLang: result.raw.src,
      success: true
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      translatedText: text,
      sourceLang: 'en',
      success: false
    };
  }
}

export function getLanguageCode(langName: string): string {
  for (const [_, value] of SUPPORTED_LANGUAGES) {
    if (value.name.toLowerCase() === langName.toLowerCase()) {
      return value.code;
    }
  }
  return 'en'; // Default to English if not found
}

export function getLanguageName(langCode: string): string {
  for (const [_, value] of SUPPORTED_LANGUAGES) {
    if (value.code === langCode) {
      return value.name;
    }
  }
  return 'English'; // Default to English if not found
}