'use strict';

angular.module('insight.system').controller('HeaderController',
  function($scope, $rootScope, $modal, getSocket, Global, Block) {
	$scope.defaultLanguage = defaultLanguage;
	
    $scope.global = Global;

    $rootScope.currency = {
      factor: 1,
      bitstamp: 0,
      symbol: 'BCH'
    };

    $scope.menu = [{
      'title': 'Blocks',
      'link': 'blocks'
    }, {
      'title': 'Status',
      'link': 'status'
    }];

    $scope.openScannerModal = function() {
      var modalInstance = $modal.open({
        templateUrl: 'scannerModal.html',
        controller: 'ScannerController'
      });
    };

    var _getBlock = function(hash) {
      Block.get({
        blockHash: hash
      }, function(res) {
        $scope.totalBlocks = res.height;
      });
    };

    var socket = getSocket($scope);
    socket.on('connect', function() {
      socket.emit('subscribe', 'inv');

      socket.on('block', function(block) {
        var blockHash = block.toString();
        _getBlock(blockHash);
      });
    });

    $rootScope.isCollapsed = true;
	
	
    $scope.availableLanguages = [{
      name: 'Deutsch',
      isoCode: 'de_DE',
    }, {
      name: 'English',
      isoCode: 'en',
    }, {
      name: 'Spanish',
      isoCode: 'es',
    }, {
      name: 'Japanese',
      isoCode: 'ja',
    }];

    $scope.setLanguage = function(isoCode) {
      gettextCatalog.currentLanguage = $scope.defaultLanguage = defaultLanguage = isoCode;
      amMoment.changeLocale(isoCode);
      localStorage.setItem('insight-language', isoCode);
      var currentPageTemplate = $route.current.templateUrl;
      $templateCache.remove(currentPageTemplate);
      $route.reload();
    };
  });
