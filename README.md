# SFDC-Neo

SFDC-Neo is a Node.js application that helps in Salesforce development by utilizing OpenAI, Salesforce Metadata API, and the Apex Parser. It helps in various tasks, including documentation creation and generation of test classes within the Salesforce ecosystem.

Demo : https://neo.sfdxy.com/

### Features
- **Test Class Generation**: This feature automates the creation of test classes for your Salesforce code by leveraging apex-parser and metadata API to retrieve the schema of related objects and fields. This allows for more precise test data generation. Additionally, it utilizes the tooling API and sfdc-soup to identify dependencies and automatically detect test factories that should be used.

Moreover, this feature offers the option to include custom prompts, enhancing the assistance provided during test class generation.
- **Code Comments**: This feature enhances code readability and maintainability by automatically generating helpful comments throughout your codebase. The comments are generated based on existing comments, code structure and logic, making it easier to understand the code and make changes as needed.
- **Code Documentation**: This feature saves time and effort by generating comprehensive documentation for your Salesforce code. The documentation is generated in a variety of formats, including HTML, PDF, and Markdown. This makes it easy to share the documentation with others or to use it as a reference guide.
- **Code Review**: This feature incorporates OpenAI to conduct code reviews. The code review process evaluates various factors such as code complexity, code style, and code performance. By analyzing these aspects, it assists in identifying and addressing potential issues in your code before they manifest as problems.

Furthermore, this feature augments the code review process by leveraging PMD results, which further enhances the guidance and recommendations provided during the review.
- **Email Template**: Better format email templates using OpenAI.
- **Validation Rule**: This feature uses OpenAI to automatically generate documentation for validation rules. It provides easy-to-read descriptions and includes relevant examples, making it user-friendly and helpful for understanding and documenting validation rules.
- **Flow**: This feature uses OpenAI to automatically generate documentation for Flow.
- **Validate & Deploy**: Easily validate and deploy the generated code from the app directly to your Salesforce org.


SFDC-Neo is currently in active development, which means there may be occasional hiccups along the way. If you encounter any issues or have suggestions for enhancements, please don't hesitate to open a GitHub issue. 

<a href="https://www.buymeacoffee.com/avidev" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 50px !important;width: 180px !important;" ></a>

## Installation

To install SFDC-Neo, you will need to have Node.js and npm or yarn installed on your system. You can then install the dependencies by running:

```bash
npm install
# or
yarn install
```


## Configuration
Before you can use SFDC-Neo, you will need to configure it with your Salesforce credentials. To do this, create a `.env` file in the root directory of the project and add the following variables:


```
SESSION_SECRET=<your session secret>
PORT=<the port to run the server on>
CLIENT_ID=<your Salesforce client ID>
CLIENT_SECRET=<your Salesforce client secret>
PRODUCTION_AUTHORIZATION_URL=https://login.salesforce.com/services/oauth2/authorize
PRODUCTION_TOKEN_URL=https://login.salesforce.com/services/oauth2/token
SANDBOX_AUTHORIZATION_URL=https://test.salesforce.com/services/oauth2/authorize
SANDBOX_TOKEN_URL=https://test.salesforce.com/services/oauth2/token
OPENAI_API_KEY=<your OpenAI API key>
OPENAI_MAX_TOKENS=4096
OPENAI_CONTEXT_MAX_TOKENS=20000
OPENAI_TEMPERATURE=0.3
OPENAI_MODEL_NAME=gpt-4-1106-preview
# only needed for enabling quota, by default this shouldn't be needed
ENABLE_QUOTA=true
SUPABASE_URL=<your Supabase URL>
SUPABASE_ADMIN_KEY=<your Supabase admin key>
```

## Usage
To start the SFDC-Neo server, run:


```bash
npm start
# or
yarn start
```

This will start the server on the port specified in the .env file. You can then access the application by navigating to http://localhost:3000 in your web browser.


## Demo

You can try the demo app here https://neo.sfdxy.com/

![home.png](/screenshots/home.png)
![test_class_gen.png](/screenshots/test_class_gen.png)
![review.png](/screenshots/review.png)


![demo.gif](/screenshots/demo.gif)


## Contributing
If you would like to contribute to SFDC-Neo, please fork the repository and submit a pull request. All contributions are welcome!

## License
SFDC-Neo is licensed under the MIT License. See the LICENSE file for more information.
