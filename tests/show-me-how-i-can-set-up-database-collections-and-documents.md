To set up database collections and documents in Appwrite, you can follow these steps:

1. Create a database:
   - Head to your [Appwrite Console](https://cloud.appwrite.io/console/) and create a new database. Give it a name, such as "Oscar", and optionally add a custom database ID.

2. Create a collection:
   - Navigate to the **Databases** page in the Appwrite Console.
   - Select the database you created (e.g., "Oscar").
   - Click on **Create collection**.
   - Give your collection a name, such as "My books", and optionally add a custom collection ID.

3. Define collection attributes:
   - In the collection settings, navigate to the **Attributes** tab.
   - Click on **Create attribute** and select the data type for your attribute (e.g., **String**).
   - Enter the attribute key (e.g., "title") and specify the size (e.g., "100").
   - Repeat this step for any other attributes you want to add to your collection.

4. Set permissions:
   - In the collection settings, navigate to the **Permissions** tab.
   - Add a new role, such as **Any**, to grant public access to the collection.
   - Check the **CREATE** and **READ** permissions for the role, so anyone can create and read documents.

5. Create a document:
   - Use the `createDocument` method in the Appwrite SDK to create a new document.
   - Replace `<PROJECT_ID>` with your project ID (found in the project settings).
   - Replace `<DATABASE_ID>` with the database ID (e.g., "Oscar").
   - Replace `<COLLECTION_ID>` with the collection ID (e.g., "My books").

Here's an example of creating a document using the Node.js SDK:

```javascript
const appwrite = require("appwrite");

const sdk = new appwrite.SDK();
sdk.setEndpoint('https://[HOSTNAME_OR_IP]/v1') // Replace with your Appwrite endpoint
sdk.setProject('PROJECT_ID') // Replace with your Appwrite project ID
sdk.setKey('API_KEY') // Replace with your Appwrite API key

const document = sdk.createDocument('<DATABASE_ID>', '<COLLECTION_ID>', {
    title: 'My Book Title',
    // Add other attributes based on your collection structure
});

document.then(response => {
    console.log(response); // The created document object
}).catch(error => {
    console.error(error); // Handle any errors
});
```

Please note that you need to replace the placeholders (`[HOSTNAME_OR_IP]`, `PROJECT_ID`, `API_KEY`, `<DATABASE_ID>`, `<COLLECTION_ID>`) with your actual values.

Sources:
- https://appwrite.io/docs/products/databases/collections/
- https://appwrite.io/docs/products/databases/quick-start/
- https://appwrite.io/docs/references/cloud/server-java/databases
- https://appwrite.io/docs/references/cloud/client-web/databases
