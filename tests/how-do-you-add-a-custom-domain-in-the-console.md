To add a custom domain in the Appwrite Console, follow these steps:

1. Go to the Appwrite Console and navigate to your project.
2. Click on the **Settings** tab in the left sidebar.
3. Select the **Custom domains** section and click **Create domain**.
4. Add your domain, and copy the associated CNAME record to your DNS provider. You can find more details on how to add a CNAME record in the [Appwrite documentation](https://appwrite.io/docs/advanced/platform/custom-domains/##cname-record).
5. Verify your domain. Please note that DNS changes might take up to 48 hours to propagate worldwide, so you may not be able to verify your domain on the same day.
6. Once your domain is verified, you can generate an SSL certificate.

After following these steps, your Appwrite project will accept API requests from your custom domain.

If you encounter any issues during the setup process or have questions, don't hesitate to [contact us](https://appwrite.io/docs/advanced/platform/custom-domains/#/contact-us), and we'll be happy to assist you.

Sources:
-https://appwrite.io/docs/advanced/platform/custom-domains/
-https://appwrite.io/docs/products/functions/deployment/
-https://appwrite.io/docs/quick-starts/flutter/
-https://appwrite.io/docs/products/functions/execution/
