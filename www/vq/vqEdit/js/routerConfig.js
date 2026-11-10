function initRouter() {
//    $(window).on('hashchange', function () {
//        checkRouter();
//    });
    checkRouter();
}

function checkRouter() {
    var hash = window.location.hash;
    var hashSplit = hash.split("/");
    // Check for various paths
    // Statistics
    if (hashSplit[1] == "stats") {
        // Check to see if any particular quiz was hit
        if (hashSplit.length >= 4) {
            var quizHit = checkRouterQuizPath(hashSplit[2], hashSplit[3]);
            if (quizHit > -1) {
                showStats();
                $("#quizStatsSelect").val(quizHit);
                $("#quizStatsSelect").change();
                if (hashSplit.length >= 5) {
                    if (hashSplit[4] == "scores") {
                        showScoreReport();
                    }
                }
            } else {
                showStats();
            }
        } else {
            showStats();
        }
    }
}

function checkRouterQuizPath(userID, quizID) {
    for (var i = 0; i < userData.quizData.length; i++) {
        var path = userData.quizData[i].relativePath;
        var pathSplit = path.split("/");
        if (pathSplit[1] == userID && pathSplit[2] == quizID) {
            return i;
        }
    }
    return -1;
}