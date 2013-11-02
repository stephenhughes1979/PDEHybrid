var HelloPlugin = {

    callNativeFunction: function (success, fail, imagedata) {
        var groupid = window.localStorage.getItem("currentgroup");
        var deviceid = window.localStorage.getItem("deviceid");
        var logincookie = window.localStorage.getItem("logincookie");
        var token = window.localStorage.getItem("token");
        
            return Cordova.exec( success, fail, 
                    "com.tricedesigns.HelloPlugin", 
                    "nativeFunction",
                    [imagedata, groupid, deviceid, logincookie, token]);
    }
};