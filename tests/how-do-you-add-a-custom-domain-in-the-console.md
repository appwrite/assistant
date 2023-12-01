To add a custom domain in the Appwrite Console, follow these steps:

1. Go to the Appwrite Console and navigate to your project.
2. Click on the **Settings** tab in the left sidebar.
3. Select the **Custom domains** section and click **Create domain**.
4. Add your domain, and copy the associated CNAME record to your DNS provider.
5. Verify your domain. Note that DNS changes might take up to 48 hours to propagate worldwide.
6. Once your domain is verified, you can generate an SSL certificate.

Here is an example of how you can add a custom domain using the Node.js SDK:

```javascript
const appwrite = require("appwrite");

const client = new appwrite.Client();
client.setEndpoint('https://[HOSTNAME_OR_IP]/v1'); // Replace [HOSTNAME_OR_IP] with your Appwrite endpoint
client.setProject('PROJECT_ID'); // Replace PROJECT_ID with your Appwrite project ID
client.setKey('API_KEY'); // Replace API_KEY with your Appwrite API key

const domains = new appwrite.Domains(client);

const customDomain = await domains.create('example.com');
console.log(customDomain);
```

And here is an example using the Web SDK:

```javascript
const sdk = new Appwrite();
sdk.setEndpoint('https://[HOSTNAME_OR_IP]/v1'); // Replace [HOSTNAME_OR_IP] with your Appwrite endpoint
sdk.setProject('PROJECT_ID'); // Replace PROJECT_ID with your Appwrite project ID
sdk.setKey('API_KEY'); // Replace API_KEY with your Appwrite API key

const domains = new sdk.Domains();

domains.create('example.com')
  .then((customDomain) => {
    console.log(customDomain);
  })
  .catch((error) => {
    console.log(error);
  });
```

Remember to replace `[HOSTNAME_OR_IP]`, `PROJECT_ID`, and `API_KEY` with your own values.