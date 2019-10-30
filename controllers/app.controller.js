var express = require ('express');
var router = express.Router();

router.use('/', function(req, res, next){

    if (req.path !== '/login' && !req.session.token){
        return res.redirect('/login')
    }

    next()
});

router.get('/token', function(req, res){
    res.send(req.session.token)
});

router.use('/parent', express.static('app/parent'));
router.use('/teacher', express.static('app/teacher'));

module.exports = router;