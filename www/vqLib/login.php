<?php
$netID = $_SERVER['cn'];
$quizList = json_decode($_REQUEST['quizList']);
// asdf
foreach($quizList as $quizAuthor) {
    $author = $quizAuthor -> author;
    $quizzes = $quizAuthor -> quizzes;
    foreach($quizzes as $quiz) {
        $quizID = $quiz -> id;
        $actual_link_arr = explode("vqList", "http://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
        $actual_link = $actual_link_arr[0];
        $actual_link_https = str_replace("http://", "https://", $actual_link);
        $path = $author . "/" . $quizID;
        $quizLink = $actual_link_https . $path;
        $relativePath = "../" . $path;
        $jsonPath = $relativePath . "/json/quiz.json";
        $userDataPath = $relativePath . "/data/" . $netID;
        $quiz -> quizLink = $quizLink;
        $quiz -> completed = "false";
        if (file_exists($userDataPath)) {
            $userData = json_decode(file_get_contents($userDataPath));
            $attempts = $userData -> attempts;
            if (count($attempts) > 0) {
                $quiz -> completed = "true";
            }
        }
        $jsonData = json_decode(file_get_contents($jsonPath));
        $quiz -> title = $jsonData -> title;
    }
}
$data = new stdClass();
$data -> netID = $netID;
$data -> listData = $quizList;
print(json_encode($data));
?>