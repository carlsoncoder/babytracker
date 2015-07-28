var babyTrackerFilters = angular.module('babytracker.filters', []);

babyTrackerFilters.filter('filter_diaper_type', function() {
    return function(input, selectedFilterOption) {
        if (selectedFilterOption === 'ALL') {
            return true;
        }

        if (selectedFilterOption === 'WET' && input.isWet) {
            return true;
        }

        if (selectedFilterOption === 'DIRTY' && input.isDirty) {
            return true;
        }

        return false;
    };
});

babyTrackerFilters.filter('checkmark', function() {
    return function(input) {
        return input ? '\u2713' : '';
    };
});