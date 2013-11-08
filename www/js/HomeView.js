AssociativeArray = function () {};

function photoObject(bytes, sent, caption){
    this.bytes=bytes;
    this.sent=sent;
    this.caption=caption;
}

// Make the length property work
Object.defineProperty(AssociativeArray.prototype, "length", {
                      get: function () {
                      var count = 0;
                      for (var key in this) {
                      if (this.hasOwnProperty(key))
                      count++;
                      }
                      return count;
                      }
                      });

var imagebyte;
var caption;
var allGroupsArray = {};
var groupArray = new AssociativeArray();
var MessageAndAdditionalPhotosGroupId;


$(document).on('pageshow', '#homePage', function(event) {
   
    var target = document.getElementById('preview1');
    var claimdata = JSON.parse(window.localStorage.getItem("claimdata"));

    window.localStorage.setItem("token", claimdata.Token);
    console.log(claimdata);
    $('#lblName').text(claimdata.CustomerName);
    $('#lblClaimNumber').text(claimdata.ClaimNumber);
    
    $('#lstExistingPhotos').empty();
    $('#lstDamageAreas').empty();
    $('#lstPersonalProperty').empty();
    $('#lstDocuments').empty();
    
    var groupsMarkers = new AssociativeArray();
    
    if (claimdata.PhotosAlreadyTaken == 1)
    {
        $("#lstExistingPhotos").append("<b>Existing Photos</b><br>");
        var button = $('<a data-role="button" style="line-height:10px;" data-icon="arrow-r" data-iconpos="right" href="javascript:takePhoto(-1);"><img src="css/themes/images/ic_camera_sm_dark.png"><span style="position:relative;top:-20px;">Existing Photos</span><a>');
        $("#lstExistingPhotos").append(button).trigger('create');
    }
    
    var DamageTile = 0;
    var PersonalTitle = 0;
    var DocumentTitle = 0;
    for (var i=0; i<claimdata.Groups.length;i++)
    {
        if (claimdata.Groups[i].Type == 1) 
        {
            if (DamageTile == 0)
            {
                $("#lstDamageAreas").append("<b>Damaged Areas</b><br>");
                DamageTitle = 1;
            }
            var button = $('<a data-role="button" style="line-height:10px;" data-icon="arrow-r" data-iconpos="right" href="javascript:takePhoto(\'' + claimdata.Groups[i].ID + '\');"><img src="css/themes/images/ic_camera_sm_dark.png"><span style="position:relative;top:-20px;">' + claimdata.Groups[i].Title + '</span></a>');
            $("#lstDamageAreas").append(button).trigger('create');
        }
        else if (claimdata.Groups[i].Type == 2) 
        {
            if (PersonalTitle == 0)
            {
                $("#lstPersonalProperty").append("<b>Personal Property</b><br>");
                PersonalTitle = 1;
            }
            var button = $('<a data-role="button" style="line-height:10px;" data-icon="arrow-r" data-iconpos="right" href="javascript:takePhoto(\'' + claimdata.Groups[i].ID + '\');"><img src="css/themes/images/ic_camera_sm_dark.png"><span style="position:relative;top:-20px;">' + claimdata.Groups[i].Title + '</span></a>');
            $("#lstPersonalProperty").append(button).trigger('create');
        }
        else if (claimdata.Groups[i].Type == 3) 
        {
            if (DocumentTitle == 0)
            {
                $("#lstDocuments").append("<b>Documents</b><br>");
                DocumentTitle = 1;
            }
            var button = $('<a data-role="button" style="line-height:10px;" data-icon="arrow-r" data-iconpos="right" href="javascript:takePhoto(\'' + claimdata.Groups[i].ID + '\');"><img src="css/themes/images/ic_camera_sm_dark.png"><span style="position:relative;top:-20px;">' + claimdata.Groups[i].Title + '</span></a>');
            $("#lstDocuments").append(button).trigger('create');
        } 
        else if (claimdata.Groups[i].Type == 4) 
        {
            MessageAndAdditionalPhotosGroupId = claimdata.Groups[i].ID;
            window.localStorage.setItem("MessageAndAdditionalPhotosGroupId", MessageAndAdditionalPhotosGroupId);
        }
    }
});

$( "#divAddDescription" ).click(function() {
    $('#popupCaption').popup('open');
});

function closePopup() {
    $('#popupCaption').popup('close');
}

function getCaption() {
    caption = $('#captiontextarea').val();
    $('#captionlabel').text(caption);
    $('#popupCaption').popup('close');
}

function nativePluginResultHandler (result) {
    alert("SUCCESS: \r\n"+result );
}

function nativePluginErrorHandler (error) {
    alert("ERROR: \r\n"+error );
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

function uploadPhoto()
{
    //alert("Not implemented yet");
    
    var groupid = window.localStorage.getItem("currentgroup");
    var img_array = JSON.parse(window.localStorage.getItem("group" + groupid + "array"));
    var img;
    if ($('#captionlabel').text().trim() == "Add Description (optional)")
    {
        img = new photoObject(imagebyte, 0, "No Caption");
    }
    else
    {
        img = new photoObject(imagebyte, 0, $('#captionlabel').text().trim());
    }
        
    if (groupArray.length)
    {
        groupArray[groupArray.length] = img;
    }
    else
    {
        groupArray[0] = img;
    }

    $('#divAddDescription').hide();
    $('#divAddDescriptionButtons').hide();
    $('#popupTakeAdditional').popup('open');
}

function finishSection() {
    var groupid = window.localStorage.getItem("currentgroup");
    var deviceid = window.localStorage.getItem("deviceid");
    var logincookie = window.localStorage.getItem("logincookie");
    var token = window.localStorage.getItem("token");
    
    //HelloPlugin.callNativeFunction(nativePluginResultHandler, nativePluginErrorHandler, groupid, deviceid,logincookie, token, groupArray);
    navigator.notification.alert(
    '"Photo Upload not actually executed. Please use custom plugin version of the app for that function"', null, 'Photo Upload', 'Done');
    
    $.mobile.changePage("#homePage", {
                        transition: "slide",
                        reverse: true,
                        changeHash: true
                        });
    
    var newimgarray = new AssociativeArray();
    for (var key in groupArray) {
        if (groupArray.hasOwnProperty(key))
        {
            var photoobj = new photoObject(groupArray[key].bytes, groupArray[key].sent, groupArray[key].caption);
            newimgarray[key] = photoobj;
        }
    }

    var finalarray = new AssociativeArray();
    var img_array = new AssociativeArray();
    img_array = JSON.parse(window.localStorage.getItem("group" + window.localStorage.getItem("currentgroup") + "array"));

    if (img_array)
    {
        var count=0;
        for (var keyx in img_array) {
            if (img_array.hasOwnProperty(keyx))
            {
                count=count+1;
            }
        }

        for (var key1 in newimgarray) {
            if (newimgarray.hasOwnProperty(key1))
            {
                var photoobj = new photoObject(newimgarray[key1].bytes, newimgarray[key1].sent, newimgarray[key1].caption);
                img_array[count] = photoobj;
                count = count+1;
            }
        }
      
        window.localStorage.setItem("group" + groupid + "array", JSON.stringify(img_array));
    }
    else
    {
        window.localStorage.setItem("group" + groupid + "array", JSON.stringify(newimgarray));
    }
}

function takeAdditionalPhotos() {
    reverseTakeAdditional();
}

function reverseTakeAdditional() {
    $('#popupTakeAdditional').popup('close');
    $('#divAddDescription').show();
    $('#divAddDescriptionButtons').show();
    openCamera();
}

function Discard() {
    $.mobile.changePage("#previewPhoto", {
        transition: "slide",
        reverse: true,
        changeHash: true
    });
    navigator.camera.getPicture(onSuccess, onFail, { quality: 100, targetWidth:320, targetHeight:480,  encodingType: Camera.EncodingType.JPEG,
        destinationType: Camera.DestinationType.DATA_URL
    });
}

function takePhoto(groupid) {
    if (groupid == -1)
    {
        var msgid = window.localStorage.getItem("MessageAndAdditionalPhotosGroupId");
        window.localStorage.setItem("currentgroup", msgid);
    }
    else
    {
        window.localStorage.setItem("currentgroup", groupid);
    }
   
    groupArray = new AssociativeArray();
    if (window.localStorage.getItem("group" + window.localStorage.getItem("currentgroup") + "array") == null) 
    {
        $.mobile.changePage("#step1", {
            transition: "slide",
            reverse: true,
            changeHash: true
        });
    }
    else
    {
        $.mobile.changePage("#picsGridPage", {
            transition: "slide",
            reverse: true,
            changeHash: true
        });
        $("#photoGrid").empty();
        var img_array = new AssociativeArray();
        img_array = JSON.parse(window.localStorage.getItem("group" + window.localStorage.getItem("currentgroup") + "array"));

        for (var key in img_array) {
            if (img_array.hasOwnProperty(key))
            {
                var tag = "a";
 
                var keyint = parseInt(key);

                if (!isEven(keyint))
                {
                    tag = "b";
                }
      
                if (navigator.userAgent.toLowerCase().match(/iphone/))
                {
                    $("#photoGrid").append("<div class=ui-block-" + tag + "><a href=\"javascript:showBigPic('" + img_array[key].bytes + "');\"><img  style=\"margin:10px;\" height=\"120\" width=\"120\" src=\"data:image/png;base64," + img_array[key].bytes + "\"></a></div>");
                }
                else
                {
                    $("#photoGrid").append("<div class=ui-block-" + tag + "><a href=\"javascript:showBigPic('" + img_array[key].bytes + "');\"><img  style=\"margin:10px;\" height=\"120\" width=\"120\" src=\"" + img_array[key].bytes + "\"></a></div>");
                }
            }
        }
    }
}

function isEven(n) 
{
    if (n != 0) 
    {
        return (n % 2 == 0);
    }
    else 
    {
        return true;
    }
}

function openCamera() {
    if(navigator.userAgent.toLowerCase().match(/iphone/))
    {
        navigator.camera.getPicture(onSuccess, onFail, { quality: 100, targetWidth:320, targetHeight:480,  encodingType: Camera.EncodingType.JPEG,
            destinationType: Camera.DestinationType.DATA_URL
        }); 
    }
    else
    {
        navigator.camera.getPicture(onSuccessURI, onFail, { quality: 100, targetWidth:320, targetHeight:480,  encodingType: Camera.EncodingType.JPEG,
            destinationType: Camera.DestinationType.FILE_URI
        }); 
    }
}

function onSuccessURI(imageURI) {
    $.mobile.changePage("#previewPhoto", {
        transition: "slide",
        reverse: true,
        changeHash: true
    });
    
    $("#imgdiv").css('background-image', 'url(' + imageURI + ')');
    $("#imgdiv").css('height', '480');
    $("#imgdiv").css('width', '290');
    
    imagebyte = imageURI;
    $('#popupTakeAdditional').popup('close');
    $('#divAddDescription').show();
    $('#divAddDescriptionButtons').show();
}

function onSuccess(imageData) {
    $.mobile.changePage("#previewPhoto", {
        transition: "slide",
        reverse: true,
        changeHash: true
    });
    
    $("#imgdiv").css('background-image', 'url("data:image/jpeg;base64,' + imageData + '")');
    $("#imgdiv").css('height', '480');
    $("#imgdiv").css('width', '290');
    imagebyte = imageData;
    
    $('#popupTakeAdditional').popup('close');
    $('#divAddDescription').show();
    $('#divAddDescriptionButtons').show();
}

function onFail(message) {
    $.mobile.changePage("#homePage", {
                        transition: "slide",
                        reverse: true,
                        changeHash: true
                        });
}

function returnToGrid() {
    var groupid = window.localStorage.getItem("currentgroup");
    takePhoto(groupid);
}

function showBigPic(imageData) {
    $.mobile.changePage("#bigPicPage", {
                        transition: "slide",
                        reverse: true,
                        changeHash: true
                        });
    if(navigator.userAgent.toLowerCase().match(/iphone/))
    {
        $("#bigPicImgdiv").css('background-image', 'url("data:image/jpeg;base64,' + imageData + '")');
    }
    else
    {
        $("#bigPicImgdiv").css('background-image', 'url("' + imageData + '")');
    }
    $("#bigPicImgdiv").css('height', '470');
    $("#bigPicImgdiv").css('width', '290');
}

function UpdateClaimInfo() {
     $.mobile.loading( 'show', {
            text: 'Loading',
            textVisible: true,
            theme: 'a',
            html: ""
    });
    
    var deviceid = window.localStorage.getItem("deviceid");
    var logincookie = window.localStorage.getItem("logincookie");
    var token = window.localStorage.getItem("token");
    var UserEmail = window.localStorage.getItem("UserEmail");

    $.ajax({
        type: "POST",
        cache: false,
        url:"https://www.bluebadgesolutions.com/services/estimatorservice.svc/updateestimatestatus/" + UserEmail + "/3",
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('EstimatorDeviceId', deviceid);
            xhr.setRequestHeader('Cookie', logincookie);
            xhr.setRequestHeader('EstimatorRequestToken',token);
        },
        success: function (data) {
            $.mobile.loading( 'hide', {
                text: 'Loading',
                textVisible: true,
                theme: 'a',
                html: ""
            });
            if (data.IsSuccess == true)
            {
                navigator.notification.alert(
    '"Thank you for using Allstate QuickFoto Claim®. Your photos have been submitted to your adjuster who will contact you with additional information after reviewing the photos."', null, 'Claim Submitted', 'Done');
            }
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
