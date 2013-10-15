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

//function onDeviceReady() {
    //if (parseFloat(window.device.version) === 7.0) {
          //document.body.style.marginTop = "15px";
    //}
//}
  
//document.addEventListener('deviceready', onDeviceReady, false);

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
        var username = $('.fname').val();
        var password = $('.fpassword').val();
        var usercred = {"InputPayload":{"UserName":username, "Password":password},"Header":{"SendingSystemCode":"A3C98370-A0FC-41cf-A5AD-281F4CDE43CE","SendingSystemName":"E7065EE6-8A5F-47e2-97A0-17BAF6D5B67B"}};
        var databuiltup = "grant_type=password&username=" + username + "&password=" + password;
        var accesstoken = '';
    
        $.ajax({
            type: "POST",
            cache: false,
            url:"https://sgglext-dv.allstate.com/auth/oauth/v2/token?id=jbjnkjnkj",
            data: databuiltup,
            contentType: "application/x-www-form-urlencoded",
            beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Basic aVJEX0w3VXNlcjpiYmJkYmY2Ny03ZTJkLTQwYTktYWQ1MS1kOTM1MDk1MzQ4ODc=');
                },
            success: function (data) {
                accesstoken = data.access_token;
                window.localStorage.setItem("accessToken", accesstoken);
                $.ajax({
                    type: "POST",
                    cache: false,
                    url:"https://sgglext-dv.allstate.com/mobile/r2r/customerservice/authenticatecustomercredentials?ih=kjkjkj",
                    data: JSON.stringify(usercred),
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + accesstoken);

                    },
                    success: function (data) {
                        console.log(data);
                        spinner.stop();
                        $.mobile.changePage( "#homePage", {
                          transition: "slide",
                          reverse: true,
                          changeHash: true
                        });
                    },  
                    error: function(httpRequest, message, errorThrown) {
                        navigator.notification.alert("The Username or Password entered was incorrect", null, "Login Failure", 'OK');
                        spinner.stop();
                    }
                });
            },
            error: function(httpRequest, message, errorThrown) {
                alert("error: " + errorThrown);
            }
        });
    };