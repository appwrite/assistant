To set up database collections and documents in Appwrite, you can follow these steps. I'll provide examples using the Node.js and Web Appwrite SDKs.

### Step-by-Step Guide

1. **Create a Database:**
   - Head to your [Appwrite Console](https://cloud.appwrite.io/console/).
   - Create a database and name it `Oscar`. Optionally, add a custom database ID.

2. **Create a Collection:**
   - Navigate to the **Databases** page.
   - Select the `Oscar` database.
   - Click **Create collection** and name it `My books`. Optionally, add a custom collection ID.

3. **Define Collection Attributes:**
   - Navigate to **Attributes**.
   - Click **Create attribute** and select **String**.
   - Enter **Attribute key** (e.g., `title`) and **Size** (e.g., `100`).

4. **Set Permissions:**
   - Navigate to **Settings** > **Permissions**.
   - Add a new role **Any**.
   - Check the **CREATE** and **READ** permissions, so anyone can create and read documents.

### Code Examples

#### Using Node.js SDK

First, install the Appwrite Node.js SDK:

```bash
npm install node-appwrite
```

Then, use the following code to create a document:

```javascript
const { Client, Databases } = require('node-appwrite');

// Initialize the client
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<PROJECT_ID>') // Your project ID
    .setKey('YOUR_API_KEY'); // Your secret API key

// Initialize the Databases service
const databases = new Databases(client);

// Create a document
const promise = databases.createDocument('<DATABASE_ID>', '<COLLECTION_ID>', 'unique()', {
    title: 'My First Book'
});

promise.then(response => {
    console.log(response); // Success
}, error => {
    console.log(error); // Failure
});
```

#### Using Web SDK

First, include the Appwrite Web SDK in your project. You can use a CDN or install it via npm:

```bash
npm install appwrite
```

Then, use the following code to create a document:

```javascript
import { Client, Databases } from 'appwrite';

// Initialize the client
const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<PROJECT_ID>'); // Your project ID

// Initialize the Databases service
const databases = new Databases(client);

// Create a document
databases.createDocument('<DATABASE_ID>', '<COLLECTION_ID>', 'unique()', {
    title: 'My First Book'
})
.then(response => {
    console.log(response); // Success
})
.catch(error => {
    console.log(error); // Failure
});
```

### Summary

1. **Create a database** in the Appwrite Console.
2. **Create a collection** within that database.
3. **Define attributes** for the collection.
4. **Set permissions** for the collection.
5. **Use the SDK** to create documents within the collection.

By following these steps and using the provided code examples, you can set up database collections and documents in Appwrite.

Sources:
- https://appwrite.io/docs/tutorials/react/step-6/
- https://appwrite.io/docs/products/databases/collections/
- https://appwrite.io/docs/references/cloud/client-android-java/databases
- https://appwrite.io/docs/products/databases/quick-start/
