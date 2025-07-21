To host a simple static website with Appwrite, you can follow these steps:

1. **Create an Account and Project**: If you haven't already, create an account on Appwrite and create your first project.

2. **Add a Platform**: In your project, go to **Add a platform** and add a **Web app**. Set the **Hostname** to `localhost` or the domain where you plan to host your web app.

3. **Configure Your Site**:
   - Navigate to your site in the Appwrite Console.
   - Go to the **Settings** tab and then the **Build settings** section.
   - Select the **Static site** checkbox.
   - Ensure the appropriate install command, build command, and output directory are set.
   - Provide a fallback file for advanced routing and proper page handling.

4. **Deploy Your Site**:
   - You can deploy your site manually by uploading the source code through the Appwrite Console.
   - Alternatively, set up automatic deployments from a Git repository for continuous integration and delivery.

5. **Redeploy**: After configuring, click on the **Update** button and redeploy your site.

6. **Install Appwrite SDK (Optional)**: If you need to interact with Appwrite services, you can install the Appwrite Web SDK using a package manager:
   ```sh
   npm install appwrite@18.1.1
   ```
   Or add it via CDN:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/appwrite@17.0.0"></script>
   ```

By following these steps, you can host and manage your static website directly within the Appwrite platform.

Sources:
- https://appwrite.io/docs/products/sites/rendering/static/
- https://appwrite.io/docs/products/sites/deploy-manually/
- https://appwrite.io/docs/quick-starts/web/
