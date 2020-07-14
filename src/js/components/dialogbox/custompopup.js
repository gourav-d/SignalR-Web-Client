import './custompopupStyle.css';

;(function (window){
    if(document.getElementById('dialogoverlay'))
        return;

     window.document.body.innerHTML = window.document.body.innerHTML +  `
        <div id="dialogoverlay"></div>
        <div id="dialogbox" class="slit-in-vertical">
            <div>
                <div id="dialogboxhead" style="background-color:rgb(63,81,181)"></div>
                <div id="dialogboxbody"></div>
                <div id="dialogboxfoot"></div>
            </div>
        </div>`;

        let dialogoverlay = document.getElementById('dialogoverlay');
        let dialogbox = document.getElementById('dialogbox');

        

        dialogbox.style.display = "none";
        dialogoverlay.style.display = "none";
        document.getElementById('dialogboxfoot').innerHTML = '<button style="background-color:rgb(63,81,181)" class="pure-material-button-contained active" id="custom-popup-ok-btn">OK</button>';
        document.getElementById('custom-popup-ok-btn')
        .addEventListener('click', function() {
            document.getElementById('dialogbox').style.display = "none";
            document.getElementById('dialogoverlay').style.display = "none";
        })
})(window)

export function Alert(message, title) {    

        let dialogoverlay = document.getElementById('dialogoverlay');
        let dialogbox = document.getElementById('dialogbox');

        let windowHeight = window.innerHeight;
        dialogoverlay.style.height = windowHeight + "px";

        dialogbox.style.top = "100px";

        dialogbox.style.display = "block";
        dialogoverlay.style.display = "block";

        if(typeof title === "undefined") {
            document.getElementById('dialogboxhead').style.display = "none";
        } else {
            document.getElementById('dialogboxhead').innerHTML = '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> '+ title;
        }

        document.getElementById('dialogboxbody').innerHTML = message;    
}