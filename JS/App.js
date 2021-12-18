
var socket = io();

var name = getQueryVariable("name") || "sudeerkumar";
var room = getQueryVariable("room") || "No Room Selected";

$(".room-title").text(room);

socket.on("connect" , function() {
console.log("Connected tp Socket I/O Server!");
console.log(name + "wants to join  " + room);

socket.emit('joinRoom', {
    name: name,
    room: room
    });
    });

//check if there is any typing is happening or not
    var timeout;

    function timeoutFunction() {
    typing = false;

    socket.emit('typing' , {
    text: " "
    });
    }
// when ever key is pressed for typing message appears
    $('#messagesbox').keyup(function(){
    console.log('happening')
    typing =true;
    $("#icon-type").removeClass();

    socket.emit('typing',{
    text: name + " is typing ................. "
    });
    clearTimeout(timeout);
    timeout =setTimeout(timeoutFunction ,1000);
    });

// below code is for checking for page visiblity api
     var hidden, visibilityChange;
     if (typeof document.hidden !== "undefined" ) {
     hidden = "hidden";
     visibilityChange = "visibilityChange";
     }
     else if (typeof document.mozHidden !== "undefined"){
     hidden = "mozHidden";
     visibilityChange = "mozvivsibilityChange";
     }
     else if (typeof document.msHidden !=="undefined") {
     hidden = "msHidden";
     visibilityChange = "msvisiblityChange";
     }
     else if (typeof document.webkitHidden ! == "undefined" ){
     hidden = "webkitHidden";
     visibilityChange = "webkitvisibilityChange";
     }

//listening for typeing event
    socket.on("typing", function(message){
    $(".typing").text(message.text);
    });
    socket.on("userSeen", function(msg)){
    /*if(msg.user == name){
    read message
    show messages only to user who has typed.*/
    var icon = $("#icon-type");
    icon.removeClass();
    icon.addClass("fa fa-check-circle");
    if(msg.read){

   //user read the messages
   icon.addClass("msg-read");
   }else{
   //message delivered but not read yet.
   icon.addClass("msg-delivered");
   }
    console.log(msg);
   });

   //setup for custom events

   socket.on("message", function(message) {
   console.log("New Message !");
   console.log(message.text);
   //insert messages into container
   var $messages = $(".messages");
   var $messages = $('<li class = "list-group-item></li>');

   var momentTimestamp =moment.utc(message.timestamp).local().format("hh:mm a");
   $message.append("<strong>" + momentTimestamp + "  " + message.name + "<strong>");
   $message.append("<p>" + message.text + "</p");
   $messages.append($message);
   //manage auto scroll
   var obj = $("ul.messages.list-group");
   var offset = obj.offset();
   var scrollLength = obj[0].scrollHeight;
   $("ul.messages. list-group").animate
   ({
   scrollTop: scrollLength - offset.top
   });
//to notify when user has not pen chat view.

    if (document [hidden]) {
    notifyMe(message);
    var umsg = {
    text: name + "has not see the message" ,
    read: false
    };
    socket.emit("userSeen", umsg);
    }else
    {
    //notify  server that user seen message
    var umsg ={
    text:name + " has seen message",
    read: true,
    user:name
    };
    socket.emit("userSerrn", umsg);
    }
    });

    //handles submitting of new messages
    var $form = $("#messageForm");
    var $message1 =  $form.find('input [name = message]');
$form.on("submit", function(event){
event.preventDefault();
var msg = $message1.val();
msg - msg.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
if (msg == "")
return -1; //empty messages cannot be sent
socket.emit("message", {
text: msg
name: name
});

//show user messages form
var $messages = $(".messages");
var $message = $('<li class = "list-group-item"></li>');

var momentTimestamp= moment().format("hh:mm a");
//$(".messages") .append($('<p>').text(message.text));
$message.append("<strong>" + momentTimestamp + " "  + name + "</strong>");
//$message.append("<p> + $message1.var()+ "</p>");
$message.append($("<p>", {
class: "mymessages",
text: $message1.val()
}));

$messages.append($message);
$message1.val('');
//manage auto scroll

var obj = $("ul.messages.list-group");
var offset = obj.offset();
var scrollLength = obj[0].scrollHeight;
$("ul.messages.list-group").animate({
scrollTop: scrollLength - offset.top
});
});

//notification message.
function notifyMe(msg) {
//lets check if the browser supports notifications of not
if (!("Notification" in window)) {
alert("This Browser does not support desktop notification, try Chrome of Safari....!");
}

//Lets check whether notification permissions have already been granted or not.

else if (Notification.permission == "granted"){
//if it is okay lets create a notification
//var notification  = new Notification(msg);
var notification  = new Notification('Chat App', {
body: msg.name + " : " + msg.text,
icon: '/image/apple-icon.png' //optional
});
notification.onclick=function(event){
event.preventDefault();
this.close();
//assume user would see message so broadcast user seen event
var umsg = {

text: name + "has seen message " ,
read: true,
user: name
};
socket.emit("userSeen", umsg);
};
}
//other wise we need to ask the user the permission.
else if (Notification.permission ! =='denied'){
Notification.requestPermission(function(permission)
{
//if user accepts, lets create a notification
if (permission == "granted")
 var notification = new Notification('Chat App' , {
 body: msg.name + " has seen the message ",
 read: true,
 user: name
  });
  socket.emit("userSeen",umsg);
  //assume user would see so broadcast the userseen event
 };
 }
 });
 }
 }
