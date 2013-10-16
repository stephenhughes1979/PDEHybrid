


function GoToAgent(index) {
    window.localStorage.setItem("cachedAgent", JSON.stringify(agents[index]));
    $.mobile.changePage( "viewPerson.html", {
                          transition: "slide",
                          reverse: true,
                          changeHash: true
                        });
}
    