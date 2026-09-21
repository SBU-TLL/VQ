<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
//IVQ outside of bookMaker
session_start();
if(array_key_exists("lis_person_name_given", $_POST)){
        $_SESSION['mail']= $_POST['lis_person_contact_email_primary'];
        $_SESSION['givenName']= $_POST['lis_person_name_given'];
        $_SESSION['nickname']=  $_POST['lis_person_name_given'];;
        $_SESSION['sn']=  $_POST['lis_person_name_family'];
        $JSON_POST=json_encode($_POST);
        print <<<EOT
                <script src="/vq/vqPlayer/js/grading.js"></script>
                <script>
              var  ses=$JSON_POST;
        </script>
EOT;
}
#else if(array_key_exists("mail",$_SESSION)){
else if(isset($_SESSION['mail'])){
}
else{
        if (!isset($_SERVER['cn']) && file_exists(".htaccess")){
                $server= $_SERVER['SERVER_NAME'];
                $target = "https://${server}${_SERVER['REQUEST_URI']}";
header("Location: /shib/?shibtarget=$target");        
}
}

?>
<!DOCTYPE html>
<html>
<head>
<title>IVQ Player</title>
<link rel="stylesheet" type="text/css" href="/vq/vqPlayer/style.css" />
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>    
<script type="text/javascript" src="/vq/vqPlayer/js/progress.js"></script>
<script type="text/javascript" src="/vq/vqPlayer/js/css_browser_selector.js"></script>
<script type="text/javascript" src="/vq/vqPlayer/js/jpinst.js?new"></script>
<script type="text/javascript" src="/vq/vqPlayer/js/range-touch.js"></script>
<script type="text/javascript" src="/vq/vqPlayer/js/resize.js"></script>
<!--    <script src='/login/js/lti.js'></script>			-->



</head>

<body role="document">
<div id="stageCover">
<div id="coverTop" class="cover stripes"></div>
<div id="coverBottom" class="cover stripes"></div>
<div id="coverLeft" class="cover stripes"></div>
<div id="coverRight" class="cover stripes"></div>
</div>
<div id="stage" class="screen">
<div id="quiz">
<div id="videoPlayer">
<video id="videoBox"  autoplay playsinline>
<source src="media/video.mp4" type="video/mp4">
<source src="media/video.m4v" type="video/mp4">
<p class="text fs-20">Loading video...</p>
<!--<track src='../../../vqLib/DAL/?author=towan&videoid=4&vtt' default>-->
<!--<track src='media/video.vtt'>-->
<!--<track default>-->
</video>
<button type="button" id="bigPlay" class="playState" aria-label="Play video"></button>	<!-- Tony -->
</div>
<div id="quizTitle" class="text fs-26"></div>
<div id="toggleQuestionBox" class="rounded">
<div id="toggleQuestionBG"></div>
<div id="toggleQuestionText" class="text fs-18">Show/Hide Questions</div>
</div>
<div id="bblink"></div>
<button type="button" id="resetQuestionButton" class="btn" aria-label="Reset questions"></button>
<div id="resetQuestionBox" class="rounded">
<div id="resetQuestionBG"></div>
<div id="resetQuestionText" class="text fs-18">Reset Questions</div>
</div>
<button type="button" id="videoSkip" aria-label="Skip to unwatched sections"></button>
<div id="videoSkipBox" class="rounded">
<div id="videoSkipBG"></div>
<div id="videoSkipText" class="text fs-18">Skip to Unwatched Sections</div>
</div>

<button type="button" id="userInfoButton" aria-label="Show account information"></button>
<div id="userInfoBox" class="rounded">
<div id="userInfoBG"></div>
<div id="userInfoLogin" class="text fs-14">Signed in as [name].</div>
<div id="userInfoComplete" class="text fs-14">You have not completed this quiz yet.</div>
</div>
<div id="scoreBox">
<div id="scoreLabel" class="text fs-15">SCORE</div>
<div id="scoreNum" class="text fs-30">0</div>
<div id="scoreBarBox">
<div id="scoreBar"></div>
</div>
<div id="medals">
<div id="medal0" class="medal"></div>
<div id="medal1" class="medal"></div>
<div id="medal2" class="medal"></div>
</div>
<div id="scoreBubble">
<div id="scoreBubbleText" class="text fs-25">+250</div>
</div>
</div>
<div id="scoreInfo">
<div id="scoreInfoTitle">Scoring Information</div>
<div id="scoreInfoText">
The maximum score is 2000 points.
<br>
<br>
• Up to 1000 points can be earned by watching the video, based on the percentage of the video you've watched.
<br>
<br>
• Up to 1000 points can be earned by answering the questions correctly. However, answering a question incorrectly reduces the number of points earned.
</div>
</div>
<div id="buttonBank"></div>
<div id="quizBank">
<div id="questionBox">
<div id="questionBoxContents">
<div id="questionBoxBG" class="rounded"></div>
<div id="questionText" class="text fs-40"></div>
<div id="fillInPanels"></div>
<textarea id="fillInAnswer" class="rounded text fs-50"></textarea>
<div id="expoBox" class="rounded">
<div id="expoTitle" class="text fs-60">Correct</div>
<div id="expoText" class="text fs-30"></div>
<div id="expoButtons">
<button type="button" id="expoButtonReview" class="expoButton rounded" aria-label="Review question">
<span class="expoButtonText text fs-30">Review</span>
</button>
<button type="button" id="expoButtonRetry" class="expoButton rounded" aria-label="Retry question">
<span class="expoButtonText text fs-30">Retry</span>
</button>
<button type="button" id="expoButtonContinue" class="expoButton rounded" aria-label="Continue video">
<span class="expoButtonText text fs-30">Continue</span>
</button>
</div>
</div>
<button type="button" id="hideQuestionButton" class="btn" aria-label="Show video">
<span id="hideQuestionButtonLabel">
<span id="hideQuestionButtonBG" class="rounded"></span>
<span id="hideQuestionButtonText" class="text fs-18">Show Video</span>
</span>
</button>
</div>
</div>
</div>
<div id="smallQuestionBox">
<div id="smallQuestionBoxBG"></div>
<div id="smallQuestionText" class="text fs-35"></div>
<button type="button" id="showQuestionButton" class="btn" aria-label="Hide video">
<span id="showQuestionButtonLabel">
<span id="showQuestionButtonBG" class="rounded"></span>
<span id="showQuestionButtonText" class="text fs-17">Hide Video</span>
</span>
</button>
</div>
<div id="videoControls">
<button type="button" id="videoPlayPause" class="playPause playState btn" aria-label="Play or pause video"></button>
<input id="seekSlider" type="range" min="0" max="100" value="0" step="0.05">
<div id="seekSliderBG" class="fakeSlider">
<div id="seekSliderTrack">
<div id="seekSliderThumb"></div>
</div>
</div>

<div id="questionMarkers"></div>

<button type="button" id="toggleQuestionButton" class="btn" aria-label="Show or hide questions"></button>
<div id="timeDisplay">
<div id="timeDisplayText" class="text fs-23"></div>
<select id="playbackSpeed" class="text fs-15">
<option value="0.25">0.25x</option>
<option value="0.5">0.5x</option>
<option value="0.75">0.75x</option>
<option value="1" selected="selected">1x</option>
<option value="1.25">1.25x</option>
<option value="1.5">1.5x</option>
<option value="1.75">1.75x</option>
<option value="2">2x</option>
</select>
</div>
<button type="button" id="cc" class="on btn" aria-label="Toggle captions"></button> <!-- Tony -->
<div id='repair'  class='text'>repair</div>
<div id="repairBox"><form action="#"><textarea></textarea><input type="hidden"  id="startTime"/><input type="submit" value="ok"></input><form></div>
<button type="button" id="muteButton" class="btn muteOff" aria-label="Mute or unmute audio"></button>
<input id="volumeSlider" type="range" min="0" max="100" value="100" step="1">
<div id="volumeSliderBG" class="fakeSlider">
<div id="volumeSliderTrack">
<div id="volumeSliderThumb"></div>
</div>
</div>
</div>
<div id="gameCompleteText" class="text fs-25"></div>
<div id="noQuestionText" class="text fs-25"></div>
</div>
<div id="blocker">
<div id="blockerText">
<div id="blockerTitle" class="text fs-150">Locked</div>
<div id="blockerSubtitle" class="text fs-50">This quiz has been made private by its author.<br>To view it, you must receive permission from the author.</div>
</div>
</div>
</div>
</body>

</html>
