const router = require('express').Router();
const userDecorator = require('../../decorators/user');
const authMiddleware = require('../../middlewares/auth');

router.use('/messages', require('./messages'));

router.get('/', async (req, res) => {
    res.json({
        message: 'Influencer Platform!'
    })
})


module.exports = userDecorator(router, 'influencer');