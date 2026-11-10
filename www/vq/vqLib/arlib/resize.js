$(function() {
    resizeWindow();
});

// Fix aspect ratio of the stage
$(window).resize(function () {
    resizeWindow();
});

// Resize the window
function resizeWindow() {
    // Get window width and height
    var w = $(window).width();
    var h = $(window).height();
    // If the aspect ratio is greater than or equal to 4:3, fix height and set width based on height
    if ((w / h) >= 4 / 3) {
        stageHeight = h;
        stageWidth = (4 / 3) * h;
        stageLeft = (w - stageWidth) / 2;
        stageTop = 0;
    }
    // If the aspect ratio is less than 4:3, fix width and set height based on width
    else {
        stageWidth = w;
        stageHeight = (3 / 4) * w;
        stageTop = (h - stageHeight) / 2;
        stageLeft = 0;
    }

    // Set "screen" object width and height to stageWidth and stageHeight, and center screen
    $(".screen").css({
        width: stageWidth + "px",
        height: stageHeight + "px",
        left: stageLeft + "px",
        top: stageTop + "px"
    });

    // Resize corner border radii based on stage height
    var cornerSize = .015 * stageHeight;
    $(".rounded").css({
        '-webkit-border-radius': cornerSize + "px",
        '-moz-border-radius': cornerSize + "px",
        'border-radius': cornerSize + "px"
    });

    var cornerSize2 = .05 * stageHeight;
    $(".roundedRight").css({
        '-webkit-border-top-right-radius': cornerSize2 + "px",
        '-webkit-border-bottom-right-radius': cornerSize2 + "px",
        '-moz-border-radius-topright': cornerSize2 + "px",
        '-moz-border-radius-bottomright': cornerSize2 + "px",
        'border-top-right-radius': cornerSize2 + "px",
        'border-bottom-right-radius': cornerSize2 + "px"
    });

    // Resize text based on stage height
    // To give a class a certain font size, assign it the class "fs-X" where X is an integer between 1 and 1000. 1000 is the height of the screen.
    // New font resize loop
    for (var i = 1; i <= 1000; i++) {
        var s = stageHeight * (i / 1000);
        var c = ".fs-" + i;
        $(c).css({
            'font-size': s + "px"
        });
    }

    // Resize the stripes
    var stripeSize = stageHeight * .05;
    var str = stripeSize + "% " + stripeSize + "%"
    $(".stripes").css({
        'background-size': stripeSize
    });
    
    $("body").css("opacity", 1);
}
