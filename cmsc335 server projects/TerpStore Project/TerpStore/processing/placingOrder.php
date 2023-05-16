<?php
$upperBody = <<<EOBODY
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <!-- For responsive page -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Placing Order Response</title>
    <style>
        strong {
            color: red;
        }
    </style>
</head>

<body>
EOBODY;
    print $upperBody;
	print "<h1>";
	print "<strong>Serial Number: </strong> ".$_POST["serialNumber"]."<br>\n";
    print "<strong>Credit Card #: </strong> ".$_POST["cc1"]."-".$_POST["cc2"];
    print "-".$_POST["cc3"]."-".$_POST["cc4"]."<br>\n"; 
	print "<strong>Shipping Address: </strong>".$_POST["shipping"]."<br>\n";

    print "\n<strong>Email Address: </strong>";
    print $_POST["email"]."<br>\n";
    print "</h1>";
    print "</body></html>"
?>
