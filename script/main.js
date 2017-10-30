$(document).ready(function(){
    $("#popup-btn-seperate").click(function(){
        var win = window.open('/webpage/browser-action-popup.html');
        if (win) {
            //Browser has allowed it to be opened
            win.focus(); //Focus on the new web page
            window.close(); //Close the current one
        } else {
            //Browser has blocked it
            alert('Please allow popups for this website');
        }
    });
});
