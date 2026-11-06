

// Allows the user to upload and download CSV files containing quiz questions.
function loadQuestionCSV(csvData) {
  questions = [];
  var csvRows = csvData.split(/[\r\n]+/g);
  for (var i = 0; i < 20; i++) {
    if (csvRows.length > i + 1) {
      var rowData = csvRows[i + 1].split(",");
      if (csvRows[i + 1].length != 0) {
        var answers = 0;
        for (var k = 1; k <= 5; k++) {
          if (rowData[k] != "") {
            answers++;
          }
        }
        var qType = (answers == 1 ? "fitb" : "mc");
        questions[i] = {
          "type": qType,
          "questionText": rowData[0],
          "answerText": [rowData[1], rowData[2], rowData[3], rowData[4], rowData[5], rowData[6]],
          "correctAnswer": rowData[7],
          "startTime": rowData[8],
          "wrongTime": rowData[9],
          "startTimeSet": (String(rowData[8]).length == 0 ? false : true),
          "wrongTimeSet": (String(rowData[9]).length == 0 ? false : true)
        }
      }

    } else {

    }
  }
  resetMarkers();
  for (var i = Math.min(20, questions.length); i >= 0; i--) {
    updateQuestionPanel(i, true);
  }
  updateEditorView();
  showSaveButton();
}

function newLoadQuestionCSV(csvString) {
  var result = Papa.parse(csvString);
  questions = [];
  var csvRows = result.data;
  csvRows.splice(0, 1);
  for (var i = 0; i < 20; i++) {
    if (csvRows.length > i) {
      var rowData = csvRows[i];
      if (csvRows[i].length != 0) {
        var answers = 0;
        for (var k = 1; k <= 6; k++) {
          if (rowData[k] != "") {
            answers++;
          }
        }
        var qType = (answers == 1 ? "fitb" : "mc");
        questions[i] = {
          "type": qType,
          "questionText": rowData[0],
          "answerText": [rowData[1], rowData[2], rowData[3], rowData[4], rowData[5],rowData[6]],
          "correctAnswer": rowData[6],
          "startTime": rowData[7],
          "wrongTime": rowData[8],
          "startTimeSet": (String(rowData[7]).length == 0 ? false : true),
          "wrongTimeSet": (String(rowData[8]).length == 0 ? false : true)
        }
      }

    } else {

    }
  }
  resetMarkers();
  for (var i = Math.min(20, questions.length); i >= 0; i--) {
    updateQuestionPanel(i, true);
  }
  updateEditorView();
  showSaveButton();
}

function newDownloadQuestionCSV() {
  var dataToUnparse = [];
  dataToUnparse[0] = ["Question Text", "Answer Choice 1", "Answer Choice 2", "Answer Choice 3", "Answer Choice 4", "Answer Choice 5", "Answer Choice 6","Correct Answer Number", "Display Time", "Wrong Time"];
  for (var i = 0; i < questions.length; i++) {
    dataToUnparse[i + 1] = [];
    var q = questions[i];
    if ((q.questionText != "" && q.answerText[0] != "") || true) {
      dataToUnparse[i + 1].push(q.questionText);
      for (var j = 0; j < 6; j++) {
        dataToUnparse[i + 1].push(q.answerText[j]);
      }
      dataToUnparse[i + 1].push(q.correctAnswer);
      dataToUnparse[i + 1].push(q.startTime);
      dataToUnparse[i + 1].push(q.wrongTime);
    }
  }
  var csvString = Papa.unparse(dataToUnparse);

  var out = "\ufeff" + csvString;
  // Make a file
  output = "data:application/csv;charset=utf-8," + encodeURI(out);

  // Download file
  var link = document.createElement('a');
  link.setAttribute('href', output);
  link.download = "quiz.csv";
  document.body.appendChild(link);

  var browser=BrowserCheck();

  if(browser[0] = "Safari" && parseInt(browser[1]) < 10.1){
    $("#myModal").css("display","block");
  }else{
    link.click();
  }
}

function BrowserCheck()
{
    var N= navigator.appName, ua= navigator.userAgent, tem;
    var M= ua.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) {M[2]=tem[1];}
    M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
    return M;
}

// Allows the user to download a CSV file containing the student response data for one quiz.
function downloadQuizDataCSV(mode, whitelist, quizName, sectionName) {
  if ($("#quizStatsSelect").val() > -1) {
    var out = "";
    // Get current quiz
    var quizID = $("#quizStatsSelect").val();
    var quiz = userData.quizData[quizID];
    var questionCount = quiz.questionData.questions.length;
    var students = quiz.playerData;
    if (mode == 1) {
      // Header, line 1
      out += '"Video Quiz Statistics","' + quiz.title + '","Acquired ' + userData.accessDate + '"\n';
      // Header, line 2
      out += '"NetID","First Name","Preferred Name","Last Name","Completion Date","Last Access Date","Time Watched (seconds)","Score","First Try Score","Mistakes: Total"';
      for (var i = 1; i <= questionCount; i++) {
        out += ',"Q' + i + '"';
      }
      var responseIDs = [];
      for (var i = 0; i < questionCount; i++) {
        if (quiz.questionData.questions[i].type == "sr") {
          out += ',"Response ' + (i + 1) + '"';
          responseIDs.push(i);
        }
      }
      out += "\n";
      // Iterate through students and print a line for each
      for (var i = 0; i < students.length; i++) {
        if (whitelist.length == 0 || contains(whitelist, students[i].netID)) {
          var stln = '';
          stln += '"' + students[i].netID + '","' + students[i].firstname + '","' + students[i].nickname + '","' + students[i].lastname;
          stln += '","';
          if (students[i].completeDate) {
            stln += new Date(students[i].completeDate).toLocaleString();
          }
          stln += '","';
          if (students[i].lastAccessDate) {
            stln += new Date(students[i].lastAccessDate).toLocaleString();
          }
          stln += '",' + arraySum(students[i].watchData) + "," + (Math.floor(100 * computeScore(students[i])) / 100) + ",";
        if (students[i].firstQuizScore){
	 stln +=students[i].firstQuizScore;
	} 
	 stln += ','; 
	if (students[i].answerData) {
            print(students[i].answerData);
            var wrongLine = "";
            var wrongTotal = 0;
            for (var j = 0; j < questionCount; j++) {
              wrongLine += ",";
              if (  students[i].answerData[j] && students[i].answerData[j].correct) {
                var wrongAnswers = students[i].answerData[j].answers.length - 1;
                wrongTotal += wrongAnswers;
                wrongLine += wrongAnswers;
              }
            }
            stln += wrongTotal + wrongLine;
          } else if (students[i].attempts != undefined) {
            if (students[i].attempts.length > 0) {
              stln += arraySum(students[i].attempts[0]);
              for (var j = 0; j < students[i].attempts[0].length; j++) {
                stln += "," + students[i].attempts[0][j];
              }
            }
          }
          if (students[i].responses) {
            for (var j = 0; j < responseIDs.length; j++) {
              var respID = responseIDs[j];
              if (students[i].responses[respID]) {
                stln += "," + students[i].responses[respID];
              } else {
                stln += ",";
              }
            }
          }
          stln += "\n";
          out += stln;
        }
      }
    } else if (mode == 2) {
      // Header
      out += '"Username","IVQ: ' + quiz.title + '"\n';
      for (var i = 0; i < students.length; i++) {
        if (whitelist.length == 0 || contains(whitelist, students[i].netID)) {
          var stln = '';
          var quizOK = false;
          // Check if the new answerData is available. Otherwise, fallback to old format.
          if (students[i].answerData) {
            quizOK = true;
            for (var j = 0; j < students[i].answerData.length; j++) {
              if (!students[i].answerData[j].correct) {
                quizOK = false;
              }
            }
          } else {
            if (students[i].attempts != undefined) {
              if (students[i].attempts.length > 0) {
                quizOK = true;
              }
            }
          }
          stln += students[i].netID + "," + (quizOK ? 1 : 0) + "\n";
          out += stln;
        }
      }
    } else if (mode == 3) {
      out += '"Username","IVQ: ' + quiz.title + '"\n';
      for (var i = 0; i < students.length; i++) {
        if (whitelist.length == 0 || contains(whitelist, students[i].netID)) {
          var stln = '';
          var scoreString = computeScore(students[i]);
          stln += students[i].netID + "," + scoreString + "\n";
          out += stln;
        }
      }
    }
    out = "data:text/csv;charset=utf-8," + out;
    // Make a file
    output = encodeURI(out);
    // Download file
    var link = document.createElement('a');
    link.setAttribute('href', output);
    if (mode == 1) {
      link.setAttribute('download', "QuizData-" + quizName + "-" + sectionName + ".csv");
    } else if (mode == 2) {
      link.setAttribute('download', "BlackboardData-" + quizName + "-" + sectionName + ".csv");
    } else if (mode == 3) {
      link.setAttribute('download', "BlackboardData-" + quizName + "-" + sectionName + ".csv");
    }
    link.click();
  } else {

  }
}

function computeScore(student) {
  if (student.answerData) {
    // Compute score
    var score = 0;
    for (var j = 0; j < student.answerData.length; j++) {
      var ans = student.answerData[j];
      if (ans.correct) {
        score += ans.score * 50 * (1 / student.answerData.length);
      }
    }
    var watchedSeconds = 0;
    for (var j = 0; j < student.watchData.length; j++) {
      if (student.watchData[j] > 0) {
        watchedSeconds++;
      }
    }
    if (student.answerData.length == 0) {
      score = 100 * watchedSeconds / student.watchData.length;
    } else {
      score += 50 * watchedSeconds / student.watchData.length;
    }
    return score;
  } else {
    // No score to compute
    return "";
  }

}

function loadFilterCSV(csvData) {
  questions = [];
  var csvRows = csvData.split(/[\r\n]+/g);
  filters.filterList = [];
  for (var i = 0; i < csvRows.length; i++) {
    var row = csvRows[i].split(",");
    var id = row[0];
    var group = row[1];
    var groupExists = false;
    for (var j = 0; j < filters.filterList.length; j++) {
      if (filters.filterList[j].groupName == group) {
        filters.filterList[j].members.push(id);
        groupExists = true;
      }
    }
    if (!groupExists) {
      var newGroup = {
        "groupName": group,
        "members": []
      };
      newGroup.members.push(id);
      filters.filterList.push(newGroup);
    }
  }
  refreshFilterList();
  saveFilter(currentQuiz);
}

function downloadFilterCSV() {
  var out = '';
  for (var i = 0; i < filters.filterList.length; i++) {
    var filter = filters.filterList[i];
    for (var j = 0; j < filter.members.length; j++) {
      var line = '"' + filter.members[j] + '","' + filter.groupName + '"\n';
      out += line;
    }
  }
  
  // Make a file
  output = "data:application/csv;charset=utf-8," + encodeURI(out);

  // Download file
  var link = document.createElement('a');
  link.setAttribute('href', output);
  link.download = "filters.csv";
  document.body.appendChild(link);

  var browser=BrowserCheck();

  if(browser[0] = "Safari" && parseInt(browser[1]) < 10.1){
    $("#myModal").css("display","block");
  }else{
    link.click();
  }
}
