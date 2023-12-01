To create a new user with Dart using the users API, you can use the `create` method provided by the `Users` class. Here is an example code snippet:

```dart
import 'package:dart_appwrite/dart_appwrite.dart';

void main() {
  Client client = Client();
  Users users = Users(client);

  client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('YOUR_PROJECT_ID') // Your project ID
    .setKey('YOUR_API_KEY') // Your secret API key
  ;

  Future result = users.create(
    userId: 'YOUR_USER_ID',
    email: 'email@example.com',
    password: 'password',
    name: 'John Doe',
  );

  result.then((response) {
    print(response);
  }).catchError((error) {
    print(error.response);
  });
}
```

Make sure to replace `'YOUR_PROJECT_ID'` and `'YOUR_API_KEY'` with your actual project ID and secret API key. You can also customize the values for `userId`, `email`, `password`, and `name` according to your requirements.

Sources:
-https://appwrite.io/docs/references/cloud/server-dart/users
