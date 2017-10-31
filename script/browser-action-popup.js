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
            addNewItemHelper.addNewItem($(".popup-body"), addNewItemHelper.new);
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
    mainWindow.searchInput = $('#popup-search-input');
    mainWindow.searchInput.on('input',function(){
        mainPageHelper.searchFunction(mainWindow.searchInput.val());
    })
    mainWindow.searchEmptyDiv = $('#popup-nocontent-search');
});

//Collection of global var
var mainWindow = {
    pushNotification: function (messageString, notificationType, seconds){
        //Z-index 1000
        //TODO implement it

    },

    getTabsInfo: function(callback){
        var getting = browser.windows.getCurrent({populate: true});
        getting.then(callback, null);
    },

    extractRootDomain:function(url) {
        var domain = mainWindow.extractHostname(url),
            splitArr = domain.split('.'),
            arrLen = splitArr.length;
    
        //extracting the root domain here
        //if there is a subdomain 
        if (arrLen > 2) {
            domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
            //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
            if (splitArr[arrLen - 1].length == 2 && splitArr[arrLen - 1].length == 2) {
                //this is using a ccTLD
                domain = splitArr[arrLen - 3] + '.' + domain;
            }
        }
        return domain;
    },

    extractHostname:function(url) {
        var hostname;
        //find & remove protocol (http, ftp, etc.) and get hostname
    
        if (url.indexOf("://") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }
    
        //find & remove port number
        hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];
    
        return hostname;
    },

    saveData:function(url,name,username,password,note,favicon){
        //TODO save data
        console.log(password);
        var encrypted = CryptoJS.AES.encrypt(password, this.masterKey);
        console.log(encrypted.ciphertext);
        var decrypted = CryptoJS.AES.decrypt(encrypted, this.masterKey);
        console.log(decrypted.toString(CryptoJS.enc.Utf8));

        if (!favicon){
            favicon = mainWindow.deafultFavIconURL;
        }

        var obj = {url,name,username,password,note,favicon}
        this.recordList[this.recordList.length] = obj;

        browser.storage.sync.set({
            recordList:  mainWindow.recordList
          });

    },

    storageChangedListener:function(changes, area) {
        var changedItems = Object.keys(changes);
       
        for (var item of changedItems) {
            mainWindow.recordList = changes[item].newValue;
        }

        mainPageHelper.loadMainPage(mainWindow.recordList);
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

    deafultFavIconURL:'/icons/favicon-32x32.png',
    currentPageFavIconURL:null,
    currentPageURL:null,
    currentPageTitle:null,

    serachInput:null,
    searchEmptyDiv:null,
    hiddenInputField:null,

    preintialize:function(){ //Load before dom is ready
        //Load URL, Title and Favicon
        mainWindow.getTabsInfo(function(windowInfo){
            tabInfo = windowInfo.tabs;
            for (var i = 0; i < windowInfo.tabs.length; i++) {
                if(!tabInfo[i].active) continue;
                mainWindow.currentPageURL = tabInfo[i].url;
                mainWindow.currentPageTitle = tabInfo[i].title;
                mainWindow.currentPageFavIconURL = tabInfo[i].favIconUrl;
                break;
            }
        })

        //Load storage area
        var ywzPMStorage = browser.storage.sync.get(
            {
                recordList:[]
            }
        );
        ywzPMStorage.then(function(item){
            if (item){
                mainWindow.recordList = item.recordList;
            }
        
            mainPageHelper.loadMainPage(mainWindow.recordList);
            browser.storage.onChanged.addListener(mainWindow.storageChangedListener);
        },
        function(error){
            console.log(error)
        
            mainPageHelper.loadMainPage(mainWindow.recordList);
            browser.storage.onChanged.addListener(mainWindow.storageChangedListener);
        });

    }
};

//Initialize mainWindow
mainWindow.preintialize();

//Main Page Section
var mainPageHelper = {
    contentHead: null,
    mainPageContent:null,

    loadMainPage:function(recordList){ //Load the main page by ini / reinitialize the main page content
        mainPageHelper.contentHead = $('.popup-content'); //Load the reference
        if (!( typeof mainPageContent === "undefined") && mainPageContent!=null) {
            mainPageContent.remove(); //Remove previous content
        }

        //Seperate List
        currentListIndex = [];
        otherListIndex = [];
        for (var i=0;i<recordList.length;i++){
            //Comparing current url and stored url...
            var storedURL = recordList[i].url;
            storedURL = mainWindow.extractRootDomain(storedURL);
            // var storedURLRegExp = new RegExp(storedURL,'i');

            var currentURL = mainWindow.currentPageURL;
            currentURL = mainWindow.extractRootDomain(currentURL);
            var currentURLRegExp = new RegExp(currentURL,'i');

            // var bool1 = currentURLRegExp.test(storedURL);
            var bool2 = currentURLRegExp.test(storedURL);

            console.log(currentURL);
            console.log(storedURL);
            console.log(bool2);

            if (bool2){ //If true
                
                currentListIndex[currentListIndex.length] = i;
            }
            else{
                otherListIndex[otherListIndex.length] = i;
            }
        }

        //Printing Result for validation
        // console.log("Printing Current List");
        // for (var i=0;i<currentListIndex.length;i++){
        //     console.log(mainWindow.recordList[currentListIndex[i]]);
        // }
        // console.log("Printing Other List");
        // for (var i=0;i<otherListIndex.length;i++){
        //     console.log(mainWindow.recordList[otherListIndex[i]]);
        // }

        var mainDiv = $('<div></div>');
        mainPageContent = mainDiv;
        //Current Tab Section
        var currentTabSection=$('<div></div');
        currentTabSection.addClass('popup-list-section');
        currentTabSection.append(addNewItemHelper.generateContentSectionHeader("Suggested Login"));
        var currentTabList=$('<div></div>');
        currentTabList.css('border-top','2px solid lightgrey');
        currentTabList.css('border-bottom','2px solid lightgrey');

        if (currentListIndex.length==0){ //Append No record
            //TODO
        }
        else{
            for (var i=0;i<currentListIndex.length;i++){ //Append correponsding item
                var currentItem = (mainWindow.recordList[currentListIndex[i]]);
                currentTabList.append(mainPageHelper.generateMainPageView(currentItem,currentListIndex[i]));
            }
        }

        currentTabSection.append(currentTabList);
        //End of Currentab Section

        //Current Tab Section
        var otherTabSection=$('<div></div');
        otherTabSection.addClass('popup-list-section');
        otherTabSection.append(addNewItemHelper.generateContentSectionHeader("Others"));
        var otherTabList=$('<div></div>');
        otherTabList.css('border-top','2px solid lightgrey');
        otherTabList.css('border-bottom','2px solid lightgrey');
        otherTabSection.append(otherTabList);//End of Currentab Section

        if (otherListIndex.length==0){ //Append no record
            //TODO
        }
        else{
            for (var i=0;i<otherListIndex.length;i++){ //Append correponsding item
                var currentItem = (mainWindow.recordList[otherListIndex[i]]);
                otherTabList.append(mainPageHelper.generateMainPageView(currentItem,otherListIndex[i]));

            }
        }
        //End of other tab section

        mainDiv.append(currentTabSection);
        mainDiv.append(otherTabSection);

        mainPageHelper.contentHead.append(mainDiv); //Append the final form to the main vieww
    },

    searchFunction: function(parameter){ // Will search for match in Name
        //Go through list, disable and enable visibility
        var searchDiv = $('.popup-list-section');
        var allNoResult = true;
        searchDiv.each(function(){
            var allRecordDiv = $(this).find('.popup-record-div');
            var noResult = true;
            
            var paraReg =  new RegExp(parameter,'i');
            allRecordDiv.each(function(){
                var instance = $(this);
        
                if (paraReg.test(mainWindow.recordList[instance.attr('id')].username) || paraReg.test(mainWindow.recordList[instance.attr('id')].name)){
                    instance.css('display','flex');
                    // console.log(paraReg.test(mainWindow.recordList[instance.attr('id')].name));
                    noResult=false;
                    allNoResult=false;
                }
                else{
                    // instance.css('visibility','hidden');
                    instance.css('display','none');
                }
            });

            if (noResult){
                var thisDiv =  $(this);
                thisDiv.css('display','none');
            }
            else{
                var thisDiv =  $(this);
                thisDiv.css('display','block');
            }
        });

        if (allNoResult){
            //Display Special Div ?? - remind no result by searching
            mainWindow.searchEmptyDiv.css('display','flex');
        }else{
            //Hide Special Div
            mainWindow.searchEmptyDiv.css('display','none');
        }

        // if (!parameter || !parameter.trim() || this.length === 0){} //Search bar is empty - Restore relevant div visibility
    },

    generateMainPageView: function(currentItem,index){
        var div = addNewItemHelper.generateContentSectionStandardDiv();//Div
        div.attr('id',index);
        div.addClass('popup-record-div');

        var header = addNewItemHelper.generateContentSectionSpecialHeader(currentItem.name);
        header.find('label').css('color','black');

        var inputUserName = addNewItemHelper.generateContentSectionInputField('','text',true);
        inputUserName.val(currentItem.username);

        header.append(inputUserName);
        div.append(header);

        //Logo Section
        var logoDiv = $('<div></div>');
        logoDiv.css('padding','0px 10px 0px 0px');
        var img = $('<img></img>');
        img.attr('src',currentItem.favicon);
        img.attr('width','24');
        img.attr('height','24');
        // img.css('border-radius','50%');
        logoDiv.append(img);
        div.prepend(logoDiv);

        //Action Section
        div.append(addNewItemHelper.generateContentSectionCopyContent(currentItem.username,'fa-user','Copy Username'));
        div.append(addNewItemHelper.generateContentSectionCopyContent(currentItem.password,'fa-key','Copy Password'));

        return div;
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

    //Cahce of favicon
    favicon:null,

    //Type of Window
    new:1,
    edit:2,
    view:3,

    //Generate new item section
    addNewItem: function (parent,type,id){
        if (type=addNewItemHelper.new){
            mainWindow.getTabsInfo(function(windowInfo){
                tabInfo = windowInfo.tabs;
                for (var i = 0; i < windowInfo.tabs.length; i++) {
                    if(!tabInfo[i].active) continue;
                    mainWindow.currentPageURL = tabInfo[i].url;
                    mainWindow.currentPageTitle = tabInfo[i].title;
                    mainWindow.currentPageFavIconURL = tabInfo[i].favIconUrl;
                    break;
                }
            })
        }

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

            if (type==addNewItemHelper.new){ //Save New Record
                mainWindow.saveData(targetDiv.find('#'+addNewItemHelper.urlInputId).val(),targetDiv.find('#'+addNewItemHelper.nameInputId).val(),targetDiv.find('#'+addNewItemHelper.usernameInputId).val(),
                    targetDiv.find('#'+addNewItemHelper.passwordInputId).val(), targetDiv.find('#'+addNewItemHelper.noteInputId).val(),addNewItemHelper.favicon);
            }
            else if (type==addNewItemHelper.edit){
                //TODO ??   
            }
            else if (type==addNewItemHelper.view){
                //TODO ??
            }

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

        var addNewItemInfoURL = this.generateContentSectionStandardDiv(); //URL of the record
        var addNewItemInfoHeader = this.generateContentSectionStandardHeader("URL");
        var addNewItemInfoURLInput = this.generateContentSectionInputField(this.urlInputId,'text');
        addNewItemInfoHeader.append(addNewItemInfoURLInput);
        addNewItemInfoURL.append(addNewItemInfoHeader);
        addNewItemInfoList.append(addNewItemInfoURL);

        var addNewItemInfoName = this.generateContentSectionStandardDiv(); //Name of the record
        var addNewItemInfoNameHeader = this.generateContentSectionStandardHeader("Name");
        var addNewItemInfoNameInput = this.generateContentSectionInputField(this.nameInputId,'text');
        addNewItemInfoNameHeader.append(addNewItemInfoNameInput);
        addNewItemInfoName.append(addNewItemInfoNameHeader);
        addNewItemInfoList.append(addNewItemInfoName);

        var addNewItemInfoUserName = this.generateContentSectionStandardDiv();//UserName
        var addNewItemInfoUserNameHeader = this.generateContentSectionStandardHeader('Username');
        var addNewItemInfoUserInput = this.generateContentSectionInputField(this.usernameInputId,'text');
        addNewItemInfoUserNameHeader.append(addNewItemInfoUserInput);
        addNewItemInfoUserName.append(addNewItemInfoUserNameHeader);
        addNewItemInfoList.append(addNewItemInfoUserName);

        var addNewPassword = this.generateContentSectionStandardDiv(); //Password
        var addNewPasswordHeader = this.generateContentSectionStandardHeader("Password");
        var addNewPasswordInput = this.generateContentSectionInputField(this.passwordInputId,'password');
        addNewPasswordHeader.append(addNewPasswordInput);
        addNewPassword.append(addNewPasswordHeader);
        addNewPassword.append(this.generateContentSectionViewPassowrd(addNewPasswordHeader.find("input")));
        addNewItemInfoList.append(addNewPassword);

        //TODO Password Generator Logic
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
        // addNewItemNoteList.css('border-bottom','2px solid lightgrey');
        addNewItemNoteSection.append(addNewItemNoteList);

        var addNewItemNoteDiv = this.generateContentSectionStandardDiv();
        var addNewItemNoteHeader =this.generateContentSectionStandardHeader("Note Area");
        addNewItemNoteHeader.append(this.generateTextArea(this.noteInputId));
        addNewItemNoteDiv.append(addNewItemNoteHeader);
        addNewItemNoteSection.append(addNewItemNoteDiv);

        /*End of Note Section */

        /*Delete Section*/
        if (type==addNewItemHelper.edit){
            //TODO add delete functionality
        }
        /*End of Delete Section */

        /*Start of Filling in form logic*/
        //TODO edit and view need chanmge this part
        //Update New changes
        addNewItemInfoHeader.find('input').val(mainWindow.currentPageURL);
        addNewItemInfoNameHeader.find('input').val(mainWindow.currentPageTitle);
        addNewItemHelper.favicon = mainWindow.currentPageFavIconURL;

        addNewItemForm.append(addNewItemInfoSection);
        // addNewItemForm.append(addNewItemCustomSection);    
        addNewItemForm.append(addNewItemNoteSection);
        /*End of Auto filling in form logic */
        
        
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

    generateContentSectionStandardDiv:function(){
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
        
        returnResult.css('border-bottom','1px solid #E8E8E8');
        returnResult.css('display','flex');
        returnResult.css('align-items','center');
        returnResult.css('width','100%');

        return returnResult;
    },

    generateContentSectionStandardHeader:function(labelName){
        var returnResult = $('<div></div>');
        returnResult.css('width','100%');

        var label = $('<label>' + labelName + '</label>');
        label.css('color','#777777');
        // label.css('margin-bottom','5px');
        label.css('font-size','13px');
        label.css('display','block');
        label.css('text-overflow','nowrap');
        // label.css('white-space','nowrap');

        returnResult.append(label);
        return returnResult;
    },

    generateContentSectionSpecialHeader:function(headerName){
        var returnResult = $('<div></div>');
        returnResult.css('width','100%');

        var label = $('<input></input>');
        label.val(headerName);
        label.attr('disabled','');
        label.addClass('popup-display-input-header');
        label.css('color','black');
        label.css('background-color','transparent');
        label.css('border','none');
        // label.css('margin-bottom','5px');
        label.css('font-size','13px');
        label.css('width','100%');
        label.css('display','block');
        label.css('text-overflow','ellipsis');
        // label.css('white-space','nowrap');

        returnResult.append(label);
        return returnResult;
    },

    generateContentSectionInputField:function(inputID,type,disabled){
        var returnResult = $('<input></input>');
        returnResult.attr('id',inputID);
        returnResult.attr('type',type);
        if (disabled){
            returnResult.attr('disabled','');
            // returnResult.css('white-space','nowrap');
        }
        returnResult.addClass('content-focus');
        returnResult.addClass('popup-input');
        returnResult.css('width','100%');
        returnResult.css('border','none');
        returnResult.css('background-color','transparent');

        return returnResult;
    },

    generateTextArea:function(inputID){
        var returnResult = $('<textarea></textarea>');
        returnResult.attr('id',inputID);
        returnResult.addClass('content-focus');
        returnResult.css('width','100%');
        returnResult.css('border','none');
        returnResult.css('background-color','transparent');

        return returnResult;
    },

    generateContentSectionViewPassowrd(targetInputField){
        var returnResult = $('<span></span>');
        returnResult.addClass('fa');
        returnResult.addClass('fa-eye');

        returnResult.css('float','right');
        returnResult.css('font-size','18px');
        returnResult.css('cursor','pointer');

        returnResult.attr('title','Show Password');

        returnResult.click(function(){
            if (returnResult.hasClass('fa-eye')){
                returnResult.attr('title','Hide Password');
                targetInputField.attr('type','text');
                returnResult.addClass('fa-eye-slash');
                returnResult.removeClass('fa-eye');
            } 
            else{
                returnResult.attr('title','Show Password');
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

    generateContentSectionCopyContent(targetValue, fontAwesomeIconClass, titleToolhint){
        var returnResult = $('<span></span>');
        returnResult.addClass('fa');
        returnResult.addClass(fontAwesomeIconClass);

        returnResult.css('float','right');
        returnResult.css('font-size','18px');
        returnResult.css('cursor','pointer');
        returnResult.css('margin-left','5px');

        returnResult.attr('title',titleToolhint);

        returnResult.click(function(){
            mainWindow.hiddenInputField = $(document.body).find('#hiddenInput');
            var targetInput = mainWindow.hiddenInputField;

            targetInput.val(targetValue);

            targetInput.select();
            document.execCommand("copy");
            targetInput.val();
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
