To use Appwrite with React, follow these steps:

### Prerequisites:
1. Ensure you have a recent version of [Node.js](https://nodejs.org/en/download/) installed on your system.
2. Have a basic knowledge of Next.js and React.
3. Follow the [Start with React](https://appwrite.io/docs/quick-starts/react) guide.

### Step-by-Step Guide:

#### 1. Create a Vite Project:
First, create a new Vite project with a React template:
```sh
npm create vite@latest my-app -- --template react && cd my-app
```

#### 2. Install the Appwrite SDK:
Install the JavaScript Appwrite SDK:
```sh
npm install appwrite@14.0.1
```

#### 3. Setup Appwrite Project:
1. Head to the [Appwrite Console](https://cloud.appwrite.io/console).
2. If this is your first time using Appwrite, create an account and create your first project.
3. Under **Add a platform**, add a **Web app**. The **Hostname** should be `localhost`.

#### 4. Initialize Appwrite SDK:
Create a new file `src/lib/appwrite.js` to hold your Appwrite-related code. Only one instance of the `Client()` class should be created per app. Add the following code to it, replacing `<YOUR_PROJECT_ID>` with your project ID:

```javascript
import { Client, Databases, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("<YOUR_PROJECT_ID>"); // Replace with your project ID

export const account = new Account(client);
export const databases = new Databases(client);
```

#### 5. Create a Simple Login Form:
Add the following components to your `App.js` file to create a simple login form:

```javascript
import React, { useState } from 'react';
import { account } from './lib/appwrite';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await account.createSession(email, password);
      setLoggedInUser(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>{loggedInUser ? `Logged in as ${loggedInUser.name}` : 'Not logged in'}</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={() => login(email, password)}>Login</button>
    </div>
  );
}

export default App;
```

### Summary:
By following these steps, you can set up Appwrite with React and create a simple login form. This example demonstrates how to initialize the Appwrite SDK and use it to handle user authentication. For more advanced features, refer to the [Appwrite documentation](https://appwrite.io/docs).

Sources:
- https://appwrite.io/docs/tutorials/nextjs-ssr-auth/step-1/
- https://appwrite.io/docs/tutorials/nextjs-ssr-auth/step-2/
- https://appwrite.io/docs/quick-starts/react/
- https://appwrite.io/docs/tutorials/react/step-3/
- https://appwrite.io/docs/quick-starts/react-native/
