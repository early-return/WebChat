const router = require('express').Router();
const account = require('./handler/account');

router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'this is a test',
    data: null,
  });
});

router.post('/login', account.login);
router.post('/register', account.register);
router.get('/check/:email', account.checkEmail);
router.post('/profile/update', account.updateProfile);

module.exports = router;
