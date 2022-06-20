const db = require('../controllers/db');
const authMiddleware = require('../middlewares/auth');

module.exports = (router, type) => {
  // I wont call the routes me, I can call it preview or message_preview
  router.get('/me', authMiddleware, async (req, res) => {
    // recieverType is not being used in this route
    const reciverType = type === 'company' ? 'companies' : 'influencers';
    // You can use the query this way
    // do something like this
    // const [...conversations] = await db.query(`SELECT m.messages_id ,m.message, m.sent_time, m.senderType, m.receiverType, m.receiverEmail, m.senderEmail, c.id, c.conversationName FROM messages m INNER JOIN conversations c ON m.conversations_id = c.id WHERE m.receiverEmail = ? OR m.senderEmail = ?` , [ req.user.email, req.user.email]);
    const [...conversations] = await db.query(
      `SELECT messages_id ,message,sent_time, senderType, receiverType, receiverEmail, senderEmail, conversations.id, conversationName FROM conversations INNER JOIN messages ON messages.conversations_id = conversations.id WHERE receiverEmail = ? OR senderEmail = ?`,
      [req.user.email, req.user.email]
    );

    res.json(conversations);
  });

  // You want to post messages, this does not require an id. The route should be something like /create
  // I will send conversation id in the body of the request
  router.post('/:id', authMiddleware, async (req, res) => {
    // add conversation id to the body of the request
    const { message, reciverEmail, conversationName } = req.body;
    const senderType = type === 'company' ? 'companies' : 'influencers';
    // Can you create a small function that does this validation, and returns a message.
    // something like this, it can be outside of the post route
    //   TODO: function validateRequest(body) {
    //        if (!body.message || !body.reciverEmail) {
    //            return [false, 'Message and reciever email can not be empty';]
    //        }
    //    }
    // You can use it like this
    // const [valid, message] = validateRequest(req.body);
    // if (!valid) {
    //     return res.json({
    //         success: false,
    //         message
    //     })
    // }
    if (message == '' && reciverEmail == '') {
      // You can add return directly here
      res.json({
        message: 'Message and reviver email can not be empty',
        success: false
      });
      return;
    }

    if (message == '' || reciverEmail == '') {
      // same here
      res.json({
        message: 'Message or reviver email can not be empty',
        success: false
      });
      return;
    }
    // Check if user trying to send messge to him/her self
    if (req.user.email === reciverEmail) {
      res.json({
        message: {
          // There is a typo here. It is different
          message: 'Please use a diffent email',
          success: false
        }
      });
      return;
    }

    // Check if new conversation
    // Use the conversationId passed to the body of the request instead of params[:id]
    // sometimes we wont have conversationId so it is safer to use an if statment
    // let conversationId = req.body.conversationId;

    // if (!conversationId) {
    //   // I am thinking there is no need to check existing conversation, frontend can do that for us or e can do it in our validation.
    //   // create a new conversation and assign it to conversationId
    //   // const [conversation] = await db.query(`INSERT INTO conversations (conversationName) VALUES (?)`, [conversationName]);
    //   // conversationId = conversation.id;
    //   // If a conversationId does not exist, return an error, that means, user is manipulating our request
    // }
    const existsconversations = await db.query(
      'SELECT 1 FROM conversations WHERE id = ?',
      [req.params.id]
    );
    if (existsconversations == 0) {
      // You need the conversationId here saved in a variable so you can use it when create messages
      // const [conversation] = await db.query('INSERT INTO conversations (conversationName) VALUES (?)', [conversationName]);
      await db.query('INSERT INTO conversations(conversationName) VALUES(?)', [
        conversationName
      ]);
    }
    // check if reciver is company or influencer
    let isCompany = false;
    const dbQuery = await db.query('SELECT 1 FROM companies WHERE email = ?', [
      reciverEmail
    ]);
    if (dbQuery.length > 0) {
      isCompany = true;
    }
    // Create new message
    const [...newMessage] = await db.query(
      'INSERT INTO messages(message, sent_time, senderType, receiverType, receiverEmail, senderEmail, conversations_id) VALUES(?, ?, ?, ?, ?, ?, ?)',
      [
        message,
        'datetime("now")',
        senderType,
        isCompany ? 'companies' : 'influencers',
        reciverEmail,
        req.user.email,
        req.params.id
      ]
    ); // use comversationId instead of req.params.id
    if (newMessage) {
      res.json({
        message: 'message sent',
        success: true
      });
    }
  });

  router.get('/:id', authMiddleware, async (req, res) => {
    const reciverType = type === 'company' ? 'companies' : 'influencers';
    // We might also need the name of the person here
    // This query will not work some thing like this is good.

    // const [...conversations] = await db.query(`SELECT m.messages_id ,m.message, m.sent_time, m.senderType, m.receiverType, m.receiverEmail, m.senderEmail, c.id, c.conversationName FROM messages m INNER JOIN conversations c ON m.conversations_id = c.id WHERE m.receiverEmail = ? OR m.senderEmail = ?` , [ req.user.email, req.user.email]);
    const [...conversation] = await db.query(
      'SELECT messages_id ,message,sent_time, senderType, receiverType, receiverEmail, senderEmail, conversations.id, conversationName FROM conversations INNER JOIN messages ON messages.conversations_id = conversations.id WHERE conversations.id = ?',
      [req.params.id]
    );

    // After getting all the response, do we not need to get the user information? the message is from
    res.json(conversation);
  });

  return router;
};
