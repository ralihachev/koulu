(function(){
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller (UserService, FlashService) {
        var vm = this;

        vm.pupils = null;
        vm.add_pupil = add_pupil;


        function add_pupil(){
            UserService.add_pupil(vm.pupils)
                .then(function(){
                    FlashService.Success('The pupil is added');
                    vm.pupils = null;
                })
                .catch(function(error){
                    FlashService.Error(error);
                });

        }
    }

})();
