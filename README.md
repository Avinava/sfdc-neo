# SFDC-Neo

SFDC-Neo is a Node.js application designed to assist developers with Salesforce tasks, such as documenting and generating test classes. It leverages the capabilities of OpenAI to provide an intelligent and efficient solution.

Demo : https://neo.sfdxy.com/

### Features
   - **Test Class Generation**: Automate the creation of robust and reliable test classes
   - **Code Comments**:  Enhance code readability and maintainability by automatically generating helpful comments throughout your codebase.
   - **Code Documentation**: Save time and effort by generating comprehensive documentation for your Salesforce code, ensuring clarity and understanding.
   - **Code Review**: Receive intelligent insights and suggestions to improve the quality and efficiency of your Salesforce code.
   - **Email Template**: Better format email templates using OpenAI.
   - **Validation Rule**: Describe and document validation rule.
   - **Validate & Deploy**: Easily validate and deploy the generated code from the app directly to your Salesforce org.


SFDC-Neo is currently in active development, which means there may be occasional hiccups along the way. If you encounter any issues or have suggestions for enhancements, please don't hesitate to open a GitHub issue. 

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
OPENAI_MAX_TOKENS=3000
OPENAI_TEMPERATURE=0.3
OPENAI_MODEL_NAME=gpt-3.5-turbo
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
