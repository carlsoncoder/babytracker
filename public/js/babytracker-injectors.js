var babyTrackerInjectors = angular.module('babytracker.injectors', []);

babyTrackerInjectors.factory('tokenInjector', ['$injector', function($injector) {
    var tokenInjector = {
        request: function(config) {
            var auth = $injector.get('auth');
            config.headers.Authorization = 'Bearer ' + auth.getToken();
            return config;
        }
    };

    return tokenInjector;
}]);