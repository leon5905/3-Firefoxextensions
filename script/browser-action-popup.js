$(document).ready(function(){
    //Assign function to Plus
    $(".popup-new-item-a").mouseenter(function(){
        $(".popup-new-item").css("background-color", "grey");
    });
    $(".popup-new-item-a").mouseleave(function(){
        $(".popup-new-item").css("background-color", "#555");
    });

    $(".popup-new-item-a").click(function(){
        if (!mainWindow.addNewItemWindow){
            addNewItemHelper.addNewItem($(".popup-body"));
        }        
    });

    //Assign function to popup
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

    //Assign Function to Home

    //Assign Function to Settings

    // browser.storage.sync.clear(); //Purge Storage

    console.log(mainWindow.recordList.length);
});

//Collection of global var
var mainWindow = {
    pushNotification: function (messageString, notificationType, seconds){
        //Z-index 1000


    },

    getURL: function(callback){
        var getting = browser.windows.getCurrent({populate: true});
        getting.then(callback, null);
    },

    saveData:function(url,name,username,password,note){
        //TODO save data
        console.log(password);
        var encrypted = CryptoJS.AES.encrypt(password, this.masterKey);
        console.log(encrypted.ciphertext);
        var decrypted = CryptoJS.AES.decrypt(encrypted, this.masterKey);
        console.log(decrypted.toString(CryptoJS.enc.Utf8));

        var obj = {url,name,username,password,note}
        this.recordList[this.recordList.length] = obj;

        browser.storage.sync.set({
            recordList:  mainWindow.recordList
          });

    },

    addNewItemWindow:null,

    //Colors
    colorPrimary1: "#555",
    colorGreen: "#007000",
    colorGreenLight: "#008000",
    colorWhiteDarken:"#F5F5F5",
    colorBlackWhiten:"#202020",
    colorSectionLineGrey:"#ddd",

    //Font Size
    fontSizeWindowTitle: '16px',

    //Master Key
    masterKey :"masterkey",

    //All of the record
    recordList: [],

    // //IsSync
    // isSync:true
};

//Load storage area
var ywzPMStorage = browser.storage.sync.get(
    {
        recordList:[]
    }
);
ywzPMStorage.then(function(item){
    console.log(item);
    if (item){
        mainWindow.recordList = item.recordList;
        // for (var i=0;i<item.length;i++){
        //     item[i]
        // }

        console.log(mainWindow.recordList.length)
        console.log(mainWindow.recordList)
    }
},
function(error){
    console.log(error)
});

//Main Page Section
var mainPageHelper = {
    loadMainPage:function(recordList){ //Load the main page by ini / reinitialize the main page content
        
    },

    searchFunction: function(parameter){ // Will search for match in Name
        //Go through list, disable and enable visibility
        
    }
};

//Add New Item Section
var addNewItemHelper = {
    //cache of id
    urlInputId:"URL",
    nameInputId:"NameInput",
    usernameInputId:"UserNameInput",
    passwordInputId:"PasswordInput",
    noteInputId:"NoteInput",
    divId:"FormInput",

    //Generate new item section
    addNewItem: function (parent){
        //Add New Item Page
        //Slide up animation to cover the parent
        var addNewItemDivId="AddNewItemID";
    
        var addNewItemDiv=$('<div></div>'); //Create top-level div
        addNewItemDiv.attr('id',addNewItemDivId);
        addNewItemDiv.css('position','absolute');
        addNewItemDiv.css('width','100%');
        addNewItemDiv.css('height','100%');
        addNewItemDiv.css('background-color','gainsboro');
        addNewItemDiv.css('z-index','999');
        addNewItemDiv.css("top","100%");
        addNewItemDiv.css("transition","all .4s ease-out");
        //addNewItemDiv.css();
    
        //
        var addNewItemHeader=$('<div></div>'); //Create Header
        addNewItemHeader.css('height',"45px");
        addNewItemHeader.css('width',"100%");
        addNewItemHeader.css('background-color',"#555");
        addNewItemHeader.css('color',"white");
        addNewItemDiv.append(addNewItemHeader);
    
        var addNewItemCancel=$("<div></div>"); //Create Cancel Section
        addNewItemCancel.click(function () {
            mainWindow.addNewItemWindow.css('top','100%');
            setTimeout(function(){
                mainWindow.addNewItemWindow.remove();
                mainWindow.addNewItemWindow = null;
            }, 410);
        });
        addNewItemCancel.hover(function () {
            addNewItemCancel.css('background-color','grey');
        }, function () {
            addNewItemCancel.css('background-color',mainWindow.colorPrimary1);
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
        var addNewItemWindowTitleLabel=$('<span><b>Add New Account Info</b></span>');//Create Window Title Label
        addNewItemWindowTitleLabel.css('color','white');
        addNewItemWindowTitleLabel.css('font-size',mainWindow.fontSizeWindowTitle);
        addNewItemWindowTitle.append(addNewItemWindowTitleLabel);
    
        var addNewSave=$('<div></div>');
        addNewSave.click(function () {
            var targetDiv = $('#'+addNewItemHelper.divId);

            mainWindow.saveData(targetDiv.find('#'+addNewItemHelper.urlInputId).val(),targetDiv.find('#'+addNewItemHelper.nameInputId).val(),targetDiv.find('#'+addNewItemHelper.usernameInputId).val(),
            targetDiv.find('#'+addNewItemHelper.passwordInputId).val(), targetDiv.find('#'+addNewItemHelper.noteInputId).val());
            mainWindow.addNewItemWindow.css('top','100%');

            setTimeout(function(){
                mainWindow.addNewItemWindow.remove();
                mainWindow.addNewItemWindow = null;
            }, 500);
        });
        addNewSave.hover(function () {
            addNewSave.css('background-color',mainWindow.colorGreenLight);
        }, function () {
            addNewSave.css('background-color',mainWindow.colorGreen);
        });
        addNewSave.css('background-color',mainWindow.colorGreen);
        addNewSave.css('width','10%');
        addNewSave.css('height','100%');
        addNewSave.css('display','flex');
        addNewSave.css('text-align','center');
        addNewSave.css('justify-content','center');
        addNewSave.css('align-items','center');
        addNewSave.css('float','left');
        addNewSave.attr('title','Save');
        addNewSave.css('cursor','pointer');
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
        addNewItemContent.css('height',"calc(100% - 45px)");
        addNewItemContent.css('top',"45px");
        addNewItemContent.css('overflow',"auto");
        addNewItemContent.attr('id',this.divId);
        addNewItemDiv.append(addNewItemContent);
    
        var addNewItemForm=$('<div></div>'); //Top-Level form div
        addNewItemContent.append(addNewItemForm);
    
        var addNewItemInfoSection=$('<div></div');//Section Info
        addNewItemInfoSection.addClass('popup-list-section');
        addNewItemInfoSection.append(this.generateContentSectionHeader("Account Information"));
        var addNewItemInfoList=$('<div></div>');
        addNewItemInfoList.css('border-top','2px solid lightgrey');
        addNewItemInfoList.css('border-bottom','2px solid lightgrey');
        addNewItemInfoSection.append(addNewItemInfoList);

        var addNewItemInfoURL = this.generateContentSectionStandardDiv("URL"); //URL of the record
        var addNewItemInfoURLInput = this.generateContentSectionInputField(this.urlInputId,'text');
        
        mainWindow.getURL(function(windowInfo){
            tabInfo = windowInfo.tabs;
            for (var i = 0; i < windowInfo.tabs.length; i++) {
                if(!tabInfo[i].active) continue;
                addNewItemInfoURLInput.find('input').val(tabInfo[i].url);
                addNewItemInfoNameInput.find('input').val(tabInfo[i].title);
            }

        });

        addNewItemInfoURL.append(addNewItemInfoURLInput);
        addNewItemInfoList.append(addNewItemInfoURL);

        var addNewItemInfoName = this.generateContentSectionStandardDiv("Name"); //Name of the record
        var addNewItemInfoNameInput = this.generateContentSectionInputField(this.nameInputId,'text');
        addNewItemInfoName.append(addNewItemInfoNameInput);
        addNewItemInfoList.append(addNewItemInfoName);

        var addNewItemInfoUserName = this.generateContentSectionStandardDiv('Username')//UserName
        addNewItemInfoUserName.append(this.generateContentSectionInputField(this.usernameInputId,'text'));
        addNewItemInfoList.append(addNewItemInfoUserName);

        var addNewPassword = this.generateContentSectionStandardDiv("Password"); //Password
        var addNewPasswordInputSpan = this.generateContentSectionInputField(this.passwordInputId,'password');
        addNewPassword.append(addNewPasswordInputSpan);
        addNewPasswordInputSpan.append(this.generateContentSectionViewPassowrd(addNewPasswordInputSpan.find("input")));
        addNewItemInfoList.append(addNewPassword);

        var addNewPasswordGenerator = this.generatePasswordGenerator(); //Password Generator
        addNewItemInfoList.append(addNewPasswordGenerator);

        /*End of Info Field*/

        // var addNewItemCustomSection=$('<div></div');//Section Custom Field
        // addNewItemCustomSection.addClass('popup-list-section');
        // addNewItemCustomSection.append(this.generateContentSectionHeader("Custom Field"));

        
        /*End of Custoim Field */

        var addNewItemNoteSection=$('<div></div');//Section Note
        addNewItemNoteSection.addClass('popup-list-section');
        addNewItemNoteSection.append(this.generateContentSectionHeader("Note"));

        var addNewItemNoteList=$('<div></div>');
        addNewItemNoteList.css('border-top','2px solid lightgrey');
        addNewItemNoteList.css('border-bottom','2px solid lightgrey');
        addNewItemInfoSection.append(addNewItemNoteList);

        var addNewItemNoteDiv = this.generateContentSectionStandardDiv("Note Area");
        addNewItemNoteDiv.append(this.generateTextArea(this.noteInputId));
        addNewItemNoteSection.append(addNewItemNoteDiv);


        /*End of Note Section */

        addNewItemForm.append(addNewItemInfoSection);
        // addNewItemForm.append(addNewItemCustomSection);    
        addNewItemForm.append(addNewItemNoteSection);
        
        parent.append(addNewItemDiv); //Add generated tab to parent
    
        mainWindow.addNewItemWindow = addNewItemDiv; //Cache the created window
    
        setTimeout(function(){
            mainWindow.addNewItemWindow.css('top',0); //Move the window to top
        }, 100);
    },

    generateContentSectionHeader:function (messageString){ //Generate Section Header
        var returnResult = $('<div><b>'+ messageString +'</b></div>');
        returnResult.css('background-color','transparent');
        returnResult.css('color','#777777');
        returnResult.css('text-transform','uppercase');
        returnResult.css('font-size','13px');
        returnResult.css('padding','5px 10px');

        return returnResult;
    },

    generateContentSectionStandardDiv:function(labelName){
        var returnResult = $('<div></div>');
        returnResult.css('background-color','white');
        returnResult.css('padding','10px 10px');
        returnResult.hover(function(){
            returnResult.css('background-color',mainWindow.colorWhiteDarken);
        },
        function(){
            returnResult.css('background-color','white');
        });
        returnResult.click(function(){
            returnResult.find('.content-focus').focus();
        });

        var label = $('<label>' + labelName + '</label>');
        label.css('color','#777777');
        // label.css('margin-bottom','5px');
        label.css('font-size','13px');
        label.css('display','block');

        returnResult.append(label);
        return returnResult;
    },

    generateContentSectionInputField:function(inputID,type){
        var spanReturnResult = $('<span></span>');
        spanReturnResult.css('display','flex');

        var returnResult = $('<input></input>');
        returnResult.attr('id',inputID);
        returnResult.attr('type',type);
        returnResult.addClass('content-focus');
        returnResult.css('width','100%');
        returnResult.css('border','none');
        returnResult.css('background-color','transparent');

        spanReturnResult.css('border-bottom','1px solid #E8E8E8');

        spanReturnResult.append(returnResult);

        return spanReturnResult;
    },

    generateTextArea:function(inputID){
        var spanReturnResult = $('<span></span>');
        spanReturnResult.css('display','flex');

        var returnResult = $('<textarea></textarea>');
        returnResult.attr('id',inputID);
        returnResult.addClass('content-focus');
        returnResult.css('width','100%');
        returnResult.css('border','none');
        returnResult.css('background-color','transparent');

        spanReturnResult.css('border-bottom','1px solid #E8E8E8');

        spanReturnResult.append(returnResult);

        return spanReturnResult;
    },

    generateContentSectionViewPassowrd(targetInputField){
        var returnResult = $('<span></span>');
        returnResult.addClass('fa');
        returnResult.addClass('fa-eye');

        returnResult.css('float','right');
        returnResult.css('font-size','18px');
        returnResult.css('cursor','pointer');

        returnResult.click(function(){
            if (returnResult.hasClass('fa-eye')){
                targetInputField.attr('type','text');
                returnResult.addClass('fa-eye-slash');
                returnResult.removeClass('fa-eye');
            } 
            else{
                targetInputField.attr('type','password');
                returnResult.removeClass('fa-eye-slash');
                returnResult.addClass('fa-eye');
            }
        });

        returnResult.hover(
            function(){
                returnResult.css('color',mainWindow.colorBlackWhiten);
            },
            function(){
                returnResult.css('color','black');
            }
        )

        return returnResult;
    },

    generateContentSectionCopyContent(targetInput, fontAwesomeIconClass){
        var returnResult = $('<input></input>');
        
        return returnResult;
    },

    generatePasswordGenerator(){
        var returnResult = $('<div></div>');
        returnResult.css('background-color','white');
        returnResult.css('padding','10px 10px');
        returnResult.hover(function(){
            returnResult.css('background-color',mainWindow.colorWhiteDarken);
        },
        function(){
            returnResult.css('background-color','white');
        });
        returnResult.click(function(){
            returnResult.find('.content-focus').focus();
        });

        var labelName = "Generate Passowrd";

        var label = $('<label>' + labelName + '</label>');
        label.css('color','#777777');
        label.css('font-size','13px');
        label.css('display','block');

        returnResult.append(label);
        return returnResult;
    }
}
