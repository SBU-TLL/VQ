<pre>
<?php
$arr = implode(".", explode(".", $_SERVER['REMOTE_ADDR'], -1));
if ($arr == "129.49.17") {
    if (isset($_GET['deleteFile'])) {
        $fileToDelete = $_GET['deleteFile'];
        $splitPath = explode("/", $fileToDelete);
        $pathToDelete = "../" . $splitPath[1] . "/.trash/" . $splitPath[3];
        `rm -rf $pathToDelete`;
        print("Deleted " . $pathToDelete . "! :)");
    }
    exec('find .. -name ".trash"', $output);
    foreach($output as $dir) {
        $out2 = "";
        exec("ls $dir", $out2);
        foreach($out2 as $file) {
            if (isset($_GET['deleteAll'])) {
                `rm -rf $dir/$file`;
                print("DOOM FOR EVERYONE!!!!!!!!!<br>");
            }
            else {
                print_r("<a href='?deleteFile=$dir/$file'>$dir/$file</a><br><br>");
            }
        }
    }
    print_r("<a href='?deleteAll=true'>Delete All</a>");
}
?>
</pre>
