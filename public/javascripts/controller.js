var fileExp = angular.module('fileExp', []);

function mainController($scope, $http, $window) {
  $http.get('/list_dir')
  .success(function(data) {
    $scope.query = '';
    $scope.files = data;
    console.log(data);
  })
  .error(function(data) {
    console.log('Error: ' + data);
  });
  $scope.rootCall = function(){
    $scope.files = [];
    $scope.query = '';
    $http.get('/list_dir')
    .success(function(data) {
      $scope.files = data;
      console.log(data);
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });
  }
  $scope.open = function(file){
    $scope.files = [];
    if(file.IsDirectory){
      $scope.query = $scope.query + file.Name+'/';
        console.log($scope.query);
      $http.get('/list_dir?path='+ $scope.query)
      .success(function(data) {
        $scope.files = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    }
    else{
        $scope.query = $scope.query + file.Name+'/';
        console.log($scope.query);
        var URL = '/get_file?path=' + encodeURIComponent($scope.query);
        $window.open(URL,'_blank');
    }
  }
}
