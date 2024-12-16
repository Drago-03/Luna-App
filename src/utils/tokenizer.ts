export class Tokenizer {
  tokenize(text: string): string[] {
    return text.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0);
  }
}

export const tokenizer = new Tokenizer();