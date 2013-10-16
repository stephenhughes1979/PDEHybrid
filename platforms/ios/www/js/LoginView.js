var opts = {
  lines: 11, // The number of lines to draw
  length: 10, // The length of each line
  width: 5, // The line thickness
  radius: 15, // The radius of the inner circle
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
  top: '20px', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};

$(document).on('pageshow', '#homePage', function(event) {
    var target = document.getElementById('preview1');
    var spinner = new Spinner(opts).spin(target);
    var claimdata = JSON.parse(window.localStorage.getItem("claimdata"));

    console.log(claimdata.CustomerName);
    $('#lblName').text(claimdata.CustomerName);
    $('#lblClaimNumber').text(claimdata.ClaimNumber);
});

var target = document.getElementById('preview');

function acceptTerms() {
    $('.chkTerms').prop('checked', true);
    $.mobile.changePage("#loginPage", {
        transition: "slide",
        reverse: true,
        changeHash: true
    });
}

function showTermsPage() {
    $.mobile.changePage("#termsPage", {
        transition: "slide",
        reverse: true,
        changeHash: true
    });
}

function Login(){
        var spinner = new Spinner(opts).spin(target);
        var claimnumber = $('.claimnumber').val();
        //var deviceid = device.uuid;
        var deviceid = "454677778";
    
        $.ajax({
            type: "POST",
            cache: false,
            url:"https://www.bluebadgesolutions.com/services/loginservice.svc/authenticateuser/" + claimnumber + "/1",
            contentType: "application/x-www-form-urlencoded",
            beforeSend: function (xhr) {
                    xhr.setRequestHeader('EstimatorDeviceId', deviceid);
                },
            success: function (data) {
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
                    url:"https://www.bluebadgesolutions.com/services/estimatorservice.svc/getestimaterequestsbyclaimnumber/" + claimnumber + "/1",
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('EstimatorDeviceId', deviceid);
                        xhr.setRequestHeader('Cookie', cookieAuth);
                    },
                    success: function (data) {
                        spinner.stop();
                        if (data.Requests.length > 0)
                        {
                            window.localStorage.setItem("claimdata", JSON.stringify(data.Requests[0]));
                            $.mobile.changePage("#homePage", {
                                transition: "slide",
                                reverse: true,
                                changeHash: true
                            });
                        }
                    },  
                    error: function(httpRequest, message, errorThrown) {
                        spinner.stop();
                        alert(errorThrown);
                    }
                }); 
            }
        });
    }