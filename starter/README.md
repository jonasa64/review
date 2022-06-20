# backend-technical-case
# Running the app
Get the node_modules started by running
`npm install`

Afterwards you can run the app with `node index`, but it's recommended to install nodemon with `npm install -G nodemon`, and the app can now be run with "auto-restart": `npm run dev`

You can test the endpoints by using for example postman and having the post data in x-www-form-url-encoded. And access the webserver on https://localhost:3000/. It's also easy to add the authentication header under headers.

# What is the case?
- Add a small conversation module between influencers and companies.
It's certain that there will only be sent messages between the parties, so only influencer -> company or company -> influencer.

*influencer -> influencer or company -> company does not need to be possible.*

- Implement a endpoint to view the preview of all invidual conversation by getting newest message for every influencer/company the person has chatted with.
- Add a endpoint for viewing whole conversation with certain person and also a post endpoint for sending new message in a conversation.

Create the database table that supports the messages, and use it.

*Tips*
- Consider implementing the messages as a decorator just like the userDecorator.
- The database can be manipulated in the db.js file, and will be changed by deleting main.db and restarting application.
- Since messages are only between the parties you don't need both senderType and receiverType, you can manage with just receiverType and easier WHERE sstatements
- Try to use JOIN's in one of the endpoints to get relevant names.


# What's the meaning of the case?
You are able to try out building something with our tech setup, and we can afterwards have a constructive talk about how you approached a technical implementation/problem.
