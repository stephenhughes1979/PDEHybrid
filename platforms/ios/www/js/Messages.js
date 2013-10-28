
function MessagesGo() {
    $.mobile.changePage("#messagesPage", {
        transition: "slide",
        reverse: true,
        changeHash: true
    });
}

function TakeMessagePhoto() {
        navigator.camera.getPicture(onMessageSuccess, onMessageFail, { quality: 10, targetWidth:320, targetHeight:480,  encodingType: Camera.EncodingType.JPEG,
        destinationType: Camera.DestinationType.DATA_URL
    }); 
}

function onMessageSuccess(imageData) {
    var d = new Date();
    $("#lstMessages").append($.datepicker.formatDate('MM d', d) + " " + d.getHours() + ":" + d.getMinutes() + "<br><div class=\"bubble bubble--alt\"><img src=\"" + "data:image/jpeg;base64," + imageData + "\"></div><br clear=\"all\">");
    $(window).scrollTop($(document).height());
}

function onMessageFail(message) {
    alert("An error occured");
    $.mobile.changePage("#messagesPage", {
                        transition: "slide",
                        reverse: true,
                        changeHash: true
                        });
}

function AddMessage() {
     $.mobile.loading( 'show', {
            text: 'Loading',
            textVisible: true,
            theme: 'a',
            html: ""
    });
    
    var d = new Date();
    var deviceid = window.localStorage.getItem("deviceid");
    var logincookie = window.localStorage.getItem("logincookie");
    var token = window.localStorage.getItem("token");
    var UserEmail = window.localStorage.getItem("UserEmail");

    $.ajax({
        type: "POST",
        cache: false,
        url:"https://www.bluebadgesolutions.com/services/estimatorservice.svc/createmessage/" + UserEmail,
        contentType: "application/json; charset=utf-8",
        data:$("#message").val(),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('EstimatorDeviceId', deviceid);
            xhr.setRequestHeader('Cookie', logincookie);
            xhr.setRequestHeader('EstimatorRequestToken',token);
            xhr.setRequestHeader('EstimatorLatitude','67.87');
            xhr.setRequestHeader('EstimatorLongitude','74.78');
        },
        success: function (data) {
             $.mobile.loading( 'hide', {
            text: 'Loading',
            textVisible: true,
            theme: 'a',
            html: ""
    });
                $("#lstMessages").append($.datepicker.formatDate('MM d', d) + " " + d.getHours() + ":" + d.getMinutes() + "<br><div class=\"bubble bubble--alt\">" + $("#message").val() + "</div><br clear=\"all\">");
            $(window).scrollTop($(document).height());
            
        },  
        error: function(httpRequest, message, errorThrown) {
            $.mobile.loading( 'hide', {
            text: 'Loading',
            textVisible: true,
            theme: 'a',
            html: ""
    });
            alert("fail:" + errorThrown);
        }
    });
}

function ReloadMessages()
{
    GetMessages();
}

function GetMessages()
{
    $.mobile.loading( 'show', {
            text: 'Loading',
            textVisible: true,
            theme: 'a',
            html: ""
    });
    
    var deviceid = window.localStorage.getItem("deviceid");
    var logincookie = window.localStorage.getItem("logincookie");
    var token = window.localStorage.getItem("token");
  
    $.ajax({
        type: "GET",
        cache: false,
        url:"https://www.bluebadgesolutions.com/services/estimatorservice.svc/getmessagelist",
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('EstimatorDeviceId', deviceid);
            xhr.setRequestHeader('Cookie', logincookie);
            xhr.setRequestHeader('EstimatorRequestToken',token);
            xhr.setRequestHeader('EstimatorLatitude','67.87');
            xhr.setRequestHeader('EstimatorLongitude','74.78');
        },
        success: function (data) {
            $.mobile.loading( 'hide', {
            text: 'Loading',
            textVisible: true,
            theme: 'a',
            html: ""
    });
            $("#lstMessages").empty();
            for (var i=0;i<data.Messages.length;i++)
            {
                var d = new Date(0);
                d.setUTCSeconds(data.Messages[i].LastUpdatedText);
                if (data.Messages[i].Type != -1)
                {
                    $("#lstMessages").append($.datepicker.formatDate('MM d', d) + " " + d.getHours() + ":" + d.getMinutes() + "<div class=\"bubble\">" + data.Messages[i].Text  + "</div><br clear=\"all\">");
                }
                else
                {
                    $("#lstMessages").append($.datepicker.formatDate('MM d', d) + " " + d.getHours() + ":" + d.getMinutes() + "<div class=\"bubble bubble--alt\">" + data.Messages[i].Text + "</div><br clear=\"all\">");
                }
            }
            console.log(data);
        },  
        error: function(httpRequest, message, errorThrown) {
            $.mobile.loading( 'hide', {
            text: 'Loading',
            textVisible: true,
            theme: 'a',
            html: ""
    });
            alert("fail");
            alert(errorThrown);
        }
    });
}

$(document).on('pageshow', '#messagesPage', function(event) {
    GetMessages();
});
