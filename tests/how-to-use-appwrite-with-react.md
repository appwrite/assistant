To use Appwrite with React, you can follow these steps:

1. Set up your first React project powered by Appwrite. Head to the [Appwrite Console](https://cloud.appwrite.io/console) and create an account if it's your first time using Appwrite. Create your first project and add a Web app platform with the hostname set to `localhost`.

2. Create a Vite project by running the following command in your terminal:
```sh
npm create vite@latest my-app -- --template react && cd my-app
```

3. Install the JavaScript Appwrite SDK by running the following command:
```sh
npm install appwrite
```

4. Find your project's ID in the Settings page of the Appwrite Console.

5. Create a new file `src/lib/appwrite.js` and add the following code to it, replacing `<YOUR_PROJECT_ID>` with your project ID:
```js
import { Client, Account } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('<YOUR_PROJECT_ID>');

export const account = new Account(client);
export { ID } from 'appwrite';
```

6. Now you can start using Appwrite in your React components. For example, you can import the `account` object from `appwrite.js` and use it to handle authentication:
```js
import React, { useState } from 'react';
import { account } from './lib/appwrite';

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function login(email, password) {
    await account.createEmailSession(email, password);
    setLoggedInUser(await account.get());
  }

  return (
    <div>
      <p>
        {loggedInUser ? `Logged in as ${loggedInUser.name}` : 'Not logged in'}
      </p>

      <form>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={() => login(email, password)}>Login</button>
      </form>
    </div>
  );
};

export default App;
```

Remember to replace `<YOUR_PROJECT_ID>` with your actual project ID. This example shows a basic login form that uses the `createEmailSession` method from the `account` object to authenticate the user.

Sources:
-https://appwrite.io/docs/quick-starts/react/
-https://appwrite.io/docs/tutorials/sveltekit-auth/step-1/
-https://appwrite.io/docs/quick-starts/nextjs/
-https://appwrite.io/docs/advanced/platform/
