var agents = null;

$(document).on('pageshow', '#listPage', function(event) {
    console.log(opts);
    var target = document.getElementById('preview1');
    var spinner = new Spinner(opts).spin(target);
    var claimdata = window.localStorage.getItem("claimdata");
    
    $('#testtext').text(claimdata.AdjusterName);
});

function GoToAgent(index) {
    window.localStorage.setItem("cachedAgent", JSON.stringify(agents[index]));
    $.mobile.changePage( "viewPerson.html", {
                          transition: "slide",
                          reverse: true,
                          changeHash: true
                        });
}
    