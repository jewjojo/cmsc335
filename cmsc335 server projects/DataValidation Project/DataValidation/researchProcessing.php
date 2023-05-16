<?php
include_once('support.php');

$title = "Database Entry Confirmation";
$body = <<<EOBODY
	<h1>$title</h1>
	<h3>Information Provided:</h3>
	<p>
		<em>FirstName:</em> {$_GET['firstname']}<br />
		<em>LastName:</em> {$_GET['lastname']}<br />
                <em>Phone Number:</em> {$_GET['phoneFirstPart']}-{$_GET['phoneSecondPart']}-{$_GET['phoneThirdPart']}<br />
    		<em>Email:</em> {$_GET['email']}<br />
                <em>Age:</em> {$_GET['age']}<br />
                <em>Height:</em> {$_GET['heightFeet']}&nbsp;{$_GET['heightInches']}<br />
                <em>Weight:</em> {$_GET['weight']}<br />
                <em>Conditions:</em> <br />
EOBODY;
                if (isset($_GET['highBloodPressure']))
                    $body .= $_GET['highBloodPressure']."<br />";
                if (isset($_GET['diabetes']))
                    $body .= $_GET['diabetes']."<br />";
                if (isset($_GET['glaucoma']))
                    $body .= $_GET['glaucoma']."<br />";
                if (isset($_GET['asthma']))
                    $body .= $_GET['asthma']."<br />";
                if (isset($_GET['none']))
                    $body .= $_GET['none']."<br />";
                
$body .= <<<EOBODY
                <em>Time Period:</em> {$_GET['period']}<br />
                <em>Study Type:</em> {$_GET['studyType']}<br />
                <em>Study Id:</em> {$_GET['firstFourDigits']}-{$_GET['secondFourDigits']}<br />
                <em>Comments:</em> {$_GET['comments']}<br />		
	</p>
	<p>
		Data has been entered in the database.
	</p>
EOBODY;


# Generating final page
echo generatePage($body, $title);	
?>
