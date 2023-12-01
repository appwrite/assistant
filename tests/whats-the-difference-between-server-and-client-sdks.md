The Server SDKs are used for integrating with Appwrite to build backend or server applications. They are designed to be used with server-side code and are constrained by an API key's scope, ignoring user permissions. The Server SDKs are maintained by the Appwrite team and are available for major programming languages and platforms.

On the other hand, the Client SDKs are used for integrating with Appwrite to build client-based applications and websites. They are designed to be used with client-side code and require users to have been granted permissions to access resources. The Client SDKs are also maintained by the Appwrite team and are available for different frameworks and platforms, such as Web, Flutter, and Apple.

Here's an example of how to use the Node.js SDK (Server SDK) to list documents from a database:

```js
const { Client } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<PROJECT_ID>')                  // Your project ID
    .setKey('98fd4...a2ad2');                    // Your secret API key

const databases = new sdk.Databases(client);

const documents = await databases.listDocuments(
    '642f358bf4084c662590',
    '642f3592aa5fc856ad1e'
);
// ... More code to manipulate the results
```

And here's an example of how to use the Web SDK (Client SDK) to achieve the same result:

```js
import { Appwrite } from 'appwrite';

const client = new Appwrite();

client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<PROJECT_ID>')                  // Your project ID
    .setKey('98fd4...a2ad2');                    // Your secret API key

const databases = new client.Databases();

const documents = await databases.listDocuments(
    '642f358bf4084c662590',
    '642f3592aa5fc856ad1e'
);
// ... More code to manipulate the results
```

Please note that the code examples provided are for illustration purposes and may require additional configuration or customization based on your specific use case.

Sources:
-https://appwrite.io/docs/sdks/
-https://appwrite.io/docs/references/
-https://appwrite.io/docs/products/auth/jwt/
