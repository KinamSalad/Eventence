(function(angular){
  function myController($scope) {
        this.data = "a s d f g  h  e t y u dsafnkldsnf dsjfan sjk";
//+"Wotton railway station in Buckinghamshire, England, was part of a horse-drawn freight tramway built by Richard Plantagenet Campbell Temple-Nugent-Brydges-Chandos-Grenville, 3rd Duke of Buckingham and Chandos in 1871. It served the Duke's home at Wotton House and the nearby village of Wotton Underwood. In 1872 the line was extended to the nearby town of Brill, converted to passenger use, equipped with steam locomotives, and named the Brill Tramway. In the 1880s, the route was taken over by the Metropolitan Railway. Wotton, the Tramway's third busiest passenger station, was also a transit point for large shipments of milk from local farms. In 1933 the Metropolitan Railway became the Metropolitan line of London Transport, making Wotton a station on the London Underground, despite its distance from London. In November 1935 London Transport withdrew all services from the route. The Tramway reverted to the descendants of the Duke of Buckingham, but having no funds and no rolling stock they were unable to operate ";
        var vm = this;
        
        vm.wordCloudConfig = {
          initCloud: function(wcApi) {
            vm.wordCloudApi = wcApi;
          }
        };
        
        vm.click = function (){
        vm.wordCloudApi.setText(vm.data, true,"");
        };
     
    
  }
  
  angular.module('myApp', ['wbxWordCloud'])

  .directive('myDirective', function() {
    return {
      restrict: 'E',
      template: '<div id="my-directive"><button ng-click="myCtrl.click()">Cloud me!</button><div flex><wbx-word-cloud word-cloud-config="myCtrl.wordCloudConfig"></wbx-word-cloud></div></div>',
      controllerAs: 'myCtrl',
      controller: myController
    };
  })
  
  
  
  angular.element(document).ready(function() {
      angular.bootstrap(document.getElementsByTagName('body')[0], ['myApp']);
    });
})(angular);