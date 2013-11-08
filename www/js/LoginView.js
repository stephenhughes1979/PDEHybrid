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

function Logout() {
    //window.localStorage.clear();
    $('.claimnumber').val("");
    $.mobile.changePage("#loginPage", {
        transition: "slide",
        reverse: true,
        changeHash: true
    });
}

function toHome() {
    $.mobile.changePage("#homePage", {
        transition: "slide",
        reverse: true,
        changeHash: true
    });
}

function Login() {
    var groupid = window.localStorage.getItem("currentgroup");

    $.mobile.loading( 'show', {
            text: 'Loading',
            textVisible: true,
            theme: 'a',
            html: ""
    });
    
    var claimnumber = $('.claimnumber').val();
    var chkTermsConds = $(".chkTerms").is(':checked') ? 1 : 0;
    if ((claimnumber.trim() != "") && (chkTermsConds == 1))
    {
        var deviceid = device.uuid;
        //var deviceid = "454677778";
        window.localStorage.setItem("deviceid", deviceid);
        
        $.ajax({
            type: "POST",
            cache: false,
            url:"https://www.bluebadgesolutions.com/services/loginservice.svc/authenticateuser/" + claimnumber + "/1",
            contentType: "application/x-www-form-urlencoded",
            beforeSend: function (xhr) {
                    xhr.setRequestHeader('EstimatorDeviceId', deviceid);
                },
            success: function (data) {
                window.localStorage.setItem("UserEmail", data.DisplayName);
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
    else
    {
        $.mobile.loading( 'hide', {
            text: 'foo',
            textVisible: true,
            theme: 'z',
            html: ""
        });
        navigator.notification.alert('""Please ensure you have entered a claim number and have accepted the terms and conditions.""', null, 'Terms', 'Done');
    }
}
