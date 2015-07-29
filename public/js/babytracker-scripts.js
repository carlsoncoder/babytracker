// NOTE: Bootstrap has been modified to have the @grid-float-breakpoint value be 1200px - if that is changed, change this as well
var bootstrap_grid_float_breakpoint_pixel_value = 1200;

var newFeedingRecordSaveButtonId = '#saveNewFeedingRecordButtonId';

var actionsSectionLinkId = '#actionsSectionLink';
var diapersSectionLinkId = '#diapersSectionLink';
var feedingsSectionLinkId = '#feedingsSectionLink';

// left boob element id's
var leftBoobButtonId = '#leftBoobTrackingButton';
var leftBoobLengthInputId = '#leftBoobLengthInput';
var leftBoobStartTimeInputId = '#leftBoobStartTimeInput';
var leftBoobTimerTextId = '#leftBoobTimerTextId';

// left boob calculations
var currentlyTrackingLeft = false;
var leftTrackingStartTime = null;
var leftTrackingLengthMinutes = null;

// right boob element id's
var rightBoobButtonId = '#rightBoobTrackingButton';
var rightBoobLengthInputId = '#rightBoobLengthInput';
var rightBoobStartTimeInputId = '#rightBoobStartTimeInput';
var rightBoobTimerTextId = '#rightBoobTimerTextId';

// right boob calculations
var currentlyTrackingRight = false;
var rightTrackingStartTime = null;
var rightTrackingLengthMinutes = null;

// stopwatch timers
var rightBoobTimer;
var leftBoobTimer;

/// <summary>
/// Handles JavaScript code that must run when a given Angular controller is initialized.
/// </summary>
/// <param name="sectionLinkID">The ID of the main section of the application we have loaded.</param>
/// <param name="initTimers">Whether or not timers should be initialized.</param>
function initializeOnControllerLoad(sectionLinkID, initTimers) {
    // set the active menu item in the navbar
    $('.sectionLink').removeClass('active');
    $(sectionLinkID).addClass('active');

    // we need to scroll to the top when a user navigates to a new page
    $("html, body").animate({ scrollTop: 0 }, "slow");

    if (initTimers) {
        initializeBoobTracking();
    }
}

/// <summary>
/// Initializes all local variables for boob tracking and timing.
/// </summary>
function initializeBoobTracking() {
    currentlyTrackingLeft = false;
    currentlyTrackingRight = false;
    leftTrackingStartTime = null;
    rightTrackingStartTime = null;
    leftTrackingLengthMinutes = null;
    rightTrackingLengthMinutes = null;

    if (leftBoobTimer) {
        clearInterval(leftBoobTimer);
    }

    if (rightBoobTimer) {
        clearInterval(rightBoobTimer);
    }

    $(leftBoobButtonId).click(function() {
        if (currentlyTrackingLeft) {
            // we are already tracking and need to stop
            var now = new Date();
            leftTrackingLengthMinutes = Math.round((now - leftTrackingStartTime) / 1000 / 60);
            if (leftTrackingLengthMinutes < 1) {
                leftTrackingLengthMinutes = 1;
            }

            $(leftBoobLengthInputId).val(leftTrackingLengthMinutes);

            $(leftBoobButtonId).prop('disabled', false);
            $(rightBoobButtonId).prop('disabled', false);
            $(rightBoobButtonId).removeClass('boobTrackingButtonDisabled');
            $(newFeedingRecordSaveButtonId).prop('disabled', false);
            $(newFeedingRecordSaveButtonId).removeClass('boobTrackingButtonDisabled');
            $(leftBoobButtonId).text('Start Left Boob Tracking');
            $(leftBoobButtonId).removeClass('boobTrackingButtonActive');
            $(leftBoobButtonId).trigger('blur');
            currentlyTrackingLeft = false;

            if (leftBoobTimer) {
                clearInterval(leftBoobTimer);
            }

            $(leftBoobTimerTextId).text('');
        }
        else {
            if (!isNullOrUndefined(leftTrackingLengthMinutes) && leftTrackingLengthMinutes !== '') {
                var prompt = confirm("You already have data stored for this boob.  If you continue, you will overwrite the present information.  Do you want to continue?");
                if (prompt !== true) {
                    return;
                }
            }

            // we need to start tracking
            currentlyTrackingLeft = true;
            leftTrackingStartTime = new Date();
            $(leftBoobStartTimeInputId).val(new Date(leftTrackingStartTime.getTime()-leftTrackingStartTime.getTimezoneOffset()*60000).toISOString().substring(0,19));

            $(leftBoobButtonId).text('Stop Left Boob Tracking');
            $(leftBoobButtonId).addClass('boobTrackingButtonActive');
            $(leftBoobButtonId).trigger('blur');

            $(rightBoobButtonId).prop('disabled', true);
            $(rightBoobButtonId).addClass('boobTrackingButtonDisabled');
            $(newFeedingRecordSaveButtonId).prop('disabled', true);
            $(newFeedingRecordSaveButtonId).addClass('boobTrackingButtonDisabled');

            if (leftBoobTimer) {
                clearInterval(leftBoobTimer);
            }

            leftBoobTimer = setInterval(function() {boobTimerTracker(leftTrackingStartTime, leftBoobTimerTextId);}, 1000);
        }
    });

    $(rightBoobButtonId).click(function() {
        if (currentlyTrackingRight) {
            // we are already tracking and need to stop
            var now = new Date();
            rightTrackingLengthMinutes = Math.round((now - rightTrackingStartTime) / 1000 / 60);
            if (rightTrackingLengthMinutes < 1) {
                rightTrackingLengthMinutes = 1;
            }

            $(rightBoobLengthInputId).val(rightTrackingLengthMinutes);

            $(leftBoobButtonId).prop('disabled', false);
            $(leftBoobButtonId).removeClass('boobTrackingButtonDisabled');
            $(rightBoobButtonId).prop('disabled', false);
            $(newFeedingRecordSaveButtonId).prop('disabled', false);
            $(newFeedingRecordSaveButtonId).removeClass('boobTrackingButtonDisabled');
            $(rightBoobButtonId).text('Start Right Boob Tracking');
            $(rightBoobButtonId).removeClass('boobTrackingButtonActive');
            $(rightBoobButtonId).trigger('blur');
            currentlyTrackingRight = false;

            if (rightBoobTimer) {
                clearInterval(rightBoobTimer);
            }

            $(rightBoobTimerTextId).text('');
        }
        else {
            if (!isNullOrUndefined(rightTrackingLengthMinutes) && rightTrackingLengthMinutes !== '') {
                var prompt = confirm("You already have data stored for this boob.  If you continue, you will overwrite the present information.  Do you want to continue?");
                if (prompt !== true) {
                    return;
                }
            }

            // we need to start tracking
            currentlyTrackingRight = true;
            rightTrackingStartTime = new Date();
            $(rightBoobStartTimeInputId).val(new Date(rightTrackingStartTime.getTime()-rightTrackingStartTime.getTimezoneOffset()*60000).toISOString().substring(0,19));

            $(rightBoobButtonId).text('Stop Right Boob Tracking');
            $(rightBoobButtonId).addClass('boobTrackingButtonActive');
            $(rightBoobButtonId).trigger('blur');

            $(leftBoobButtonId).prop('disabled', true);
            $(leftBoobButtonId).addClass('boobTrackingButtonDisabled');
            $(newFeedingRecordSaveButtonId).prop('disabled', true);
            $(newFeedingRecordSaveButtonId).addClass('boobTrackingButtonDisabled');

            if (rightBoobTimer) {
                clearInterval(rightBoobTimer);
            }

            rightBoobTimer = setInterval(function() {boobTimerTracker(rightTrackingStartTime, rightBoobTimerTextId);}, 1000);
        }
    });
}

function boobTimerTracker(startTime, timerTextId) {
    var now = new Date();
    var totalSeconds = Math.round((now - startTime) / 1000);

    var minutes = 0;
    var seconds = totalSeconds;

    if (totalSeconds > 59) {
        minutes = Math.floor(totalSeconds / 60);
        seconds = (totalSeconds - (minutes * 60));
    }

    if (minutes.toString().length == 1) {
        minutes = '0' + minutes.toString();
    }

    if (seconds.toString().length == 1) {
        seconds = '0' + seconds.toString();
    }

    $(timerTextId).text(minutes + ':' + seconds);
}

/// <summary>
/// Determines the available viewport width.
/// </summary>
/// <returns>The available width of the viewport.</returns>
function getViewPortWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

/// <summary>
/// Determines if the object value is null or undefined.
/// </summary>
/// <param name="obj">The object to be evaluated.</param>
/// <returns>True if the object is null or undefined, otherwise false.</returns>
function isNullOrUndefined(obj) {
    return typeof (obj) === 'undefined' || obj === null;
}

/// <summary>
/// Determines if we are in a mobile viewport.
/// </summary>
/// <returns>True if the viewport is 'mobile' width, otherwise false.</returns>
function isMobileViewPort() {
    var viewportWidth = getViewPortWidth();
    return viewportWidth < bootstrap_grid_float_breakpoint_pixel_value;
}