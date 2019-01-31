// Editor Engine - DataDash
// Developers - M Bradley

// ###### Begin server connection functions #######

// Get mySQL server details from connection_details.txt

// GLOBAL VARIABLES

var GLOBAL_EDIT_SECTIONS = 0; // Global counter for field ID's

// GLOBAL VARIABLES END

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

// Field functions

function get_sql_records(field_name,select_element){

    var connection = establish_mySQL_connection();
    connection.connect();
    var sql_command = "SELECT * FROM " + read_target_table();
    connection.query(sql_command, function(error, rows, fields){

        var row_records = new Array;
        for(var r = 0; r < rows.length; r++){
            row_records.push(rows[r][field_name]);
        }
        populate_select_elements(select_element,row_records,field_name);

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

function save_edit_config(){

    const fs = require('fs');
    const path = './default.dash';
    if(fs.existsSync(path)){
        fs.unlinkSync('default.dash');
    }
    var filter_element_array = new Array;
    var master_element_array = document.getElementsByTagName('*');
    for(var i = 0;i < master_element_array.length; i++){

        if(master_element_array[i].tagName == "SELECT"){

            filter_element_array.push(master_element_array[i].value);

        }

        //filter_element_array.push(master_element_array[i].tagName);

    }
    
    // testing

    for(var x = 0; x < filter_element_array.length; x++){

        fs.appendFileSync('default.dash', filter_element_array[x]);
        fs.appendFileSync('default.dash', "\n");

    }


}

// Set on change clauses for select items and populate functions across select objects within main edit window

function add_functionality(select_object,reference,position){

    if(reference == 'field_A'){

        var att = document.createAttribute("onchange");
        var value = select_object.value;
        att.value="get_sql_records(this.value,'"+position+"value_A');";
        select_object.setAttributeNode(att);

        // EXAMPLE FUNCTION
    }
    else if(reference == 'field2_A'){

        var att = document.createAttribute("onchange");
        var value = select_object.value;
        att.value="get_sql_records(this.value,'"+position+"value2_A');";
        select_object.setAttributeNode(att);

    }
    else if(reference == 'field_B'){

        var att = document.createAttribute("onchange");
        var value = select_object.value;
        att.value="get_sql_records(this.value,'"+position+"value_B');";
        select_object.setAttributeNode(att);

    }
    else if(reference == 'field2_B'){

        var att = document.createAttribute("onchange");
        var value = select_object.value;
        att.value="get_sql_records(this.value,'"+position+"value2_B');";
        select_object.setAttributeNode(att);

    }

}

function process_selects(){

    var master_boxes = new Array('field_A','value_A','function_A','field2_A','value2_A','result_A','field_B','value_B','function_B','field2_B','value2_B','result_B');

    for(var i = 0; i < GLOBAL_EDIT_SECTIONS;i++){

        for(var x = 0; x < master_boxes.length; x++){

            proc_object = document.getElementById(i+master_boxes[x]);
            add_functionality(proc_object,master_boxes[x],i);

        }

    }

}

// Form creator

// Populate select boxes with array data

function create_element_array(element){

    // Declare Arrays
    var box_values = new Array('field_A','value_A','function_A','field2_A','value2_A','result_A'); // last must always be result
    var box_values2 = new Array('field_B','value_B','function_B','field2_B','value2_B','result_B'); // last must always be result
    var modifier_values = new Array('MODIFIER','<','>','=','-','+',);
    var functional_values = new Array('COUNT','COUNT WITH','DISPLAY');

    // Declare generated form name based on global count
    var M_Form = GLOBAL_EDIT_SECTIONS+'masterForm';

    document.getElementById(element).innerHTML += "<form id='"+M_Form+"'>";

    document.getElementById(element).innerHTML += "</form>";

    outputForm = document.getElementById(M_Form);

    for(var i = 0; i < box_values.length+1; i++){
        if(i <= box_values.length-2){
            var elem = document.createElement("select");
            elem.id=GLOBAL_EDIT_SECTIONS+box_values[i];
            outputForm.appendChild(elem);
            write_select_header(elem,box_values[i]);
        }
        else if(i == box_values.length-1){
            var elem = document.createElement("input");
            elem.id=GLOBAL_EDIT_SECTIONS+box_values[i];
            elem.type="text";
            outputForm.appendChild(elem);
        }
    }

    var modBox = document.createElement("select");
    modBox.id=GLOBAL_EDIT_SECTIONS+'modbox';
    outputForm.appendChild(modBox);

    for(var i = 0;i < modifier_values.length;i++){
        var elem = document.createElement("option");
        elem.textContent = modifier_values[i];
        elem.value = modifier_values[i];
        modBox.appendChild(elem);
    }

    for(var i = 0; i < box_values2.length+1; i++){
        if(i <= box_values2.length-2){
            var elem = document.createElement("select");
            elem.id=GLOBAL_EDIT_SECTIONS+box_values2[i];
            outputForm.appendChild(elem);
            write_select_header(elem,box_values2[i]);
        }
        else if(i == box_values.length-1){
            var elem = document.createElement("input");
            elem.id=GLOBAL_EDIT_SECTIONS+box_values2[i];
            elem.type="text";
            outputForm.appendChild(elem);
            write_select_header(elem,box_values2[i]);
        }
        else{
            var outputS = "<input id='delete"+GLOBAL_EDIT_SECTIONS+"'"+" type='button'"+" value='-' "+"onclick=delete_form('"+M_Form+"'"+");>";
            outputForm.innerHTML += outputS;
        }
    }

    outputForm.innerHTML += "<p>";
    var masterResult = document.createElement("input");
    masterResult.id = GLOBAL_EDIT_SECTIONS+"masterResult";
    masterResult.type = "text";
    outputForm.appendChild(masterResult);

    outputForm.innerHTML += "<p>";

    retrieve_mySQL_fields(GLOBAL_EDIT_SECTIONS+box_values[0]);
    retrieve_mySQL_fields(GLOBAL_EDIT_SECTIONS+box_values[3]);
    retrieve_mySQL_fields(GLOBAL_EDIT_SECTIONS+box_values2[0]);
    retrieve_mySQL_fields(GLOBAL_EDIT_SECTIONS+box_values2[3]);
    populate_select_elements(GLOBAL_EDIT_SECTIONS+box_values[2],functional_values,'FUNCTION');
    populate_select_elements(GLOBAL_EDIT_SECTIONS+box_values2[2],functional_values,'FUNCITON');

    GLOBAL_EDIT_SECTIONS++;

    process_selects();
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

function write_select_header(element,header){
    var elem = document.createElement("option");
    elem.textContent = header;
    elem.value = header;
    element.appendChild(elem);
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

}