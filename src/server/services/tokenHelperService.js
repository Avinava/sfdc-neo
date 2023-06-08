import { get_encoding } from "@dqbd/tiktoken";
import * as dotenv from "dotenv";

dotenv.config();

class TokenHelperService {
  countTokens(input) {
    const encoder = get_encoding("cl100k_base");
    const tokens = encoder.encode(input);
    const tokenCount = tokens.length;
    encoder.free();
    return tokenCount;
  }

  getTokenCount(input) {
    const result = this.countTokens(input);
    return {
      result: result,
      limit: Number(process.env.OPENAI_MAX_TOKENS || 3000),
      limitExceeded: result > Number(process.env.OPENAI_MAX_TOKENS || 3000),
    };
  }
}

export default new TokenHelperService();
