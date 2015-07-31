var app = angular.module('babyTrackerApp',
    [
        'ui.router',
        'tableSort',
        'babytracker.controllers',
        'babytracker.filters',
        'babytracker.directives',
        'babytracker.factories',
        'babytracker.injectors'
    ]
);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$httpProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider) {
        $stateProvider
            .state(
                'home',
                {
                    url: '/',
                    templateUrl: 'templates/home.html',
                    controller: 'BabyController',
                    onEnter: ['$state', 'auth', function($state, auth) {
                        if (!auth.isLoggedIn())
                        {
                            $state.go('login');
                        }
                    }]
                })
            .state(
                'homeactions',
                {
                    url: '/',
                    templateUrl: 'templates/home.html',
                    controller: 'BabyController',
                    onEnter: ['$state', 'auth', function($state, auth) {
                        if (!auth.isLoggedIn())
                        {
                            $state.go('login');
                        }
                    }]
                })
            .state(
                'adddiaperrecord',
                {
                    url: '/adddiaperrecord',
                    templateUrl: 'templates/addmodifydiaperrecord.html',
                    controller: 'BabyController',
                    onEnter: ['$state', 'auth', function($state, auth) {
                        if (!auth.isLoggedIn())
                        {
                            $state.go('login');
                        }
                    }]
                })
            .state(
                'modifydiaperrecord',
                {
                    url: '/modifydiaperrecord/{diaperId}',
                    templateUrl: 'templates/addmodifydiaperrecord.html',
                    controller: 'BabyController',
                    onEnter: ['$state', 'auth', function($state, auth) {
                        if (!auth.isLoggedIn())
                        {
                            $state.go('login');
                        }
                    }]
                })
            .state(
                'addfeedingrecord',
                {
                    url: '/addfeedingrecord',
                    templateUrl: 'templates/addfeedingrecord.html',
                    controller: 'BabyController',
                    onEnter: ['$state', 'auth', function($state, auth) {
                        if (!auth.isLoggedIn())
                        {
                            $state.go('login');
                        }
                    }]
                })
            .state(
                'addmanualfeedingrecord',
                {
                    url: '/addmanualfeedingrecord',
                    templateUrl: 'templates/manualaddmodifyfeedingrecord.html',
                    controller: 'BabyController',
                    onEnter: ['$state', 'auth', function($state, auth) {
                        if (!auth.isLoggedIn())
                        {
                            $state.go('login');
                        }
                    }]
                })
            .state(
                'modifyfeedingrecord',
                {
                    url: '/modifyfeedingrecord/{feedingId}',
                    templateUrl: 'templates/manualaddmodifyfeedingrecord.html',
                    controller: 'BabyController',
                    onEnter: ['$state', 'auth', function($state, auth) {
                        if (!auth.isLoggedIn())
                        {
                            $state.go('login');
                        }
                    }]
                })
            .state(
                'viewfeedings',
                {
                    url: '/viewfeedings',
                    templateUrl: 'templates/viewfeedings.html',
                    controller: 'BabyController',
                    onEnter: ['$state', 'auth', function($state, auth) {
                        if (!auth.isLoggedIn())
                        {
                            $state.go('login');
                        }
                    }]
                })
            .state(
                'viewdiapers',
                {
                    url: '/viewdiapers',
                    templateUrl: 'templates/viewdiapers.html',
                    controller: 'BabyController',
                    onEnter: ['$state', 'auth', function($state, auth) {
                        if (!auth.isLoggedIn())
                        {
                            $state.go('login');
                        }
                    }]
                })
            .state(
                'dailysummary',
                {
                    url: '/dailysummary',
                    templateUrl: 'templates/dailysummary.html',
                    controller: 'BabyController',
                    onEnter: ['$state', 'auth', function($state, auth) {
                        if (!auth.isLoggedIn())
                        {
                            $state.go('login');
                        }
                    }]
                })
            .state(
                'login',
                {
                    url: '/login',
                    templateUrl: 'templates/login.html',
                    controller: 'NavigationController',
                    onEnter: ['$state', 'auth', function($state, auth) {
                        if (auth.isLoggedIn())
                        {
                            $state.go('home');
                        }
                    }]
                })
            .state(
                'changepassword',
                {
                    url: '/changepassword',
                    templateUrl: 'templates/changepassword.html',
                    controller: 'NavigationController',
                    onEnter: ['$state', 'auth', function($state, auth) {
                        if (!auth.isLoggedIn())
                        {
                            $state.go('login');
                        }
                    }]
                }
            );

        $urlRouterProvider.otherwise('/');

        $httpProvider.interceptors.push('tokenInjector');
}]);