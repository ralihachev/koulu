(function(){
    'use strict';

    angular
        .module('app')
        .factory('UserService', Service);

    function Service ($http, $q){
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetAllPupils = GetAllPupils;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.add_pupil = add_pupil;

        return service;

        function GetCurrent (){
            return $http.get('/api/users/current').then(handleSuccess, handleError);
        }

        function GetAllPupils (){
            return $http.get('/api/users/allPupils').then(handleSuccess, handleError);
        }

        function GetById (_id){
            return $http.get('/api/users/' + _id).then(handleSuccess, handleError);
        }

        function GetByUsername (username){
            return $http.get('/api/users/' + username).then(handleSuccess, handleError);
        }

        function Create (user){
            return $http.post('/api/users', user).then(handleSuccess, handleError);
        }

        function Update (user){
            return $http.put('/api/users/' + user._id, user).then(handleSuccess, handleError);
        }

        function add_pupil(details){
            return $http.post('/api/users/addPupil', details).then(handleSuccess, handleError)
        }



        function handleSuccess (res){
            return res.data;
        }

        function handleError (res){
            return $q.reject(res.data);
        }
    }
})();