To add a custom domain in the Appwrite Console, follow these steps:

1. **Navigate to the Project**: Go to the Appwrite Console and navigate to your project.
2. **Access Settings**: Click on the **Settings** tab in the left sidebar.
3. **Custom Domains Section**: Select the **Custom domains** section and click **Create domain**.
4. **Enter Domain**: Add your custom domain.
5. **Add CNAME Record**: Copy the provided CNAME record and add it to your DNS provider. Refer to the [Add a CNAME record](https://appwrite.io/docs/advanced/platform/custom-domains/##cname-record) section for detailed instructions.
6. **Verify Domain**: Wait for DNS changes to propagate, which can take up to 48 hours. Once propagated, verify your domain.

After setting up the DNS, ensure that your custom domain is added to the "Allowed Domains" list in your Appwrite project settings to accept API requests from it.

For any issues or assistance, you can contact Appwrite support.