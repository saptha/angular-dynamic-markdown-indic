var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; //Underscore must already be loaded on the page
});

var app = angular.module('saptha', ['underscore','bgDirectives','angularModalService', 'LocalStorageModule'])
        .config(function(localStorageServiceProvider){
          localStorageServiceProvider.setPrefix('trtitle');
          // localStorageServiceProvider.setStorageCookieDomain('example.com');
         localStorageServiceProvider.setStorageType('localStorage');
        })
		    .directive('onLastRepeat', function() {
        return function(scope, element, attrs) {
            if (scope.$last) setTimeout(function(){
                scope.$emit('onRepeatLast', element, attrs);
            }, 1);
        };
    })
	.directive('myLang', function($parse, $timeout) {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      var model = $parse(attrs.ngModel).assign;
      console.log("Inside directive")
      element.on('keyup', function() {
        //upadate value of ngModel with value attached to DOM value attribute
        scope.$apply(function() {
          console.log(element.val())
          ctrl.$setViewValue(element.val());
          ctrl.$render();
        });
      })
    }
  }
})
.directive('confirmOnExit', function() {
    return {
        link: function($scope, elem, attrs) {
            window.onbeforeunload = function(){
                if ($scope.formchp.$dirty) {
                    return "The form is dirty, do you want to stay on the page?";
                }
            }
            $scope.$on('$locationChangeStart', function(event, next, current) {
                if ($scope.formchp.$dirty) {
                    if(!confirm("The form is dirty, do you want to stay on the page?")) {
                        event.preventDefault();
                    }
                }
            });
        }
    };
})
 .directive('markdown', ['$window', '$sce', function($window, $sce) {
    var converter = $window.Markdown.getSanitizingConverter();

    return {
      template: "<div ng-bind-html='sanitisedHtml' />",
      restrict: 'E',
      replace: true,
      scope: {
        markdown: '=bindFrom' ,
        class: '='
      },
      link: function(scope, element, attrs) {
        scope.$watch('markdown', function(value) {
          if (value != undefined && value != '') {
            scope.html = converter.makeHtml(value);
          	scope.sanitisedHtml = $sce.trustAsHtml(scope.html);
          }
        });
      }
    };
  }]);

  app.controller('MainCtrl', ['$scope', '_', 'ModalService', 'localStorageService', function($scope, _, ModalService, localStorageService) {
    init = function() {
           _.keys($scope);
       }

     $scope.chps = localStorageService.get('chps') ? localStorageService.get('chps') : [];
     $scope.liveprvw = true;

$scope.$watch('chps', function(value){
  if (angular.isUndefined(value) || value == null)
     { console.log('Its undefined. Setting to empty array'); value = [];}
  localStorageService.set('chps',value);
},true);
/*
 $scope.storageType = 'Local storage';

 if (localStorageService.getStorageType().indexOf('session') >= 0) {
   $scope.storageType = 'Session storage';
 }

 if (!localStorageService.isSupported) {
   $scope.storageType = 'Cookie';
 }


 $scope.$watch(function(){
   return localStorageService.get('chps');
 }, function(value){
if (angular.isUndefined(value) || value == null)
   { console.log('Its undefined. Setting to empty array'); value=[];}

    $scope.chps = value;
 }, true);

*/
 $scope.clearAll = localStorageService.clearAll;

   //$scope.book = {'trtitle':"", 'chps': [], 'cover': "", 'price': 0, 'blurb': ""}
   //$scope.chps = $scope.book.chps;
  	//$scope.textarea = '**Welcome, I am some Bold Markdown text**';
    	//	$scope.chps.content = 'I am *ready* to be edited!';
        $scope.editItem = function (chp) {
             chp.editing = true;
             $('#tit'+chp.id).focus();
         };
         $scope.editChp = function (chp) {
           _.each($scope.chps, function(item){ item.edit = false;});
              chp.edit = true;
              //$scope.class= "col-sm-6";
              //$scope.liveprvw = true;

            //  $('#cont'+chp.id).focus();
          };
          $scope.delChp = function (chp) {
          //  window.alert("Really?");
          ModalService.showModal({
    templateUrl: 'yesno.html',
    controller: "YesNoController",
    inputs: {
   title: chp.title,
   id: chp.id
 }
  }).then(function(modal) {
    modal.element.modal();
    modal.close.then(function(result) {
      $scope.yesNoResult = result ? "You said Yes" : "You said No";
      if (result)
      {
      $scope.chps = _.filter($scope.chps, function(chap) {
      return chap.id != chp.id;
      });
         _.each($scope.chps, function(item, i){ item.id = 'chp'+(i+1);});
    }
    });
  });
          };
         $scope.doneEditing = function (chp) {
             chp.editing = false;
             //dong some background ajax calling for persistence...
         };
         $scope.toggleCustom = function() {
          $scope.liveprvw = $scope.liveprvw === false ? true: false;
          if ($scope.liveprvw) {
            $scope.class = "";
          }
          else {
            $scope.class = "md-fullmode";
          }
         };
  $scope.addNewchp = function() {

    var newItemNo = $scope.chps.length+1;
	$scope.newitem = newItemNo;
  $scope.liveprvw = true;
  $scope.class= "";
  _.each($scope.chps, function(item){ item.edit = false;});
    $scope.chps.push({'id':'chp'+newItemNo, 'edit': true, 'editing': true, 'type': "Chapter"});
	$scope.$on('onRepeatLast', function(scope, element, attrs){
          //work your magic
		   var node = document.getElementById('titchp'+$scope.newitem);
	 Kanni.enableNode(node);
	 var node = document.getElementById('contchp'+$scope.newitem);
	 Kanni.enableNode(node);
   $('#titchp'+$scope.newitem).focus();
     $('#contchp'+$scope.newitem).markdown();

  //  $('#contchp'+$scope.newitem).markdown();
  //  $('#titchp'+$scope.newitem).focus();

/* commented for permanent preview solution
    $('#contchp'+$scope.newitem).markdown({
   additionalButtons: [

 	 [{
           name: "groupcustom",
           data: [{
             name: "livepreview",
             toggle: true, // this param only take effect if you load bootstrap.js
             title: "Live Preview",
             icon: "fa fa-eye",
             callback: function (e) {
                    angular.element('#Sapthaelement').scope().toggleCustom();
                    angular.element('#Sapthaelement').scope().$apply();
                  }
           }]
     }]

   ]
 });

 commented for permanent preview solution */
       });
};

  $scope.removechp = function() {
    var lastItem = $scope.chps.length-1;
    if ( lastItem !== 0)
    {
    $scope.chps.splice(lastItem);
  }
  };
  $("[data-toggle=tooltip]").tooltip();

  init();
}]);

app.controller('YesNoController', function($scope, title, id, close) {

  $scope.mtitle = title;
   $scope.mid = id;
  $scope.close = function(result) {
    close(result, 500); // close, but give 500ms for bootstrap to animate
  };

});
