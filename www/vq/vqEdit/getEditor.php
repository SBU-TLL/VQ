<?php
$data = json_decode(file_get_contents($_REQUEST['permissionsPath']));
$out = new stdClass();
$out -> editor = "";
$out -> author = "";
if (isset($data -> editor)) {
    $out -> editor = $data -> editor;
}
if (isset($data -> author)) {
    $out -> author = $data -> author;
}
print(json_encode($out));
?>
