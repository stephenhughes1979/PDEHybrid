var pushNotification;
               
function acceptTerms() {
    $('.chkTerms').prop('checked', true);
    $.mobile.changePage("#home", {
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
    $.mobile.changePage("#home", {
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

function checkPluginResultHandler (result) {
    if (result)
    {
        window.localStorage.setItem("pushenabled", "1");
    }
    else
    {
        window.localStorage.setItem("pushenabled", "0");
    }
}

function checkPluginErrorHandler (error) {
    alert("ERROR: \r\n"+error );
    window.localStorage.setItem("pushenabled", "0");
}

function onGeoSuccess(position) {
        window.localStorage.setItem("latitude", position.coords.latitude);
        window.localStorage.setItem("longitude", position.coords.longitude);
    }

    // onError Callback receives a PositionError object
    //
    function onGeoError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

function Login() {
    //CheckPlugin.checkIfPushEnabled(checkPluginResultHandler, checkPluginErrorHandler);
    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
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
        
        //var pushenabled = window.localStorage.getItem("pushenabled");
        var pushenabled = "1";
            
        $.ajax({
               type: "POST",
               cache: false,
               url:"https://www.bluebadgesolutions.com/services/loginservice.svc/authenticateuser/" + claimnumber + "/" + pushenabled,
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
                      pushNotification = window.plugins.pushNotification;
                          
                          if ( device.platform == 'android' || device.platform == 'Android' )
                            {
                                pushNotification.register(
                                    successHandler,
                                    errorHandler, {
                                        "senderID":"replace_with_sender_id",
                                        "ecb":"onNotificationGCM"
                                    });
                            }
                            else
                            {
                                pushNotification.register(
                                    tokenHandler,
                                    errorHandler, {
                                        "badge":"true",
                                        "sound":"true",
                                        "alert":"true",
                                        "ecb":"onNotificationAPN"
                                    });
                            }

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

function successHandler (result) {
    alert('result = ' + result);
}

function errorHandler (error) {
    alert('error = ' + error);
}

function tokenHandler (result) {
    alert('device token = ' + result);
}

function onNotificationAPN (event) {
    if ( event.alert )
    {
        navigator.notification.alert(event.alert);
    }
    
    if ( event.sound )
    {
        var snd = new Media(event.sound);
        snd.play();
    }
    
    if ( event.badge )
    {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
}
