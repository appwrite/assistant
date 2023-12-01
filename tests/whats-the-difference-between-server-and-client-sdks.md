The Server SDKs are used for integrating with Appwrite to build backend or server applications. They are typically used in server-side environments and are constrained by an API key's scope, ignoring user permissions.

On the other hand, the Client SDKs are used for integrating with Appwrite to build client-based applications and websites. They are typically used in client-side environments and require users to have been granted permissions to access resources.

Here is an example of using the Node.js SDK to make a request using the Server SDK:

```javascript
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

And here is an example of using the Node.js SDK to make a request using the Client SDK:

```javascript
const sdk = require('node-appwrite');

// Init SDK
const client = new sdk.Client();

const databases = new sdk.Databases(client);

client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('5df5acd0d48c2') // Your project ID
    .setKey('919c2d18fb5d4...a2ae413da83346ad2') // Your secret API key
;

const promise = databases.getDocument('[DATABASE_ID]', '[COLLECTION_ID]', '[DOCUMENT_ID]');

promise.then(function (response) {
    console.log(response);
}, function (error) {
    console.log(error);
});
```

Sources:
-https://appwrite.io/docs/references/
-https://appwrite.io/docs/products/auth/jwt/
-https://appwrite.io/docs/sdks/
-https://appwrite.io/docs/references/cloud/server-nodejs/avatars
-https://appwrite.io/docs/references/cloud/server-nodejs/databases
