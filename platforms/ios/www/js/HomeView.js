var opts = {
  lines: 11, // The number of lines to draw
  length: 20, // The length of each line
  width: 10, // The line thickness
  radius: 30, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: '40px', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};

var target = document.getElementById('preview');
var deviceid;
function onDeviceReady() {
    if (parseFloat(window.device.version) === 7.0) {
          document.body.style.marginTop = "15px";
    }
    
    deviceid = device.uuid;
    debug.log(deviceid);
    navigator.notification.alert(deviceid, null, "Device id", 'OK');
}
  
document.addEventListener('deviceready', onDeviceReady, false);

$(document).on('pageshow', '#loginPage', function(event) {
        $.ajaxSetup({ cache: false });
});

function SearchByZip() {
    if ($('.textZip').val().trim() != "")
    {
        window.localStorage.setItem("zipsearchvalue", $('.textZip').val());
        $.mobile.changePage( "listview.html", {
          transition: "slide",
          reverse: true,
          changeHash: true
        });
    }
    else
    {
        navigator.notification.alert("Please enter a ZipCode value", null, "ZIP Required", 'OK');
    }
}

function Login(){
        var spinner = new Spinner(opts).spin(target);
        
        $.ajax({
            type: "POST",
            cache: false,
            url:"https://www.bluebadgesolutions.com/services/loginservice.svc/authenticateuser/7854676767/1",
            contentType: "application/x-www-form-urlencoded",
            beforeSend: function (xhr) {
                    xhr.setRequestHeader('EstimatorDeviceId', '53423547890');
                },
            success: function (data) {
                console.log(data);
            },
            error: function(httpRequest, message, errorThrown) {
                spinner.stop();
                alert(errorThrown);
            },
            complete: function (jqXHR, textStatus) {
                var cookieAuth = jqXHR.getResponseHeader("Set-Cookie");
                window.localStorage.setItem("logincookie", cookieAuth);
                $.ajax({
                    type: "POST",
                    cache: false,
                    url:"https://www.bluebadgesolutions.com/services/estimatorservice.svc/getestimaterequestsbyclaimnumber/7854676767/1",
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('EstimatorDeviceId', '53423547890');
                        xhr.setRequestHeader('Cookie', cookieAuth);
                    },
                    success: function (data) {
                        console.log(data);
                        spinner.stop();
                    },  
                    error: function(httpRequest, message, errorThrown) {
                         alert(errorThrown);
                    }
                }); 
            }
        });
    };