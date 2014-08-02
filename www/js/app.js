window.mobile_app = angular.module('bdfz-guidebook', ['ionic', 'mobile.controllers', 'ngSanitize']);

window.mobile_app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
/*
window.mobile_app.config([
  "$httpProvider", function(provider) {
    provider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    return provider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  }
]);
*/

window.mobile_app.run([
  '$ionicPlatform', function($ionicPlatform) {
    return $ionicPlatform.ready(function() {
      return StatusBar.styleDefault();
    });
  }
]).config([
  '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('mobile', {
      url: '/mobile',
      abstract: true,
      templateUrl: "sidebar.html"
    }).state('mobile.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: "home.html",
          controller: 'HomeController'
        }
      }
    }).state('mobile.books', {
      url: '/books',
      views: {
        'menuContent': {
          templateUrl: "books.html",
          controller: 'BooksController'
        }
      }
    }).state('mobile.show_book', {
      url: '/books/:BookId',
      views: {
        'menuContent': {
          templateUrl: "show_book.html",
          controller: 'BookDetailController'
        }
      }
    }).state('mobile.article', {
      url: '/books/:Book_Id/:ArticleId',
      views: {
        'menuContent': {
          templateUrl: "show_article.html",
          controller: 'ArticleController'
        }
      }
    }).state('mobile.about', {
      url: '/about',
      views: {
        "menuContent": {
          templateUrl: "about.html",
          controller: "AboutController"
        }
      }
    });
    return $urlRouterProvider.otherwise("/mobile/home");
  }
]);

window.MobileController = angular.module('mobile.controllers', []);

window.MobileController.controller('BooksController', [
  '$scope', '$http', function($scope, $http) {
    $scope.get_list = function() {
      return $http({
        url: 'http://book.bdfzer.com/api/v1/book/get_list.json',
        method: 'GET',
        isArray: true
      }).success(function(data) {
        return $scope.books = data;
      });
    };
    $scope.get_list();
    return $scope.refresh = function() {
      return $scope.get_list();
    };
  }
]).controller('BookDetailController', [
  '$scope', '$stateParams', '$http', '$rootScope', function($scope, $stateParams, $http, $rootScope) {
    $scope.get_list = function() {
      return $http({
        url: 'http://book.bdfzer.com/api/v1/article/get_list.json',
        params: {
          id: $stateParams.BookId
        },
        isArray: true
      }).success(function(data) {
        return $scope.articles = data;
      });
    };
    $scope.get_book = function() {
      return $http({
        url: 'http://book.bdfzer.com/api/v1/book/info.json',
        params: {
          id: $stateParams.BookId
        },
        isArray: false
      }).success(function(data) {
        return $rootScope.book = data;
      });
    };
    $scope.get_list();
    $scope.get_book();
    return $scope.refresh = function() {
      return $scope.get_list();
    };
  }
]).controller('AboutController', ['$scope', '$http', function($scope, $http) {}]).controller('HomeController', [
  '$scope', '$http', function($scope, $http) {
    return $http({
      url: 'http://book.bdfzer.com/api/v1/mobile/last_update.json',
      method: 'GET',
      isArray: false
    }).success(function(data) {
      return $scope.version = data.version;
    });
  }
]).controller('ArticleController', [
  '$scope', '$http', '$stateParams', '$ionicPlatform', function($scope, $http, $stateParams, $ionicPlatform) {
    $scope.get_article = function() {
      return $http({
        url: 'http://book.bdfzer.com/api/v1/article/get_info.json',
        params: {
          id: $stateParams.ArticleId
        },
        isArray: false
      }).success(function(data) {
        return $scope.article = data;
      });
    };
    $scope.get_book = function() {
      return $http({
        url: 'http://book.bdfzer.com/api/v1/book/info.json',
        params: {
          id: $stateParams.Book_Id
        },
        isArray: false
      }).success(function(data) {
        return $scope.book = data;
      });
    };
    $scope.get_book();
    $scope.get_article();
    return $ionicPlatform.ready(function() {
      return $('img').addClass("full-image");
    });
  }
]).controller('SideMenuController', [
  '$scope', '$ionicSideMenuDelegate', '$rootScope', '$http', function($scope, $ionicSideMenuDelegate, $rootScope, $http) {
    $rootScope.SideBarTitle = "北大附中学生手册";
    return $scope.toggleLeft = function() {
      return $ionicSideMenuDelegate.toggleLeft();
    };
  }
]);