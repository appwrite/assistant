To set up database collections and documents in Appwrite, you can follow these steps:

1. Create a database: 
   - Head to your [Appwrite Console](https://cloud.appwrite.io/console/) and create a new database. Give it a name, for example, `Oscar`. You can also add a custom database ID if needed.

2. Create a collection:
   - Within the database, create a new collection. Name it `My books` (or any other name you prefer). You can also add a custom collection ID if needed.

3. Define collection attributes:
   - Navigate to the **Attributes** section of the collection and create attributes by clicking on **Create attribute**. Select the attribute type, for example, **String**, and provide an attribute key and size. For example, you can create an attribute with the key `title` and size `100`. This helps define the structure of your collection's documents.

4. Set permissions:
   - Go to the **Settings** > **Permissions** section and add a new role called **Any**. Check the **CREATE** and **READ** permissions for this role, allowing anyone to create and read documents.

5. Create a document:
   - To create a document, you can use the `createDocument` method provided by the Appwrite SDK for your platform. Replace `<PROJECT_ID>` with your project ID, `<DATABASE_ID>` with the ID of the `Oscar` database, and `<COLLECTION_ID>` with the ID of the `My books` collection. Here's an example using the Node.js SDK:

```javascript
const appwrite = require('appwrite');

const sdk = new appwrite.SDK('<YOUR_ENDPOINT>', '<YOUR_PROJECT_ID>');

sdk.setKey('<YOUR_API_KEY>');

async function createDocument() {
  try {
    const document = await sdk.database.createDocument('<DATABASE_ID>', '<COLLECTION_ID>', {
      title: 'My Book Title',
      // Add other attributes as needed
    });

    console.log('Document created:', document);
  } catch (error) {
    console.error('Error creating document:', error);
  }
}

createDocument();
```

Note: Replace `<YOUR_ENDPOINT>` and `<YOUR_API_KEY>` with your Appwrite endpoint and API key respectively.

By following these steps, you can set up database collections and create documents within them using Appwrite.