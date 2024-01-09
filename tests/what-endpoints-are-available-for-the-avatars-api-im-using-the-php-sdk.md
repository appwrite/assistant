The available endpoints for the Avatars API in the PHP SDK are `getImage()` and `getBrowser()`. The `getImage()` endpoint allows you to fetch remote images and manipulate them, while the `getBrowser()` endpoint allows you to fetch browser icons. Here is an example code using the PHP SDK:

```php
<?php

use Appwrite\Client;
use Appwrite\Services\Avatars;

$client = new Client();

$client
    ->setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    ->setProject('5df5acd0d48c2') // Your project ID
    ->setKey('919c2d18fb5d4...a2ae413da83346ad2') // Your secret API key
;

$avatars = new Avatars($client);

$result = $avatars->getImage('https://example.com');
```

Please note that you need to replace the endpoint, project ID, and secret API key with your own values.

Sources:
- https://appwrite.io/docs/references/cloud/server-php/avatars
- https://appwrite.io/docs/references/cloud/server-nodejs/avatars
