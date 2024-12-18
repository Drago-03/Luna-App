import { franc } from 'franc';
import { translate } from '@vitalets/google-translate-api';

export const SUPPORTED_LANGUAGES = new Map([
  ['eng', 'English'],
  ['cmn', 'Chinese'],
  ['spa', 'Spanish'],
  ['hin', 'Hindi'],
  ['ara', 'Arabic'],
  ['ben', 'Bengali'],
  ['por', 'Portuguese'],
  ['rus', 'Russian'],
  ['jpn', 'Japanese'],
  ['kor', 'Korean']
]);

export async function detectLanguage(text: string): Promise<string> {
  return franc(text);
}

export async function translateText(text: string, targetLang: string = 'eng'): Promise<string> {
  const result = await translate(text, { to: targetLang });
  return result.text;
}
 
export default class LanguageProcessor {
}