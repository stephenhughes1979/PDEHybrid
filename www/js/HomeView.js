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
    var db = window.openDatabase("pdehybrid", "1.0", "Test DB", 1000000);
    db.transaction(createDB, errorCB);
    var target = document.getElementById('preview1');
    var claimdata = JSON.parse(window.localStorage.getItem("claimdata"));

    window.localStorage.setItem("token", claimdata.Token);

    $('#lblName').text(claimdata.CustomerName);
    $('#lblClaimNumber').text(claimdata.ClaimNumber);
    
    $('#lstExistingPhotos').empty();
    $('#lstDamageAreas').empty();
    $('#lstPersonalProperty').empty();
    $('#lstDocuments').empty();
    
    var groupsMarkers = new AssociativeArray();
    
    var DamageTitle = 0;
    var PersonalTitle = 0;
    var DocumentTitle = 0;
    for (var i=0; i<claimdata.Groups.length;i++)
    {
        if (claimdata.Groups[i].Type == 1) 
        {
            if (DamageTitle == 0)
            {
                $("#lstDamageAreas").append("<b>Damaged Areas</b><br>");
                DamageTitle = 1;
            }
            var clid = claimdata.Groups[i].ID;
            var clmtitle = claimdata.Groups[i].Title;
            db.transaction( function(tx){ loadPhotos(tx, clid, clmtitle, "lstDamageAreas") }, errorCB );
        }
        else if (claimdata.Groups[i].Type == 2)
        {
            if (PersonalTitle == 0)
            {
                $("#lstPersonalProperty").append("<b>Personal Property</b><br>");
                PersonalTitle = 1;
            }

               var cliperd = claimdata.Groups[i].ID;
               var clmpertitle = claimdata.Groups[i].Title;
               db.transaction( function(tx){ loadPhotos(tx, cliperd, clmpertitle, "lstPersonalProperty") }, errorCB );
        }
        else if (claimdata.Groups[i].Type == 3) 
        {
            if (DocumentTitle == 0)
            {
                $("#lstDocuments").append("<b>Documents</b><br>");
                DocumentTitle = 1;
            }
               var cldocid = claimdata.Groups[i].ID;
               var clmdoctitle = claimdata.Groups[i].Title;
               db.transaction( function(tx){ loadPhotos(tx, cldocid, clmdoctitle, "lstDocuments") }, errorCB );
        } 
        else if (claimdata.Groups[i].Type == 4) 
        {
            MessageAndAdditionalPhotosGroupId = claimdata.Groups[i].ID;
            window.localStorage.setItem("MessageAndAdditionalPhotosGroupId", MessageAndAdditionalPhotosGroupId);
               
            if (claimdata.PhotosAlreadyTaken == 1)
            {
               $("#lstExistingPhotos").append("<b>Existing Photos</b><br>");
               db.transaction( function(tx){ loadPhotos(tx, MessageAndAdditionalPhotosGroupId, "Existing Photos", "lstExistingPhotos") }, errorCB );
            }
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

// database code
function errorCB(err) {
    alert("Error processing SQL: " + err.code);
}

function successCB() {
    alert("success!");
    var db = window.openDatabase("pdehybrid", "1.0", "Test DB", 1000000);
    db.transaction(queryDB, errorCB);
}

function createDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS PHOTOS (groupid, data, sent, caption)');
}

function insertPhoto(tx, groupid, groups) {
    for (var key in groups) {
        if (groups.hasOwnProperty(key))
        {
            tx.executeSql('INSERT INTO PHOTOS (groupid, data, sent, caption) VALUES (\'' + groupid + '\', \''  + groups[key].bytes + '\', \'' + groups[key].sent + '\', \'' + groups[key].caption + '\')');
        }
    }
    groupArray = new AssociativeArray();
}

function loadPhotos(tx, groupid, grouptitle, divid) {
    tx.executeSql('SELECT count(*) as photocount, \'' + groupid + '\' as grpid, \'' + divid + '\' as divid, \'' + grouptitle + '\' as grouptitle FROM PHOTOS WHERE groupid = \'' + groupid + '\'', [], getPhotoCountInitSuccess, errorCB);
}

function doPhotosExist(tx, groupid) {
    tx.executeSql('SELECT count(*) as photocount FROM PHOTOS WHERE groupid = \'' + groupid + '\'', [], getPhotoCountSuccess, errorCB);
}

function getPhotosSuccess(tx, results) {
    for (var i=0; i<results.rows.length; i++) {
        var tag = "a";
        if (!isEven(i))
        {
            tag = "b";
        }
            
        $("#photoGrid").append("<div class=ui-block-" + tag + "><a href=\"javascript:showBigPic('" + results.rows.item(i).data + "');\"><img  style=\"margin:10px;\" height=\"120\" width=\"120\" src=\"data:image/png;base64," + results.rows.item(i).data + "\"></a></div>");
    }
}

function getPhotoCountInitSuccess(tx, results) {
    console.log(results.rows.item(0));
    if (results.rows.item(0).photocount != '0')
    {
        button = $('<ul data-role="listview" data-iconpos="right" data-inset="true"><li><a href="javascript:takePhoto(' + results.rows.item(0).grpid + ');"><fieldset data-role="controlgroup" data-type="horizontal"><div style="width:200px;float:left;"><img style="float:left;" src="css/themes/images/ic_check_sm_dark.png"><label style="margin-left:20px;">' + results.rows.item(0).grouptitle + '</label></div><div style="width:50px;float:right;"><span class="step">' + results.rows.item(0).photocount + '</span></div></fieldset></a></li></ul>');
    }
    else
    {
        button = $('<ul data-role="listview" data-iconpos="right" data-inset="true"><li><a href="javascript:takePhoto(' + results.rows.item(0).grpid + ');"><fieldset data-role="controlgroup" data-type="horizontal"><div style="width:200px;float:left;"><img style="float:left;" src="css/themes/images/ic_camera_sm_dark.png"><label style="margin-left:20px;">' + results.rows.item(0).grouptitle + '</label></div><div style="width:50px;float:right;"></div></fieldset></a></li></ul>');
    }
    
    $("#" + results.rows.item(0).divid).append(button).trigger('create');
}

function getPhotoCountSuccess(tx, results) {
    if (results.rows.item(0).photocount == '0')
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
        var groupid = window.localStorage.getItem("currentgroup");
        tx.executeSql('SELECT * FROM PHOTOS WHERE groupid = \'' + groupid + '\'', [], getPhotosSuccess, errorCB);
    }
}

// end of database code

function finishSection() {
    var groupid = window.localStorage.getItem("currentgroup");
    var deviceid = window.localStorage.getItem("deviceid");
    var logincookie = window.localStorage.getItem("logincookie");
    var token = window.localStorage.getItem("token");
    
    //UploadPlugin.callNativeFunction(nativePluginResultHandler, nativePluginErrorHandler, groupid, deviceid,logincookie, token, groupArray);
    
    var db = window.openDatabase("pdehybrid", "1.0", "Test DB", 1000000);
    db.transaction( function(tx){ insertPhoto(tx, groupid, groupArray) }, errorCB );
    
    $.mobile.changePage("#homePage", {
                        transition: "slide",
                        reverse: true,
                        changeHash: true
                        });
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
    navigator.camera.getPicture(onSuccess, onFail, { quality: 10, targetWidth:320, targetHeight:480,  encodingType: Camera.EncodingType.JPEG,
        destinationType: Camera.DestinationType.DATA_URL
    });
}

function takePhoto(groupid) {
    var db = window.openDatabase("pdehybrid", "1.0", "Test DB", 1000000);
    
    if (groupid == -1)
    {
        var msgid = window.localStorage.getItem("MessageAndAdditionalPhotosGroupId");
        window.localStorage.setItem("currentgroup", msgid);
        db.transaction( function(tx){ doPhotosExist(tx, msgid) }, errorCB );
    }
    else
    {
        window.localStorage.setItem("currentgroup", groupid);
        db.transaction( function(tx){ doPhotosExist(tx, groupid) }, errorCB );
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
        navigator.camera.getPicture(onSuccess, onFail, { quality: 10, targetWidth:320, targetHeight:480,  encodingType: Camera.EncodingType.JPEG,
            destinationType: Camera.DestinationType.DATA_URL
        }); 
    }
    else
    {
        navigator.camera.getPicture(onSuccessURI, onFail, { quality: 10, targetWidth:320, targetHeight:480,  encodingType: Camera.EncodingType.JPEG,
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
    
    $("#bigPicImgdiv").css('background-image', 'url("data:image/jpeg;base64,' + imageData + '")');
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
