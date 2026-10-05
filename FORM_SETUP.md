# Contact form email setup

The contact form uses EmailJS from the static site. It sends two emails for each valid submission:

1. A lead notification to `info@salvorproject.com`.
2. A confirmation email to the visitor's submitted address.

## 1. Create the EmailJS service

In the EmailJS dashboard, connect the mailbox that should send the messages and copy:

- Account -> General -> Public Key
- Email Services -> Service ID

## 2. Create the two templates

Create a team notification template with the recipient set to `info@salvorproject.com`.

Create a customer confirmation template with the recipient set to `{{email}}`.

Both templates can use these dynamic variables:

- `{{name}}`
- `{{company}}`
- `{{email}}`
- `{{phone}}`
- `{{service}}`
- `{{message}}`
- `{{reply_to}}`

Set the Reply-To field on the team template to `{{reply_to}}` so the team can reply directly to the customer.

## 3. Add the identifiers

Edit `assets/js/email-config.js` and fill in the four values from EmailJS:

- `publicKey`
- `serviceId`
- `teamTemplateId`
- `userTemplateId`

These values are browser-side identifiers, not mailbox passwords or private API keys. Do not put SMTP passwords or other secrets in this file.

## 4. Test both deliveries

Submit the form with a real test address and verify that:

- `info@salvorproject.com` receives the lead notification.
- The submitted address receives the confirmation.
- Replying to the team notification addresses the customer.

Until the identifiers are filled in, the form opens a pre-filled email to `info@salvorproject.com` as a fallback.
