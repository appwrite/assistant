To use Appwrite with React, you can follow these steps:

1. Create a React project using Vite:
```sh
npm create vite@latest my-app -- --template react && cd my-app
```

2. Install the JavaScript Appwrite SDK:
```sh
npm install appwrite
```

3. Find your project's ID in the Appwrite Console's Settings page.

4. Create a new file `src/lib/appwrite.js` and add the following code to it, replacing `<YOUR_PROJECT_ID>` with your project ID:
```js
import { Client, Account } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('<YOUR_PROJECT_ID>');

export const account = new Account(client);
```

5. In your React component, import the `account` object from the `appwrite.js` file and use it to implement authentication or other Appwrite features. Here's an example of a login form:
```js
import React, { useState } from 'react';
import { account } from './lib/appwrite';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    try {
      await account.createEmailSession(email, password);
      console.log('Logged in successfully');
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  return (
    <div>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginForm;
```

Remember to replace `<YOUR_PROJECT_ID>` with your actual project ID. This example demonstrates a basic login form using the `createEmailSession` method from the `account` object.

Please note that this answer is based on the provided context and may not cover all possible scenarios or variations in using Appwrite with React. For more detailed information and additional features, please refer to the official Appwrite documentation and reference pages.

Sources:
- https://appwrite.io/docs/quick-starts/react/
- https://appwrite.io/docs/tutorials/sveltekit-auth/step-1/
- https://appwrite.io/docs/quick-starts/nextjs/
- https://appwrite.io/docs/tutorials/refine/step-5/
