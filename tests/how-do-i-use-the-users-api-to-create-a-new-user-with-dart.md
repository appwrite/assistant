To use the users API to create a new user with Dart, you can use the `createArgon2User` method from the `Users` class. Here is an example code snippet:

```dart
import 'package:dart_appwrite/dart_appwrite.dart';

void main() {
  Client client = Client();
  Users users = Users(client);

  client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('YOUR_PROJECT_ID')
    .setKey('YOUR_API_KEY');

  Future result = users.createArgon2User(
    userId: 'USER_ID',
    email: 'email@example.com',
    password: 'password',
  );

  result.then((response) {
    print(response);
  }).catchError((error) {
    print(error.response);
  });
}
```

Make sure to replace `YOUR_PROJECT_ID` with your actual project ID and `YOUR_API_KEY` with your secret API key.