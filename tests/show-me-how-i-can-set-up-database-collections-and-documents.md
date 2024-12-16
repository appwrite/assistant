To set up database collections and documents in Appwrite, you can follow these steps:

### Creating a Collection

1. **Navigate to the Appwrite Console**: Go to the [Appwrite Console](https://cloud.appwrite.io/).
2. **Create a Collection**: 
   - Head to the **Databases** page.
   - Select the desired database or create a new one.
   - Click on **Create collection** to start setting up a new collection.

3. **Configure Permissions**:
   - Navigate to **Settings** > **Permissions**.
   - Add a new role **Any**.
   - Check the **CREATE** and **READ** permissions to allow anyone to create and read documents.

### Creating a Document

Once you have your collection set up, you can create documents using the SDKs.

#### Node.js SDK Example

```javascript
const sdk = require('node-appwrite');

// Initialize the client
const client = new sdk.Client();
client
    .setEndpoint('https://[HOSTNAME_OR_IP]/v1') // Your API Endpoint
    .setProject('<PROJECT_ID>') // Your project ID
    .setKey('your-api-key'); // Your secret API key

// Initialize the Database service
const databases = new sdk.Databases(client);

// Create a document
databases.createDocument('<DATABASE_ID>', '<COLLECTION_ID>', '<DOCUMENT_ID>', {
    'field1': 'value1',
    'field2': 'value2'
})
.then(response => {
    console.log(response);
})
.catch(error => {
    console.error(error);
});
```

#### Web SDK Example

```javascript
import { Client, Databases } from 'appwrite';

// Initialize the client
const client = new Client();
client
    .setEndpoint('https://[HOSTNAME_OR_IP]/v1') // Your API Endpoint
    .setProject('<PROJECT_ID>'); // Your project ID

// Initialize the Database service
const databases = new Databases(client);

// Create a document
databases.createDocument('<DATABASE_ID>', '<COLLECTION_ID>', '<DOCUMENT_ID>', {
    'field1': 'value1',
    'field2': 'value2'
})
.then(response => {
    console.log(response);
})
.catch(error => {
    console.error(error);
});
```

### Notes

- Replace `<PROJECT_ID>`, `<DATABASE_ID>`, `<COLLECTION_ID>`, `<DOCUMENT_ID>`, and `your-api-key` with your actual project, database, collection, document IDs, and API key.
- Ensure that the collection attributes are correctly defined to validate and store data according to your collection structure.

This setup allows you to manage collections and documents efficiently within your Appwrite project.