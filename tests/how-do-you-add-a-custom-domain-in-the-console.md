To add a custom domain in the Appwrite Console, you can follow these steps:

1. Go to the Appwrite Console and navigate to your project.
2. Click on the **Settings** tab in the left sidebar.
3. Select the **Custom domains** section and click **Create domain**.
4. Add your domain and copy the associated CNAME record to your DNS provider. You can refer to the [Add a CNAME record](https://appwrite.io/docs/advanced/platform/custom-domains/##cname-record) section for more details.
5. Verify your domain. Please note that DNS changes might take up to 48 hours to propagate worldwide, so you may not be able to complete this step on the same day.
6. Once your domain is verified, you can generate an SSL certificate.

Following these steps will allow your Appwrite project to accept API requests from your custom domain.

If you encounter any issues during the setup process or have further questions, feel free to [contact us](https://appwrite.io/docs/advanced/platform/custom-domains/#/contact-us) for assistance.

Sources:
-https://appwrite.io/docs/advanced/platform/custom-domains/
-https://appwrite.io/docs/advanced/self-hosting/tls-certificates/
