const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/main.db');
const query = (sql, params) => new Promise(async res => {
    db.prepare(sql).all(params, (err, rows) => {
        if (err) {
            console.log(err);
            return res(false)
        }
        res(rows);
    });
})
db.serialize(async () => {
    //create tables
    const sqlStart = [
        `CREATE TABLE IF NOT EXISTS \`influencers\` (
            \`id\` INTEGER PRIMARY KEY,
            \`name\` TEXT,
            \`igUsername\` TEXT,
            \`email\` TEXT,
            \`passwordHash\` TEXT
         )`,
        `CREATE TABLE IF NOT EXISTS \`companies\` (
            \`id\` INTEGER PRIMARY KEY,
            \`name\` TEXT,
            \`CVR\` INT,
            \`email\` TEXT,
            \`passwordHash\` TEXT
         )`,
            // Tables for message and conversations
         `CREATE TABLE IF NOT EXISTS \`messages\` (
            \`messages_id\` INTEGER PRIMARY KEY,
            \`message\` TEXT,
            \`sent_time\` TEXT,
            \`senderType\` TEXT,
            \`receiverType\` TEXT,
            \`receiverEmail\` TEXT,
            \`senderEmail\` TEXT,
            \`conversations_id\` INTEGER REFERENCES conversations(id)
        )`,

        `CREATE TABLE IF NOT EXISTS \`conversations\` (
            \`id\` INTEGER PRIMARY KEY,
            \`conversationName\` Text

        )`

    ]
    
    sqlStart.forEach(v => db.run(v))
    
    //insert test influencer + test company if not exists yet
    const existsInfluencer = await query('SELECT 1 FROM influencers', []);
    if(existsInfluencer.length == 0) {
        query('INSERT INTO influencers(name, igUsername, email, passwordHash) VALUES(?, ?, ?, ?)', ['John Doe', 'johndoe', 'john@gmail.com', '7cf7e66906a6e38d1ac73fac3ed8438f35c0855fc7b195e5ba4f7f6018db4c9dfc7834cf3b4c7b19014265df17400ba9296113d6eb44d8448228ef1216f37983']);
        query('INSERT INTO influencers(name, igUsername, email, passwordHash) VALUES(?, ?, ?, ?)', ['Camilla', 'cam', 'camilla@gmail.com', '7cf7e66906a6e38d1ac73fac3ed8438f35c0855fc7b195e5ba4f7f6018db4c9dfc7834cf3b4c7b19014265df17400ba9296113d6eb44d8448228ef1216f37983']);
        query('INSERT INTO influencers(name, igUsername, email, passwordHash) VALUES(?, ?, ?, ?)', ['Jane Doe', 'janeoe', 'jane@gmail.com', '7cf7e66906a6e38d1ac73fac3ed8438f35c0855fc7b195e5ba4f7f6018db4c9dfc7834cf3b4c7b19014265df17400ba9296113d6eb44d8448228ef1216f37983']);
        query('INSERT INTO influencers(name, igUsername, email, passwordHash) VALUES(?, ?, ?, ?)', ['Line', 'Line15', 'line@gmail.com', '7cf7e66906a6e38d1ac73fac3ed8438f35c0855fc7b195e5ba4f7f6018db4c9dfc7834cf3b4c7b19014265df17400ba9296113d6eb44d8448228ef1216f37983']);
    }
    
    const existsCompany = await query('SELECT 1 FROM companies', []);
    if(existsCompany.length == 0) {
        query('INSERT INTO companies(name, CVR, email, passwordHash) VALUES(?, ?, ?, ?)', ['John Doe', 13131313, 'dream@dreaminfluencers.com', '7cf7e66906a6e38d1ac73fac3ed8438f35c0855fc7b195e5ba4f7f6018db4c9dfc7834cf3b4c7b19014265df17400ba9296113d6eb44d8448228ef1216f37983']);
        query('INSERT INTO companies(name, CVR, email, passwordHash) VALUES(?, ?, ?, ?)', ['Jane Doe', 13131313, 'dream1@dreaminfluencers.com', '7cf7e66906a6e38d1ac73fac3ed8438f35c0855fc7b195e5ba4f7f6018db4c9dfc7834cf3b4c7b19014265df17400ba9296113d6eb44d8448228ef1216f37983']);
        query('INSERT INTO companies(name, CVR, email, passwordHash) VALUES(?, ?, ?, ?)', ['John Snow', 13131313, 'dream2@dreaminfluencers.com', '7cf7e66906a6e38d1ac73fac3ed8438f35c0855fc7b195e5ba4f7f6018db4c9dfc7834cf3b4c7b19014265df17400ba9296113d6eb44d8448228ef1216f37983']);
    }

    const existsconversations = await query('SELECT 1 FROM conversations', []);
    if(existsconversations.length == 0){
        query('INSERT INTO conversations(conversationName) VALUES(?)', ['conversation 1']);
        query('INSERT INTO conversations(conversationName) VALUES(?)', ['conversation 2']);
        query('INSERT INTO conversations(conversationName) VALUES(?)', ['conversation 2']);
    }

    const existsMessages = await query("SELECT 1 FROM messages", []);
    if(existsMessages.length == 0){
        query('INSERT INTO messages(message, sent_time, senderType, receiverType, receiverEmail, senderEmail, conversations_id) VALUES(?, ?, ?, ?, ?, ?, ?)', ['Hello John','datetime("now")','companies', 'influencers', 'john@gmail.com','dream2@dreaminfluencers.com',1 ]);
        query('INSERT INTO messages(message, sent_time, senderType, receiverType, receiverEmail, senderEmail, conversations_id) VALUES(?, ?, ?, ?, ?, ?, ?)', ['Hey how are you ?','datetime("now")','influencers','influencers', 'jane@gmail.com', 'john@gmail.com',3]);
        query('INSERT INTO messages(message, sent_time, senderType, receiverType, receiverEmail, senderEmail, conversations_id) VALUES(?, ?, ?, ?, ?, ?, ?)', ['Hello there','datetime("now")','influencers', 'companies', 'dream2@dreaminfluencers.com', 'john@gmail.com', 1]);
        query('INSERT INTO messages(message, sent_time, senderType, receiverType, receiverEmail, senderEmail, conversations_id) VALUES(?, ?, ?, ?, ?, ?, ?)', ['Hey','datetime("now")','influencers', 'companies', 'camilla@gmail.com','dream1@dreaminfluencers.com',2]);
        query('INSERT INTO messages(message, sent_time, senderType, receiverType, receiverEmail, senderEmail, conversations_id) VALUES(?, ?, ?, ?, ?, ?, ?)', ['Hey', 'datetime("now")','companies', 'influencers', 'dream1@dreaminfluencers.com','camilla@gmail.com',2]);
    }
})
module.exports = {
    query
}