import BaseChatWriter from "./BaseChatWriter.js";

class EmailTemplate extends BaseChatWriter {
  constructor() {
    const basePrompt = `
# YOUR TASK
Generate professional looking email template based on Salesforce HTML template provided.
Use html and inline css to style and structure the email template to look professional and modern.
make sure it looks good on mobile, desktops and different email clients.
Generate without DOCTYPE, html, head, body tags.

# HTML TEMPLATE
{HtmlValue}

# RESPONSE HTML
  `;

    const inputVariables = [
      {
        label: "HTML Template",
        value: "HtmlValue",
      },
    ];

    super(basePrompt, inputVariables);
  }

  async generate(template) {
    return {
      result: this.extractCode(await super.generate(cls)),
    };
  }
}

export default new EmailTemplate();
