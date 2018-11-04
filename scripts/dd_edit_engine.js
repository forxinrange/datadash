// Editor Engine - DataDash
// Developers - M Bradley

// ###### Begin server connection functions #######

// Get mySQL server details from connection_details.txt

function read_mySQL_connection_details(){
    var fs = require('fs');
    var details = fs.readFileSync('connection_details.txt').toString().split("\n");
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
    return targetTable[4]; // Returns speified table
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

        connection.destroy(); // Kill connection
    })
}

// Function to get all field names from target table and pipe them into return function

function retrieve_mySQL_fields(element){
    var connection = establish_mySQL_connection();
    connection.connect();
    var sql_command = "SELECT * FROM " + read_target_table();
    connection.query(sql_command, function(error, rows, fields){
        var field_names = new Array;
        for(var f = 0; f < fields.length; f++){
            field_names.push(fields[f].name);
        }
        
        // RETURN FUNCTION HERE

        populate_select_elements(element,field_names);

        connection.destroy(); // Kill connection
    })
}

// Form creator

var GLOBAL_EDIT_SECTIONS = 0;

function create_select_element(formID){
    var output = "<select id='"+GLOBAL_EDIT_SECTIONS+"field'></select>";
    var id = GLOBAL_EDIT_SECTIONS+'field';
    retrieve_mySQL_fields(id);
    GLOBAL_EDIT_SECTIONS++;
    document.getElementById(formID).innerHTML += output;
}

function delete_select_element(formID){
    GLOBAL_EDIT_SECTIONS--;
    select_ID = GLOBAL_EDIT_SECTIONS+"field";
    document.getElementById(select_ID).outerHTML = "";
}

// Populate select boxes with array data

function populate_select_elements(element, array){
    document.getElementById(element).innerHTML = "";
    var items = document.getElementById(element);
    for(var i = 0; i < array.length; i++){
        var elem = document.createElement("option");
        elem.textContent = array[i];
        elem.value = array[i];
        items.appendChild(elem);
    }
}


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