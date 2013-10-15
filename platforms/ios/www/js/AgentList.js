var agents = null;

$(document).on('pageshow', '#listPage', function(event) {
    console.log(opts);
    var target = document.getElementById('preview1');
    var spinner = new Spinner(opts).spin(target);
    var accesstoken = window.localStorage.getItem("accessToken");
    var zip = window.localStorage.getItem("zipsearchvalue");
    var usercred = {"InputPayload":{"ZIP":zip, "MaxRows":"15"},"Header":{"SendingSystemCode":"A3C98370-A0FC-41cf-A5AD-281F4CDE43CE","SendingSystemName":"E7065EE6-8A5F-47e2-97A0-17BAF6D5B67B"}};
    
    
    $.ajax({
            type: "POST",
            cache: false,
            url:"https://sgglext-dv.allstate.com/mobile/r2r/agentservice/findagentsbyzip",
            data: JSON.stringify(usercred),
            contentType: "application/json; charset=utf-8",
            beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + accesstoken);
            },
            success: function (data) {
                var output = '';
                agents = data.OutputPayload.Agents;
                $.each(data.OutputPayload.Agents, function(index, value){
                    output += '<li><a href="javascript:GoToAgent(' + index + ');">' + value.FirstName + ' ' + value.LastName + '</a></li>';
                });
                $('#listview').append(output);
                $('#listview').listview('refresh');
                spinner.stop();
            },  
            error: function(httpRequest, message, errorThrown) {
                 navigator.notification.alert(message + errorThrown, null, "Service Failure", 'OK');
            }
        });    
});

function GoToAgent(index) {
    window.localStorage.setItem("cachedAgent", JSON.stringify(agents[index]));
    $.mobile.changePage( "viewPerson.html", {
                          transition: "slide",
                          reverse: true,
                          changeHash: true
                        });
}
    