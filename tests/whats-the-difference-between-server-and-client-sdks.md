The difference between Server and Client SDKs in Appwrite lies in their intended use cases and the permissions they operate under:

1. **Client SDKs**:
   - Designed for integrating with Appwrite to build client-based applications and websites.
   - Used in web, mobile, or native applications where end-users will register and create accounts.
   - Access to resources is controlled by user permissions, meaning users must be granted specific permissions to access certain resources.

2. **Server SDKs**:
   - Designed for integrating with Appwrite to build backend or server applications, such as admin apps, CLI tools, or server-side rendered (SSR) web apps.
   - Operate under the constraints of an API key's scope, which means they ignore user permissions and are instead controlled by the API key's defined permissions.
   - Suitable for server-side operations where you need to perform actions on behalf of the server rather than individual users.

In summary, Client SDKs are for user-facing applications with user-specific permissions, while Server SDKs are for backend operations with broader access defined by API keys.

Sources:
- https://appwrite.io/docs/references/
- https://appwrite.io/docs/references/quick-start/
- https://appwrite.io/docs/products/auth/server-side-rendering/
- https://appwrite.io/docs/sdks/
