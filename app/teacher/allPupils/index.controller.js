(function(){
    'use strict';

    angular
        .module('app')
        .controller('allPupils.IndexController', Controller);

    function Controller (UserService, FlashService) {
        var vm = this;
        vm.pupils = null;
        vm.search = search;
        vm.update_pupil = update_pupil;
        initController();

        function initController(){
            UserService.GetAllPupils().then(function(pupils){
                vm.pupils = pupils;
            });
        }

        function update_pupil(index){
            UserService.Update(vm.pupils[index]).then(function(){
                FlashService.Success('Pupil updated')
            }).catch(function(error){
                FlashService.Error(error);
            })
        }

        function search() {

            var input, filter, table, tr, td_school, td_id, i, txtValue;

            input = document.getElementById("search");
            filter = input.value.toUpperCase();
            table = document.getElementById("pupil_table");
            tr = table.getElementsByTagName("tr");

            for (i = 0; i < tr.length; i++) {
                td_school = tr[i].getElementsByTagName("td")[0];
                if (td_school) {
                    txtValue = td_school.textContent || td_school.innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                    }
                }
            }
        }

    }

})();
