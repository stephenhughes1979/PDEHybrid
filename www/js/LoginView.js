$(document).on('pageshow', '#homePage', function(event) {
    var target = document.getElementById('preview1');
    var claimdata = JSON.parse(window.localStorage.getItem("claimdata"));

    console.log(claimdata.CustomerName);
    $('#lblName').text(claimdata.CustomerName);
    $('#lblClaimNumber').text(claimdata.ClaimNumber);
});

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
        $.mobile.loading( 'show', {
            text: 'Loading',
            textVisible: true,
            theme: 'a',
            html: ""
        });
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
                $.mobile.loading( 'hide', {
                                text: 'foo',
                                textVisible: true,
                                theme: 'z',
                                html: ""
                            });
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
                        if (data.Requests.length > 0)
                        {
                            $.mobile.loading( 'hide', {
                                text: 'foo',
                                textVisible: true,
                                theme: 'z',
                                html: ""
                            });
                            window.localStorage.setItem("claimdata", JSON.stringify(data.Requests[0]));
                            $.mobile.changePage("#homePage", {
                                transition: "slide",
                                reverse: true,
                                changeHash: true
                            });
                        }
                    },  
                    error: function(httpRequest, message, errorThrown) {
                        $.mobile.loading( 'hide', {
                                text: 'foo',
                                textVisible: true,
                                theme: 'z',
                                html: ""
                            });
                        alert(errorThrown);
                    }
                }); 
            }
        });
    }