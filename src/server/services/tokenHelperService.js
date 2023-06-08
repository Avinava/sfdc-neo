import { get_encoding } from "@dqbd/tiktoken";

class TokenHelperService {
  countTokens(input) {
    const encoder = get_encoding("cl100k_base");
    const tokens = encoder.encode(input);
    const tokenCount = tokens.length;
    encoder.free();
    return tokenCount;
  }
}

export default new TokenHelperService();
