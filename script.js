var app = angular.module('app', ['ngRoute']);

const {remote} = require('electron');

app.config(function($routeProvider){
    $routeProvider.when('/', {
        templateUrl: `${__dirname}/components/home/home.html`,
        controller: 'homeCtrl'  
    });
});


app.controller('headCtrl', function($scope) {
    
    var window = remote.BrowserWindow.getFocusedWindow();

    $scope.close = function() {
        window.close();
    };

    
    $scope.minimize = function() {
        window.minimize();     
    };

    $scope.maximize = function() {
        window.isMaximized() ? window.unmaximize() : window.maximize();
    };
    
});

app.controller('homeCtrl', function($scope) {
    
});