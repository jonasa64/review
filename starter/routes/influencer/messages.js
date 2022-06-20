const router = require('express').Router();
const authMiddleware = require('../../middlewares/auth');

//get list of conversations with newest message from each conversation
router.get('/', authMiddleware, async (req, res) => {
    res.json({
        conversations: []
    })

})
//get everything in a conversation
router.get('/:id', authMiddleware, async (req, res) => {
    res.json({
        messages: []
    })

})
//create a new message in a conversation
router.post('/:id', authMiddleware, async (req, res) => {
    res.json({
        success: false
    })

})

module.exports = router;