var babyTrackerDirectives = angular.module('babytracker.directives', []);

babyTrackerDirectives.directive('scriptLoader', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var pageName = attrs.pagename;
            switch (pageName) {
                case 'home':
                {
                    initializeOnControllerLoad(actionsSectionLinkId, false);
                    break;
                }

                case 'actions':
                {
                    initializeOnControllerLoad(actionsSectionLinkId, false);
                    break;
                }

                case 'diapers':
                {
                    initializeOnControllerLoad(diapersSectionLinkId, false);
                    scope.loadDiaperDetails();
                    break;
                }

                case 'feedings':
                {
                    initializeOnControllerLoad(feedingsSectionLinkId, false);
                    scope.loadFeedingDetails();
                    break;
                }

                case 'addFeedingRecord':
                {
                    initializeOnControllerLoad(feedingsSectionLinkId, true);
                    break;
                }

                case 'modifyFeedingRecord':
                {
                    initializeOnControllerLoad(feedingsSectionLinkId, false);
                    break;
                }

                default:
                {
                    initializeOnControllerLoad(actionsSectionLinkId, false);
                    break;
                }
            }
        }
    };
});

babyTrackerDirectives.directive('toastrWatcher', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            scope.$watch('userMessage', function(newValue, oldValue) {
                if (!isNullOrUndefined(newValue) && !isNullOrUndefined(newValue.message)) {
                    if (newValue.type === 'success') {
                        toastr.success(newValue.message, newValue.title);

                        if (newValue.nextState !== 'NONE' && !isNullOrUndefined(scope) && !isNullOrUndefined(scope.$state)) {
                            scope.$state.go(newValue.nextState);
                        }
                    }
                    else {
                        toastr.error(newValue.message, newValue.title);
                    }
                }
            });
        }
    };
});