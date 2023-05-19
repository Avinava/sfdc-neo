import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
dotenv.config();

class OpenAI {
  openai;
  constructor() {
    this.openai = new OpenAIApi(
      new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      })
    );
  }

  getDocumentationCompletion(cls) {
    const messages = [
      {
        role: "user",
        content: `Given the following apex class, generate markdown documentation, following the instructions below`,
      },
      {
        role: "user",
        content: `Apex Class:
        ${cls.Body}`,
      },
      {
        role: "user",
        content: `Instructions:
        You are a developer who is documenting the class provided in markdown.
        Use the apex class that was provided in context to generate the documentation
        If the question is not related to the context, politely respond that you are tuned to only generate documentation.
        Only return the markdown, don't return any extra text.
        `,
      },
    ];

    return this.getCompletion(messages);
  }

  getCodeDocumentationCompletion(cls) {
    const messages = [
      {
        role: "user",
        content: `Given the following apex class, add documentation and comments, following the instructions below`,
      },
      {
        role: "user",
        content: `Apex Class:
        ${cls.Body}`,
      },
      {
        role: "user",
        content: `Instructions:
        You are a developer who updates the class to add class docs, apexdocs and comments.
        Use the apex class that was provided in context to generate the documentation
        If the question is not related to the context, politely respond that you are tuned to only generate documentation.
        Only return the documentation, don't return any extra text.
        `,
      },
    ];

    return this.getCompletion(messages);
  }

  getTestClassCompletion(cls) {
    const messages = [
      {
        role: "user",
        content: `Given the following apex class generate the unit test class, following the instructions below`,
      },
      {
        role: "user",
        content: `Apex Class: 
        ${cls.Body}`,
      },
      {
        role: "user",
        content: `Instructions:
        You are a developer who generates apex test classes for provided apex class. 
        Use the apex class that was provided in context to generate the test class
        If the question is not related to the context, politely respond that you are tuned to only generate apex class.
        Only return the test class code, don't return any extra text.
        `,
      },
      {
        role: "system",
        content: `Apex Test Class:`,
      },
    ];

    return this.getCompletion(messages);
  }

  getCompletion(messages) {
    return this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
  }
}

export default new OpenAI();
