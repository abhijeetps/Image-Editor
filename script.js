var app = angular.module('app', ['ngRoute']);

const {remote} = require('electron');

app.service('image', function(){
    var imagePath = "";
    this.setImagePath = function(path) {
        imagePath = path;
    }

    this.getImagePath = function() {
        return imagePath;
    }
});

app.config(function($routeProvider){
    $routeProvider.when('/', {
        templateUrl: `${__dirname}/components/home/home.html`,
        controller: 'homeCtrl'  
    }).when('/edit',{
        templateUrl: `${__dirname}/components/edit/edit.html`,
        controller: 'editCtrl'  
    }).otherwise({
        template: `404 NOT FOUND`
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

app.controller('homeCtrl', function($scope, $location, image) {
    $scope.pickFile = function () {
        var {dialog} = remote;

        dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                {name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif']},            
            ]
        }, function(file){
            if(!!file) {
                var path = file[0];
                image.setImagePath(path)
                $location.path('/edit');
                $scope.$apply();
            }
        });
    };
});

app.controller('editCtrl', function($scope, image){
    $scope.imagePath = image.getImagePath();

    $scope.effects = {
        'Brightness': {val: 100, min: 0, max: 200, delim: '%'},
        'Contrast': {val: 100, min: 0, max: 200, delim: '%'},
        'Invert': {val: 0, min: 0, max: 100, delim: '%'},
        'Hue-Rotate': {val: 0, min: 0, max: 360, delim: 'deg'},
        'Sepia': {val: 0, min: 0, max: 100, delim: '%'},
        'Greyscale': {val: 0, min: 0, max: 100, delim: '%'},
        'Saturate': {val: 100, min: 0, max: 200, delim: '%'},
        'Blur': {val: 0, min: 0, max: 5, delim: 'px'}        
    };

    $scope.imageEffect = function(effectName) {
        console.log(effectName);
    }
});