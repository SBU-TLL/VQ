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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IVQ Player</title>
    <link rel="stylesheet" type="text/css" href="/vq/vqPlayer/style.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>    
    <script type="text/javascript" src="/vq/vqPlayer/js/progress.js"></script>
    <script type="text/javascript" src="/vq/vqPlayer/js/css_browser_selector.js"></script>
    <script type="text/javascript" src="/vq/vqPlayer/js/jpinst.js?new"></script>
    <script type="text/javascript" src="/vq/vqPlayer/js/range-touch.js"></script>
    <script type="text/javascript" src="/vq/vqPlayer/js/resize.js"></script>
</head>

<body>
    <div id="stageCover" role="presentation">
        <div id="coverTop" class="cover stripes" aria-hidden="true"></div>
        <div id="coverBottom" class="cover stripes" aria-hidden="true"></div>
        <div id="coverLeft" class="cover stripes" aria-hidden="true"></div>
        <div id="coverRight" class="cover stripes" aria-hidden="true"></div>
    </div>
    
    <main id="stage" class="screen">
        <div id="quiz" role="application" aria-label="Interactive Video Quiz">
            <div id="videoPlayer" role="region" aria-label="Video Player">
                <video id="videoBox" autoplay playsinline controls>
                    <source src="media/video.mp4" type="video/mp4">
                    <source src="media/video.m4v" type="video/mp4">
                    <p class="text fs-20">Your browser doesn't support HTML5 video. Here is a <a href="media/video.mp4">link to the video</a> instead.</p>
                </video>
                <button id="bigPlay" class="playState" aria-label="Play/Pause Video"></button>
            </div>

            <h1 id="quizTitle" class="text fs-26"></h1>

            <button id="toggleQuestionBox" class="rounded" aria-expanded="false">
                <div id="toggleQuestionBG"></div>
                <span id="toggleQuestionText" class="text fs-18">Show/Hide Questions</span>
            </button>

            <div id="bblink" role="complementary"></div>

            <button id="resetQuestionButton" class="btn" aria-label="Reset Questions">
                <div id="resetQuestionBox" class="rounded">
                    <div id="resetQuestionBG"></div>
                    <span id="resetQuestionText" class="text fs-18">Reset Questions</span>
                </div>
            </button>

            <button id="videoSkip" aria-label="Skip to Unwatched Sections">
                <div id="videoSkipBox" class="rounded">
                    <div id="videoSkipBG"></div>
                    <span id="videoSkipText" class="text fs-18">Skip to Unwatched Sections</span>
                </div>
            </button>

            <div id="userInfoButton" role="region" aria-label="User Information">
                <div id="userInfoBox" class="rounded">
                    <div id="userInfoBG"></div>
                    <div id="userInfoLogin" class="text fs-14" aria-live="polite">Signed in as [name].</div>
                    <div id="userInfoComplete" class="text fs-14" aria-live="polite">You have not completed this quiz yet.</div>
                </div>
            </div>

            <div id="scoreBox" role="region" aria-label="Score Information">
                <div id="scoreLabel" class="text fs-15">SCORE</div>
                <div id="scoreNum" class="text fs-30" aria-live="polite">0</div>
                <div id="scoreBarBox" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                    <div id="scoreBar"></div>
                </div>
                <div id="medals" aria-label="Achievement Medals">
                    <div id="medal0" class="medal" role="img" aria-label="Bronze Medal"></div>
                    <div id="medal1" class="medal" role="img" aria-label="Silver Medal"></div>
                    <div id="medal2" class="medal" role="img" aria-label="Gold Medal"></div>
                </div>
                <div id="scoreBubble" aria-live="polite">
                    <div id="scoreBubbleText" class="text fs-25">+250</div>
                </div>
            </div>

            <div id="scoreInfo" role="dialog" aria-label="Scoring Information">
                <h2 id="scoreInfoTitle">Scoring Information</h2>
                <div id="scoreInfoText">
                    <p>The maximum score is 2000 points.</p>
                    <ul>
                        <li>Up to 1000 points can be earned by watching the video, based on the percentage of the video you've watched.</li>
                        <li>Up to 1000 points can be earned by answering the questions correctly. However, answering a question incorrectly reduces the number of points earned.</li>
                    </ul>
                </div>
            </div>

            <div id="buttonBank" role="group" aria-label="Question Navigation"></div>

            <div id="quizBank" role="region" aria-label="Quiz Questions">
                <div id="questionBox" role="form">
                    <div id="questionBoxContents">
                        <div id="questionBoxBG" class="rounded"></div>
                        <div id="questionText" class="text fs-40" role="heading" aria-level="2"></div>
                        <div id="fillInPanels" role="group" aria-label="Answer Options"></div>
                        <textarea id="fillInAnswer" class="rounded text fs-50" aria-label="Your Answer"></textarea>
                        
                        <div id="expoBox" class="rounded" role="alert" aria-live="polite">
                            <h3 id="expoTitle" class="text fs-60">Correct</h3>
                            <div id="expoText" class="text fs-30"></div>
                            <div id="expoButtons" role="group" aria-label="Question Navigation">
                                <button id="expoButtonReview" class="expoButton rounded">
                                    <span class="expoButtonText text fs-30">Review</span>
                                </button>
                                <button id="expoButtonRetry" class="expoButton rounded">
                                    <span class="expoButtonText text fs-30">Retry</span>
                                </button>
                                <button id="expoButtonContinue" class="expoButton rounded">
                                    <span class="expoButtonText text fs-30">Continue</span>
                                </button>
                            </div>
                        </div>

                        <button id="hideQuestionButton" class="btn">
                            <div id="hideQuestionButtonLabel">
                                <div id="hideQuestionButtonBG" class="rounded"></div>
                                <span id="hideQuestionButtonText" class="text fs-18">Show Video</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div id="videoControls" role="group" aria-label="Video Controls">
                <button id="videoPlayPause" class="playPause playState btn" aria-label="Play/Pause"></button>
                <input id="seekSlider" type="range" min="0" max="100" value="0" step="0.05" aria-label="Video Progress">
                <div id="seekSliderBG" class="fakeSlider" aria-hidden="true">
                    <div id="seekSliderTrack">
                        <div id="seekSliderThumb"></div>
                    </div>
                </div>

                <div id="questionMarkers" aria-hidden="true"></div>

                <button id="toggleQuestionButton" class="btn" aria-label="Toggle Questions"></button>
                
                <div id="timeDisplay" role="timer" aria-label="Video Time">
                    <div id="timeDisplayText" class="text fs-23"></div>
                    <label for="playbackSpeed" class="sr-only">Playback Speed</label>
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

                <button id="cc" class="on btn" aria-label="Toggle Closed Captions"></button>
                
                <button id="repair" class="text" aria-label="Report Issue">repair</button>
                
                <div id="repairBox" role="dialog" aria-label="Report Issue Form">
                    <form action="#">
                        <label for="repairText" class="sr-only">Describe the issue</label>
                        <textarea id="repairText"></textarea>
                        <input type="hidden" id="startTime"/>
                        <button type="submit">Submit</button>
                    </form>
                </div>

                <button id="muteButton" class="btn muteOff" aria-label="Mute/Unmute"></button>
                <input id="volumeSlider" type="range" min="0" max="100" value="100" step="1" aria-label="Volume Control">
                <div id="volumeSliderBG" class="fakeSlider" aria-hidden="true">
                    <div id="volumeSliderTrack">
                        <div id="volumeSliderThumb"></div>
                    </div>
                </div>
            </div>

            <div id="gameCompleteText" class="text fs-25" role="alert" aria-live="polite"></div>
            <div id="noQuestionText" class="text fs-25" role="alert" aria-live="polite"></div>
        </div>

        <div id="blocker" role="alert">
            <div id="blockerText">
                <h2 id="blockerTitle" class="text fs-150">Locked</h2>
                <p id="blockerSubtitle" class="text fs-50">This quiz has been made private by its author.<br>To view it, you must receive permission from the author.</p>
            </div>
        </div>
    </main>
</body>
</html>
