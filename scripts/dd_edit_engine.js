// Editor Engine - DataDash
// Developers - M Bradley

// ###### Begin server connection functions #######

// Get mySQL server details from connection_details.txt

function read_mySQL_connection_details(){
    //const {dialog} = require('electron');
    var fs = require('fs');
    var details = fs.readFileSync('connection_details.txt').toString().split("\n");
    //var details = dialog.showOpenDialog({properties: ['openFile']});
    var connectionInfo = {
        host: details[0],
        user: details[1],
        password: details[2],
        database: details[3]
    };
    return connectionInfo; // Returns connection object details
}

// Get target table specified in connection_details.txt

function read_target_table(){
    var fs = require('fs');
    var targetTable = fs.readFileSync('connection_details.txt').toString().split("\n");
    return targetTable[4]; // Returns specified table
}

// Returns active connection ready to initiate

function establish_mySQL_connection(){
    var mysql = require('mysql');
    var connectionInfo = read_mySQL_connection_details();
    var activeConnection = mysql.createConnection(connectionInfo);
    return activeConnection;
}

// Function to return data from specific SQL query

function query_mySQL_database(sql_query,element){
    var connection = establish_mySQL_connection();
    connection.connect();
    connection.query(sql_query, function(error, rows, fields){

        // RETURN FUNCTION HERE

        dev_Build_Test(fields,rows,element);

        connection.destroy(); // Kill connection from mySQL server
    })
}

// Function to get all field names from target table and pipe them into return function

function retrieve_mySQL_fields(element){
    var header = 'FIELDS';
    var connection = establish_mySQL_connection();
    connection.connect();
    var sql_command = "SELECT * FROM " + read_target_table();
    connection.query(sql_command, function(error, rows, fields){
        var field_names = new Array;
        for(var f = 0; f < fields.length; f++){
            field_names.push(fields[f].name);
        }
        // RETURN FUNCTION HERE

        populate_select_elements(element,field_names,header);

        connection.destroy(); // Kill connection from mySQL server
    })
}

// Form creator

var GLOBAL_EDIT_SECTIONS = 0; // Global counter for field ID's

// Populate select boxes with array data

function create_select_element(element){
    var box_values = new Array('field','value','function','field2','value','result'); // last must always be result
    var M_Form = GLOBAL_EDIT_SECTIONS+'masterForm';
    // var deleteButton = '<input id="'+GLOBAL_EDIT_SECTIONS+'del" type="button" value="delete" onclick="delete_form("'+M_Form+');">';

    document.getElementById(element).innerHTML += "<form id='"+M_Form+"'>";
    document.getElementById(element).innerHTML += "</form>";

    outputForm = document.getElementById(M_Form);
    for(var i = 0; i < box_values.length; i++){
        if(i != box_values.length-1){
            var elem = document.createElement("select");
            elem.id=GLOBAL_EDIT_SECTIONS+box_values[i];
            outputForm.appendChild(elem);
        }
        else{
            var elem = document.createElement("input");
            elem.id=GLOBAL_EDIT_SECTIONS+box_values[i];
            elem.type="text";
            //elem.setAttribute="readonly";
            outputForm.appendChild(elem);
        }
    }

    var m_section = document.getElementById(element);
    delbtn = document.createElement("input");
    delbtn.id=GLOBAL_EDIT_SECTIONS+'delbtn';
    delbtn.type="button";
    delbtn.value="delete";
    //delbtn.onclick=delete_form(M_Form);



    m_section.appendChild(delbtn);

    retrieve_mySQL_fields(GLOBAL_EDIT_SECTIONS+box_values[0]);
    GLOBAL_EDIT_SECTIONS++;
}

function delete_form(element){
    document.getElementById(element).outerHTML = "";
}

function populate_select_elements(element, array, header){
    document.getElementById(element).innerHTML = "";
    var items = document.getElementById(element);
    array.unshift(header);
    for(var i = 0; i < array.length; i++){
        var elem = document.createElement("option");
        elem.textContent = array[i];
        elem.value = array[i];
        items.appendChild(elem);
    }
}


// ########## DEV TOOLS ONLY NOT FOR PROD ###########

// Debugging and dev tools

function devPrint(array,element){
    var devArray;
    for(var x = 0; x < array.length;x++){
        devArray += array[x];
    }
    document.getElementById(element).innerHTML = devArray;
}

function dev_Build_Test(fields,rows,element){
    var fieldArray = new Array;
    var rowArray = new Array;
    for(var f = 0; f < fields.length; f++){
        fieldArray.push(fields[f].name);
        for(var r = 0; r < rows.length; r++){
            rowArray.push(rows[r][fieldArray[f]]);
        }
    }
    var output;
    for(var i = 0; i < rowArray.length; i++){
        output += rowArray[i];
    }
    document.getElementById(element).innerHTML = output;
}


function openFP(){

    const { dialog } = require('electron').remote;
    console.log(dialog);

    

}