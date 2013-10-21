var imagebyte;

$(document).on('pageshow', '#homePage', function(event) {
   
    var target = document.getElementById('preview1');
    var claimdata = JSON.parse(window.localStorage.getItem("claimdata"));

    window.localStorage.setItem("token", claimdata.Token);
    console.log(claimdata);
    $('#lblName').text(claimdata.CustomerName);
    $('#lblClaimNumber').text(claimdata.ClaimNumber);
    
    $('#lstDameage').empty();
    for (var i=0; i<claimdata.Groups.length;i++)
    {
        var button = $('<a data-role="button" style="height:50px" data-theme="a" data-icon="arrow-r" data-iconpos="right" class="iconleft" href="javascript:takePhoto(\'' + claimdata.Groups[i].ID + '\');"><img src="css/themes/images/ic_camera_sm_dark.png" style="position:relative;left:-50px;"><span style="position:relative;top:-9px;left:-30px;">' + claimdata.Groups[i].Title + '</span></a>');
        $("#lstDameage").append(button).trigger('create');
    }
});

$( "#divAddDescription" ).click(function() {
  alert( "Handler for .click() called." );
});

function uploadPhoto()
{
  
    var groupid = window.localStorage.getItem("currentgroup");
    var deviceid = window.localStorage.getItem("deviceid");
    var logincookie = window.localStorage.getItem("logincookie");
    var token = window.localStorage.getItem("token");
    var photo = imagebyte;
   // $('#textdump').text(photo);
    $.ajax({
        type: "POST",
        cache: false,
        url:"https://www.bluebadgesolutions.com/services/estimatorservice.svc/createestimatephoto/JPG/8/0/shugh@allstate.com/nocaption/" +  groupid,
        contentType: "application/json; charset=utf-8",
        data:photo,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('EstimatorDeviceId', deviceid);
            xhr.setRequestHeader('Cookie', logincookie);
            xhr.setRequestHeader('EstimatorRequestToken',token);
            xhr.setRequestHeader('EstimatorLatitude','67.87');
            xhr.setRequestHeader('EstimatorLongitude','74.78');
        },
        success: function (data) {
            alert(data.IsSuccess);
            alert(data.ErrorMessage);
        },  
        error: function(httpRequest, message, errorThrown) {
            alert('fail');
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

function Discard() {
    $.mobile.changePage("#previewPhoto", {
        transition: "slide",
        reverse: true,
        changeHash: true
    });
    navigator.camera.getPicture(onSuccess, onFail, { quality: 10, targetWidth:320, targetHeight:480,  encodingType: Camera.EncodingType.JPEG,
        destinationType: Camera.DestinationType.DATA_URL
    });
}

function takePhoto(groupid) {
    window.localStorage.setItem("currentgroup", groupid);
    $.mobile.changePage("#step1", {
        transition: "slide",
        reverse: true,
        changeHash: true
    });
}

function openCamera() {
    $.mobile.changePage("#previewPhoto", {
        transition: "slide",
        reverse: true,
        changeHash: true
    });
    navigator.camera.getPicture(onSuccess, onFail, { quality: 10, targetWidth:320, targetHeight:480,  encodingType: Camera.EncodingType.JPEG,
        destinationType: Camera.DestinationType.DATA_URL
    }); 
}

function onSuccess(imageData) {
    var image = document.getElementById('imgPreview');
    $("#imgdiv").css('background-image', 'url(' + "data:image/jpeg;base64," + imageData + ')');
    $("#imgdiv").css('height', '480');
    $("#imgdiv").css('width', '290');
    imagebyte = imageData;
}

function onFail(message) {
    $.mobile.changePage("#homePage", {
                        transition: "slide",
                        reverse: true,
                        changeHash: true
                        });
}