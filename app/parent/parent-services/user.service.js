(function(){
    'use strict';

    angular
        .module('app')
        .factory('UserService', Service);

    function Service ($http, $q){
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.cancelBus = cancelBus;
        service.GetPupil = GetPupil;

        return service;

        function GetCurrent (){
            return $http.get('/api/users/current').then(handleSuccess, handleError);
        }

        function GetPupil (){
            return $http.get('/api/users/GetPupil').then(handleSuccess, handleError);
        }


        function GetAll (){
            return $http.get('/api/users').then(handleSuccess, handleError);
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


        function cancelBus(cancel){
            return $http.post('/api/users/cancellation', cancel).then(handleSuccess, handleError)
        }

        function handleSuccess (res){
            return res.data;
        }

        function handleError (res){
            return $q.reject(res.data);
        }
    }
})();