The main difference between Server and Client SDKs is their purpose and the resources they can access. 

Server SDKs are used for integrating with Appwrite to build backend or server applications. They have access to all resources and are not constrained by user permissions. Examples of Server SDKs include the Node.js SDK, Dart SDK, Python SDK, PHP SDK, and Ruby SDK.

Client SDKs, on the other hand, are used for integrating with Appwrite to build client-based applications and websites. They can only access resources that users have been granted permission to access. Examples of Client SDKs include the Apple SDK and Android SDK.

Here is an example of how to use the Node.js SDK to list teams:

```javascript
const { Client } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<PROJECT_ID>')                  // Your project ID
    .setKey('98fd4...a2ad2');                    // Your secret API key

const teams = new sdk.Teams(client);

const promise = teams.list();

promise.then(function (response) {
    console.log(response);
}, function (error) {
    console.log(error);
});
```

Please note that the specific SDKs and code examples may vary depending on the programming language and platform you are using.