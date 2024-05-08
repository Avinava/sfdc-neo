import * as cspell from "cspell-lib";
const allowedWords = [];
class SpellService {
  constructor() {
    this.settings = {
      generateSuggestions: false,
      noConfigSearch: true,
    };
  }

  async checkSpelling(phrase) {
    const document = {
      uri: "text.txt",
      text: phrase,
      languageId: "java",
      locale: "en",
    };

    const result = await cspell.spellCheckDocument(document, this.settings, {
      suggestionsTimeout: 2000,
      words: allowedWords,
    });
    return result.issues;
  }
}

export default new SpellService();
