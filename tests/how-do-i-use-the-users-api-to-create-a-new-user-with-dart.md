To create a new user with Dart using the Appwrite Users API, you can use one of the provided methods depending on the hashing algorithm you want to use for the password. Below are examples for creating a user with different hashing algorithms:

### Using PHPass
```dart
import 'package:dart_appwrite/dart_appwrite.dart';

Client client = Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>') // Your project ID
    .setKey('<YOUR_API_KEY>'); // Your secret API key

Users users = Users(client);

User result = await users.createPHPassUser(
    userId: '<USER_ID>',
    email: 'email@example.com',
    password: 'password',
    name: '<NAME>', // (optional)
);
```

### Using Scrypt
```dart
import 'package:dart_appwrite/dart_appwrite.dart';

Client client = Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>') // Your project ID
    .setKey('<YOUR_API_KEY>'); // Your secret API key

Users users = Users(client);

User result = await users.createScryptUser(
    userId: '<USER_ID>',
    email: 'email@example.com',
    password: 'password',
    passwordSalt: '<PASSWORD_SALT>',
    passwordCpu: 0,
    passwordMemory: 0,
    passwordParallel: 0,
    passwordLength: 0,
    name: '<NAME>', // (optional)
);
```

### Using Bcrypt
```dart
import 'package:dart_appwrite/dart_appwrite.dart';

Client client = Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>') // Your project ID
    .setKey('<YOUR_API_KEY>'); // Your secret API key

Users users = Users(client);

User result = await users.createBcryptUser(
    userId: '<USER_ID>',
    email: 'email@example.com',
    password: 'password',
    name: '<NAME>', // (optional)
);
```

### Using Scrypt Modified
```dart
import 'package:dart_appwrite/dart_appwrite.dart';

Client client = Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>') // Your project ID
    .setKey('<YOUR_API_KEY>'); // Your secret API key

Users users = Users(client);

User result = await users.createScryptModifiedUser(
    userId: '<USER_ID>',
    email: 'email@example.com',
    password: 'password',
    passwordSalt: '<PASSWORD_SALT>',
    passwordSaltSeparator: '<PASSWORD_SALT_SEPARATOR>',
    passwordSignerKey: '<PASSWORD_SIGNER_KEY>',
    name: '<NAME>', // (optional)
);
```

### Using Argon2
```dart
import 'package:dart_appwrite/dart_appwrite.dart';

Client client = Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>') // Your project ID
    .setKey('<YOUR_API_KEY>'); // Your secret API key

Users users = Users(client);

User result = await users.createArgon2User(
    userId: '<USER_ID>',
    email: 'email@example.com',
    password: 'password',
    name: '<NAME>', // (optional)
);
```

Replace `<YOUR_PROJECT_ID>`, `<YOUR_API_KEY>`, `<USER_ID>`, `<PASSWORD_SALT>`, `<PASSWORD_SALT_SEPARATOR>`, and `<PASSWORD_SIGNER_KEY>` with your actual Appwrite project details and user-specific information.

Sources:
- https://appwrite.io/docs/references/cloud/server-dart/users
