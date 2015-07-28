// NOTE: Bootstrap has been modified to have the @grid-float-breakpoint value be 1200px - if that is changed, change this as well
var bootstrap_grid_float_breakpoint_pixel_value = 1200;

var newFeedingRecordSaveButtonId = '#saveNewFeedingRecordButtonId';
var boobTrackingInfoMessageId = '#boobTrackingInfoMsgId';

var actionsSectionLinkId = '#actionsSectionLink';
var diapersSectionLinkId = '#diapersSectionLink';
var feedingsSectionLinkId = '#feedingsSectionLink';

// left boob element id's
var leftBoobButtonId = '#leftBoobTrackingButton';
var leftBoobLengthInputId = '#leftBoobLengthInput';
var leftBoobStartTimeInputId = '#leftBoobStartTimeInput';

// left boob calculations
var currentlyTrackingLeft = false;
var leftTrackingStartTime = null;
var leftTrackingLengthMinutes = null;

// right boob element id's
var rightBoobButtonId = '#rightBoobTrackingButton';
var rightBoobLengthInputId = '#rightBoobLengthInput';
var rightBoobStartTimeInputId = '#rightBoobStartTimeInput';

// right boob calculations
var currentlyTrackingRight = false;
var rightTrackingStartTime = null;
var rightTrackingLengthMinutes = null;


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

    $(leftBoobButtonId).click(function() {
        if (currentlyTrackingLeft) {
            // we are already tracking and need to stop
            var now = new Date();
            leftTrackingLengthMinutes = (now - leftTrackingStartTime) / 1000 / 60;
            if (leftTrackingLengthMinutes < 1) {
                leftTrackingLengthMinutes = 1;
            }

            $(leftBoobLengthInputId).val(leftTrackingLengthMinutes);

            $(boobTrackingInfoMessageId).text('');
            $(leftBoobButtonId).prop('disabled', false);
            $(rightBoobButtonId).prop('disabled', false);
            $(newFeedingRecordSaveButtonId).prop('disabled', false);
            $(leftBoobButtonId).text('Start Left Boob Tracking');
            currentlyTrackingLeft = false;
        }
        else {
            // we need to start tracking
            currentlyTrackingLeft = true;
            $(boobTrackingInfoMessageId).text('- Currently timing left boob');
            leftTrackingStartTime = new Date();
            $(leftBoobStartTimeInputId).val(new Date(leftTrackingStartTime.getTime()-leftTrackingStartTime.getTimezoneOffset()*60000).toISOString().substring(0,19));

            $(leftBoobButtonId).text('Stop Left Boob Tracking');
            $(rightBoobButtonId).prop('disabled', true);
            $(newFeedingRecordSaveButtonId).prop('disabled', true);
        }
    });

    $(rightBoobButtonId).click(function() {
        if (currentlyTrackingRight) {
            // we are already tracking and need to stop
            var now = new Date();
            rightTrackingLengthMinutes = (now - rightTrackingStartTime) / 1000 / 60;
            if (rightTrackingLengthMinutes < 1) {
                rightTrackingLengthMinutes = 1;
            }

            $(rightBoobLengthInputId).val(rightTrackingLengthMinutes);

            $(boobTrackingInfoMessageId).text('');
            $(leftBoobButtonId).prop('disabled', false);
            $(rightBoobButtonId).prop('disabled', false);
            $(newFeedingRecordSaveButtonId).prop('disabled', false);
            $(rightBoobButtonId).text('Start Right Boob Tracking');
            currentlyTrackingRight = false;
        }
        else {
            // we need to start tracking
            currentlyTrackingRight = true;
            $(boobTrackingInfoMessageId).text('- Currently timing right boob');
            rightTrackingStartTime = new Date();
            $(rightBoobStartTimeInputId).val(new Date(rightTrackingStartTime.getTime()-rightTrackingStartTime.getTimezoneOffset()*60000).toISOString().substring(0,19));

            $(rightBoobButtonId).text('Stop Right Boob Tracking');
            $(leftBoobButtonId).prop('disabled', true);
            $(newFeedingRecordSaveButtonId).prop('disabled', true);
        }
    });
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