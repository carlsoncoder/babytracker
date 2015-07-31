var babyTrackerControllers = angular.module('babytracker.controllers', []);

babyTrackerControllers.controller('BabyController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    'diapers',
    'feedings',
    'dailysummary',
    'auth',
    function($scope, $rootScope, $state, $stateParams, diapers, feedings, dailysummary, auth) {
        $scope.$state = $state;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.isRecordEdit = false;
        $scope.errorMessage = '';
        $scope.userMessage = {};
        $scope.allDiaperRecords = [];
        $scope.allFeedingRecords = [];
        $scope.lastUsedBoob = '';

        $scope.showDateChanger = false;
        $scope.dateToChange = new Date();

        $scope.poopColors = ['Black', 'Green', 'Brown', 'Yellow'];
        $scope.poopConsistencies = ['Thick', 'Solid', 'Watery', 'Seedy'];
        $scope.selectedPoopColor = '';
        $scope.selectedPoopConsistency = '';

        $scope.currentDiaper = {};
        $scope.currentDiaper.affectedDateTime = new Date();

        $scope.currentFeeding = {};

        $scope.dailySummary = {};

        if ($stateParams.diaperId) {
            $scope.isRecordEdit = true;
            diapers.loadAll(function(status, err, diapers) {
                if (!status) {
                    $scope.userMessage = { type: 'error', title: 'Diaper Records', message: 'Error loading diaper records: ' + err, nextState: 'NONE'};
                }
                else {
                    for (var i = 0; i < diapers.length; i++) {
                        if (diapers[i]._id === $stateParams.diaperId) {
                            $scope.currentDiaper = diapers[i];
                            $scope.currentDiaper.affectedDateTime = new Date($scope.currentDiaper.affectedDateTime);

                            $scope.selectedPoopColor = $scope.currentDiaper.color;
                            $scope.selectedPoopConsistency = $scope.currentDiaper.consistency;
                            break;
                        }
                    }
                }
            });
        }

        if ($stateParams.feedingId) {
            $scope.isRecordEdit = true;
            feedings.loadAll(function(status, err, feedings) {
                if (!status) {
                    $scope.userMessage = { type: 'error', title: 'Feeding Records', message: 'Error loading feeding records: ' + err, nextState: 'NONE'};
                }
                else {
                    for (var i = 0; i < feedings.data.length; i++) {
                        if (feedings.data[i]._id === $stateParams.feedingId) {
                            $scope.currentFeeding = feedings.data[i];

                            if (!isNullOrUndefined($scope.currentFeeding.startDateLeft)) {
                                $scope.currentFeeding.startDateLeft = new Date($scope.currentFeeding.startDateLeft);
                            }

                            if (!isNullOrUndefined($scope.currentFeeding.startDateRight)) {
                                $scope.currentFeeding.startDateRight = new Date($scope.currentFeeding.startDateRight);
                            }

                            break;
                        }
                    }
                }
            });
        }

        $scope.enableShowDateChanger = function() {
            $scope.showDateChanger = true;
        };

        $scope.loadDiaperDetails = function() {
            diapers.loadAll(function(status, err, diapers) {
                if (!status) {
                    $scope.userMessage = { type: 'error', title: 'Diaper Records', message: 'Error loading diaper records: ' + err, nextState: 'NONE'};
                }
                else {
                    $scope.allDiaperRecords = diapers;
                }
            });
        };

        $scope.loadFeedingDetails = function() {
            feedings.loadAll(function(status, err, feedings) {
                if (!status) {
                    $scope.userMessage = { type: 'error', title: 'Feeding Records', message: 'Error loading feeding records: ' + err, nextState: 'NONE'};
                }
                else {
                    $scope.allFeedingRecords = feedings.data;
                    $scope.lastUsedBoob = feedings.lastUsedBoob;
                }
            });
        };

        $scope.changeDate = function() {
            if (isNullOrUndefined($scope.dateToChange) || $scope.dateToChange === '') {
                $scope.errorMessage = 'You must enter a valid date';
                return;
            }

            $scope.buildDailySummary($scope.dateToChange);
            $scope.showDateChanger = false;
            $scope.errorMessage = '';
        };

        $scope.buildDailySummary = function(dateToLoad) {
            dailysummary.loadDailySummary(dateToLoad, function(err, dailySummary) {
                if (err) {
                    $scope.errorMessage = 'Error loading daily summary: ' + err;
                }
                else {
                    $scope.dailySummary = dailySummary;
                }
            });
        };

        $scope.saveManualFeedingRecord = function() {
            var isLeftDefined = (!isNullOrUndefined($scope.currentFeeding.startDateLeft) && $scope.currentFeeding.startDateLeft !== '') && (!isNullOrUndefined($scope.currentFeeding.lengthInMinutesLeft) && $scope.currentFeeding.lengthInMinutesLeft !== '');
            var isRightDefined = (!isNullOrUndefined($scope.currentFeeding.startDateRight) && $scope.currentFeeding.startDateRight !== '') && (!isNullOrUndefined($scope.currentFeeding.lengthInMinutesRight) && $scope.currentFeeding.lengthInMinutesRight !== '');

            if (!isLeftDefined && !isRightDefined) {
                $scope.errorMessage = 'Either the right, left, or both boobs must have a valid start time and length';
                return;
            }

            if (isLeftDefined) {
                if (!isNumeric($scope.currentFeeding.lengthInMinutesLeft)) {
                    $scope.errorMessage = "Please enter a valid numeric value for the left length in minutes";
                    return;
                }

                $scope.currentFeeding.lengthInMinutesLeft = Math.round($scope.currentFeeding.lengthInMinutesLeft);
            }
            else {
                $scope.currentFeeding.lengthInMinutesLeft = null;
                $scope.currentFeeding.startDateLeft = null;
            }

            if (isRightDefined) {
                if (!isNumeric($scope.currentFeeding.lengthInMinutesRight)) {
                    $scope.errorMessage = "Please enter a valid numeric value for the right length in minutes";
                    return;
                }

                $scope.currentFeeding.lengthInMinutesRight = Math.round($scope.currentFeeding.lengthInMinutesRight);
            }
            else {
                $scope.currentFeeding.lengthInMinutesRight = null;
                $scope.currentFeeding.startDateRight = null;
            }

            if (!isNullOrUndefined($scope.currentFeeding.comment) && $scope.currentFeeding.comment !== '') {
                if ($scope.currentFeeding.comment.length > 256) {
                    $scope.errorMessage = 'The maximum comment length is 256.  Please enter a shorter comment';
                    return;
                }
            }

            feedings.save($scope.currentFeeding, function(status, msg) {
                if (status === true) {
                    $scope.userMessage = { type: 'success', title: 'Feeding Record', message: 'Feeding Record Saved!', nextState: 'viewfeedings'};
                }
                else {
                    $scope.errorMessage = 'Error saving feeding: ' + msg;
                }
            });
        };

        $scope.saveFeedingRecord = function() {
            $(newFeedingRecordSaveButtonId).prop('disabled', true);

            $scope.currentFeeding.startDateLeft = leftTrackingStartTime;
            $scope.currentFeeding.lengthInMinutesLeft = leftTrackingLengthMinutes;
            $scope.currentFeeding.startDateRight = rightTrackingStartTime;
            $scope.currentFeeding.lengthInMinutesRight = rightTrackingLengthMinutes;

            if (leftBoobTimer) {
                clearInterval(leftBoobTimer);
            }

            if (rightBoobTimer) {
                clearInterval(rightBoobTimer);
            }

            var isLeftDefined = (!isNullOrUndefined($scope.currentFeeding.startDateLeft) && $scope.currentFeeding.startDateLeft !== '') && (!isNullOrUndefined($scope.currentFeeding.lengthInMinutesLeft) && $scope.currentFeeding.lengthInMinutesLeft !== '');
            var isRightDefined = (!isNullOrUndefined($scope.currentFeeding.startDateRight) && $scope.currentFeeding.startDateRight !== '') && (!isNullOrUndefined($scope.currentFeeding.lengthInMinutesRight) && $scope.currentFeeding.lengthInMinutesRight !== '');

            if (!isLeftDefined && !isRightDefined) {
                $scope.errorMessage = 'Either the right, left, or both boobs must have a valid start time and length';
                $(newFeedingRecordSaveButtonId).prop('disabled', false);
                return;
            }

            if (!isNullOrUndefined($scope.currentFeeding.comment) && $scope.currentFeeding.comment !== '') {
                if ($scope.currentFeeding.comment.length > 256) {
                    $scope.errorMessage = 'The maximum comment length is 256.  Please enter a shorter comment';
                    $(newFeedingRecordSaveButtonId).prop('disabled', false);
                    return;
                }
            }

            feedings.save($scope.currentFeeding, function(status, msg) {
                if (status === true) {
                    $scope.userMessage = { type: 'success', title: 'Feeding Record', message: 'Feeding Record Saved!', nextState: 'viewfeedings'};
                }
                else {
                    $scope.errorMessage = 'Error saving feeding: ' + msg;
                    $(newFeedingRecordSaveButtonId).prop('disabled', false);
                }
            });
        };

        $scope.deleteFeedingRecord = function(feedingId) {
            var prompt = confirm("Are you sure you want delete this feeding record?");
            if (prompt === true) {
                feedings.delete(feedingId, function (status, msg) {
                    if (status === true) {
                        $scope.userMessage = { type: 'success', title: 'Feeding History', message: 'Feeding successfully deleted!', nextState: 'NONE'};
                        updateDeletedFeedingRecord(feedingId);
                    }
                    else {
                        $scope.errorMessage = 'Error deleting feeding: ' + msg;
                    }

                });
            }
        };

        $scope.saveDiaperRecord = function() {
            if (isNullOrUndefined($scope.currentDiaper.affectedDateTime) || $scope.currentDiaper.affectedDateTime === '') {
                $scope.errorMessage = 'A datetime is required for this diaper entry';
                return;
            }

            if (isNullOrUndefined($scope.currentDiaper.isWet)) {
                $scope.currentDiaper.isWet = false;
            }

            if (isNullOrUndefined($scope.currentDiaper.isDirty)) {
                $scope.currentDiaper.isDirty = false;
            }

            if (!$scope.currentDiaper.isWet && !$scope.currentDiaper.isDirty) {
                $scope.errorMessage = 'The diaper must be dirty, wet, or both';
                return;
            }

            if ($scope.currentDiaper.isDirty) {
                $scope.currentDiaper.color = $scope.selectedPoopColor;
                $scope.currentDiaper.consistency = $scope.selectedPoopConsistency;

                if (isNullOrUndefined($scope.currentDiaper.color) || $scope.currentDiaper.color === '') {
                    $scope.errorMessage = 'You must define a color for a dirty diaper';
                    return;
                }
                else if (isNullOrUndefined($scope.currentDiaper.consistency) || $scope.currentDiaper.consistency === '') {
                    $scope.errorMessage = 'You must define a consistency for a dirty diaper';
                    return;
                }
            }
            else {
                $scope.currentDiaper.color = '';
                $scope.currentDiaper.consistency = '';
            }

            if (!isNullOrUndefined($scope.currentDiaper.comment) && $scope.currentDiaper.comment !== '') {
                if ($scope.currentDiaper.comment.length > 256) {
                    $scope.errorMessage = 'The maximum comment length is 256.  Please enter a shorter comment';
                    return;
                }
            }

            diapers.save($scope.currentDiaper, function(status, msg) {
                if (status === true) {
                    $scope.userMessage = { type: 'success', title: 'Diaper Record', message: 'Diaper Record Saved!', nextState: 'viewdiapers'};
                }
                else {
                    $scope.errorMessage = 'Error saving diaper: ' + msg;
                }
            });
        };

        $scope.deleteDiaperRecord = function(diaperId) {
            var prompt = confirm("Are you sure you want delete this diaper record?");
            if (prompt === true) {
                diapers.delete(diaperId, function (status, msg) {
                    if (status === true) {
                        $scope.userMessage = { type: 'success', title: 'Diaper History', message: 'Diaper successfully deleted!', nextState: 'NONE'};
                        updateDeletedDiaperRecord(diaperId);
                    }
                    else {
                        $scope.errorMessage = 'Error deleting diaper: ' + msg;
                    }

                });
            }
        };

        function updateDeletedDiaperRecord(deletedDiaperId) {
            var newDiaperRecords = [];
            for (var i = 0; i < $scope.allDiaperRecords.length; i++) {
                if ($scope.allDiaperRecords[i]._id !== deletedDiaperId) {
                    newDiaperRecords.push($scope.allDiaperRecords[i]);
                }
            }

            $scope.allDiaperRecords = newDiaperRecords;
        }

        function updateDeletedFeedingRecord(deletedFeedingId) {
            var newFeedingRecords = [];
            for (var i = 0; i < $scope.allFeedingRecords.length; i++) {
                if ($scope.allFeedingRecords[i]._id !== deletedFeedingId) {
                    newFeedingRecords.push($scope.allFeedingRecords[i]);
                }
            }

            $scope.allFeedingRecords = newFeedingRecords;
        }
}]);

babyTrackerControllers.controller('NavigationController', [
    '$scope',
    '$state',
    'auth',
    function($scope, $state, auth) {
        $scope.user = {};
        $scope.errorMessage = '';

        $scope.$state = $state;
        $scope.userMessage = {};

        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;

        $scope.user = {};

        $scope.logIn = function() {
            if (isNullOrUndefined($scope.user.username) || $scope.user.username === '') {
                $scope.errorMessage = 'Please enter your user name';
                return;
            }

            if (isNullOrUndefined($scope.user.password) || $scope.user.password === '') {
                $scope.errorMessage = 'Please enter your password';
                return;
            }

            auth.logIn($scope.user, function(status, message) {
                if (!status) {
                    $scope.errorMessage = message;
                    $scope.user.password = '';
                }
                else {
                    $state.go('home');
                }
            });
        };

        $scope.logOut = function() {
            auth.logOut();
            $state.go('login');
        };

        $scope.changePassword = function() {
            if (isNullOrUndefined($scope.oldPassword) || $scope.oldPassword === '') {
                $scope.errorMessage = 'You must enter the old password';
                return;
            }

            if (isNullOrUndefined($scope.newPassword) || $scope.newPassword === '') {
                $scope.errorMessage = 'You must enter a new password';
                return;
            }

            if (isNullOrUndefined($scope.newPasswordConfirm) || $scope.newPasswordConfirm === '') {
                $scope.errorMessage = 'You must confirm your new password';
                return;
            }

            if ($scope.newPassword !== $scope.newPasswordConfirm) {
                $scope.errorMessage = 'Your new passwords do not match - please re-enter';
                return;
            }

            auth.changePassword($scope.oldPassword, $scope.newPassword, function(status, message) {
                if (!status) {
                    $scope.errorMessage = message;
                }
                else {
                    $scope.userMessage = { type: 'success', title: 'Login Information', message: 'Password successfully changed!', nextState: 'home'};
                }
            });
        };
    }
]);