Based on the provided context, the only endpoint mentioned for the Avatars API is:

```text
GET /avatars/image
```

However, this context does not provide a comprehensive list of all available endpoints for the Avatars API. For a complete list of endpoints and their functionalities, I recommend referring to the official Appwrite documentation.

If you need to use the Avatars API with the PHP SDK, here is an example of how you might use the `GET /avatars/image` endpoint:

### PHP SDK Example

```php
<?php

require_once 'vendor/autoload.php';

use Appwrite\Client;
use Appwrite\Services\Avatars;

$client = new Client();

$client
    ->setEndpoint('https://[HOSTNAME_OR_IP]/v1') // Your API Endpoint
    ->setProject('YOUR_PROJECT_ID') // Your project ID
    ->setKey('YOUR_API_KEY'); // Your secret API key

$avatars = new Avatars($client);

try {
    $response = $avatars->getImage('https://example.com/image.png');
    echo $response; // Handle the response as needed
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
```

Make sure to replace `'YOUR_PROJECT_ID'`, `'YOUR_API_KEY'`, and the URL in `getImage` with your actual project ID, API key, and image URL respectively.

For more detailed information and additional endpoints, please refer to the [Appwrite Avatars API documentation](https://appwrite.io/docs/client/avatars).

Sources:
- https://appwrite.io/docs/references/cloud/server-nodejs/avatars
- https://appwrite.io/docs/references/cloud/client-rest/avatars
- https://appwrite.io/docs/references/cloud/client-graphql/avatars
- https://appwrite.io/docs/references/cloud/server-dart/avatars
- https://appwrite.io/docs/references/cloud/client-apple/avatars
