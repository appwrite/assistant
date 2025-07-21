To set up database collections and documents in Appwrite, you can follow these steps:

### Step 1: Create a Collection

1. **Navigate to the Appwrite Console**: Go to [Appwrite Console](https://cloud.appwrite.io/).
2. **Create a New Collection**: 
   - Go to the Databases section and create a new collection.
   - Define the collection attributes. For example, to store ideas, you might have:
     - `userId` (String, Required)
     - `title` (String, Required)
     - `description` (String, Not Required)

### Step 2: Configure Permissions

1. **Set Collection Permissions**:
   - Navigate to the **Settings** tab of your collection.
   - Add the role **Any** and check the **Read** box to allow public read access.
   - Add a **Users** role and check the **Create** box to allow users to create documents.
   - Enable **Document security** to allow setting permissions at the document level.
   - Click the **Update** button to save changes.

### Step 3: Use Appwrite SDK to Interact with the Database

#### Using Node.js SDK

```javascript
const sdk = require('node-appwrite');

// Initialize the client
const client = new sdk.Client();
client
    .setEndpoint('https://[YOUR_APPWRITE_ENDPOINT]') // Your Appwrite Endpoint
    .setProject('YOUR_PROJECT_ID') // Your project ID
    .setKey('YOUR_API_KEY'); // Your secret API key

// Initialize the database service
const databases = new sdk.Databases(client);

// Create a document
const promise = databases.createDocument('databaseId', 'collectionId', 'unique()', {
    userId: 'user123',
    title: 'My Idea',
    description: 'This is a description of my idea.'
});

promise.then(function (response) {
    console.log(response); // Success
}, function (error) {
    console.log(error); // Failure
});
```

#### Using Web SDK

```javascript
import { Client, Databases } from 'appwrite';

// Initialize the client
const client = new Client();
client
    .setEndpoint('https://[YOUR_APPWRITE_ENDPOINT]') // Your Appwrite Endpoint
    .setProject('YOUR_PROJECT_ID'); // Your project ID

// Initialize the database service
const databases = new Databases(client);

// Create a document
databases.createDocument('databaseId', 'collectionId', 'unique()', {
    userId: 'user123',
    title: 'My Idea',
    description: 'This is a description of my idea.'
}).then(response => {
    console.log(response); // Success
}).catch(error => {
    console.log(error); // Failure
});
```

Replace `'YOUR_APPWRITE_ENDPOINT'`, `'YOUR_PROJECT_ID'`, `'YOUR_API_KEY'`, `'databaseId'`, and `'collectionId'` with your actual Appwrite endpoint, project ID, API key, database ID, and collection ID respectively.

This setup allows you to create collections and documents, configure permissions, and interact with your database using Appwrite's SDKs.

Sources:
- https://appwrite.io/docs/tutorials/react-native/step-6/
- https://appwrite.io/docs/references/cloud/server-nodejs/databases
- https://appwrite.io/docs/references/cloud/server-java/databases
- https://appwrite.io/docs/references/cloud/server-graphql/databases
