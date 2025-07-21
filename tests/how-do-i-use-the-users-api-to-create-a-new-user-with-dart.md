To create a new user using the Appwrite Users API with Dart, you can use the `create` method from the `Users` class. Below is an example of how to set up the client and create a user:

```dart
import 'package:dart_appwrite/dart_appwrite.dart';

void main() async {
  Client client = Client()
      .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
      .setProject('<YOUR_PROJECT_ID>') // Your project ID
      .setKey('<YOUR_API_KEY>'); // Your secret API key

  Users users = Users(client);

  try {
    User result = await users.create(
      userId: '<USER_ID>',
      email: 'email@example.com', // (optional)
      phone: '+12065550100', // (optional)
      password: '', // (optional)
      name: '<NAME>', // (optional)
    );
    print(result);
  } catch (e) {
    print(e);
  }
}
```

In this example, replace `<REGION>`, `<YOUR_PROJECT_ID>`, `<YOUR_API_KEY>`, `<USER_ID>`, and other placeholders with your actual Appwrite project details and user information. The `create` method allows you to specify optional parameters such as `email`, `phone`, `password`, and `name` to create a user.

Sources:
- https://appwrite.io/docs/references/cloud/server-dart/users
