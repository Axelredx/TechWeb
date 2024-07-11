function navButton(){
    document.getElementById("nav").innerHTML="<div class='nav-content'>HOME</div><div class='nav-content'>ABOUT US </div><div class='nav-content'>CONTACT US</div>"
    document.getElementsByClassName("nav-content")[0].style.visibility="block";
    document.getElementsByClassName("nav-content")[1].style.visibility="block";
    document.getElementsByClassName("nav-content")[2].style.visibility="block";
    document.getElementById("nav-item").setAttribute("onclick","hide()");

}

function hide(){
    document.getElementsByClassName("nav-content")[0].style.visibility="hidden";
    document.getElementsByClassName("nav-content")[1].style.visibility="hidden";
    document.getElementsByClassName("nav-content")[2].style.visibility="hidden";
    document.getElementsByClassName("nav-content")[0].style.maxHeight=0;
    document.getElementsByClassName("nav-content")[1].style.maxHeight=0;
    document.getElementsByClassName("nav-content")[2].style.maxHeight=0;
   document.getElementById("nav-item").setAttribute("onclick","navButton()");
}