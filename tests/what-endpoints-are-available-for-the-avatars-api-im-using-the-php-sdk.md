The Avatars API in the Appwrite PHP SDK provides several endpoints to help you manage and generate avatars. Here are the available endpoints:

1. **GET /avatars/qr**: Generates a QR code image.
   - Example in PHP:
     ```php
     use Appwrite\Client;
     use Appwrite\Services\Avatars;

     $client = (new Client())
         ->setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
         ->setProject('<YOUR_PROJECT_ID>') // Your project ID
         ->setSession(''); // The user session to authenticate with

     $avatars = new Avatars($client);
     ```

2. **GET /avatars/image**: Fetches an image avatar.
   - Example in PHP:
     ```php
     use Appwrite\Client;
     use Appwrite\Services\Avatars;

     $client = (new Client())
         ->setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
         ->setProject('<YOUR_PROJECT_ID>') // Your project ID
         ->setSession(''); // The user session to authenticate with

     $avatars = new Avatars($client);
     ```

3. **GET /avatars/initials**: Generates an avatar with initials.
   - Example in PHP:
     ```php
     use Appwrite\Client;
     use Appwrite\Services\Avatars;

     $client = (new Client())
         ->setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
         ->setProject('<YOUR_PROJECT_ID>') // Your project ID
         ->setSession(''); // The user session to authenticate with

     $avatars = new Avatars($client);
     ```

4. **GET /avatars/browsers/{code}**: Fetches a browser icon by code.
   - Example in PHP:
     ```php
     use Appwrite\Client;
     use Appwrite\Services\Avatars;
     use Appwrite\Enums\Browser;

     $client = (new Client())
         ->setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
         ->setProject('<YOUR_PROJECT_ID>') // Your project ID
         ->setSession(''); // The user session to authenticate with

     $avatars = new Avatars($client);
     ```

These endpoints allow you to generate and retrieve different types of avatars using the Appwrite PHP SDK. Make sure to replace placeholders like `<YOUR_PROJECT_ID>` with your actual project details.