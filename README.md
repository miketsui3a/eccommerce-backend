# Setup

This shopify app backend need a domain that expose to the internet. We will use ngrok for this time.
Go to ngrok website and install ngrok.
After installing ngrok, run ngrok in terminal using the command:
```
ngrok http [your web app port]
```

The Forwarding address should be the shopify app's PROXY_SERVER in the shopify app's .env file.

This backend should be started before the shopify app.
Need to create a .env file. The .env file example is in .env.example



# Development

```
npm run dev
```
