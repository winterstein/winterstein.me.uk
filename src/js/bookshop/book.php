<?php 

//echo $_GET["title"];
$target = $_GET["title"];
$target = trim($target);
if ( ! $target || count($target) == 0) {
    echo "FAIL";
} else {
    $target = preg_replace('/\b(a|and|the)\b/i', " ", $target);
    $target2 = urlencode($target);
    $url = "http://www.goodreads.com/search.xml?key=r32kkmhbJfChCeXSUrmQ&searchfield=title&q=$target2";
    //echo "<p>$url</p>";

    $str = 
        //'foo[title]1984[/title]1984 [title]Catch-22[/title]bar'; 
        file_get_contents($url);
    //$str = preg_replace('/</', "[", $target);

    $str2 = $str;
    $i = 0;
//    echo "Looping on $str2...<br>";

    $target = strtolower($target);
    $target = preg_replace('/(\b|^)(a|and|the)\b/i', " ", $target);
    $target = trim($target);
    $target = preg_replace('/\W+/', " ", $target);
    //echo "Target:[$target]<br>";

    $fnd = false;
    while($str2 && count($str2) > 0) {
	$pos = strpos($str2, '<title>');
	if ( ! $pos) break; // can't be 0 -- god php is ugly
	$pos2 = strpos($str2, '</title>');
	if ( ! $pos2) break;
//	echo "$pos $pos2<br>";
	$title = substr($str2, $pos+7, $pos2 - $pos - 7);
	$str2 = substr($str2, $pos2+7);
//        $str2 = strstr($str2, '<title>', false);
        //echo "str2=$str2<br>";
//        if ( ! $str2) break;
//        $str2 = substr($str2, 7);
//        $title = stristr($str2, '</title>', true);
//        echo("title=$title<br>");    
        $title2 = preg_replace('/\(.+?\)/', " ", $title);
        $title2 = strtolower($title2);
        $title2 = preg_replace('/\b(a|and|the)\b/i', " ", $title2);
        $title2 = preg_replace('/\W+/', " ", $title2);        
        $title2 = trim($title2);
//        echo("title now =$title2<br>");
        if (levenshtein($target, $title2) < 2) {
            //echo "<b>MATCH $target $title2</b>";
            echo $title;
            $fnd = true;
	    $pos = strpos($str2, '<name>');
	    $pos2 = strpos($str2, '</name>');
            //$author = strstr($str2, '<name>', false);
            if ($pos) {
                $author = substr($str2, $pos+6, $pos2-$pos-6);
                //$author = strstr($author, '</name>', true);                
                echo " by $author";
            }
            break;
        } else {
//            echo "No match: $target vs $title2";
//            echo levenshtein($target, $title2);
//            echo "<br>";
        }
        $i++;
        if ($i > 1000) break;
    }
    if ( ! $fnd) echo "FAIL";
}
//echo $str;

?>
