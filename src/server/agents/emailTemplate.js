import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";
class EmailTemplate {
  promptTemplate = `
# YOUR TASK
Generate professional looking email template based on Salesforce HTML template provided.
make sure generated email templates are responsive, looks good on mobile devices and desktops and different email clients.
Use html and inline css to update the email template and its design.

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
    const response = await model.call(input);
    return response;
  }
}

export default new EmailTemplate();
