var config = require ('config.json');
var express = require ('express');
var router = express.Router();
var userService = require ('services/user.service');
var formidable = require ('formidable');

router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
router.put('/:_id', updateUser);
router.post('/cancellation', cancelBus);
router.post('/addPupil', add_pupil);
router.get('/GetPupil', GetPupil);
router.get('/allPupils', GetAllPupils);
router.post('/addPupilFromFile', add_pupils_from_file);
router.post('/addTimetable', add_timetable);

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
    userService.GetPupil (req.user.sub)//passing parent id for further search in parent db for getting the phone number. The number is then used to connect parent with the pupil
        .then(function (pupil){
            res.send (pupil)
        })
        .catch(function(err){
            res.status(400).send(err);
        })
}

function GetAllPupils (req, res){
    userService.GetAllPupils()
        .then(function (pupil){
            res.send(pupil)
        })
        .catch(function(err){
            res.status(400).send(err)
        })
}


function updateUser (req, res){

    var userId = req.params._id;
    console.log(req.body);

    userService.update(userId, req.body)
        .then(function(){
            res.sendStatus(200)
        })
        .catch(function(err){
            res.status(400).send(err)
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

function add_pupils_from_file(req, res){
    userService.add_pupils_from_file(req)
        .then(function(){
            res.sendStatus(200);
        })
        .catch(function(err){
            console.log('Error');
            res.status(400).send(err)
        })
}

function add_timetable(req, res){
    userService.add_timetable(req)
        .then(function(){
            res.sendStatus(200);
        })
        .catch(function(err){
            console.log('Error');
            res.status(400).send(err);
        })
}