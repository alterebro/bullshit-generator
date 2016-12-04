<?php
$q = (isset($_GET) && isset($_GET['q'])) ? $_GET['q'] : false;

if ( $q ) {

	$q = rawurlencode($q);
	$lang = 'en'; // es
	$url = 'https://suggestqueries.google.com/complete/search?client=firefox&hl='.$lang.'&q=' . $q;

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_ENCODING, 'UTF-8');
	curl_setopt($ch, CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');

	$data = curl_exec($ch);
	curl_close($ch);

} else {

	$data = '[]';
}

header('content-type: application/json; charset=utf-8');
echo $data;
