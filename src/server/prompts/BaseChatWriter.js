import { model } from "../services/model.js";
import BaseWriter from "./BaseWriter.js";

class BaseChatWriter extends BaseWriter {
  // Method to generate response
  async generate(data) {
    const input = await this.prompt.format(data);
    const response = await model.invoke(input);
    return response.content;
  }
}

export default BaseChatWriter;
