// Editor shortcut to bypass video upload for testing
var editorShortcut = false;

var questions = [];
var currentQuestion = -1;
var scrubbing = false;
var jsonPath = "";
var videoPath = "";
var quizLink = "";
var showingSaveButton = false;

var showingMenu = true;
var showingEditor = false;
var showingHeaderBar = false;
var showingProgress = false;
var showingWarning = false;
var showingStats = false;
var showingDelete = false;
var showingFeedback = false;
var showingScoreReport = false;
var showingPermissions = false;
var showingShare = false;
var showingFolder = false;

var graphData = [1, 2, 5, 3, 4];
var numViewers = 1;

var scrollbarDrag = false;
var scrollbarPos = 0;
var scrollbarHeight = 100;
var lastY = 0;

var confirmDeleteLevel = 0;

var filters = {
    "filterList": []
}

var shareCheckboxes = [];
var enablePublicMode = false;
var enablePrivateMode = false;
var currentQuizEditor = "";
var currentQuizEditCode = "";
var currentQuizAuthor = "";
var currentQuizCode = "";

// Read only editor for statistics mode
var readOnly = false;

var draggingMarker = {
    "on": false
}

var userData = {
    "netID": "japalmeri",
    "firstname": "",
    "dirs": [],
    "quizData": [],
    "folders": []
};

var currentQuiz = -1;

var quizData = {};

var folders = [];
var folderSelected = {
    "type": "",
    "id": -1
};

// Fun stuff
var funFacts = ["Fun Fact: Did you know that the developers of this application love mint candy?", "Fun Fact: It's three o'clock.", "Fun Fact: You can view stats for your videos in the Statistics menu."];

var isDev = false;

$(function () {
    resizeWindow();
    checkDev();
    userLogin();
$(document).keydown(function(e) {
//var keys=["ArrowLeft","Null","ArrowRighti"]
    if(e.which==37 || e.which==39)
{
video = $("#videoBox")[0];

var codeDelta= (e.which)-38;
var timeDelta=codeDelta*video.duration/1000;
//console.log(codeDelta,video.currentTime,video.duration,timeDelta)
if(video) video.currentTime+=timeDelta;
seekTimeUpdate();
}
});
    // When the user clicks on <span> (x), close the modal
    $("#closeButton").on("click",function() {
      $("#myModal").css("display","none");
    });

setInterval(()=>{
$.get('img/arrow_down.svg',()=>{})}
,180000);

});

function userLogin() {
    $.ajax({
        url: "login.php",
        dataType: "json"
    }).done(function (data) {
        userData = data;
        loadUserData();
        continueLoading();
    }).fail(function () {
        editorShortcut = true;
        //userData = testUserData;
        loadUserData();
        continueLoading();
    });
}

function checkDev() {
    if (window.location.href.indexOf("/vqdev/") !== -1) {
        $("#version").append(" (dev)");
        $("title").text("IVQ Dev");
        isDev = true;
    }
}

function refreshUserData(callback) {
    $.ajax({
        url: "login.php",
        dataType: "json"
    }).done(function (data) {
        userData = data;
        callback();
    }).fail(function () {

    });
}

function loadUserData() {
    $("#welcomeText").text("Hi, " + userData.firstname + "!");
    $(".quizSelect").empty();
    $("#loadQuiz").append('<option value="-1">Select a quiz:</option>');
    $("#quizStatsSelect").append('<option value="-1">Total Stats</option>');
    $("#deleteDropdown").append('<option value="-1">Select a quiz:</option>');
    var quizzes = userData.quizData;
    userData.quizData = userData.quizData.sort(function (q1, q2) {
        if (q1.owner != q2.owner) {
            if (q1.owner == userData.netID) {
                return -1;
            } else if (q2.owner == userData.netID) {
                return 1;
            } else {
                return (q1 < q2 ? -1 : 1);
            }
        }
        var id1 = betterParseInt(q1.relativePath.split("/")[2]);
        var id2 = betterParseInt(q2.relativePath.split("/")[2]);
        return id1 - id2;
    });
    let ivqID;
    for (var i = 0; i < quizzes.length; i++) {
        
	ivqID=i 
	if (userData.quizData && userData.quizData[i].isOwner) {
	   //ivqID=userData.quizData[i].relativePath.split("/").reverse()[0] 
            $("#loadQuiz").append('<option value="' + ivqID + '">' + userData.quizData[i].title + '</option>');
            $("#deleteDropdown").append('<option value="' + ivqID + '">' + userData.quizData[i].title + '</option>');
        }
        $("#quizStatsSelect").append('<option value="' + ivqID + '">' + userData.quizData[i].title + '</option>');
    }
    // Create a small box for each video quiz
    $("#quizInfoPanel").empty();
    $("#shareQuizSelect").empty(); //
    for (var i = 0; i < quizzes.length; i++) {
        var quiz = userData.quizData[i];
        // Create box
        $("#quizInfoPanel").append('<div id="quizInfoBox' + i + '" class="quizInfoBox"></div>');
        // Title
        $("#quizInfoBox" + i).append('<div id="quizInfoTitle' + i + '" class="quizInfoTitle text fs-35"></div>');
        // View count
        $("#quizInfoBox" + i).append('<div id="quizInfoViews' + i + '" class="quizInfoViews text fs-25"></div>');
        // Time watched
        $("#quizInfoBox" + i).append('<div id="quizInfoTime' + i + '" class="quizInfoTime text fs-25"></div>');
        // Questions answered
        $("#quizInfoBox" + i).append('<div id="quizInfoAnswers' + i + '" class="quizInfoAnswers text fs-25"></div>');
        // Quiz owner (if shared by another user).
        $("#quizInfoBox" + i).append('<div id="quizInfoOwner' + i + '" class="quizInfoOwner text fs-18"></div>');
        // Position box
        $("#quizInfoBox" + i).css({
            'top': (12.5 * i) + "%"
        });
        if (!userData.quizData[i].isOwner) {
            // TODO: Indicate that the current user is not the owner
        }
        // Add event listener for click (should open that quiz's statistics)
        initQuizInfoBoxClick(i);
        // Add checkboxes for batch sharing
        if (quiz.isOwner) {
            $("#shareQuizSelect").append('<div id="shareItem' + i + '" class="shareItem"></div>');
            $("#shareItem" + i).append('<div id="shareCheckbox' + i + '" class="shareCheckbox btn"></div>');
            $("#shareItem" + i).append('<div id="shareText' + i + '" class="shareText text fs-27"></div>');
            $("#shareItem" + i).css("top", (2.5 + 7.5 * i) + "%");
            $("#shareText" + i).text(quiz.title);
            initShareBoxClick(i);
        }
    }
    // Get number of quizzes
    var numQuizzes = userData.quizData.length;
    // Get the sum of the unique views of all the quizzes, total time, and questions answered
    var totalViews = 0;
    var totalTime = 0;
    var totalQuestions = 0;
    for (var i = 0; i < numQuizzes; i++) {
        var quizWatchData = [];
        $("#quizInfoTitle" + i).text(userData.quizData[i].title);
        var viewCount = userData.quizData[i].playerData.length;
        var quizTime = 0;
        var quizAnswers = 0;
        var quizErrorTotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var quizAttemptTotals = [];
        for (var n = 0; n < 20; n++) {
            quizAttemptTotals.push([0, 0, 0, 0]);
        }
        var userCompletionCount = 0;
        var totals = userData.quizData[i].totals;
        if (totals) {
            quizErrorTotals = totals.quizErrorTotals;
            quizAttemptTotals = totals.quizAttemptTotals;
            userCompletionCount = totals.userCompletionCount;
            quizWatchData = totals.quizWatchData;
            for (var j = 0; j < quizWatchData.length; j++) {
                quizTime += quizWatchData[j];
            }
            quizAnswers = userData.quizData[i].questionData.questions.length * userCompletionCount;
            viewCount = totals.views;
        }
        userData.quizData[i].quizErrorTotals = quizErrorTotals;
        userData.quizData[i].quizAttemptTotals = quizAttemptTotals;
        userData.quizData[i].userCompletionCount = userCompletionCount;
        userData.quizData[i].quizWatchData = quizWatchData;
        userData.quizData[i].views = viewCount;
        if (totals) {
            $("#quizInfoViews" + i).text(viewCount + (viewCount == 1 ? " view" : " views"));
            $("#quizInfoTime" + i).text(formatTime(quizTime) + " watched");
            $("#quizInfoAnswers" + i).text(quizAnswers + " answered");
        } else {
            $("#quizInfoViews" + i).text("");
            $("#quizInfoTime" + i).text("");
            $("#quizInfoAnswers" + i).text("");
        }
        var owner = userData.quizData[i].owner;
        if (owner == userData.netID) {
            $("#quizInfoOwner" + i).text("");
        } else {
            $("#quizInfoOwner" + i).text("Shared by " + owner);
        }
        totalViews += viewCount;
        totalTime += quizTime;
        totalQuestions += quizAnswers;
    }
    // Set text fields to display data
    $("#statBoxText1").text(numQuizzes);
    $("#statBoxText2").text(totalViews);
    $("#statBoxText3").text(formatTime(totalTime));
    $("#statBoxText4").text(totalQuestions);
    // Compute level
    var xp = totalTime + 180 * totalQuestions;
    var levels = [];
    var totals = [];
    var total = 0;
    // 5th root of 2; exp to next level doubles every 5 levels
    var growthRate = 1.148698354997035006798626946777927589443850889097797505513;
    for (var i = 0; i < 99; i++) {
        levels[i] = Math.floor(5 * Math.pow(growthRate, i)) * 100;
        total += levels[i];
        totals[i] = total;
    }
    var level = 0;
    while (xp >= totals[level]) {
        level++;
    }
    if (level < 99) {
        var thisLevelEXP = 0;
        if (level > 0) {
            thisLevelEXP = xp - totals[level - 1];
        } else {
            thisLevelEXP = xp;
        }
        // Set text
        $("#userStatsLevelText").text(level + 1);
        $("#userStatsExpText").text(thisLevelEXP + " / " + levels[level] + " EXP");
        $("#userStatsTotalExpText").text("Total: " + xp + " EXP");
        // Adjust EXP bar
        $("#userStatsExpBar").css("width", (thisLevelEXP / levels[level] * 100) + "%");
    } else {
        // Set text
        $("#userStatsLevelText").text("100");
        $("#userStatsExpText").text("Maximum Level Reached");
        $("#userStatsTotalExpText").text("Total: " + xp + " EXP");
        // Adjust EXP bar
        $("#userStatsExpBar").css("width", "100%");
    }
    // Scrollbar
    scrollbarHeight = Math.min(100, (800 / quizzes.length));
    $("#quizInfoScrollBar").css("height", scrollbarHeight + "%");
    // Folders
    folders = [];
    // First, make the folder objects
    for (var i = 0; i < userData.folders.length; i++) {
        var newFolder = {
            "name": userData.folders[i].name,
            "quizzes": [],
            "expand": userData.folders[i].expand === true
        };
        folders.push(newFolder);
    }
    var lastFolder = {
        "name": "Uncategorized",
        "quizzes": [],
        "expand": false
    };
    folders.push(lastFolder);
    // Add quizzes to the correct folders. If a quiz is not in a folder, add it to "uncategorized".
    for (var i = 0; i < userData.quizData.length; i++) {
        var path = userData.quizData[i].relativePath;
        var added = false;
        for (var j = 0; j < userData.folders.length; j++) {
			var dirs = userData.folders[j].quizzes;				//	Tony
        // console.log(path,dirs )
			if (dirs.length && dirs.indexOf(path) != -1) {
                folders[j].quizzes.push(i);
                added = true;
            }
        }
		//console.log(folders[j])
        if (!added) {
            folders[folders.length - 1].quizzes.push(i);
        }
    }
    resizeWindow();
}

function initQuizInfoBoxClick(i) {
    $("#quizInfoBox" + i).click(function () {
        $("#quizStatsSelect").val(i);
        $("#quizStatsSelect").change();
    });
}

function initShareBoxClick(i) {
    shareCheckboxes[i] = false;
    $("#shareItem" + i).click(function () {
        clickCheckbox(i);
    });
}

function clickCheckbox(i) {
    if (shareCheckboxes[i]) {
        shareCheckboxes[i] = false;
        $("#shareCheckbox" + i).removeClass("anim_checkboxOn");
        $("#shareCheckbox" + i).addClass("anim_checkboxOff");
    } else {
        shareCheckboxes[i] = true;
        $("#shareCheckbox" + i).removeClass("anim_checkboxOff");
        $("#shareCheckbox" + i).addClass("anim_checkboxOn");
    }
}

// Initializes the scrollbar events
function initScrollbar() {
    scrollbarDrag = false;
    scrollbarPos = 0;
    // When the mouse is pressed over the scrollbar, start dragging it
    $("#quizInfoScrollBar").mousedown(function (e) {
        scrollbarDrag = true;
        lastY = e.pageY;
    });
    // If dragging, move the scrollbar on mouse move
    $(window).mousemove(function (e) {
        if (scrollbarDrag) {
            var newY = e.pageY;
            var dy = newY - lastY;
            var norm = 100 * (newY - lastY) / $("#quizInfoScroll").height();
            moveScrollbar(norm);
            lastY = newY;
        }
    });
    // Mousewheel to scroll
    $("body").mousewheel(function (e) {
        if (showingStats) {
            if (e.deltaY > 0) {
                moveScrollbar(-3);
            } else if (e.deltaY < 0) {
                moveScrollbar(3);
            }
        }
    })
}

function moveScrollbar(dy) {
    scrollbarPos += dy;
    if (scrollbarPos < 0) {
        scrollbarPos = 0;
    }
    if (scrollbarPos > 100 - scrollbarHeight) {
        scrollbarPos = 100 - scrollbarHeight;
    }
    // Set position of scrollbar
    $("#quizInfoScrollBar").css({
        'top': scrollbarPos + "%"
    });
    // Set positions of info divs
    var numDivs = userData.quizData.length;
    var scroll = 0;
    if (numDivs <= 8) {
        scroll = 0;
    } else {
        var scrollPct = scrollbarPos / (100 - scrollbarHeight);
        var panelHeight = 12.5 * numDivs - 100;
        scroll = panelHeight * scrollPct;
    }
    for (var i = 0; i < numDivs; i++) {
        $("#quizInfoBox" + i).css("top", (12.5 * i - scroll) + "%");
    }
}

function continueLoading() {
    initVideoControls();
    initButtons();
    initScrollbar();
    resizeWindow();
    hideEditorView();
    showMenuView();
    hideLoadingScreen();
    initRouter();
    initPermissionControls();
    initFolderControls();
}

function initVideoControls() {
    // Video controls
    video = $("#videoBox")[0];
    $("#videoPlayPause").click(function () {
        playPause();
    });
    $("#seekSlider").change(function () {
        vidSeek();
    });
    $("#seekSlider").mousedown(function () {
        scrubbing = true;
    });
    $(window).mouseup(function () {
        if (scrubbing) {
            scrubbing = false;
        }
        if (scrollbarDrag) {
            scrollbarDrag = false;
        }
    })
    setInterval(function () {
        if (!scrubbing) {
            seekTimeUpdate();
        }
    }, 30);

    // Question timing controls
    $("#questionTimingSet1").click(function () {
        if (isEditor()) {
            setQuestionTime(currentQuestion, true);
            showSaveButton();
        }
    });
    $("#questionTimingSet2").click(function () {
        if (isEditor()) {
            setQuestionTime(currentQuestion, false);
            showSaveButton();
        }
    });
    $("#questionTimingJump1").click(function () {
        if (isEditor()) {
            if (questions[currentQuestion].startTimeSet) {
                video.currentTime = questions[currentQuestion].startTime;
            }
        }
    });
    $("#questionTimingJump2").click(function () {
        if (isEditor()) {
            if (questions[currentQuestion].wrongTimeSet) {
                video.currentTime = questions[currentQuestion].wrongTime;
            }
        }
    });

}

function initButtons() {
    // Question text input
    $("#questionTextInput").change(function () {
        if (currentQuestion != -1) {
            questions[currentQuestion].questionText = $("#questionTextInput").val();
            showSaveButton();
        }
    });
    // Answer choices
    for (var i = 0; i < 6; i++) {
        initAnswerTextChange(i);
        initAnswerButtonClick(i + 1);
    }
    $("#questionAnswerInput").change(function () {
        questions[currentQuestion].answerText[0] = $("#questionAnswerInput").val();
        showSaveButton();
    });
    // Question number buttons
    for (var i = 0; i < 20; i++) {
        $("#numberButtonPanel").append("<div id='questionButton" + i + "' class='questionButton'></div>");
        $("#questionButton" + i).append("<div id='questionButtonText" + i + "' class='questionButtonText text fs-30'>" + (i + 1) + "</div>");
        $("#questionButton" + i).css({
            'left': (20 * (i % 5)) + "%",
            'top': (25 * Math.floor(i / 5) + 2.5) + "%"
        });
        initButtonClick(i);
    }
    // Hide the question buttons
    $(".questionButton").css("opacity", 0);
    // Question markers
    for (var i = 0; i < 20; i++) {
        // Make divs
        $("#questionMarkers").append('<div id="questionMarkerT' + i + '" class="questionMarker questionMarkerTop questionMarker' + i + '"></div>');
        $("#questionMarkerT" + i).append('<div id="questionMarkerTextT' + i + '" class="questionMarkerText questionMarkerTextTop text fs-20">' + (i + 1) + '</div>');
        $("#questionMarkers").append('<div id="questionMarkerB' + i + '" class="questionMarker questionMarkerBottom questionMarker' + i + '"></div>');
        $("#questionMarkerB" + i).append('<div id="questionMarkerTextB' + i + '" class="questionMarkerText questionMarkerTextBottom text fs-20">' + (i + 1) + '</div>');
        // Add event listeners
        initMarkerListeners(i);
    }
    // Hide question markers
    $(".questionMarker").css("opacity", 0);
    $("body").mousemove(function (event) {
        if (draggingMarker.on) {
            // Get mouse X coordinate
            var x = event.pageX;
            // Normalize it to the 0 to 100 range
            var l = $("#questionMarkers").offset().left;
            var w = $("#questionMarkers").width();
            var xNorm = (x - l) * (100 / w);
            // Constrain to [0, 100] range
            if (xNorm < 0) {
                xNorm = 0;
            }
            if (xNorm > 100) {
                xNorm = 100;
            }
            // Set marker position
            if (draggingMarker.isTop) {
                questions[draggingMarker.id].startTime = xNorm * video.duration / 100;
            } else {
                questions[draggingMarker.id].wrongTime = xNorm * video.duration / 100;
            }
            setMarkerPos(draggingMarker.id, draggingMarker.isTop, xNorm);
            updateTimingText();
            showSaveButton();
        }
    });
    $(window).mouseup(function () {
        draggingMarker = {
            "on": false
        }
    });

    // Return to menu
    $("#returnToMenu").click(function () {
        if (!video.paused) {
            playPause();
        }
        $("#quizStatsSelect").val(-1);
        if (readOnly) {
            hideEditorView();
            showMenuView();
            hideStatsPanel();
        } else {
            if (showingSaveButton) {
                showWarningPanel();
            } else {
                refreshUserData(loadUserData);
                hideEditorView();
                showMenuView();
            }
        }
    });

    $("#unsavedWarningButton1").click(function () {
        // Keep working
        hideWarningPanel();
    });

    $("#unsavedWarningButton2").click(function () {
        // Return to menu
        hideWarningPanel();
        refreshUserData(loadUserData);
        hideEditorView();
        instantHideSaveButton();
        showMenuView();
    });

    // Show editor view
    $("#editPanel").click(function () {
        if (editorShortcut) {
            readOnly = false;
            showEditorView();
            hideMenuView();
        }
    })

    // Download CSV
    $("#downloadCSVButton").click(function () {
        newDownloadQuestionCSV();
    });

    // Upload CSV
    $('#fileUploadInput').change(function (e) {
        if (!browserSupportFileUpload()) {
            alert('The File APIs are not fully supported in this browser!');
        } else {
            var data = null;
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (event) {
                var csvData = event.target.result;
                // TODO
                //loadQuestionCSV(csvData);
                newLoadQuestionCSV(csvData);
            };
            reader.onerror = function () {
                alert('Unable to read ' + file.fileName);
            };
        }
    });

    // Method that checks that the browser supports the HTML5 File API
    function browserSupportFileUpload() {
        var isCompatible = false;
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            isCompatible = true;
        }
        return isCompatible;
    }

    // Upload Video
    $("#videoUpload").change(function (e) {
        var data = null;
        var file = e.target.files[0];
        var fileName = file.name;
        var fileSize = file.size;
        var nameSplit = fileName.split(".");
        var ext = nameSplit[nameSplit.length - 1];
        var MAX_SIZE =1500 * 1024 * 1024 // 400 MB
        // Check if extension is acceptable AND file size is less than max size
        if ((ext == "mp4" || ext == "m4v") && fileSize < MAX_SIZE) {
            // File is OK; upload file
            uploadFile(file);
        } else {
            if (fileSize > MAX_SIZE) {
                $("#fileFormatErrorText").text("That file exceeds the upload limit of 1500 MB. (Click this to dismiss.)");
                $("#fileFormatErrorLink").attr("href", null);
            } else {
                $("#fileFormatErrorText").text("That file format isn't accepted. Click here to convert it to MP4.");
                $("#fileFormatErrorLink").attr("href", "https://apps.tlt.stonybrook.edu/converter");
            }
            // File is not OK; inform the user
            $("#fileFormatError").addClass("anim_showFileFormatError");
        }
    });

    $("#fileFormatError").click(function () {
        $("#fileFormatError").removeClass("anim_showFileFormatError");
    });

    // Dropdown menu that lets the user load a quiz
    $("#loadQuiz").change(function () {
        var optionSelected = $("#loadQuiz").val();
        if (optionSelected != -1) {
            readOnly = false;
            loadExistingQuiz(optionSelected);
            setTimeout(function () {
                $("#loadQuiz").val(-1);
            }, 150);
        }
    });

    // Dropdown menu that lets the user see the stats for a quiz
    $("#quizStatsSelect").change(function () {
        console.log(userData.quizData);
	var optionSelected = $("#quizStatsSelect").val();
        if (optionSelected != -1) {
            readOnly = true;
            loadQuizStats(optionSelected);
            $("#statsDownloadButton").css({
                "opacity": 1,
                "pointer-events": "auto"
            });
        } else {
            hideEditorBody();
            showStatsPanel();
            $("#statsDownloadButton").css({
                "opacity": .25,
                "pointer-events": "none"
            });
        }
        if (optionSelected > -1) {
            var path = userData.quizData[optionSelected].relativePath.split("/");
            location.hash = "#/stats/" + path[1] + "/" + path[2] + "/";
        } else {
            location.hash = "#/stats/";
        }
    });

    $("#saveButton").click(function () {
        trySaveQuiz();
    });

    $("#quizTitleInput").change(function () {
        showSaveButton();
    });

    $("#copyLinkButton").mouseenter(function () {
        $("#copyLinkBubble").removeClass("anim_exitQuizLink");
        $("#copyLinkBubble").addClass("anim_enterQuizLink");
    });

    $("#copyLinkButton").mouseleave(function () {
        $("#copyLinkBubble").removeClass("anim_enterQuizLink");
        $("#copyLinkBubble").addClass("anim_exitQuizLink");
    });

    $("#copyLinkButton").click(function () {
        $("#copyLinkBubbleText").select();
        document.execCommand("copy");
    });

    $("#questionTypeSelect").change(function () {
        var newType = $("#questionTypeSelect").val();
        changeQuestionType(newType);
        questions[currentQuestion].type = newType;
        showSaveButton();
    });

    // Menu button to show the statistics view.
    $("#statsPanel").click(function () {
        showStats();
    });

    // Menu button to show the delete view.
    $("#fileManagerPanel").click(function () {
        showDeleteView();
        hideMenuView();
    });

    // Menu button to show the About view.
    $("#sharePanel").click(function () {
        $("#shareQuizUsers").val("");
        showShareView();
        hideMenuView();
    });

    // Menu button to show the help/feedback view.
    $("#feedbackPanel").click(function () {
        showFeedbackView();
        hideMenuView();
    });

    $("#removeQuestionButton").click(function () {
        if (isEditor()) {
            removeQuestion();
        }
    });

    // Show/hide help overlay
    $("#editorHelpButton").mouseenter(showHelpOverlay).mouseleave(hideHelpOverlay);

    $("#deleteReturn").click(function () {
        if (confirmDeleteLevel < 4) {
            hideDeleteView();
            showMenuView();
        }
    });

    $("#deleteDropdown").change(function () {
        var v = $("#deleteDropdown").val();
        if (v == 0) {
            confirmDeleteLevel = 0;
        } else {
            confirmDeleteLevel = 1;
        }
        updateConfirmDelete();
    });

    $("#deleteConfirm").click(function () {
        if (confirmDeleteLevel > 0 && confirmDeleteLevel < 4) {
            confirmDeleteLevel++;
            updateConfirmDelete();
            if (confirmDeleteLevel == 4) {
                deleteVideo();
            }
        } else if (editorShortcut) {
            playTrashAnimation();
        }
    });

    $("#feedbackCancel").click(function () {
        hideFeedbackView();
        showMenuView();
    });

    $("#feedbackSend").click(function () {
        // TODO: send mail
        sendMail();
        hideFeedbackView();
        showMenuView();
    });

    $("#statsDownloadButton").click(function () {
        showScoreReport();
    });

    // Upload CSV
    $('#filterUpload').change(function (e) {
        if (!browserSupportFileUpload()) {
            alert('The File APIs are not fully supported in this browser!');
        } else {
            var data = null;
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (event) {
                var csvData = event.target.result;
                loadFilterCSV(csvData);
            };
            reader.onerror = function () {
                alert('Unable to read ' + file.fileName);
            };
        }
    });

    $("#downloadFilterButton").click(function () {
        downloadFilterCSV();
    });

    $("#downloadScoresButton").click(function () {
        var filterSelect = $("#scoreReportFilterSelect");
        var quizName = $("#quizStatsSelect option:selected").html();
        var mode = $("#scoreReportFormatSelect").val();
        var filterIndex = filterSelect.val();
        var sectionName = $("#scoreReportFilterSelect option:selected").html();
        var whitelist = [];
        if (filterIndex > -1) {
            whitelist = filters.filterList[filterIndex].members;

        }

	console.log(mode, whitelist, quizName, sectionName);
        downloadQuizDataCSV(mode, whitelist, quizName, sectionName);
    });

    $("#downloadAllScoresButton").click(function () {
        var quizName = $("#quizStatsSelect option:selected").html();
        var mode = $("#scoreReportFormatSelect").val();
        $("#scoreReportFilterSelect option").each(function () {
            var filterIndex = $(this).val();
            var sectionName = $(this).text();
            if (filterIndex != -1) {
                // Everything except "all users"
                whitelist = filters.filterList[filterIndex].members;
                downloadQuizDataCSV(mode, whitelist, quizName, sectionName);
            }
        });
    });

    $("#scoreReportReturn").click(function () {
        hideScoreReport();
    });

    $("#permissionsButton").click(function () {
        loadPermissions(currentQuiz, false);
    });

    $("#permissionsCancel").click(function () {
        hidePermissionsView();
    });

    $("#permissionsSubmit").click(function () {
        savePermissions(currentQuiz);
        hidePermissionsView();
    });

    $("#cannotReset").click(function () {
var cannotReset=  !userData.quizData[currentQuiz].cannotReset

        $("#resetIcon").removeClass("anim_spinButton");
		$("#resetIcon").removeClass("resetGreen");
		$("#resetIcon").removeClass("resetGray");
		setTimeout(function () {
            $("#resetIcon").addClass("anim_spinButton");
            setIcon($("#resetIcon"),cannotReset);
				}, 25);
        console.log(currentQuiz)
        userData.quizData[currentQuiz].cannotReset= cannotReset;
        savePermissions(currentQuiz);
      showSaveButton(); 
    });    
    function setIcon(sel,state)
    {   var iconColor=["Green","Gray"][+state]
        sel.addClass(`reset${iconColor}`); 
    }

    $("#shareReturn").click(function () {
        hideShareView();
        showMenuView();
    });

    $("#shareSubmit").click(function () {
        var shareUsers = $("#shareQuizUsers").val().split("\n");
        batchAddPermissions(shareCheckboxes, shareUsers);
        $("#shareSubmit").addClass("anim_shareSubmitSpin");
        setTimeout(function () {
            $("#shareSubmitText").text("Shared!");
        }, 62.5);
        setTimeout(function () {
            hideShareView();
            showMenuView();
        }, 1000);
    });

    bindExpoEvents();

    $("#timeDisplayText").click(function () {
console.log(video)
        $("#timeDisplayInput").css("visibility", "visible");
        pauseVideo();
        var currentTime = $("#timeDisplayText").text();
        $("#timeDisplayInput").val(currentTime);
        $("#timeDisplayInput").focus();
    });

    $("#timeDisplay").mouseleave(function () {
        var newTime = $("#timeDisplayInput").val();
        if (newTime != "") {
            var sec = parseTime(newTime);
            if (sec != "ERROR") {
                video.currentTime = sec;
            }
            $("#timeDisplayInput").css("visibility", "hidden");
            $("#timeDisplayInput").val("");
        }
    });

    // Menu button to show the help/feedback view.
    $("#showFoldersButton").click(function () {
        showFolderView();
        hideMenuView();
    });
}

// Upload video file
function uploadFile(file) {
    var url = 'upload.php';
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Everything ok, file uploaded
            videoPath = xhr.responseText;
            // Load the video
            loadVideo(videoPath);
            // Make a new json file for the video quiz
            jsonPath = videoPath.split("media")[0] + "json/quiz.json";
            var blankJson = {
                "videoPath": videoPath,
                "title": "New Quiz",
                "questions": []
            }
            var jsonString = JSON.stringify(blankJson);
            $.ajax({
                type: "POST",
                url: "saveQuiz.php",
                data: {
                    'path': jsonPath,
                    'jsonData': jsonString
                }
            }).done(function (data) {
                print("Making new quiz");
                refreshUserData(continueVideoUpload);
            }).fail(function () {
                console.log("Uh oh! Something went wrong!");
            });
        }
    };
    xhr.upload.onprogress = function (e) {
        var pctComplete = 0;
        var roundPct = 0;
        if (e.lengthComputable) {
            pctComplete = 100 * e.loaded / e.total;
            roundPct = Math.floor(pctComplete);
        }
        $("#uploadProgressCount").text(roundPct + "%");
        $("#uploadProgressBar").css("width", pctComplete + "%");
    }
    // Test
    xhr.open("POST", url, true);
    fd.append("upload_file", file);
    xhr.send(fd);
    // Hide menu view
    hideMenuView();
    showProgressPanel();
}

function continueVideoUpload() {
    print("Continue video upload");
    // Make a new quiz
    newQuiz();
    readOnly = false;
    // Show the editor
    showEditorView();
    hideProgressPanel();
    // Update question panel
    var quizPathPart = videoPath.substr(3, videoPath.length).split("media")[0];
    quizLink = userData.serverPath + quizPathPart;
    var relPathToFind = "../" + quizPathPart.substr(0, quizPathPart.length - 1);
    console.log(relPathToFind);
    console.log(userData.quizData);
    currentQuiz = userData.quizData.findIndex(function (q) {
        return q.relativePath == relPathToFind;
    });
    // Reset quiz editor/author information
    currentQuizEditor = "";
    currentQuizEditCode = "";
    currentQuizAuthor = "";
    currentQuizCode = "";
    updatePermissionLocks();
    print("Current quiz is " + currentQuiz);
    // Better method: get the quiz link from PHP
    $("#copyLinkBubbleText").val(quizLink);
    instantHideSaveButton();
    resetMarkers();
    updateQuestionPanel(0, true);
    updateEditorView();
}

function initButtonClick(i) {
    $("#questionButton" + i).click(function () {
        buttonClick(i);
    });
}

function buttonClick(i) {
    if (currentQuestion != i) {
        if (!readOnly || i < questions.length) {
            updateQuestionPanel(i, false);
        }
    }
}

function initAnswerTextChange(i) {
    $("#questionChoiceInput" + (i + 1)).change(function () {
        questions[currentQuestion].answerText[i] = $("#questionChoiceInput" + (i + 1)).val();
        showSaveButton();
    });
    $("#questionExpoInput" + (i + 1)).change(function () {
        questions[currentQuestion].expoText[i] = $("#questionExpoInput" + (i + 1)).val();
        showSaveButton();
    });
}

function initAnswerButtonClick(i) {
    $("#questionChoiceCorrect" + i).click(function () {
        if (isEditor()) {
            answerButtonClick(i);
        }
    });
}

function answerButtonClick(i) {
    if (currentQuestion != -1) {
        if (questions[currentQuestion].correctAnswer != i) {
            var lastCorrect = questions[currentQuestion].correctAnswer;
            questions[currentQuestion].correctAnswer = i;
            $("#questionChoiceCorrect" + i).addClass("anim_spinButton");
            $("#questionChoiceCorrect" + lastCorrect).addClass("anim_spinButton");
            setTimeout(function () {
                $("#questionChoiceCorrect" + i).removeClass("checkOff");
                $("#questionChoiceCorrect" + i).addClass("checkOn");
                $("#questionChoiceCorrect" + lastCorrect).removeClass("checkOn");
                $("#questionChoiceCorrect" + lastCorrect).addClass("checkOff");
            }, 62.5);
            setTimeout(function () {
                $("#questionChoiceCorrect" + i).removeClass("anim_spinButton");
                $("#questionChoiceCorrect" + lastCorrect).removeClass("anim_spinButton");
            }, 250);
            showSaveButton();
        }
    }
}

function initMarkerListeners(i) {
    // Double click sets current question to the one clicked
    $(".questionMarker" + i).dblclick(function () {
        if (currentQuestion != i) {
            updateQuestionPanel(i, false);
        }
    });
    // Click and drag markers to adjust the timing
    $("#questionMarkerT" + i).mousedown(function () {
        if (currentQuestion == i && !readOnly && isEditor()) {
            draggingMarker = {
                "on": true,
                "id": i,
                "isTop": true
            };
        }
    });
    $("#questionMarkerB" + i).mousedown(function () {
        if (currentQuestion == i && !readOnly && isEditor()) {
            draggingMarker = {
                "on": true,
                "id": i,
                "isTop": false
            };
        }
    });
}

function newQuiz() {
    questions = [];
    newQuestion(0);
    $("#quizTitleInput").val("New Quiz");
}

function newQuestion(i) {
    questions[i] = {
        "type": "mc",
        "questionText": "",
        "answerText": ["", "", "", "", ""],
        "expoText": ["", "", "", "", ""],
        "correctAnswer": 0,
        "startTime": 0,
        "wrongTime": 0,
        "startTimeSet": false,
        "wrongTimeSet": false
    }
}

function updateQuestionPanel(i, forceAnimation) {
    if (questions.length > 0 || !readOnly) {
        // Show question panel and number button panel
        $("#questionPanel").css("opacity", 1);
        $("#numberButtonPanel").css("opacity", 1);
        // Hide the no questions panel
        $("#noQuestionsPanel").css("opacity", 0);
    } else {
        // Hide question panel and number button panel
        $("#questionPanel").css("opacity", 0);
        $("#numberButtonPanel").css("opacity", 0);
        // Show the no questions panel
        $("#noQuestionsPanel").css("opacity", 1);
    }
    var isNew = false;
    if (i == questions.length && isEditor()) {
        if (questions.length > 0) {
            showSaveButton();
        }
        isNew = true;
        // Make new question
        newQuestion(i);
        $("#questionButton" + i).addClass("anim_spinButtonNew");
        $("#questionButton" + (i + 1)).addClass("anim_newQuestionButton");
    }
    if (forceAnimation) {
        for (var j = 0; j < Math.min(20, questions.length + 1); j++) {
            if (i != j) {
                $("#questionButton" + j).removeClass("anim_spinButtonNew");
                $("#questionButton" + j).removeClass("anim_buttonSelect");
                $("#questionButton" + j).addClass("anim_buttonDeselect");
            } else {
                $("#questionButton" + j).removeClass("anim_spinButtonNew");
                $("#questionButton" + j).removeClass("anim_buttonDeselect");
                $("#questionButton" + j).addClass("anim_buttonSelect");
            }
        }
        if (questions.length < 20) {
            $("#questionButton" + (questions.length)).addClass("anim_newQuestionButton");
        }
    }
    updateQuestionButtons();
    if (i < questions.length) {
        // Display that question
        if (currentQuestion != -1) {
            // Question button
            $("#questionButton" + currentQuestion).removeClass("anim_spinButtonNew");
            $("#questionButton" + currentQuestion).removeClass("anim_newQuestionButton");
            $("#questionButton" + currentQuestion).removeClass("anim_buttonSelect");
            $("#questionButton" + currentQuestion).addClass("anim_buttonDeselect");
            // Question markers
            deselectQuestion(currentQuestion);
        }
        currentQuestion = i;
        // Spin all the things
        $("#questionNumber").addClass("anim_spinButton");
        $("#questionTextInput").addClass("anim_spinPanel");
        $(".questionChoiceBox").addClass("anim_spinPanel");
        $(".questionTimingBox").addClass("anim_spinPanel");
        $("#questionStats").addClass("anim_spinPanel");
        if (!isNew) {
            $("#questionButton" + i).removeClass("anim_spinButtonNew");
            $("#questionButton" + i).removeClass("anim_newQuestionButton");
            $("#questionButton" + i).removeClass("anim_buttonDeselect");
            $("#questionButton" + i).addClass("anim_buttonSelect");
        }
        selectQuestion(i);
        // In 250ms, remove the spin animation
        setTimeout(function () {
            $("#questionNumber").removeClass("anim_spinButton");
            $("#questionTextInput").removeClass("anim_spinPanel");
            $(".questionChoiceBox").removeClass("anim_spinPanel");
            $(".questionTimingBox").removeClass("anim_spinPanel");
            $("#questionStats").removeClass("anim_spinPanel");
        }, 250);
        setTimeout(function () {
            if (currentQuestion != -1) {
                $("#questionNumberText").text(currentQuestion + 1);
            }
            if (currentQuestion == -1) {
                $("#questionTextInput").text("");
                $(".questionChoiceInput").text("");
            } else {
                var q = questions[currentQuestion];
                $("#questionTextInput").val(q.questionText);
                if (q.type == "mc") {
                    for (var i = 0; i < 6; i++) {
                        $("#questionChoiceInput" + (i + 1)).val(q.answerText[i]);
                        if (q.expoText !== undefined) {
                            $("#questionExpoInput" + (i + 1)).val(q.expoText[i]);
                        }
                    }
                } else if (q.type == "fitb") {
                    $("#questionAnswerInput").val(q.answerText[0]);
                }
                updateTimingText();
                if (readOnly) {
                    updateQuestionStatsText();
                }
                $(".questionChoiceCorrect").removeClass("checkOn");
                $(".questionChoiceCorrect").addClass("checkOff");
                $("#questionChoiceCorrect" + q.correctAnswer).removeClass("checkOff");
                $("#questionChoiceCorrect" + q.correctAnswer).addClass("checkOn");
            }
        }, 62.5);
    }
    for (var j = 0; j < 20; j++) {
        if (j < questions.length) {
            $("#questionButtonText" + j).text(j + 1);
            $("#questionButton" + j).removeClass("buttonPlus");
            $("#questionButton" + j).addClass("btn");
        } else if (j == questions.length) {
            $("#questionButtonText" + j).text("");
            $("#questionButton" + j).addClass("buttonPlus");
            $("#questionButton" + j).addClass("btn");
        } else {
            $("#questionButton" + j).removeClass("anim_buttonSelect");
            $("#questionButton" + j).removeClass("anim_buttonDeselect");
            $("#questionButton" + j).removeClass("anim_newQuestionButton");
            $("#questionButton" + j).removeClass("anim_spinButtonNew");
            $("#questionButton" + j).css("opacity", 0);
            $("#questionButton" + j).removeClass("btn");
        }
    }
    if (i < questions.length) {
        setQuestionType(questions[i].type);
    }
}

function changeQuestionType(t) {
    var q = questions[currentQuestion];
    q.type = t;
    q.answerText = ["", "", "", "", ""];
    q.correctAnswer = 0;
    updateQuestionPanel(currentQuestion, false);
}

function setQuestionType(t) {
    setTimeout(function () {
        if (t == "mc") {
            // Multiple choice
            $(".show-fitb").css({
                "opacity": 0,
                "pointer-events": "none"
            });
            $(".show-mc").css({
                "opacity": 1,
                "pointer-events": "inherit"
            });
        }
        if (t == "fitb") {
            // Fill in the blank
            $(".show-fitb").css({
                "opacity": 1,
                "pointer-events": "inherit"
            });
            $(".show-mc").css({
                "opacity": 0,
                "pointer-events": "none"
            });
        }
        if (t == "sr") {
            // Short-Response
            $(".show-fitb").css({
                "opacity": 0,
                "pointer-events": "inherit"
            });
            $(".show-mc").css({
                "opacity": 0,
                "pointer-events": "none"
            });
        }
    }, 62.5);
    $("#questionTypeSelect").val(t);
}

function updateTimingText() {
    if (currentQuestion >= 0 && questions.length > 0) {
        var q = questions[currentQuestion];
        $("#questionTimingBoxText1").text(q.startTimeSet ? formatTime(q.startTime) : "--:--:--");
        $("#questionTimingBoxText2").text(q.wrongTimeSet ? formatTime(q.wrongTime) : "--:--:--");
    }
}

function updateQuestionButtons() {
    // Question markers
    for (var i = 0; i < questions.length; i++) {
        if (currentQuestion == i) {
            selectQuestion(i);
        } else {
            deselectQuestion(i);
        }
    }
}

function deselectQuestion(i) {
    if (questions.length > i) {
        if (questions[i].startTimeSet) {
            $("#questionMarkerT" + i).removeClass("anim_questionMarkerSelect");
            $("#questionMarkerT" + i).addClass("anim_questionMarkerDeselect");
        }
        if (questions[i].wrongTimeSet) {
            $("#questionMarkerB" + i).removeClass("anim_questionMarkerSelect");
            $("#questionMarkerB" + i).addClass("anim_questionMarkerDeselect");
        }
    }
}

function selectQuestion(i) {
    if (questions[i].startTimeSet) {
        $("#questionMarkerT" + i).removeClass("anim_questionMarkerDeselect");
        $("#questionMarkerT" + i).addClass("anim_questionMarkerSelect");
    }
    if (questions[i].wrongTimeSet) {
        $("#questionMarkerB" + i).removeClass("anim_questionMarkerDeselect");
        $("#questionMarkerB" + i).addClass("anim_questionMarkerSelect");
    }
}

function resetMarkers() {
    $(".questionMarker").removeClass("anim_questionMarkerSelect");
    $(".questionMarker").removeClass("anim_questionMarkerDeselect");
    $(".questionMarker").css("opacity", 0);
}

function formatTime(n) {
    var m = Math.floor(n);
    var hr = Math.floor(m / 3600);
    m -= 3600 * hr;
    var min = Math.floor(m / 60);
    m -= 60 * min;
    var sec = m;
    return (hr > 0 ? hr + ":" : "") + (min < 10 && hr != 0 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
}

function setQuestionTime(id, isTop) {
    if (isTop) {
        questions[id].startTime = video.currentTime;
        if (!questions[id].startTimeSet) {
            questions[id].startTimeSet = true;
            $("#questionMarkerT" + id).removeClass("anim_questionMarkerDeselect");
            $("#questionMarkerT" + id).addClass("anim_questionMarkerSelect");
        }
    } else {
        questions[id].wrongTime = video.currentTime;
        if (!questions[id].wrongTimeSet) {
            questions[id].wrongTimeSet = true;
            $("#questionMarkerB" + id).removeClass("anim_questionMarkerDeselect");
            $("#questionMarkerB" + id).addClass("anim_questionMarkerSelect");
        }
    }
    updateEditorView();
}

function updateMarkerPositions() {
    for (var i = 0; i < questions.length; i++) {
        var q = questions[i];
        if (q.startTimeSet) {
            var startPos = 100 * q.startTime / video.duration;
            setMarkerPos(i, true, startPos);
            $("#questionMarkerT" + i).css("opacity", 1);
        }
        if (q.wrongTimeSet) {
            setMarkerPos(i, false, 100 * q.wrongTime / video.duration);
            $("#questionMarkerB" + i).css("opacity", 1);
        }
    }
}

function setMarkerPos(id, isTop, pos) {
    $("#questionMarker" + (isTop ? "T" : "B") + id).css("left", (pos - 2) + "%");
}

function playPause() {
    if (video.paused) {
        playVideo();
    } else {
        pauseVideo();
    }
}

function playVideo() {
    video.play();
    $("#videoPlayPause").removeClass("playState");
    $("#videoPlayPause").addClass("pauseState");
}

function pauseVideo() {
    video.pause();
    $("#videoPlayPause").removeClass("pauseState");
    $("#videoPlayPause").addClass("playState");
}

function vidSeek() {
    var seekto = video.duration * ($("#seekSlider").val() / 100);
    video.currentTime = seekto;
    seekTimeUpdate();
}

function seekTimeUpdate() {
    var currentTime = video.currentTime;
    var currentPct = currentTime * (100 / video.duration);
    $("#seekSlider").val(currentPct);
    $("#timeDisplayText").text(formatTime(currentTime));
    $("#graphTrackbar").css("left", (currentPct - .125) + "%");
    if (numViewers > 0 && !isNaN(graphData[Math.floor(currentTime)])) {
        $("#videoWatchInfoText").text((graphData[Math.floor(currentTime)] / numViewers).toFixed(2));
    } else {
        $("#videoWatchInfoText").text("???");
    }
}

function videoEnded() {
    pauseVideo();
}

function bindExpoEvents() {
    for (var i = 1; i <= 6; i++) {
        bindExpoEvent(i);
    }
}

function bindExpoEvent(i) {
    $("#questionChoiceBox" + i).mouseenter(function () {
        $("#questionExpoBox" + i).removeClass("anim_expoFadeOut");
        $("#questionExpoBox" + i).addClass("anim_expoFadeIn");
    });
    $("#questionChoiceBox" + i).mouseleave(function () {
        $("#questionExpoBox" + i).removeClass("anim_expoFadeIn");
        $("#questionExpoBox" + i).addClass("anim_expoFadeOut");
    });
}

// Show and hide parts of the editor

function showEditorView() {
    showHeaderBar();
    showEditorBody();
}

function showHeaderBar() {
    if (!showingHeaderBar) {
        showingHeaderBar = true;
        $("#headerBar").css({
            "opacity": 1,
            "pointer-events": "auto"
        });
        $("#headerBar").addClass("anim_topSideIn");
        setTimeout(function () {
            $("#headerBar").removeClass("anim_topSideIn");
        }, 250);
    }
    updateEditorView();
}

function showEditorBody() {
    if (!showingEditor) {
        showingEditor = true;
        $("#editorView").css({
            "opacity": 1,
            "pointer-events": "auto"
        });
        $("#videoPlayer").addClass("anim_leftSideIn");
        $("#watchTimeBox").addClass("anim_leftSideIn");
        $("#videoControls").addClass("anim_leftSideIn");
        $("#questionPanel").addClass("anim_rightSideIn");
        $("#numberButtonPanel").addClass("anim_rightSideIn");
        $("#noQuestionsPanel").addClass("anim_rightSideIn");
        setTimeout(function () {
            $("#videoPlayer").removeClass("anim_leftSideIn");
            $("#watchTimeBox").removeClass("anim_leftSideIn");
            $("#videoControls").removeClass("anim_leftSideIn");
            $("#questionPanel").removeClass("anim_rightSideIn");
            $("#numberButtonPanel").removeClass("anim_rightSideIn");
            $("#noQuestionsPanel").removeClass("anim_rightSideIn");
        }, 250);
    }
}

function hideEditorView() {
    hideHeaderBar();
    hideEditorBody();
}

function hideHeaderBar() {
    if (showingHeaderBar) {
        showingHeaderBar = false;
        $("#headerBar").addClass("anim_topSideOut");
        setTimeout(function () {
            $("#headerBar").removeClass("anim_topSideOut");
            $("#headerBar").css({
                "opacity": 0,
                "pointer-events": "none"
            });
        }, 250);
    }
}

function hideEditorBody() {
    if (showingEditor) {
        showingEditor = false;
        $("#videoPlayer").addClass("anim_leftSideOut");
        $("#watchTimeBox").addClass("anim_leftSideOut");
        $("#videoControls").addClass("anim_leftSideOut");
        $("#questionPanel").addClass("anim_rightSideOut");
        $("#numberButtonPanel").addClass("anim_rightSideOut");
        $("#noQuestionsPanel").addClass("anim_rightSideOut");
        setTimeout(function () {
            $("#videoPlayer").removeClass("anim_leftSideOut");
            $("#watchTimeBox").removeClass("anim_leftSideOut");
            $("#videoControls").removeClass("anim_leftSideOut");
            $("#questionPanel").removeClass("anim_rightSideOut");
            $("#numberButtonPanel").removeClass("anim_rightSideOut");
            $("#noQuestionsPanel").removeClass("anim_rightSideOut");
            $("#editorView").css({
                "opacity": 0,
                "pointer-events": "none"
            });
        }, 250);
    }
}

function showMenuView() {
    if (!showingMenu) {
        location.hash = "";
        $("#menuView").css("visibility", "visible");
        $("#menuView").addClass("anim_menuIn");
        setTimeout(function () {
            $("#menuView").removeClass("anim_menuIn");
            showingMenu = true;
        }, 250);
        $("#statsDownloadButton").css({
            "opacity": .25,
            "pointer-events": "none"
        });
        currentQuizEditor = "";
        currentQuizEditCode = "";
        updatePermissionLocks();
    }
}

function hideMenuView() {
    if (showingMenu) {
        $("#menuView").addClass("anim_menuOut");
        setTimeout(function () {
            $("#menuView").removeClass("anim_menuOut");
            $("#menuView").css("visibility", "hidden");
            showingMenu = false;
        }, 250);
        // Hide file format error message
        $("#fileFormatError").removeClass("anim_showFileFormatError");
    }
}

function showProgressPanel() {
    if (!showingProgress) {
        randomizeFunFact();
        $("#uploadProgressPanel").removeClass("anim_progressOut");
        $("#uploadProgressPanel").addClass("anim_progressIn");
        showingProgress = true;
    }
}

function randomizeFunFact() {
    var funFact = funFacts[Math.floor(funFacts.length * Math.random())];
    $("#uploadProgressFlavor").text(funFact);
}

function hideProgressPanel() {
    if (showingProgress) {
        $("#uploadProgressPanel").removeClass("anim_progressIn");
        $("#uploadProgressPanel").addClass("anim_progressOut");
        showingProgress = false;
    }
}

// Show/hide warning panel
function showWarningPanel() {
    if (!showingWarning) {
        $("#unsavedWarningPanel").removeClass("anim_progressOut");
        $("#unsavedWarningPanel").addClass("anim_progressIn");
        $("#unsavedWarningBG").removeClass("anim_fadeOutBG");
        $("#unsavedWarningBG").addClass("anim_fadeInBG");
        showingWarning = true;
    }
}

function hideWarningPanel() {
    if (showingWarning) {
        $("#unsavedWarningPanel").removeClass("anim_progressIn");
        $("#unsavedWarningPanel").addClass("anim_progressOut");
        $("#unsavedWarningBG").removeClass("anim_fadeInBG");
        $("#unsavedWarningBG").addClass("anim_fadeOutBG");
        showingWarning = false;
    }
}

// Show/hide delete view
function showDeleteView() {
    if (!showingDelete) {
        $("#deleteView").removeClass("anim_progressOut");
        $("#deleteView").addClass("anim_progressIn");
        showingDelete = true;
        confirmDeleteLevel = 0;
        updateConfirmDelete();
        $("#deleteDropdown").val(-1);
    }
}

function hideDeleteView() {
    if (showingDelete) {
        $("#deleteView").removeClass("anim_progressIn");
        $("#deleteView").addClass("anim_progressOut");
        showingDelete = false;
    }
}

function loadVideo(src) {
    $("#videoBox").find("#videoSource").attr("src", src + "?" + Math.random());
    //    console.log(video);
    //    $("#videoBox").load(src, function(data) {
    //        console.log(data);
    //    });
    video.load();
    video.onloadedmetadata = function () {
        showEditorView();
        hideMenuView();
        hideStatsPanel();
        currentQuestion = -1;
        updateQuestionPanel(0, true);
        updateEditorView();
    }
}

function loadVideo__Quizindex(quizindex) {
//	loadVideo(quizindex)	
	var videoPath=`${userData.quizData[quizindex].relativePath}/media/video.mp4`
	console.log(userData.quizData[quizindex])		//	-Tony
	loadVideo(videoPath)		//	-Tony
//	Video__Quizindex(quizindex, loadVideo);
}

function cleanQuiz(save) {
    // Remove empty questions
    var removedQuestions = false;
    for (var i = questions.length - 1; i >= 0; i--) {
        var q = questions[i];
        if (isQuestionEmpty(q)) {
            questions.splice(i, 1);
            removedQuestions = true;
        }
    }
    // Remove empty answer slots
    var cleanedQuestions = false;
    for (var i = 0; i < questions.length; i++) {
        var q = questions[i];
        var a = q.answerText;
        var b = q.expoText;
        for (var j = 0; j < 5; j++) {
            for (var k = 0; k < 4; k++) {
                if (a[k].length == 0 && a[k + 1].length > 0) {
                    cleanedQuestions = true;
                    a[k] = a[k + 1];
                    a[k + 1] = "";
                    b[k] = b[k + 1];
                    b[k + 1] = "";
                    if (questions[i].correctAnswer == k + 2) {
                        questions[i].correctAnswer = k + 1;
                    }
                }
            }
        }
    }
    // Sort questions by display time
    questions.sort(function (a, b) {
        return a.startTime - b.startTime;
    });
    // If two questions are too close together, space them apart
    for (var i = 0; i < questions.length - 1; i++) {
        if (questions[i + 1].startTime - questions[i].startTime < .1) {
            questions[i + 1].startTime = questions[i].startTime + .1;
        }
    }
    // If a question is too close to the end, fix it
    for (var i = 0; i < questions.length; i++) {
        if (video.duration - questions[i].startTime < .1) {
            questions[i].startTime = video.duration - .1;
        }
    }
    if (save) {
        saveQuiz();
    }
    if (questions.length == 0) {
        newQuestion(0);

    }
    resetMarkers();
    updateQuestionButtons();
    if (removedQuestions) {
        updateQuestionPanel(0, true);
    } else {
        updateQuestionPanel(currentQuestion, true);
    }
    updateEditorView();
}

function isQuestionEmpty(q) {
    var isEmpty = true;
    if (q.questionText != "") {
        isEmpty = false;
    }
    for (var j = 0; j < 5; j++) {
        if (q.answerText[j] != "") {
            isEmpty = false;
        }
    }
    if (q.startTimeSet || q.wrongTimeSet) {
        isEmpty = false;
    }
    return isEmpty;
}

function showSaveButton() {
    if (!showingSaveButton) {
        $("#saveButton").removeClass("anim_exitSaveButton");
        $("#saveButton").addClass("anim_enterSaveButton");
        $("#saveButtonText").text("Save Quiz");
        showingSaveButton = true;
    }
}

function hideSaveButton() {
    if (showingSaveButton) {
        $("#saveButton").removeClass("anim_enterSaveButton");
        $("#saveButton").addClass("anim_exitSaveButton");
        $("#saveButtonText").text("Saved!");
        showingSaveButton = false;
    }
}

function instantHideSaveButton() {
    if (showingSaveButton) {
        $("#saveButton").removeClass("anim_enterSaveButton");
        showingSaveButton = false;
    }
}

function showErrorBubble(t, y, q) {
    // Set text
    $("#errorBubbleText").text(t);
    // Position bubble
    $("#errorBubble").css("top", y + "%");
    // Add animation
    $("#errorBubble").removeClass("anim_showErrorText");
    setTimeout(function () {
        $("#errorBubble").addClass("anim_showErrorText");
    }, 10);
    // Jump to question where the problem is
    if (currentQuestion != q) {
        updateQuestionPanel(q, false);
        updateEditorView();
    }
}

// Update the editor view
function updateEditorView() {
    if (showingEditor) {
        updateMarkerPositions();
        updateTimingText();
    }
    // Switch UI based on readOnly setting.
    if (readOnly) {
        $("#quizTitleInput").css({
            "opacity": 0,
            "z-index": -100
        });
        $("#quizStatsSelect").css({
            "opacity": 1,
            "z-index": 100
        });
        $(".readOnlyHide").css("visibility", "hidden");
        $(".readOnlyShow").css("visibility", "visible");
        $("#questionPanel").css("pointer-events", "none");
        $("#videoPlayer").css("height", "45%");
        $("#videoPlayPause").css("left", "5%");
        $("#timeDisplay").css("left", "17.5%");
    } else {
        $("#quizTitleInput").css({
            "opacity": 1,
            "z-index": 100
        });
        $("#quizStatsSelect").css({
            "opacity": 0,
            "z-index": -100
        });
        $(".readOnlyHide").css("visibility", "visible");
        $(".readOnlyShow").css("visibility", "hidden");
        $("#questionPanel").css("pointer-events", "auto");
        $("#videoPlayer").css("height", "60%");
        $("#videoPlayPause").css("left", "30%");
        $("#timeDisplay").css("left", "42.5%");
    }
}

function showStats() {
    // Enter read-only mode
    readOnly = true;
    // Show editor
    showHeaderBar();
    hideMenuView();
    showStatsPanel();
    location.hash = "#/stats/";
}

function showStatsPanel() {
    if (!showingStats) {
        showingStats = true;
        $("#userStatsPanel").removeClass("anim_userStatsPanelOut");
        $("#userStatsPanel").addClass("anim_userStatsPanelIn");
        $(".quizInfoBox").removeClass("anim_quizInfoBoxOut");
        $(".quizInfoBox").addClass("anim_quizInfoBoxIn");
        if (scrollbarHeight < 100) {
            $("#quizInfoScroll").removeClass("anim_userStatsPanelOut");
            $("#quizInfoScroll").addClass("anim_userStatsPanelIn");
        }
        $("#statsDownloadButton").css({
            "opacity": .25,
            "pointer-events": "none"
        });
    }
}

function hideStatsPanel() {
    if (showingStats) {
        showingStats = false;
        $("#userStatsPanel").removeClass("anim_userStatsPanelIn");
        $("#userStatsPanel").addClass("anim_userStatsPanelOut");
        $(".quizInfoBox").removeClass("anim_quizInfoBoxIn");
        $(".quizInfoBox").addClass("anim_quizInfoBoxOut");
        if (scrollbarHeight < 100) {
            $("#quizInfoScroll").removeClass("anim_userStatsPanelIn");
            $("#quizInfoScroll").addClass("anim_userStatsPanelOut");
        }
    }
}

function resizeGraph(w, h) {
    var graphWidth = w;
    var graphHeight = h;
    // Clear graph svg
    $("#graphSVG").empty();

    // Find maximum
    var max = 0;
    for (var i = 0; i < graphData.length; i++) {
        if (graphData[i] > max) {
            max = graphData[i];
        }
    }
    // Make points, start with bottom
    var pts = graphWidth + "," + graphHeight + " 0," + graphHeight;
    for (var i = 0; i < graphData.length; i++) {
        var x1 = graphWidth * i / (graphData.length);
        var x2 = graphWidth * (i + 1) / (graphData.length);
        if (isNaN(x1)) {
            x1 = 0;
        }
        if (isNaN(x2)) {
            x2 = 0;
        }
        var y = graphHeight * (max - graphData[i]) / max;
        if (isNaN(y)) {
            y = 0;
        }
        pts += " " + x1 + "," + y + " " + x2 + "," + y;
    }
    // Append polygon
    var polygon = $(document.createElementNS("http://www.w3.org/2000/svg", "polygon"))
        .attr({
            id: "graphPoly",
            points: pts
        });
    $("#graphSVG").attr({
        "width": graphWidth,
        "height": graphHeight
    });
    $("#graphSVG").append(polygon);
}

function removeQuestion() {
    if (currentQuestion > -1) {
        newQuestion(currentQuestion);
        cleanQuiz(false);
        showSaveButton();
    }
}

function showHelpOverlay() {
    $("#helpOverlay").removeClass("anim_helpOff");
    $("#helpOverlay").addClass("anim_helpOn");
}

function hideHelpOverlay() {
    $("#helpOverlay").removeClass("anim_helpOn");
    $("#helpOverlay").addClass("anim_helpOff");
}

// Show the stats for the current question
function updateQuestionStatsText() {
    var quiz = userData.quizData[currentQuiz];
    var userCount = quiz.userCompletionCount;
    if (userCount > 0) {
        $("#averageAttemptsText").text((1 + quiz.quizErrorTotals[currentQuestion] / userCount).toFixed(2));
        var total = 0;
        for (var i = 0; i < 4; i++) {
            total += quiz.quizAttemptTotals[currentQuestion][i];
            $("#onTryText" + (i + 1)).text(Math.round(total * 100 / userCount));
        }
    } else {
        $("#averageAttemptsText").text("???");
        for (var i = 0; i < 4; i++) {
            $("#onTryText" + (i + 1)).text("?");
        }
    }
}

// Show/hide feedback view
function showFeedbackView() {
    $("#feedbackInput").val("");
    if (!showingFeedback) {
        $("#feedbackView").removeClass("anim_progressOut");
        $("#feedbackView").addClass("anim_progressIn");
        showingFeedback = true;
    }
}

function hideFeedbackView() {
    if (showingFeedback) {
        $("#feedbackView").removeClass("anim_progressIn");
        $("#feedbackView").addClass("anim_progressOut");
        showingFeedback = false;
    }
}

// Show/hide sharing view
function showShareView() {
    $("#feedbackInput").val("");
    $("#shareSubmitText").text("Submit");
    $("#shareSubmit").removeClass("anim_shareSubmitSpin");
    if (!showingShare) {
        $("#shareView").removeClass("anim_progressOut");
        $("#shareView").addClass("anim_progressIn");
        showingShare = true;
    }
}

function hideShareView() {
    if (showingShare) {
        $("#shareView").removeClass("anim_progressIn");
        $("#shareView").addClass("anim_progressOut");
        showingShare = false;
    }
}

// Show/hide score report view
function showScoreReport() {
    if (!showingScoreReport) {
        $("#scoreReportBox").removeClass("anim_progressOut");
        $("#scoreReportBox").addClass("anim_progressIn");
        $("#unsavedWarningBG").removeClass("anim_fadeOutBG");
        $("#unsavedWarningBG").addClass("anim_fadeInBG");
        showingScoreReport = true;
        location.hash = location.hash + "scores/";
    }
}

function hideScoreReport() {
    if (showingScoreReport) {
        $("#scoreReportBox").removeClass("anim_progressIn");
        $("#scoreReportBox").addClass("anim_progressOut");
        $("#unsavedWarningBG").removeClass("anim_fadeInBG");
        $("#unsavedWarningBG").addClass("anim_fadeOutBG");
        showingScoreReport = false;
        location.hash = location.hash.split("/scores/")[0] + "/";
    }
}

// Show/hide permissions view
function showPermissionsView() {
    if (!showingPermissions) {
        $("#permissionsView").removeClass("anim_progressOut");
        $("#permissionsView").addClass("anim_progressIn");
        $("#unsavedWarningBG").removeClass("anim_fadeOutBG");
        $("#unsavedWarningBG").addClass("anim_fadeInBG");
        showingPermissions = true;
    }
}

function hidePermissionsView() {
    if (showingPermissions) {
        $("#permissionsView").removeClass("anim_progressIn");
        $("#permissionsView").addClass("anim_progressOut");
        $("#unsavedWarningBG").removeClass("anim_fadeInBG");
        $("#unsavedWarningBG").addClass("anim_fadeOutBG");
        showingPermissions = false;
    }
}

function hideLoadingScreen() {
    $("#loadingScreen").css("display", "none");
}

function initPermissionControls() {
    $("#publicCheckbox").click(function () {
        if (enablePublicMode) {
            enablePublicMode = false;
            $("#publicCheckbox").removeClass("anim_checkboxOn");
            $("#publicCheckbox").addClass("anim_checkboxOff");
        } else {
            enablePublicMode = true;
            $("#publicCheckbox").removeClass("anim_checkboxOff");
            $("#publicCheckbox").addClass("anim_checkboxOn");
            enablePrivateMode = false;
            $("#privateCheckbox").removeClass("anim_checkboxOn");
            $("#privateCheckbox").addClass("anim_checkboxOff");
        }
    });
    $("#privateCheckbox").click(function () {
        if (enablePrivateMode) {
            enablePrivateMode = false;
            $("#privateCheckbox").removeClass("anim_checkboxOn");
            $("#privateCheckbox").addClass("anim_checkboxOff");
        } else {
            enablePrivateMode = true;
            $("#privateCheckbox").removeClass("anim_checkboxOff");
            $("#privateCheckbox").addClass("anim_checkboxOn");
            enablePublicMode = false;
            $("#publicCheckbox").removeClass("anim_checkboxOn");
            $("#publicCheckbox").addClass("anim_checkboxOff");
        }
    });
}

function isEditor() {
    if (userData.netID == currentQuizEditor || currentQuizEditor == "") {
        return true;
    } else {
        return false;
    }
}

function isAuthor() {
    if (currentQuizAuthor == "" || currentQuizAuthor == userData.netID) {
        return true;
    } else {
        return false;
    }
}

function updatePermissionLocks() {
    print("Update Permission Locks");
    if (isEditor()) {
        // Make text boxes editable and enable question type dropdown
        $(".questionChoiceInput").removeAttr("readonly");
        $(".questionExpoInput").removeAttr("readonly");
        $("#questionTextInput").removeAttr("readonly");
        $("#quizTitleInput").removeAttr("readonly");
        $("#questionTypeSelect").prop("disabled", false);
        $(".questionButton").css("visibility", "visible");
        $("#readOnlyLabel").css("visibility", "hidden");
        $("#uploadCSVButton").css("opacity", "1");
        $("#downloadCSVButton").css("opacity", "1");
        $(".csvBlocker").css("visibility", "hidden");
    } else {
        // Make text boxes read-only and disable question type dropdown
        $(".questionChoiceInput").attr("readonly", "readonly");
        $(".questionExpoInput").attr("readonly", "readonly");
        $("#questionTextInput").attr("readonly", "readonly");
        $("#quizTitleInput").attr("readonly", "readonly");
        $("#questionTypeSelect").prop("disabled", true);
        $("#questionButton" + questions.length).css("visibility", "hidden");
        $("#readOnlyLabel").css("visibility", "visible");
        $("#uploadCSVButton").css("opacity", ".25");
        $("#downloadCSVButton").css("opacity", ".25");
        $(".csvBlocker").css("visibility", "visible");
    }
    if (isAuthor()) {
        // Enable permissions
        $("#permissionsButton").css("opacity", 1);
        $("#permissionsBlocker").css("visibility", "hidden");
    } else {
        // Disable permissions
        $("#permissionsButton").css("opacity", .25);
        $("#permissionsBlocker").css("visibility", "visible");
    }
}

// Show/hide folder view
function showFolderView() {
    if (!showingFolder) {
        $("#folderView").removeClass("anim_progressOut");
        $("#folderView").addClass("anim_progressIn");
        makeFolders();
        showingFolder = true;
        setFolderView("", -1);
    }
}

function hideFolderView() {
    if (showingFolder) {
        $("#folderView").removeClass("anim_progressIn");
        $("#folderView").addClass("anim_progressOut");
        showingFolder = false;
    }
}

function makeFolders() {
    $("#folderList").empty();
    // Folder divs
    for (var i = 0; i < folders.length; i++) {
        $("#folderList").append('<div id="folder' + i + '" class="folderItem btn folder"></div>');
        $("#folder" + i).append('<div id="folderBox' + i + '" class="folderBox"></div>');
        $("#folderBox" + i).append('<div id="folderIcon' + i + '" class="folderIcon"></div>');
        $("#folderBox" + i).append('<div id="folderName' + i + '" class="folderName text fs-28"></div>');
        $("#folderIcon" + i).append('<div id="folderNum' + i + '" class="folderNum text fs-20"></div>');
        $("#folderName" + i).text(folders[i].name);
        $("#folderNum" + i).text(folders[i].quizzes.length);
        initFolderClick(i);
    }
    // Quiz divs
    for (var i = 0; i < userData.quizData.length; i++) {
        $("#folderList").append('<div id="folderQuiz' + i + '" class="folderItem btn folderQuiz"></div>');
        $("#folderQuiz" + i).append('<div id="folderQuizBox' + i + '" class="folderQuizBox"></div>');
        $("#folderQuizBox" + i).append('<div class="folderQuizIcon"></div>');
        $("#folderQuizBox" + i).append('<div id="folderQuizName' + i + '" class="folderName text fs-28"><span class="fqName"></span> <span class="fqShared"></span></div>');
        $("#folderQuizName" + i + ">.fqName").text(userData.quizData[i].title);
        if (!userData.quizData[i].isOwner) {
            $("#folderQuizName" + i + ">.fqShared").text("Shared by " + userData.quizData[i].owner);
        }
        initFolderQuizClick(i);
    }
    updateFolders(false);
    updateFolderDropdown();
    resizeWindow();
}

function initFolderClick(i) {
    $("#folderIcon" + i).click(function (evt) {
        if (!folders[i].expand) {
            expandFolder(i);
        } else {
            collapseFolder(i);
        }
        evt.stopPropagation();
    });
    $("#folder" + i).click(function () {
        setFolderView("folder", i);
    });
}

function expandFolder(id) {
    folders[id].expand = true;
    updateFolders(true);
}

function collapseFolder(id) {
    folders[id].expand = false;
    if (folderSelected.type == "quiz") {
        if (folders[id].quizzes.indexOf(folderSelected.id) != -1) {
            setFolderView("", -1);
        }
    }
    updateFolders(true);
}

function initFolderQuizClick(i) {
    $("#folderQuiz" + i).click(function () {
        setFolderView("quiz", i);
    });
}

function setFolderView(type, id) {
    folderSelected.type = type;
    folderSelected.id = id;
    $(".anim_folderSelected").removeClass("anim_folderSelected");
    $(".folderInfoPanel").css("visibility", "hidden");
    if (type == "quiz") {
        $("#folderQuizPanel").css("visibility", "visible");
        $("#folderQuiz" + id).addClass("anim_folderSelected");
        var folderID = -1;
        for (var i = 0; i < folders.length; i++) {
            if (folders[i].quizzes.indexOf(id) != -1) {
                folderID = i;
            }
        }
        $("#folderInfoSelect").val(folderID);
        $("#folderQuizTitle").text(userData.quizData[id].title);
        // Fade out edit button if user is not the owner
        if (userData.quizData[id].owner != userData.netID) {
            $("#folderInfoSubmit").css("opacity", ".25");
            $("#folderInfoSubmit").removeClass("btn");
        } else {
            $("#folderInfoSubmit").css("opacity", "1");
            $("#folderInfoSubmit").addClass("btn");
        }
    } else if (type == "folder") {
        $("#folderFolderPanel").css("visibility", "visible");
        $("#folder" + id).addClass("anim_folderSelected");
        $("#folderTitleInput").val(folders[folderSelected.id].name);
        $("#folderThumbNumber").text(folders[folderSelected.id].quizzes.length);
        if (folderSelected.id < folders.length - 1) {
            $(".folderDelete").css("opacity", "1");
            $("#folderDeleteButton").addClass("btn");
            $("#folderTitleInput").css("pointer-events", "auto");
        } else {
            $(".folderDelete").css("opacity", "0");
            $("#folderDeleteButton").removeClass("btn");
            $("#folderTitleInput").css("pointer-events", "none");
        }
    } else {
        $("#folderBlankPanel").css("visibility", "visible");
    }
}

function updateFolders(animate) {
    var count = -1;
    for (var i = 0; i < folders.length; i++) {
        count++;
        if (animate) {
            $("#folder" + i).animate({
                "top": (6 * count) + "%"
            }, 200);
        } else {
            $("#folder" + i).css("top", (6 * count) + "%");
        }
        // Expand the folders
        for (var j = 0; j < folders[i].quizzes.length; j++) {
            if (folders[i].expand) {
                count++;
            }
            var quizID = folders[i].quizzes[j];
            var newProps = {
                "top": (6 * count) + "%",
                "opacity": (folders[i].expand ? 1 : 0)
            };
            if (animate) {
                $("#folderQuiz" + quizID).animate(newProps, 200);
            } else {
                $("#folderQuiz" + quizID).css(newProps);
            }
        }
        $("#folderNum" + i).text(folders[i].quizzes.length);
        $("#folderName" + i).text(folders[i].name);
    }
}

function initFolderControls() {
    $("#folderReturn").click(function () {
        saveFolders();
        hideFolderView();
        showMenuView();
    })
    $("#folderInfoSelect").change(function () {
        if (folderSelected.type == "quiz") {
            var newVal = $("#folderInfoSelect").val();
            moveQuizToFolder(folderSelected.id, newVal);
        }
    });
    $("#folderInfoSubmit").click(function () {//alert()
        if (folderSelected.type == "quiz") {
            saveFolders();
            // Check permissions
            var owner = userData.quizData[folderSelected.id].owner;
            if (owner == userData.netID) {
                readOnly = false;
                loadExistingQuiz(folderSelected.id);
                hideFolderView();
            }
        }
    });
    $("#folderAddButton").click(function () {
        makeNewFolder();
    });
    $("#folderTitleInput").change(function () {
        if (folderSelected.type == "folder") {
            if (folderSelected.id != folders.length - 1) {
                var newTitle = $("#folderTitleInput").val();
                folders[folderSelected.id].name = newTitle;
                updateFolderDropdown();
                updateFolders(true);
                saveFolders();
            }
        }
    });
    $("#folderDeleteButton").click(function () {
        if (folderSelected.type == "folder") {
            deleteFolder(folderSelected.id);
        }
    });
}

function updateFolderDropdown() {
    // Folder dropdown
    $("#folderInfoSelect").empty();
    for (var i = 0; i < folders.length; i++) {
        $("#folderInfoSelect").append('<option value="' + i + '">' + folders[i].name + '</option>');
    }
}

function findQuizInFolders(quizID) {
    for (var i = 0; i < folders.length; i++) {
        for (var j = 0; j < folders[i].quizzes.length; j++) {
            if (folders[i].quizzes[j] == quizID) {
                return {
                    "folder": i,
                    "index": j
                };
            }
        }
    }
    return null;
}

function moveQuizToFolder(quizID, folderID) {
    var index = findQuizInFolders(quizID);
    if (index != null) {
        folders[index.folder].quizzes.splice(index.index, 1);
    }
    folders[folderID].quizzes.push(quizID);
    if (!folders[folderID].expand) {
        expandFolder(folderID);
    }
    updateFolders(true);
    saveFolders();
}

function makeNewFolder() {
    var newFolder = {
        "name": "New Folder",
        "quizzes": [],
        "expand": false
    };
    folders.splice(folders.length - 1, 0, newFolder);
    makeFolders();
    if (folderSelected.type == "quiz") {
        setFolderView(folderSelected.type, folderSelected.id);
    }
    saveFolders();
}

function deleteFolder(id) {
   if (id < folders.length - 1) {
        for (var i = 0; i < folders[id].quizzes.length; i++) {

	if (folders[id].name.toLowerCase()=="delete"){
   	deleteVideo(folders[id].quizzes[i]);
	}
	else{
            folders[folders.length - 1].quizzes.push(folders[id].quizzes[i]);
        }
	}
        folders.splice(id, 1);
        makeFolders();
        setFolderView("", -1);
        saveFolders();
    }
}

function saveFolders() {
    var folderData = {
        "folders": []
    };
    // Save data for all folders except "Uncategorized", which is always the last folder
    for (var i = 0; i < folders.length - 1; i++) {
        var newFolder = {
            "name": folders[i].name,
            "quizzes": [],
            "expand": folders[i].expand
        };
        for (var j = 0; j < folders[i].quizzes.length; j++) {
            newFolder.quizzes.push(userData.quizData[folders[i].quizzes[j]].relativePath);
        }
        folderData.folders.push(newFolder);
    }

    var str = JSON.stringify(folderData);
    $.ajax({
        type: "POST",
        url: "saveFolderData.php",
        data: {
            "data": str
        }
    }).done(function (data) {

    });
}
