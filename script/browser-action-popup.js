var addNewItemWindow;
var colorPrimary1 = "#555"
var colorGreen = "#007000"
var colorGreenLight = "#008000"

$(document).ready(function(){
    $(".popup-new-item-a").mouseenter(function(){
        $(".popup-new-item").css("background-color", "grey");
    });
    $(".popup-new-item-a").mouseleave(function(){
        $(".popup-new-item").css("background-color", "#555");
    });

    $(".popup-new-item-a").click(function(){
        if (!addNewItemWindow){
            addNewItem($(".popup-body"));
        }        
    });
});

function addNewItem(parent){
    //Add New Item Page
    //Slide up animation to cover the parent
    var addNewItemDivId="AddNewItemID";

    var addNewItemDiv=$('<div></div>'); //Create top-level div
    addNewItemDiv.attr('id',addNewItemDivId);
    addNewItemDiv.css('position','absolute');
    addNewItemDiv.css('width','100%');
    addNewItemDiv.css('background-color','gainsboro');
    addNewItemDiv.css('z-index','999');
    addNewItemDiv.css("top","100%");
    addNewItemDiv.css("transition","all .4s ease-in-out");
    //addNewItemDiv.css();
    
    //
    var addNewItemForm=$('<form></form>')//Create top-level form

    addNewItemDiv.append(addNewItemForm);

    //
    var addNewItemHeader=$('<div></div>'); //Create Header
    addNewItemHeader.css('height',"45px");
    addNewItemHeader.css('width',"100%");
    addNewItemHeader.css('background-color',"#555");
    addNewItemHeader.css('color',"white");
    addNewItemForm.append(addNewItemHeader);

    var addNewItemCancel=$("<div></div>"); //Create Cancel Section
    addNewItemCancel.click(function () {
        addNewItemWindow.css('top','100%');
        setTimeout(function(){
            addNewItemWindow.remove();
            addNewItemWindow = null;
        }, 500);
    });
    addNewItemCancel.hover(function () {
        addNewItemCancel.css('background-color','grey');
    }, function () {
        addNewItemCancel.css('background-color',colorPrimary1);
    });
    addNewItemCancel.css('height','100%');
    addNewItemCancel.css('width','10%');
    addNewItemCancel.css('display','flex');
    addNewItemCancel.css('justify-content','center');
    addNewItemCancel.css('align-items','center');
    addNewItemCancel.css('cursor','pointer');
    addNewItemCancel.css('float','left');
    addNewItemCancel.attr('title','Cancel');

    var addNewItemCancelLabel=$("<i></i>"); //Create Cancel Label
    addNewItemCancelLabel.addClass("fa");
    addNewItemCancelLabel.addClass("fa-times");
    addNewItemCancelLabel.css('text-align','center');
    addNewItemCancelLabel.css('font-size','24px');

    addNewItemCancel.append(addNewItemCancelLabel);
    addNewItemHeader.append(addNewItemCancel);

    var addNewItemWindowTitle=$('<div></div>');//Create Window Title
    addNewItemWindowTitle.css('float','left');
    addNewItemWindowTitle.css('width','80%');
    addNewItemWindowTitle.css('height','100%');
    addNewItemWindowTitle.css('display','flex');
    addNewItemWindowTitle.css('text-align','center');
    addNewItemWindowTitle.css('justify-content','center');
    addNewItemWindowTitle.css('align-items','center');
    var addNewItemWindowTitleLabel=$('<span>Add New Account Info</span>');//Create Window Title Label
    addNewItemWindowTitle.append(addNewItemWindowTitleLabel);

    var addNewSave=$('<div></div>');//Create Window Title
    addNewSave.click(function () {
        addNewItemWindow.css('top','100%');
        setTimeout(function(){
            addNewItemWindow.remove();
            addNewItemWindow = null;
        }, 500);
    });
    addNewSave.hover(function () {
        addNewSave.css('background-color',colorGreenLight);
    }, function () {
        addNewSave.css('background-color',colorGreen);
    });
    addNewSave.css('background-color',colorGreen);
    addNewSave.css('width','10%');
    addNewSave.css('height','100%');
    addNewSave.css('display','flex');
    addNewSave.css('text-align','center');
    addNewSave.css('justify-content','center');
    addNewSave.css('align-items','center');
    addNewSave.css('float','left');
    addNewSave.attr('title','Save');
    var addNewSaveLabel = $('<i></i>');
    addNewSaveLabel.addClass("fa");
    addNewSaveLabel.addClass("fa-check");
    addNewSaveLabel.css('text-align','center');
    addNewSaveLabel.css('font-size','24px');
    addNewSave.append(addNewSaveLabel);

    addNewItemHeader.append(addNewItemWindowTitle);
    addNewItemHeader.append(addNewSave);


    //
    //Craete Content (Body)
    var addNewItemContent=$('<div></div>')
    addNewItemContent.css('height',"1000px")
    addNewItemForm.append(addNewItemContent);



    //
    parent.append(addNewItemDiv); //Add generate tab to parent

    addNewItemWindow = addNewItemDiv;

    setTimeout(function(){
        addNewItemWindow.css('top',0);
    }, 100);
}