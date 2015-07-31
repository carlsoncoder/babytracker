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
                    var latestFeedingRecord = null;
                    data.forEach(function(feeding) {
                        if (latestFeedingRecord === null) {
                            latestFeedingRecord = feeding;
                        }
                        else {
                            var latestDate = new Date(latestFeedingRecord.overallStartDate);
                            if (latestDate > feeding.overallStartDate) {
                                latestFeedingRecord = feeding;
                            }
                        }
                    });

                    var returnValue = {};
                    returnValue.data = data;

                    // latestFeedingRecord will give us the last used boob, if possible
                    returnValue.lastUsedBoob = 'Unknown';
                    if (latestFeedingRecord !== null) {
                        if (isNullOrUndefined(latestFeedingRecord.lengthInMinutesLeft) || latestFeedingRecord.lengthInMinutesLeft === 0) {
                            returnValue.lastUsedBoob = 'Right';
                        }
                        else if (isNullOrUndefined(latestFeedingRecord.lengthInMinutesRight) || latestFeedingRecord.lengthInMinutesRight === 0) {
                            returnValue.lastUsedBoob = 'Left';
                        }
                        else {
                            // figure out which one to use
                            var leftDate = new Date(latestFeedingRecord.startDateLeft);
                            var rightDate = new Date(latestFeedingRecord.startDateRight);

                            if (leftDate > rightDate) {
                                returnValue.lastUsedBoob = 'Left';
                            }
                            else {
                                returnValue.lastUsedBoob = 'Right';
                            }
                        }
                    }

                    callback(true, '', returnValue);
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

    feedingsFactory.delete = function(feedingId, callback) {
        $http.post('/feedings/deletefeeding', { feedingId: feedingId })
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

    return feedingsFactory;
}]);

babyTrackerFactories.factory('dailysummary', ['$http', 'diapers', 'feedings', function($http, diapers, feedings) {
    var dailySummaryFactory = {};

    dailySummaryFactory.loadDailySummary = function(dateToLoad, callback) {
        var dailySummary = {};

        dailySummary.expectedNumberOfWetDiapers = 6;
        dailySummary.expectedNumberOfDirtyDiapers = 4;
        dailySummary.expectedNumberOfFeedings = 10;

        var allDiapers = [];
        var allFeedings = [];
        var dirtyDiapers = 0;
        var wetDiapers = 0;

        if (isNullOrUndefined(dateToLoad)) {
            dateToLoad = new Date();
        }

        diapers.loadAll(function(status, err, diapers) {
            if (!status) {
                callback(err);
            }
            else {
                allDiapers = diapers;
                feedings.loadAll(function(status, err, feedings) {
                    if (!status) {
                        callback(err);
                    }
                    else {
                        allFeedings = feedings.data;
                        dailySummary.mostRecentBoob = feedings.lastUsedBoob;

                        var todaysDiapers = [];
                        var dateToLoadString = moment(dateToLoad).format("MM/DD/YYYY");
                        dailySummary.loadedDate = dateToLoadString;

                        allDiapers.forEach(function(diaper) {
                            var diaperDate = new Date(diaper.affectedDateTime);
                            var diaperDateString = moment(diaperDate).format("MM/DD/YYYY");

                            if (diaperDateString === dateToLoadString) {
                                todaysDiapers.push(diaper);

                                if (diaper.isWet) {
                                    wetDiapers++;
                                }

                                if (diaper.isDirty) {
                                    dirtyDiapers++;
                                }
                            }
                        });

                        dailySummary.diapers = todaysDiapers;
                        dailySummary.numberOfWetDiapers = wetDiapers;
                        dailySummary.numberOfDirtyDiapers = dirtyDiapers;

                        var totalFeedingLength = 0;

                        var todaysFeedings = [];
                        allFeedings.forEach(function(feeding) {
                            feeding.overallStartDate = new Date(feeding.overallStartDate);
                            feeding.overallEndDate = new Date(feeding.overallEndDate);

                            var feedingStartDateString = moment(feeding.overallStartDate).format("MM/DD/YYYY");
                            var feedingEndDateString = moment(feeding.overallEndDate).format("MM/DD/YYYY");

                            if (feedingStartDateString === dateToLoadString || feedingEndDateString === dateToLoadString) {
                                todaysFeedings.push(feeding);
                                totalFeedingLength += feeding.overallLength;
                            }
                        });

                        // sort by earliest first for average time between feedings calculations
                        todaysFeedings.sort(function(first, second) {
                            return first.overallStartDate == second.overallStartDate ? 0
                                : +(first.overallStartDate > second.overallStartDate) || -1;
                        });

                        var minutesBetweenFeedings = [];
                        var overallTotalMinutesBetweenFeedings = 0;
                        var lastStartTime = null;
                        if (todaysFeedings.length > 1) {
                            for (var i = 0; i < todaysFeedings.length; i++) {
                                if (lastStartTime === null) {
                                    // first time through the loop
                                    lastStartTime = todaysFeedings[i].overallStartDate;
                                }
                                else {
                                    // get difference between this start time, and last start time
                                    var minutesSinceLast = Math.round((todaysFeedings[i].overallStartDate - lastStartTime) / 1000 / 60);
                                    overallTotalMinutesBetweenFeedings += minutesSinceLast;
                                    minutesBetweenFeedings.push(minutesSinceLast);

                                    // reset last start time
                                    lastStartTime = todaysFeedings[i].overallStartDate;
                                }
                            }

                            var totalMinutes = Math.round(overallTotalMinutesBetweenFeedings / minutesBetweenFeedings.length);
                            var hours = Math.floor(totalMinutes / 60);
                            var minutes = (totalMinutes - (hours * 60));

                            if (hours.toString().length == 1) {
                                hours = '0' + hours.toString();
                            }

                            if (minutes.toString().length == 1) {
                                minutes = '0' + minutes.toString();
                            }

                            dailySummary.averageTimeBetweenFeedings = hours + ':' + minutes;
                        }
                        else{
                            dailySummary.averageTimeBetweenFeedings = 'N/A';
                        }

                        dailySummary.feedings = todaysFeedings;
                        dailySummary.numberOfFeedings = todaysFeedings.length;

                        dailySummary.averageTimePerFeeding = 0;
                        if (totalFeedingLength > 0 && todaysFeedings.length > 0) {
                            dailySummary.averageTimePerFeeding = Math.round(totalFeedingLength / todaysFeedings.length);
                        }

                        return callback(null, dailySummary);
                    }
                });
            }
        });
    };

    return dailySummaryFactory;
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