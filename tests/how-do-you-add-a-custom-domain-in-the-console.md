To add a custom domain in the Appwrite Console, follow these steps:

1. **Navigate to the Appwrite Console and go to your project.**
2. **Click on the Settings tab in the left sidebar.**
3. **Select the Custom domains section and click Create domain.**
4. **Add your domain, and copy the associated CNAME record to your DNS provider.** You can refer to the [Add a CNAME record](https://appwrite.io/docs/advanced/platform/custom-domains/##cname-record) section for more details.
5. **Verify your domain.** Note that DNS changes might take up to 48 hours to propagate worldwide, so you may not be able to complete this step on the same day.
6. **Once you verify your domain, you can generate an SSL certificate.**

When both **VERIFICATION STATUS** and **CERTIFICATE STATUS** are green, the new domain is ready to use.

If you encounter any issues during the setup process or have questions, don't hesitate to [contact Appwrite support](https://appwrite.io/docs/advanced/platform/custom-domains/#/contact-us), and they will be happy to assist you.

Sources:
- https://appwrite.io/docs/products/functions/domains/
- https://appwrite.io/docs/advanced/platform/custom-domains/
- https://appwrite.io/docs/products/messaging/mailgun/
- https://appwrite.io/docs/tutorials/subscriptions-with-stripe/step-3/
- https://appwrite.io/docs/tutorials/subscriptions-with-stripe/step-4/
