(function (){
    'use strict';

    angular
        .module('app')
        .controller('Cancel.IndexController', Controller);
    function Controller($window, UserService, FlashService){
        var vm = this;
        vm.user = null;
        vm.cancelBus = cancelBus;
        initController();

        function initController(){
            UserService.GetCurrent().then(function(user){
                vm.user = user;
            });
        }


        function cancelBus(){
            UserService.cancelBus(vm.user)
                .then(function(){
                    FlashService.Success('The cancellation is made');
                })
                .catch(function(error){
                    FlashService.Error(error);
                });
        }

    }
})();
