To set up database collections and documents in Appwrite, you can follow these steps:

1. Create a database: Head to your Appwrite Console and create a new database. You can name it `Oscar` and optionally add a custom database ID.

2. Create a collection: Within the `Oscar` database, click on **Create collection**. Name the collection `My books` and optionally add a custom collection ID.

3. Define collection attributes: Navigate to the **Attributes** section of the collection and click on **Create attribute**. Select the attribute type, such as **String**, and enter the attribute key and size. For example, you can create an attribute with the key `title` and size `100`.

4. Set permissions: Go to the **Settings** > **Permissions** section and add a new role called **Any**. Check the **CREATE** and **READ** permissions for this role to allow anyone to create and read documents.

5. Create a document: To create a document, you can use the `createDocument` method provided by the Appwrite SDK. Replace `<PROJECT_ID>` with your project ID, `<DATABASE_ID>` with the ID of the `Oscar` database, and `<COLLECTION_ID>` with the ID of the `My books` collection.

Here's an example of creating a document using the Node.js SDK:

```javascript
const appwrite = require("appwrite");

const sdk = new appwrite.SDK();

sdk
  .setEndpoint('https://[HOSTNAME_OR_IP]/v1') // Replace with your Appwrite endpoint
  .setProject('<PROJECT_ID>') // Replace with your project ID
  .setKey('<API_KEY>'); // Replace with your API key

const document = sdk.createDocument(
  '<DATABASE_ID>',
  '<COLLECTION_ID>',
  { title: 'My Book Title', author: 'John Doe' }
);

document.then((response) => {
  console.log(response); // The created document object
}).catch((error) => {
  console.error(error); // Handle any errors
});
```

Note: Make sure to replace the placeholders (`[HOSTNAME_OR_IP]`, `<PROJECT_ID>`, `<API_KEY>`, `<DATABASE_ID>`, `<COLLECTION_ID>`) with your actual values.

You can find more information about setting up database collections and documents in the [Appwrite Databases documentation](https://appwrite.io/docs/references/cloud/client-web/databases#/docs/products/databases/collections).

Sources:
-https://appwrite.io/docs/products/databases/collections/
-https://appwrite.io/docs/products/databases/quick-start/
-https://appwrite.io/docs/references/cloud/server-java/databases
-https://appwrite.io/docs/references/cloud/client-web/databases
