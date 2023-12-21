To create a new user with the users API in Dart, you can use the `create` method from the `Users` class. Here is an example code snippet:

```dart
import 'package:dart_appwrite/dart_appwrite.dart';

void main() {
  Client client = Client();
  Users users = Users(client);

  client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('5df5acd0d48c2') // Your project ID
    .setKey('919c2d18fb5d4...a2ae413da83346ad2') // Your secret API key
  ;

  Future result = users.create(
    userId: '[USER_ID]',
    email: 'email@example.com',
    password: 'password',
  );

  result
    .then((response) {
      print(response);
    }).catchError((error) {
      print(error.response);
  });
}
```

Make sure to replace `[USER_ID]` with the desired user ID, and provide the appropriate values for `email` and `password`.

Sources:
- https://appwrite.io/docs/references/cloud/server-dart/users
