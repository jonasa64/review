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
    ]
    sqlStart.forEach(v => db.run(v))
    
    //insert test influencer + test company if not exists yet
    const existsInfluencer = await query('SELECT 1 FROM influencers', []);
    if(existsInfluencer.length == 0) {
        query('INSERT INTO influencers(name, igUsername, email, passwordHash) VALUES(?, ?, ?, ?)', ['John Doe', 'johndoe', 'john@gmail.com', '7cf7e66906a6e38d1ac73fac3ed8438f35c0855fc7b195e5ba4f7f6018db4c9dfc7834cf3b4c7b19014265df17400ba9296113d6eb44d8448228ef1216f37983']);
        query('INSERT INTO influencers(name, igUsername, email, passwordHash) VALUES(?, ?, ?, ?)', ['Camilla', 'cam', 'camilla@gmail.com', '7cf7e66906a6e38d1ac73fac3ed8438f35c0855fc7b195e5ba4f7f6018db4c9dfc7834cf3b4c7b19014265df17400ba9296113d6eb44d8448228ef1216f37983']);
    }
    
    const existsCompany = await query('SELECT 1 FROM companies', []);
    if(existsCompany.length == 0) {
        query('INSERT INTO companies(name, CVR, email, passwordHash) VALUES(?, ?, ?, ?)', ['John Doe', 13131313, 'dream@dreaminfluencers.com', '7cf7e66906a6e38d1ac73fac3ed8438f35c0855fc7b195e5ba4f7f6018db4c9dfc7834cf3b4c7b19014265df17400ba9296113d6eb44d8448228ef1216f37983']);
    }
})
module.exports = {
    query
}