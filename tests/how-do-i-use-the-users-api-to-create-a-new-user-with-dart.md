To create a new user using the Appwrite Users API with Dart, you can use the `create` method from the `Users` class. Below is an example of how to do this:

```dart
import 'package:dart_appwrite/dart_appwrite.dart';

Client client = Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<YOUR_PROJECT_ID>') // Your project ID
    .setKey('<YOUR_API_KEY>'); // Your secret API key

Users users = Users(client);

Future<void> createUser() async {
    try {
        User result = await users.create(
            userId: '<USER_ID>',
            email: 'email@example.com', // (optional)
            phone: '+12065550100', // (optional)
            password: 'password', // (optional)
            name: '<NAME>', // (optional)
        );
        print('User created: ${result.$id}');
    } catch (e) {
        print('Error creating user: $e');
    }
}

createUser();
```

In this example, replace `<REGION>`, `<YOUR_PROJECT_ID>`, `<YOUR_API_KEY>`, `<USER_ID>`, and other placeholders with your actual Appwrite project details and user information. The `create` method allows you to specify optional parameters like `email`, `phone`, `password`, and `name` to create a user.

Sources:
- https://appwrite.io/docs/references/cloud/server-dart/users
