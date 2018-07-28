 window.myCPP = window.myCPP || {};

    //replace with the CCP URL for the current Amazon Connect instance
    var ccpUrl = "https://perficientdemo.awsapps.com/connect/ccp#/";

    connect.core.initCCP(containerDiv, {
        ccpUrl: ccpUrl,        
        loginPopup: true,         
        softphone: {
            allowFramedSoftphone: true
        }
    });

    connect.contact(subscribeToContactEvents);  
    

    function subscribeToContactEvents(contact) {
        window.myCPP.contact = contact;
        logInfoMsg("New contact offered. Subscribing to events for contact");
        if (contact.getActiveInitialConnection()
            && contact.getActiveInitialConnection().getEndpoint()) {
            logInfoMsg("New contact is from " + contact.getActiveInitialConnection().getEndpoint().phoneNumber);
        } else {
            logInfoMsg("This is an existing contact for this agent");
        }
        logInfoMsg("Contact is from queue " + contact.getQueue().name);    
        logInfoMsg("ContactID is " + contact.getContactId());   
        logInfoMsg("Contact attributes are " + JSON.stringify(contact.getAttributes()));
        
        updateContactAttribute(contact.getAttributes());    
        contact.onEnded(clearContactAttribute);
    }

    function updateContactAttribute(msg){
        JIRAlink.innerHTML ='<a href ="https://jira.naic.org/issues/?jql=project%20%3D%20%22NIPRSD%22%20AND%20assignee%20is%20EMPTY%20AND%20summary%20~%20%22'+contact.getContactId()+'%22%20AND%20created%20%3E%20startOfDay()%20AND%20created%20%3C%20endOfDay()" target="_blank" class="jiraLink"> JIRA cases </a>';
        
        var tableRef = document.getElementById('attributesTable').getElementsByTagName('tbody')[0];      
        
        for (var key in msg) {
            console.log(msg);
            if msg.hasOwnProperty(key) {
                        var row = tableRef.insertRow(tableRef.rows.length);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        cell1.innerHTML = key;
                        cell2.innerHTML = msg[key]['value'];
                    
                }
            }
        }
        
 


    function clearContactAttribute(){
        var old_tbody= document.getElementById('attributesTable').getElementsByTagName('tbody')[0];
        var new_tbody = document.createElement('tbody');    
        old_tbody.parentNode.replaceChild(new_tbody, old_tbody);     
    }


    function logMsgToScreen(msg) {
        logMsgs.innerHTML =  new Date().toLocaleTimeString() + ' : ' + msg + '<br>' + logMsgs.innerHTML;
    }


    function logInfoMsg(msg) {
        connect.getLog().info(msg);
        logMsgToScreen(msg);
    }


// LogMessages section display controls

var showLogsBtn = document.getElementById('showAttributes');
var showLogsDiv = document.getElementById('hiddenAttributes');
var hideLogsBtn = document.getElementById('hideAttributes');
var hideLogsDiv = document.getElementById('visibleAttributes');


showLogsBtn.addEventListener('click',replaceDisplay);

hideLogsBtn.addEventListener('click',replaceDisplay);

    function replaceDisplay(){
            showLogsDiv.style.display = showLogsDiv.style.display === 'none' ? '' : 'none';
            hideLogsDiv.style.display = hideLogsDiv.style.display === 'none' ? '' : 'none';
    }
