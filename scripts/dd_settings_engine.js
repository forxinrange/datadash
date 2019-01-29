// Settings Engine - DataDash
// Developers - M Bradley

function create_input(type,id,value){

    var inputElem = document.createElement("input");
    inputElem.type = type;
    inputElem.id = id;
    inputElem.value = value;
    return inputElem;

}

function create_label(labelText){

    var labelElem = document.createElement("label");
    labelElem.innerHTML = labelText;
    return labelElem;

}

function writeDetails(){

    var hostCapture = document.getElementById("hostnameF");
    var userCapture = document.getElementById("usernameF");
    var passwordCapture = document.getElementById("passwordF");
    var dbCapture = document.getElementById("databaseF");
    var tableCapture = document.getElementById("tableF");

    var settings = {

        host: hostCapture.value,
        user: userCapture.value,
        password: passwordCapture.value,
        database: dbCapture.value,
        targetTable: tableCapture.value

    };

    const fs = require('fs');
    fs.unlinkSync('./connection_details.txt');

    fs.appendFileSync('connection_details.txt', settings.host);
    fs.appendFileSync('connection_details.txt', '\n');
    fs.appendFileSync('connection_details.txt', settings.user);
    fs.appendFileSync('connection_details.txt', '\n');
    fs.appendFileSync('connection_details.txt', settings.password);
    fs.appendFileSync('connection_details.txt', '\n');
    fs.appendFileSync('connection_details.txt', settings.database);
    fs.appendFileSync('connection_details.txt', '\n');
    fs.appendFileSync('connection_details.txt', settings.targetTable);



}

function populateForm(){

    var values = getDetails();

    var form_object = document.getElementById('con_form');

    var lineBreak1 = document.createElement("br");
    var lineBreak2 = document.createElement("br");
    var lineBreak3 = document.createElement("br");
    var lineBreak4 = document.createElement("br");
    var lineBreak5 = document.createElement("br");

    var hostLabel = create_label("Hostname/IP:<br>");
    var userLabel = create_label("Username:<br>");
    var passwordLabel = create_label("Password:<br>");
    var databaseLabel = create_label("Database Name:<br>");
    var tableLabel = create_label("Table Name:<br>");
    
    var submitBtn = document.createElement("input");
    submitBtn.type="button";
    submitBtn.value="Save";
    submitBtn.onclick="writeDetails();";

    hostOutput = create_input("text","hostnameF",values.host);
    userOutput = create_input("text","usernameF",values.user);
    passwordOutput = create_input("text","passwordF",values.password);
    databaseOutput = create_input("text","databaseF",values.database);
    tableOutput = create_input("text","tableF",values.targetTable);

    form_object.appendChild(hostLabel);
    form_object.appendChild(hostOutput);
    form_object.appendChild(lineBreak1);
    form_object.appendChild(userLabel);
    form_object.appendChild(userOutput);
    form_object.appendChild(lineBreak2);
    form_object.appendChild(passwordLabel);
    form_object.appendChild(passwordOutput);
    form_object.appendChild(lineBreak3);
    form_object.appendChild(databaseLabel);
    form_object.appendChild(databaseOutput);
    form_object.appendChild(lineBreak4);
    form_object.appendChild(tableLabel);
    form_object.appendChild(tableOutput);
    form_object.appendChild(lineBreak5);
    //form_object.appendChild(submitBtn);

}


function getDetails(){

    const fs = require('fs');
    const path = './connection_details.txt';
    if(fs.existsSync(path)){

        var details = fs.readFileSync('connection_details.txt').toString().split("\n");
        var serverSettings = {
          
            host: details[0],
            user: details[1],
            password: details[2],
            database: details[3],
            targetTable: details[4]
            
        };

        return serverSettings;

    }
    else{

        document.getElementById('servSettings').innerHTML = "Warning: No connection details configured.  <br>Please configure SQL server details and reload DataDash.";

    }
}