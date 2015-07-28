var babyTrackerFactories = angular.module('babytracker.factories', []);

babyTrackerFactories.factory('diapers', ['$http', function($http) {
    var diaperFactory = {};

    diaperFactory.loadAll = function(callback) {
        $http.get('/diapers/all')
            .success(function(data, status) {
                if (status === 500) {
                    callback(false, data.toString(), null);
                }
                else {
                    callback(true, '', data);
                }
            })
            .error(function(data, status) {
                callback(false, data.toString(), null);
            });
    };

    diaperFactory.save = function(diaper, callback) {
        $http.post('/diapers/savediaper', { diaper: diaper })
            .success(function(data, status) {
                if (status === 500) {
                    callback(false, data.toString());
                }
                else {
                    callback(true, '');
                }
            })
            .error(function(data, status) {
                callback(false, data.toString());
            });
    };

    diaperFactory.delete = function(diaperId, callback) {
        $http.post('/diapers/deletediaper', { diaperId: diaperId })
            .success(function(data, status) {
                if (status === 500) {
                    callback(false, data.toString());
                }
                else {
                    callback(true, '');
                }
            })
            .error(function(data, status) {
                callback(false, data.toString());
            });
    };

    return diaperFactory;
}]);

babyTrackerFactories.factory('feedings', ['$http', function($http) {
    var feedingsFactory = {};

    feedingsFactory.loadAll = function(callback) {
        $http.get('/feedings/all')
            .success(function(data, status) {
                if (status === 500) {
                    callback(false, data.toString(), null);
                }
                else {
                    data.forEach(function(feeding) {
                        feeding.overallStartDate = getComparedDate(feeding.startDateLeft, feeding.startDateRight, true, -1, -1);
                        feeding.overallEndDate = getComparedDate(feeding.startDateLeft, feeding.startDateRight, false, feeding.lengthInMinutesLeft, feeding.lengthInMinutesRight);

                        var leftLength = isNullOrUndefined(feeding.lengthInMinutesLeft) ? 0 : feeding.lengthInMinutesLeft;
                        var rightLength = isNullOrUndefined(feeding.lengthInMinutesRight) ? 0 : feeding.lengthInMinutesRight;
                        feeding.overallLength = leftLength + rightLength;
                    });

                    callback(true, '', data);
                }
            })
            .error(function(data, status) {
                callback(false, data.toString(), null);
            });
    };

    feedingsFactory.save = function(feeding, callback) {
        $http.post('/feedings/savefeeding', { feeding: feeding })
            .success(function(data, status) {
                if (status === 500) {
                    callback(false, data.toString());
                }
                else {
                    callback(true, '');
                }
            })
            .error(function(data, status) {
                callback(false, data.toString());
            });
    };

    feedingsFactory.delete = function(feeding, callback) {
        $http.post('/feedings/deletefeeding', { feeding: feeding })
            .success(function(data, status) {
                if (status === 500) {
                    callback(false, data.toString());
                }
                else {
                    callback(true, '');
                }
            })
            .error(function(data, status) {
                callback(false, data.toString());
            });
    };

    function getComparedDate(dateOne, dateTwo, isEarliest, dateOneMinutes, dateTwoMinutes) {
        var dateOneUndefined = typeof(dateOne) === null || typeof(dateOne) === undefined || dateOne === '';
        var dateTwoUndefined = typeof(dateTwo) === null || typeof(dateTwo) === undefined || dateTwo === '';

        if (dateOneUndefined && dateTwoUndefined) {
            return null;
        }

        dateOne = new Date(dateOne);
        dateTwo = new Date(dateTwo);

        if (isEarliest) {
            if (dateOneUndefined && !dateTwoUndefined) {
                return dateTwo;
            }
            else if (dateTwoUndefined && !dateOneUndefined) {
                return dateOne;
            }
            else if (dateOne > dateTwo) {
                return dateTwo;
            }
            else {
                return dateOne;
            }
        }
        else {
            var newDate;
            if (dateOneUndefined && !dateTwoUndefined) {
                newDate = new Date(dateTwo.getTime() + (dateTwoMinutes * 60000));
                return newDate;
            }
            else if (dateTwoUndefined && !dateOneUndefined) {
                newDate = new Date(dateOne.getTime() + (dateOneMinutes * 60000));
                return newDate;
            }
            else if (dateOne > dateTwo) {
                newDate = new Date(dateOne.getTime() + (dateOneMinutes * 60000));
                return newDate;
            }
            else {
                newDate = new Date(dateTwo.getTime() + (dateTwoMinutes * 60000));
                return newDate;
            }
        }
    }

    return feedingsFactory;
}]);

babyTrackerFactories.factory('auth', ['$http', '$window', function($http, $window) {
    var authFactory = {};

    authFactory.saveToken = function(token) {
        $window.localStorage['baby-tracker-website-token'] = token;
    };

    authFactory.getToken = function() {
        return $window.localStorage['baby-tracker-website-token'];
    };

    authFactory.isLoggedIn = function() {
        var token = authFactory.getToken();
        if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        }
        else {
            return false;
        }
    };

    authFactory.currentUser = function() {
        if (authFactory.isLoggedIn()) {
            var token = authFactory.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.username;
        }
    };

    authFactory.logIn = function(user, callback) {
        $http.post('/login', user)
            .success(function(data, status) {
                if (status === 401) {
                    callback(false, data.toString());
                }
                else {
                    authFactory.saveToken(data.token);
                    callback(true, '');
                }
            })
            .error(function(data, status) {
                callback(false, data.toString());
            });
    };

    authFactory.logOut = function() {
        $window.localStorage.removeItem('baby-tracker-website-token');
    };

    authFactory.changePassword = function(oldPassword, newPassword, callback) {
        $http.post('/changepassword', { oldPassword: oldPassword, newPassword: newPassword})
            .success(function(data, status) {
                if (status === 401) {
                    callback(false, 'Invalid Login Details');
                }
                else {
                    callback(true, '');
                }
            })
            .error(function(data, status) {
                callback(false, data.toString());
            });
    };

    return authFactory;
}]);