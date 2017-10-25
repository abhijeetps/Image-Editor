var app = angular.module('app', ['ngRoute']);

const {remote} = require('electron');

app.service('image', function(){
    var imagePath = "";
    var imageDimensions = [];
    this.setImagePath = function(path) {
        imagePath = path;
    }

    this.getImagePath = function() {
        return imagePath;
    }

    this.setImageDimensions = function(dimensions){
        imageDimensions = dimensions;
    }

    this.getImageDimensions = function(dimensions){
        return imageDimensions;
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
                image.setImagePath(path);
                var sizeof = require('image-size'); 
                var dimensions = sizeof(path);
                image.setImageDimensions(dimensions);
                $location.path('/edit');
                $scope.$apply();
            }
        });
    };
});

app.controller('editCtrl', function($scope, image, $location){
    $scope.imagePath = image.getImagePath();

    $scope.controlsActive = false;

    var imageReference = document.getElementById('mainImage');

    var generatedStyles = "";

    $scope.effects = {
        'Brightness': {val: 100, min: 0, max: 200, delim: '%'},
        'Contrast': {val: 100, min: 0, max: 200, delim: '%'},
        'Invert': {val: 0, min: 0, max: 100, delim: '%'},
        'Hue-Rotate': {val: 0, min: 0, max: 360, delim: 'deg'},
        'Sepia': {val: 0, min: 0, max: 100, delim: '%'},
        'Grayscale': {val: 0, min: 0, max: 100, delim: '%'},
        'Saturate': {val: 100, min: 0, max: 200, delim: '%'},
        'Blur': {val: 0, min: 0, max: 5, delim: 'px'}        
    };

    $scope.imageEffect = function(effectName) {
        $scope.controlsActive = true;
        $scope.activeEffect = effectName;
    }

    $scope.setEffect = function(){
        generatedStyles = "";
        for(let i in $scope.effects) {
            generatedStyles += `${i}(${$scope.effects[i].val + $scope.effects[i].delim}) `;
        }
        imageReference.style.filter = generatedStyles;
    }

    $scope.hideThis = function() {
        $scope.controlsActive = false;
    };

    $scope.change = function() {
        $location.path('/');
    }

    $scope.save = function() {
        const {BrowserWindow} = remote;
        var imageDimensions = image.getImageDimensions();
        let src = image.getImagePath();
        let style = imageReference.style.filter;

        let win = new BrowserWindow({
            frame: false,
            show: false,
            width: imageDimensions.width,
            height: imageDimensions.height,
            webPreferences: {
                webSecurity: false
            } 
        });
        win.loadURL(
            `data:text/html, 
                <style>
                * {
                    margin: 0;
                    padding 0;
                }
                </style>

                <img src="${src}" style="filter: ${style}">

                <script>
                    var screenshot = require('electron-screenshot');
                    screenshot({
                        filename: 'untitled.jpg',
                        delay: 1000
                    });
                    
                    

                </script>

            `
        );
    }
});