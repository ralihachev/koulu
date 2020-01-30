(function (){
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);
    function Controller($window, UserService, FlashService){
        var vm = this;

        vm.pupil = null;
        vm.saveUser = saveUser;
        initController();

        function initController(){
            UserService.GetPupil().then(function(pupil){
                vm.pupil = pupil;
            });
        }

        function saveUser(number){
            UserService.Update(vm.pupil[number])
                .then(function(){
                    FlashService.Success('Pupil updated');
                })
                .catch(function(error){
                    FlashService.Error(error);
                });
        }

    }
})();
