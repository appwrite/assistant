To create a new user using the Appwrite Users API with Dart, you can use the `Users` class from the Dart Appwrite SDK. Below is an example of how to achieve this:

```dart
import 'package:dart_appwrite/dart_appwrite.dart';

void main() async {
  Client client = Client()
      .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
      .setProject('<YOUR_PROJECT_ID>') // Your project ID
      .setKey('<YOUR_API_KEY>'); // Your secret API key

  Users users = Users(client);

  try {
    final user = await users.create(
      userId: 'unique()', // Use 'unique()' to generate a unique ID
      email: 'user@example.com',
      password: 'password',
      name: 'John Doe',
    );

    print(user);
  } catch (e) {
    print(e);
  }
}
```

In this example, replace `<YOUR_PROJECT_ID>` and `<YOUR_API_KEY>` with your actual Appwrite project ID and API key. The `create` method requires a `userId`, `email`, and `password` as mandatory parameters. You can also optionally provide a `name` for the user. The `userId` can be set to `'unique()'` to automatically generate a unique identifier for the user.