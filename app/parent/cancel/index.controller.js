(function (){
    'use strict';

    angular
        .module('app')
        .controller('Cancel.IndexController', Controller);
    function Controller($window, UserService, FlashService){
        var vm = this;
        vm.pupil = null;
        vm.cancelBus = cancelBus;

        initController();

        function initController(){
            UserService.GetPupil().then(function(pupil){
                vm.pupil = pupil;
            });
        }


        function cancelBus(number){
            UserService.cancelBus(vm.pupil[number])
                .then(function(){
                    FlashService.Success('The cancellation is made');
                })
                .catch(function(error){
                    FlashService.Error(error);
                });
        }

    }
})();
