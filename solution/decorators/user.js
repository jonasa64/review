const authMiddleware = require('../middlewares/auth');
const db = require('../controllers/db')

module.exports = (router, type) => {
    router.get('/me', authMiddleware, async (req, res) => {
        const dbTable = type === 'company' ? 'companies' : 'influencers';
        const [user] = await db.query(`SELECT id, email, name FROM ${dbTable} WHERE id = ?`, [req.user.id]);
        res.json(user);
    })

    return router;
}