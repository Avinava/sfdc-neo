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

  getCodeReviewCompletion(cls) {
    const messages = [
      {
        role: "user",
        content: `Given the following apex class, generate a code review, following the instructions below`,
      },
      {
        role: "user",
        content: `Apex Class:
        ${cls.Body}`,
      },
      {
        role: "user",
        content: `Instructions:
        You are a developer who is reviewing the apex class provided.
        Use the apex class that was provided in context to generate the review based on salesforce best practices.
        If the question is not related to the context, politely respond that you are tuned to only generate code reviews.
        Only return the code review, don't return any extra text.`,
      },
      {
        role: "user",
        content: `
        Add a summary of the code review and rate the code quality from 1 to 10.
        Where 1 is the worst and 10 is the best.
        Add a very brief footnotes on what Code Quality rating means
        `,
      },
    ];

    return this.getCompletion(messages);
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

  generateCodeComments(cls) {
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
        You are a developer who updates the class to add comments and apexdoc headers.
        Only update the code to add comments and nothing else.
        If the question is not related to the context, politely respond that you are tuned to only add commments.
        Only return the code with comments and apexdoc, don't return anything extra text.
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
