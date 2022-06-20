const db = require('../controllers/db');
const authMiddleware = require('../middlewares/auth');

module.exports = (router, type) => {

    router.get("/me", authMiddleware, async (req, res) => {
        const reciverType = type === 'company' ? 'companies' : 'influencers';
        const [...conversations] = await db.query(`SELECT messages_id ,message,sent_time, senderType, receiverType, receiverEmail, senderEmail, conversations.id, conversationName FROM conversations INNER JOIN messages ON messages.conversations_id = conversations.id WHERE receiverEmail = ? OR senderEmail = ?` , [ req.user.email, req.user.email]);

        res.json(conversations);
    });

    router.post("/:id", authMiddleware, async (req, res) => {
        const  {message, reciverEmail, conversationName} = req.body;
        const senderType = type === 'company' ? 'companies' : 'influencers';
       // Check that message of reciver email send with post request
        if(message == '' && reciverEmail == ''){
            res.json({
                message : 'Message and reviver email can not be empty',
                success: false
            });
            return;
        } 

        if(message == '' || reciverEmail == ''){
           res.json({
                message : 'Message or reviver email can not be empty',
                success: false
            });
            return;
        }
        // Check if user trying to send messge to him/her self
        if(req.user.email === reciverEmail){
          res.json({
                message: {
                    message: 'Please use a diffent email',
                    success: false
                }
            })
            return;
        }
        
        // Check if new conversation
        const existsconversations = await db.query('SELECT 1 FROM conversations WHERE id = ?', [req.params.id]);
    if(existsconversations == 0){
        await db.query('INSERT INTO conversations(conversationName) VALUES(?)', [conversationName]);
    }
    // check if reciver is company or influencer
    let isCompany = false;
    const dbQuery = await db.query('SELECT 1 FROM companies WHERE email = ?', [reciverEmail]);
    if(dbQuery.length > 0){
        isCompany = true;
    }
    // Create new message
     const [...newMessage] =  await db.query('INSERT INTO messages(message, sent_time, senderType, receiverType, receiverEmail, senderEmail, conversations_id) VALUES(?, ?, ?, ?, ?, ?, ?)', [message,'datetime("now")', senderType, (isCompany ? 'companies' : 'influencers'), reciverEmail, req.user.email ,req.params.id]);
     if(newMessage){
      res.json({
            message: "message sent",
            success: true,
        });
    }
     
    });



    router.get("/:id", authMiddleware ,async (req, res) => {
        const reciverType = type === 'company' ? 'companies' : 'influencers';
        const [...conversation] = await db.query('SELECT messages_id ,message,sent_time, senderType, receiverType, receiverEmail, senderEmail, conversations.id, conversationName FROM conversations INNER JOIN messages ON messages.conversations_id = conversations.id WHERE conversations.id = ?', [req.params.id]);

        res.json(conversation);

    });

    return router;
}