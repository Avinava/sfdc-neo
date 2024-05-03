import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";
class EmailTemplate {
  promptTemplate = `
# YOUR TASK
Generate professional looking email template based on Salesforce HTML template provided.
Use html and inline css to style and structure the email template to look professional and modern.
make sure it looks good on mobile, desktops and different email clients.
Generate without DOCTYPE, html, head, body tags.

# HTML TEMPLATE
{HtmlValue}


# RESPONSE HTML

  `;

  prompt;

  constructor() {
    this.prompt = new PromptTemplate({
      template: this.promptTemplate,
      inputVariables: ["Body", "HtmlValue"],
    });
  }

  async generate(template) {
    const input = await this.prompt.format(template);
    const response = await model.invoke(input);
    return response.content;
  }
}

export default new EmailTemplate();
