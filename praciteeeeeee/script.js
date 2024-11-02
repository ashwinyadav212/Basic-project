var rect = document.querySelector("#center");

rect.addEventListener("mousemove", function(details){
    var rectanglelocation  =  rect.getBoundingClientRect();
    console.log(details.clientsX)
})