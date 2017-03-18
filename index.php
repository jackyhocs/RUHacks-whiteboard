<!DOCTYPE html>
<html>

    <head>
        <h1>Drawing thing</h1>
    </head>
    <div style="width:70%; float:left">
    <body>
        <canvas id="drawCanvas" width="800" height="600"></canvas>
        <br>
        <button id="clearCanvas" onclick="clearCanvas()" >Clear</button>
        <button id="changeBrush" onclick="changeColor()" >Erase</button>
    </body>
    <script src="https://cdn.pubnub.com/pubnub.min.js"></script>
    <script type="text/javascript">
        var PUBNUB_demo = PUBNUB.init({
            publish_key: 'pub-c-322f1648-4777-4661-8d79-3beaa73059a9',
            subscribe_key: 'sub-c-8daa3c1e-0b83-11e7-b34d-02ee2ddab7fe'
        });
    </script>
        
    <script src="javascript/canvas.js"></script>
    </div>
    <div style="width:30%; float:right">
        <?php
session_start();

if(isset($_GET['logout'])){	
	
	//Simple exit message
	$fp = fopen("log.html", 'a');
	fwrite($fp, "<div class='msgln'><i>User ". $_SESSION['name'] ." has left the chat session.</i><br></div>");
	fclose($fp);
	
	session_destroy();
	header("Location: index.php"); //Redirect the user
}

function loginForm(){
	echo'
	<div id="loginform">
	<form action="index.php" method="post">
		<p>Please enter your name to continue:</p>
		<label for="name">Name:</label>
		<input type="text" name="name" id="name" />
		<input type="submit" name="enter" id="enter" value="Enter" />
        <select id="colour" name="colour">
          <option value="red">Red</option>
          <option value="orange">Orange</option>
          <option value="yellow">Yellow</option>
          <option value="cyan">Cyan</option>
          <option value="blue">Blue</option>
        </select>
	</form>
	</div>
	';
}

if(isset($_POST['enter']) && $_POST['name'] != ""){
    $_SESSION['name'] = stripslashes(htmlspecialchars($_POST['name']));
    echo'
        <script src="javascript/canvas.js">
        initialColour("<?php echo $_POST["colour"]; ?>")
        </script>
    ';
}
else{
	echo '<span class="error">Please type in a name</span>';
	}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Chat - Customer Module</title>
<link type="text/css" rel="stylesheet" href="stylesheet/style.css" />
</head>

<?php
if(!isset($_SESSION['name'])){
	loginForm();
}
else{
?>
<div id="wrapper">
	<div id="menu">
		<p class="welcome">Welcome, <b><?php echo $_SESSION['name']; ?></b></p>
		<p class="logout"><a id="exit" href="#">Exit Chat</a></p>
		<div style="clear:both"></div>
	</div>	
	<div id="chatbox"><?php
	if(file_exists("log.html") && filesize("log.html") > 0){
		$handle = fopen("log.html", "r");
		$contents = fread($handle, filesize("log.html"));
		fclose($handle);
		
		echo $contents;
	}
	?></div>
	
	<form name="message" action="">
		<input name="usermsg" type="text" id="usermsg" size="63" />
		<input name="submitmsg" type="submit"  id="submitmsg" value="Send" />
	</form>
</div>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js"></script>
<script type="text/javascript">
// jQuery Document
$(document).ready(function(){
	//If user submits the form
	$("#submitmsg").click(function(){	
		var clientmsg = $("#usermsg").val();
		$.post("post.php", {text: clientmsg});				
		$("#usermsg").attr("value", "");
		return false;
	});
	
	//Load the file containing the chat log
	function loadLog(){		
		var oldscrollHeight = $("#chatbox").attr("scrollHeight") - 20;
		$.ajax({
			url: "log.html",
			cache: false,
			success: function(html){		
				$("#chatbox").html(html); //Insert chat log into the #chatbox div				
				var newscrollHeight = $("#chatbox").attr("scrollHeight") - 20;
				if(newscrollHeight > oldscrollHeight){
					$("#chatbox").animate({ scrollTop: newscrollHeight }, 'normal'); //Autoscroll to bottom of div
				}				
		  	},
		});
	}
	setInterval (loadLog, 2500);	//Reload file every 2.5 seconds
	
	//If user wants to end session
	$("#exit").click(function(){
		var exit = confirm("Are you sure you want to end the session?");
		if(exit==true){window.location = 'index.php?logout=true';}		
	});
});
</script>
<?php
}
?>
</body>
</html>
    </div>
</html>
