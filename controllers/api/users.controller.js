var config = require ('config.json');
var express = require ('express');
var router = express.Router();
var userService = require ('services/user.service');

router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);
router.post('/cancellation', cancelBus);
router.post('/addPupil', add_pupil);
router.get('/GetPupil', GetPupil);

module.exports = router;


function authenticateUser (req, res){

    userService.authenticate(req.body.username, req.body.password, req.body.loginPerson)
        .then(function(token){
            if (token) {
                res.send({token: token})
            } else {
                res.sendStatus(401)
            }
        })
        .catch(function(err){
            res.status(400).send(err);
        })
}

function registerUser(req, res){
    userService.create(req.body)
        .then(function(){
            res.sendStatus(200);
        })
        .catch(function(err){
            res.status(400).send(err)
        })
}

function getCurrentUser (req, res){
    userService.getById (req.user.sub)
        .then(function (user){
            if (user) {
                res.send (user)
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function(err){
            res.status(400).send(err);
        })
}


function GetPupil (req, res){

    userService.GetPupil (req.user.sub)
        .then(function (pupil){
            res.send (pupil)
        })
        .catch(function(err){
            res.status(400).send(err);
        })
}



function updateUser (req, res){

    var userId = req.params._id;

    userService.update(userId, req.body)
        .then(function(){
            res.sendStatus(200)
        })
        .catch(function(err){
            res.status(400).send(err)
        })
}

function deleteUser (req, res){
    var userId = req.user.sub;
    if (req.params._id !== userId){
        return res.status(401).send('You can only delete your own account')
    }

    userService.delete(userId)
        .then(function(){
            res.sendStatus(200)
        })
        .catch(function(err){
            res.status(400)
        })
}

function cancelBus (req, res){
    userService.cancelBus(req.body)
        .then(function(){
            res.sendStatus(200);
        })
        .catch(function(err){
            res.status(400).send(err);
        })
}

function add_pupil (req, res){
    userService.add_pupil(req.body)
        .then(function(){
            res.sendStatus(200);
        })
        .catch(function(err){
            res.status(400).send(err);
        })
}