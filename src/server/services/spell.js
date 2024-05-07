import * as cspell from "cspell-lib";
const allowedWords = ["cust", "cuztom", "clockz"];
class SpellService {
  constructor() {
    this.settings = {
      generateSuggestions: true,
      noConfigSearch: true,
      suggestionsTimeout: 2000,
      words: this.allowedWords,
    };
  }

  async checkSpelling(phrase) {
    const document = {
      uri: "text.txt",
      text: phrase,
      languageId: "java",
      locale: "en",
    };

    const result = await cspell.spellCheckDocument(document, this.settings);
    return result.issues;
  }
}

export default new SpellService();
