# SFDC-Neo

SFDC-Neo is a Node.js application designed to assist developers with Salesforce tasks, such as documenting and generating test classes. It leverages the capabilities of OpenAI to provide an intelligent and efficient solution.

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
SUPABASE_URL=<your Supabase URL>
SUPABASE_ADMIN_KEY=<your Supabase admin key>
OPENAI_API_KEY=<your OpenAI API key>
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
![Screen Recording 2023-05-21 at 1 17 26 AM](/screenshots/demo.gif)



## Contributing
If you would like to contribute to SFDC-Neo, please fork the repository and submit a pull request. All contributions are welcome!

## License
SFDC-Neo is licensed under the MIT License. See the LICENSE file for more information.
