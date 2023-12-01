To create a new user using the Appwrite users API with Dart, you can use the following code:

```dart
import 'package:appwrite/appwrite.dart';

void main() async {
  Client client = Client();
  client.setEndpoint('https://[HOSTNAME_OR_IP]/v1'); // Replace with your Appwrite endpoint

  Account account = Account(client);
  try {
    Response response = await account.create(
      email: 'user@example.com',
      password: 'password',
      name: 'John Doe',
    );
    print(response.data);
  } catch (e) {
    print(e);
  }
}
```

Make sure to replace `[HOSTNAME_OR_IP]` with your Appwrite endpoint. You can find more information about the users API in the Appwrite documentation: [Users API Reference](https://appwrite.io/docs/users).

Sources:
