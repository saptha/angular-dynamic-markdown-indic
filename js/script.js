var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; //Underscore must already be loaded on the page
});

var app = angular.module('saptha', ['underscore'])
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


  app.controller('MainCtrl', ['$scope', '_', function($scope, _) {
		init = function() {
           _.keys($scope);
       }
  $scope.chps = [];
  	//$scope.textarea = '**Welcome, I am some Bold Markdown text**';
    		$scope.chps.content = 'I am *ready* to be edited!';

  $scope.addNewchp = function() {

    var newItemNo = $scope.chps.length+1;
	$scope.newitem = newItemNo;
    $scope.chps.push({'id':'chp'+newItemNo});

	$scope.$on('onRepeatLast', function(scope, element, attrs){
          //work your magic
		   var node = document.getElementById('titchp'+$scope.newitem);
	 Kanni.enableNode(node);
	 var node = document.getElementById('contchp'+$scope.newitem);
	 Kanni.enableNode(node);

	 $('#contchp'+$scope.newitem).markdown({
  additionalButtons: [
  /*
	 [{
          name: "groupcustom",
          data: [{
            name: "cmdBeer",
            toggle: true, // this param only take effect if you load bootstrap.js
            title: "Beer",
            icon: "glyphicon glyphicon-glass",
            callback: function(e){
              // Replace selection with some drinks
              var chunk, cursor,
                  selected = e.getSelection(), content = e.getContent(),
                  drinks = ["Heinekken", "Budweiser",
                            "Iron City", "Amstel Light",
                            "Red Stripe", "Smithwicks",
                            "Westvleteren", "Sierra Nevada",
                            "Guinness", "Corona", "Calsberg"],
                  index = Math.floor((Math.random()*10)+1)


              // Give random drink
              chunk = drinks[index]

              // transform selection and set the cursor into chunked text
              e.replaceSelection(chunk)
              cursor = selected.start

              // Set the cursor
              e.setSelection(cursor,cursor+chunk.length)
            }
          }]
    }]
	*/
  ]
});


      });



  };

  $scope.removechp = function() {
    var lastItem = $scope.chps.length-1;
    if ( lastItem !== 0)
    {
    $scope.chps.splice(lastItem);
  }
  };

  init();
}]);
