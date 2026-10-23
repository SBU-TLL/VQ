function Video__Quizindex(quizindex, callback) {		//	Tony
	$.ajax({url: "../vqLib/DAL?video&quizindex="+quizindex}).done(callback).fail(function(e){console.log('quiz_io.js Video__Quizindex() : ' + e)})
}

function loadExistingQuiz(id) {
    loadPermissions(id, true);
}

function reallyLoadQuiz(id) {
    print("Really load quiz " + id);
    var qp = userData.quizData[id].relativePath + "/json/quiz.json";
	console.log('quiz_io.js reallyLoadQuiz() : ' + qp + ' , ' + qp.split('/')[1] + ' , ' + qp.split('/')[2])	//	Tony
    currentQuiz = id;
    $.ajax({
        //url: "../vqLib/DAL",			//	Tony
        //url: "loadQuiz.php",			//	Remove Jim's path-depended loader.	-Tony
        dataType: "json",
        data: {
            //quizPath: qp,				//	Remove Jim's legacy quizPath.		-Tony
			'author': qp.split('/')[1],	//	Tony
			'quizid': qp.split('/')[2]	//	Tony
        }
    }).done(function (data) {
        // Load data
        //quizData = JSON.parse(data);	//	Remove Jim's 2nd JSON decode of loadQuiz.php's doubly encoded file.	-Tony
        quizData = data;				//	Tony
        videoToLoad = quizData.videoPath;
        // Fix for portability
		console.log(quizData)
        var videoExtension = quizData.videoPath.split("/media/")[1];
        videoPath = userData.quizData[id].relativePath + "/media/" + videoExtension;
        questions = quizData.questions;
        // In case of old quiz: add expoText property to json
        for (var i = 0; i < questions.length; i++) {
            if (questions[i].expoText === undefined) {
                questions[i].expoText = ["", "", "", "", ""];
            }
        }
        resetMarkers();
        instantHideSaveButton();
        $("#quizTitleInput").val(quizData.title);
        //loadVideo(videoPath);		//	Remove Jim's path-dependent loader	-Tony
        loadVideo__Quizindex(id);	//	Tony
        quizLink = userData.serverPath + videoPath.substr(3, videoPath.length).split("media")[0];
        if (currentQuizAuthor == "" || currentQuizAuthor == userData.netID) {
            $("#copyLinkBubbleText").val(quizLink);
        }
        updateQuestionButtons();
        updatePermissionLocks();
    }).fail(function () {
        console.log("Couldn't load quiz.");
    });
}

function loadQuizStats(id) {
    var qp = userData.quizData[id].relativePath;
    currentQuiz = id;
    $.ajax({
        url: "getQuizStats.php",
        dataType: "text",
        data: {
            quizPath: qp
        }
    }).done(function (data) {
        // Load data
        var jsonData = JSON.parse(data);
        quizData = jsonData.quizData;
        videoToLoad = quizData.videoPath;
        processQuizWatchData(id, jsonData.viewerData);
        // Fix for portability
        var videoExtension = quizData.videoPath.split("/media/")[1];
        videoPath = userData.quizData[id].relativePath + "/media/" + videoExtension;
        questions = quizData.questions;
        graphData = userData.quizData[id].quizWatchData;
        numViewers = userData.quizData[id].views;
        resetMarkers();
        instantHideSaveButton();
        $("#quizTitleInput").val(quizData.title);
        loadVideo(videoPath);
        quizLink = userData.serverPath + videoPath.substr(3, videoPath.length).split("media")[0];
        $("#copyLinkBubbleText").val(quizLink);
        updateQuestionButtons();
        resizeWindow();
        loadFilter(currentQuiz);
    }).fail(function () {
        console.log("Couldn't find stats.");
    });
}

function processQuizWatchData(i, viewerData) {
    var quizWatchData = [];
    userData.quizData[i].playerData = viewerData;
    var viewCount = userData.quizData[i].playerData.length;
    var quizTime = 0;
    var quizAnswers = 0;
    var quizErrorTotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var quizAttemptTotals = [];
    for (var n = 0; n < 20; n++) {
        quizAttemptTotals.push([0, 0, 0, 0]);
    }
    var userCompletionCount = 0;
    for (var j = 0; j < viewCount; j++) {
        var watchData = userData.quizData[i].playerData[j].watchData;
        if (watchData != undefined) {
            for (var k = 0; k < watchData.length; k++) {
                quizTime += watchData[k];
                if (isNaN(quizWatchData[k])) {
                    quizWatchData[k] = 0;
                }
                quizWatchData[k] += watchData[k];
            }
        }
        var attempts = userData.quizData[i].playerData[j].attempts;
        var answerData = userData.quizData[i].playerData[j].answerData;
        if (attempts != undefined) {
            if (answerData) {
                quizAnswers += answerData.length;
                userCompletionCount++;
                for (var k = 0; k < answerData.length; k++) {
                    var numErrors = answerData[k].answers.length - 1;
                    quizErrorTotals[k] += numErrors;
                    if (numErrors < 4) {
                        quizAttemptTotals[k][numErrors]++;
                    }
                }
                print(answerData);
            } else if (attempts.length > 0) {
                quizAnswers += attempts[attempts.length - 1].length;
                // User's first attempt
                var att = attempts[0];
                userCompletionCount++;
                for (var k = 0; k < att.length; k++) {
                    quizErrorTotals[k] += att[k];
                    if (att[k] < 4) {
                        quizAttemptTotals[k][att[k]]++;
                    }
                }
            }
        }
    }
    userData.quizData[i].quizErrorTotals = quizErrorTotals;
    userData.quizData[i].quizAttemptTotals = quizAttemptTotals;
    userData.quizData[i].userCompletionCount = userCompletionCount;
    userData.quizData[i].quizWatchData = quizWatchData;
    userData.quizData[i].views = viewCount;
    var totals = {
        "quizErrorTotals": quizErrorTotals,
        "quizAttemptTotals": quizAttemptTotals,
        "userCompletionCount": userCompletionCount,
        "quizWatchData": quizWatchData,
        "views": viewCount
    };
    $.ajax({
        url: "saveQuizTotals.php",
        type: "POST",
        data: {
            path: userData.quizData[i].relativePath,
            totals: JSON.stringify(totals)
        }
    });
}

function trySaveQuiz() {
    if (showingSaveButton) {
        // For each non-empty quiz:
        for (var i = 0; i < questions.length; i++) {
            var q = questions[i];
            if (!isQuestionEmpty(q)) {
                // Question must have text
                if (q.questionText.length == 0) {
                    showErrorBubble("Error: Question text cannot be empty", 20.85, i);
                    return;
                }
                if (q.type == "mc") {
                    // Question must have at least 2 answers
                    var answerCount = 0;
                    for (var j = 0; j < 5; j++) {
                        if (q.answerText[j].length > 0) {
                            answerCount++;
                        }
                    }
                    if (answerCount < 2) {
                        showErrorBubble("Error: Question must have at least 2 answers", 41.25, i);
                        return;
                    }
                    // Correct answer must be set
                    if (q.correctAnswer == 0) {
                        showErrorBubble("Error: Correct answer must be set", 41.25, i);
                        return;
                    }
                    // Correct answer must be nonempty
                    if (q.answerText[q.correctAnswer - 1].length == 0) {
                        showErrorBubble("Error: Correct answer must be non-empty", 41.25, i);
                        return;
                    }
                } else if (q.type == "fitb") {
                    // Answer must be non-empty
                    if (q.answerText[0].length == 0) {
                        showErrorBubble("Error: Answer must be non-empty", 33.5, i);
                        return;
                    }
                }
                // Question display time must be set
                if (!q.startTimeSet) {
                    showErrorBubble("Error: Question display time must be set", 59.35, i);
                    return;
                }
            }
        }
        cleanQuiz(true);
    }
}

function saveQuiz() {
    var quizTitle = $("#quizTitleInput").val();
    var toSend = {
        "title": quizTitle,
        "videoPath": videoPath,
        "questions": questions
    };
    jsonPath = videoPath.split("media")[0] + "json/quiz.json";
	console.log('quiz_io.js saveQuiz() : ' + jsonPath.split('/')[1] + ' , ' + jsonPath.split('/')[2])	//	Tony
    var jsonString = JSON.stringify(toSend);
    $.ajax({
        //type: "POST",
        url: "../vqLib/DAL",					//	Tony
        //url: "saveQuiz.php",					//	Remove Jim's path-depended loader.		-Tony
        data: {
            //'path': jsonPath,					//	Remove Jim's legacy path				-Tony
			'author': jsonPath.split('/')[1],	//	Tony
			'quizid': jsonPath.split('/')[2],	//	Tony
            'quiz': jsonString					//	Tony
            //'jsonData': jsonString			//	Remove Jim's indescript payload name	-Tony
        }
    }).done(function (data) {
		console.log(data);
        hideSaveButton();
    }).fail(function () {
        console.log("Uh oh! Something went wrong!");
    });
}

function playTrashAnimation() {
    // Reset trash animation
    resetTrashAnimation();
    // Open the trash and make things fall into the trash
    $("#deleteBoxTop1").addClass("anim_boxTop1Open");
    $("#deleteBoxTop2").addClass("anim_boxTop2Open");
    $("#deleteVideo").addClass("anim_deleteObjectFall");
    for (var i = 0; i < 20; i++) {
        setTimeout(function (j) {
            spawnTrashMarker(j);
        }, 50 * i + 250, i);
    }
    // After 2.25s, close the trash
    setTimeout(function () {
        $("#deleteBoxTop1").removeClass("anim_boxTop1Open");
        $("#deleteBoxTop2").removeClass("anim_boxTop2Open");
        $("#deleteBoxTop1").addClass("anim_boxTop1Close");
        $("#deleteBoxTop2").addClass("anim_boxTop2Close");
    }, 2250);
    // After 2.5s, start moving the trash box
    setTimeout(function () {
        $("#deleteBox").addClass("anim_deleteBoxMove");
        $("#deleteConveyor").addClass("anim_conveyorMove");
    }, 2500);
    setTimeout(function () {
        $("#deleteFlash").removeClass("anim_quickFadeOut");
        $("#deleteFlash").addClass("anim_quickFadeIn");
    }, 3500);
    setTimeout(function () {
        $("#deleteCheck").addClass("anim_spinDeleteCheck");
        $("#deleteFinishLabel").addClass("anim_deleteFinishLabelIn");
    }, 4000);
    setTimeout(function () {
        $("#deleteFlash").removeClass("anim_quickFadeIn");
        $("#deleteFlash").addClass("anim_quickFadeOut");
        resetTrashAnimation();
    }, 6000);
    setTimeout(function () {
        showMenuView();
        hideDeleteView();
        refreshUserData(loadUserData);
    }, 6125);
}

function resetTrashAnimation() {
    $("#deleteTrashMarkers").empty();
    $("#deleteBox").removeClass("anim_deleteBoxMove");
    $("#deleteConveyor").removeClass("anim_conveyorMove");
    $("#deleteBoxTop1").removeClass("anim_boxTop1Close");
    $("#deleteBoxTop2").removeClass("anim_boxTop2Close");
    $("#deleteVideo").removeClass("anim_deleteObjectFall");
    $("#deleteCheck").removeClass("anim_spinDeleteCheck");
    $("#deleteFinishLabel").removeClass("anim_deleteFinishLabelIn");
}

function spawnTrashMarker(i) {
    $("#deleteTrashMarkers").append("<div id='deleteTrashMarker" + i + "' class='deleteTrashMarker'></div>");
    $("#deleteTrashMarker" + i).css("left", (5 + 10 * Math.random()) + "%");
    if (i % 2 == 1) {
        $("#deleteTrashMarker" + i).css("background-image", "url(img/poke_red.svg)");
    } else {
        $("#deleteTrashMarker" + i).css("background-image", "url(img/poke_green.svg)");
    }
}

function updateConfirmDelete() {
    // Set button color
    if (confirmDeleteLevel == 0) {
        $("#deleteConfirm").css("background-color", "#808080");
    } else {
        $("#deleteConfirm").css("background-color", "#1c6e46");
    }
    if (confirmDeleteLevel != 4) {
        $("#deleteReturn").css("background-color", "#eb2529");
    } else {
        $("#deleteReturn").css("background-color", "#808080");
    }
    // Set button text
    if (confirmDeleteLevel <= 1) {
        $("#deleteConfirmText").text("Confirm");
    } else if (confirmDeleteLevel == 2) {
        $("#deleteConfirmText").text("Really?");
    } else if (confirmDeleteLevel == 3) {
        $("#deleteConfirmText").text("Actually?");
    } else if (confirmDeleteLevel >= 4) {
        $("#deleteConfirmText").text("Deleting...");
    }
    // Spin button
    $("#deleteConfirm").addClass("anim_spinPanel");
    setTimeout(function () {
        $("#deleteConfirm").removeClass("anim_spinPanel");
    }, 250);
    if (confirmDeleteLevel == 4) {
        $("#deleteViewBox").css("pointer-events", "none");
        $("#deleteReturn").addClass("anim_spinPanel");
        setTimeout(function () {
            $("#deleteReturn").removeClass("anim_spinPanel");
        }, 250);
    } else {
        $("#deleteViewBox").css("pointer-events", "auto");
    }
}

function deleteVideo() {
    var v = $("#deleteDropdown").val();
    var quizPathSplit = userData.quizData[v].relativePath.split("/");
    var quizID = quizPathSplit[quizPathSplit.length - 1];
    $.ajax({
        url: "deleteQuiz.php",
        data: {
            "quizID": quizID
        }
    }).done(function (data) {

    }).fail(function () {
        console.log("Uh oh! Something went wrong!");
    });
    playTrashAnimation();
}

function loadFilter(id) {
    var qp = userData.quizData[id].relativePath + "/json/filters.json";
	console.log('quiz_io.js loadFilter() : ' + qp.split('/')[1] + ' , ' + qp.split('/')[2])	//	Tony
    $.ajax({
        url: "../vqLib/DAL",					//	Tony
        //url: "loadQuiz.php",					//	Remove Jim's path-depended loader.	-Tony
        dataType: "json",
        data: {
            //quizPath: qp,						//	Remove Jim's legacy quizPath.		-Tony
			author: qp.split('/')[1],			//	Tony
			quizid: qp.split('/')[2],			//	Tony
			filter: ''							//	Tony
        }
    }).done(function (data) {
        // Load data
        if (data !== "{}") {
            filters = JSON.parse(data);
            refreshFilterList();
        } else {
            filters = {
                "filterList": []
            }
            refreshFilterList();
        }

    }).fail(function () {
        filters = {
            "filterList": []
        }
        refreshFilterList();
    });
}

function saveFilter(id) {
    var jsonPath = userData.quizData[id].relativePath + "/json/filters.json";
    var jsonString = JSON.stringify(filters);
    $.ajax({
        type: "POST",
        url: "saveQuiz.php",
        data: {
            'path': jsonPath,
            'jsonData': jsonString
        }
    }).done(function (data) {
        console.log("Saved filter.");
    }).fail(function () {
        console.log("Uh oh! Something went wrong!");
    });
}

function refreshFilterList() {
    $("#scoreReportFilterSelect").empty();
    $("#scoreReportFilterSelect").append('<option value="-1">All Users</option>');
    for (var i = 0; i < filters.filterList.length; i++) {
        var filter = filters.filterList[i];
        $("#scoreReportFilterSelect").append('<option value="' + i + '">' + filter.groupName + '</option>');
    }
}

function loadPermissions(id, isInitial) {
    var qp = userData.quizData[id].relativePath + "/json/permissions.json";
	console.log('quiz_io.js loadPermissions() : ' + qp.split('/')[1] + ' , ' + qp.split('/')[2])	//	Tony
    $.ajax({
        url: "../vqLib/DAL",						//	Tony
        //url: "loadQuiz.php",						//	Remove Jim's path-depended loader.	-Tony
        //dataType: "json",							//	Remove Jim's double JSON decode of loadQuiz.php's doubly encoded file.	-Tony
        data: {
            //quizPath: qp,							//	Remove Jim's legacy quizPath.		-Tony
			'author': qp.split('/')[1],				//	Tony
			'quizid': qp.split('/')[2],			//	Tony
			'permission': ''						//	Tony
        }
    }).done(function (data) {
		if (data !== "" && data !== "{}") {			//	Check for no data					-Tony
			// Load data
			var jsonData = JSON.parse(data);
			var canAccessData = jsonData.canAccessData;
			var str = "";
			for (var i = 0; i < canAccessData.length; i++) {
				str += canAccessData[i] + (i < canAccessData.length - 1 ? "\n" : "");
			}
			var canViewData = jsonData.canViewQuiz;
			var viewStr = "";
			if (canViewData != null && canViewData != undefined) {
				for (var i = 0; i < canViewData.length; i++) {
					viewStr += canViewData[i] + (i < canViewData.length - 1 ? "\n" : "");
				}
			}
			$("#permissionsReportInput").val(str);
			$("#permissionsViewInput").val(viewStr);
			var isPublic = jsonData.isPublic;
			var isPrivate = jsonData.isPrivate;
			if (!(isPublic == true)) {
				enablePublicMode = false;
				$("#publicCheckbox").removeClass("anim_checkboxOn");
				$("#publicCheckbox").addClass("anim_checkboxOff");
			} else {
				enablePublicMode = true;
				$("#publicCheckbox").removeClass("anim_checkboxOff");
				$("#publicCheckbox").addClass("anim_checkboxOn");
			}
			if (!(isPrivate == true)) {
				enablePrivateMode = false;
				$("#privateCheckbox").removeClass("anim_checkboxOn");
				$("#privateCheckbox").addClass("anim_checkboxOff");
			} else {
				enablePrivateMode = true;
				$("#privateCheckbox").removeClass("anim_checkboxOff");
				$("#privateCheckbox").addClass("anim_checkboxOn");
			}
			// Set netID to loan input placeholder
			$("#optionsLoanInput").attr("placeholder", userData.netID);
			var editorText = jsonData.editor;
			if (editorText != null && editorText != undefined) {
				$("#optionsLoanInput").val(editorText);
			} else {
				$("#optionsLoanInput").val("");
			}
			// Get editor data
			currentQuizEditor = "";
			currentQuizEditCode = "";
			currentQuizAuthor = "";
			currentQuizEditCode = "";
			if (jsonData.editor != null && jsonData.editor != undefined) {
				currentQuizEditor = jsonData.editor;
			}
			if (jsonData.editCode != null && jsonData.editCode != undefined) {
				currentQuizEditCode = jsonData.editCode;
			}
			if (jsonData.author != null && jsonData.author != undefined) {
				currentQuizAuthor = jsonData.author;
			}
			if (jsonData.quizCode != null && jsonData.quizCode != undefined) {
				currentQuizCode = jsonData.quizCode;
			}
			// Show "unsaved changes" warning if there are unsaved changes
			if (showingSaveButton) {
				$("#optionsLoanWarning").css("opacity", 1);
			} else {
				$("#optionsLoanWarning").css("opacity", 0);
			}
			// Set quiz link URL
			if (jsonData.author != null && jsonData.author != undefined) {
				$("#copyLinkBubbleText").val(userData.serverPath + jsonData.author + "/" + jsonData.quizCode + "/");
			} else {

			}
			if (isInitial) {
				reallyLoadQuiz(id);
			} else {
				showPermissionsView();
			}
		} else {
			$(".permissionsInput").val("");
			$("#optionsLoanInput").val("");
			enablePrivateMode = false;
			$("#privateCheckbox").removeClass("anim_checkboxOn");
			$("#privateCheckbox").addClass("anim_checkboxOff");
			enablePublicMode = false;
			$("#publicCheckbox").removeClass("anim_checkboxOn");
			$("#publicCheckbox").addClass("anim_checkboxOff");
			$("#optionsLoanInput").attr("placeholder", userData.netID);
			// No permissions, no editor
			currentQuizEditor = "";
			currentQuizEditCode = "";
			currentQuizAuthor = "";
			currentQuizEditCode = "";
			if (isInitial) {
				reallyLoadQuiz(id);
			} else {
				showPermissionsView();
			}
		}
    }).fail(function (d) {
        console.log("Permission loading failed: " + JSON.stringify(d));
    });
}

function savePermissions(id) {
    console.log(id);
	console.log(userData.quizData[id].relativePath)
    var jsonPath = userData.quizData[id].relativePath + "/json/permissions.json";
    console.log(jsonPath);
    var author = userData.quizData[id].relativePath.split("/")[1];
    var quizCode = userData.quizData[id].relativePath.split("/")[2];
    var permissionText = $("#permissionsReportInput").val();
    var permissionArray = permissionText.split("\n");
    var whitelistText = $("#permissionsViewInput").val();
    var whitelistArray = whitelistText.split("\n");
    var oldEditor = currentQuizEditor;
    var oldEditCode = currentQuizEditCode;
    var canReset= userData.quizData[id].canReset||true;
    var editorInput = $("#optionsLoanInput").val();
    var editor = (editorInput == userData.netID ? "" : editorInput);
    var editCode = "";
    if (editor == oldEditor) {
        editCode = oldEditCode;
    } else {
        if (editor == "") {
            editCode = "";
        } else {
            editCode = "temp" + (new Date().getTime());
        }
    }
    var permissionJson = { 
        "canReset":canReset,
        "canAccessData": permissionArray,
        "canViewQuiz": whitelistArray,
        "isPublic": enablePublicMode,
        "isPrivate": enablePrivateMode,
        "editor": editor,
        "editCode": editCode,
        "author": author,
        "quizCode": quizCode
    };
    var jsonString = JSON.stringify(permissionJson);
    var loanJson = {
        "author": author,
        "sourcePath": quizCode,
        "oldEditor": oldEditor,
        "oldCode": oldEditCode,
        "newEditor": editor,
        "newCode": editCode
    }
    $.ajax({
        type: "POST",
        url: "loanQuiz.php",
        data: loanJson
    }).done(function (data) {

    });
    currentQuizEditor = editor;
    currentQuizEditCode = editCode;
    updatePermissionLocks();
    // Save permissions
    $.ajax({
        //type: "POST",
        url: "../vqLib/DAL",					//	Tony
        //url: "saveQuiz.php",					//	Remove Jim's path-depended loader.		-Tony
        data: {
            //'path': jsonPath,					//	Remove Jim's legacy path				-Tony
			'author': jsonPath.split('/')[1],	//	Tony
			'quizid': jsonPath.split('/')[2],	//	Tony
			'permission': jsonString			//	Tony
            //'jsonData': jsonString			//	Remove Jim's indescript payload name	-Tony
        }
    }).done(function (data) {

    }).fail(function () {
        console.log("Uh oh! Something went wrong!");
    });

    // Set Public Mode status of the project
    $.ajax({
        type: "POST",
        url: "makePublic.php",
        data: {
            'path': userData.quizData[id].relativePath,
            'isPublic': enablePublicMode
        }
    }).done(function (data) {

    }).fail(function () {
        console.log("Uh oh! Something went wrong!");
    });
    // Reload quiz from file (discarding changes) if you're not the editor and there are changes
    if (currentQuizEditor != userData.netID && showingSaveButton) {
        reallyLoadQuiz(id);
    }
}

function batchAddPermissions(quizzes, users) {
    var quizzesToEdit = [];
    for (var i = 0; i < quizzes.length; i++) {
        if (quizzes[i] == true) {
            // Add permissions for this quiz.
            quizzesToEdit.push(userData.dirs[i]);
        }
    }
    $.ajax({
        type: "POST",
        url: "batchAddPermissions.php",
        data: {
            'quizzes': JSON.stringify(quizzesToEdit),
            'users': JSON.stringify(users)
        }
    }).done(function (data) {

    }).fail(function () {
        console.log("Uh oh! Something went wrong!");
    });
}
