// Get all names of fields and pipe them to a drop down box

function serverDetails(){

    var fs = require('fs');
    var farray = fs.readFileSync('connection_details.txt').toString().split("\n");
    var connectionInfo = {

        host: farray[0],
        user: farray[1],
        password: farray[2],
        database: farray[3]

    };
    return connectionInfo;
}

function targetTable(){

    var fs = require('fs');
    var dbtable = fs.readFileSync('connection_details.txt').toString().split("\n");
    return dbtable[4];

}


// Save XML configuration file



//function pipeFieldsDropDown(element,hostname,username,dbpassword,dbdatabase,dbtable){
    
function pipeFieldsDropDown(element){

    dbtable = targetTable();
    var mysql = require('mysql');
    var connectObj = serverDetails();
    var connection = mysql.createConnection(connectObj);
    connection.connect();
    var sqlcom = "SELECT * FROM " + dbtable;
    connection.query(sqlcom, function(error, rows, fields){

        var fieldsArray = new Array;

        for(var r = 0; r < fields.length; r++){

            fieldsArray.push(fields[r].name);
        }

        dropDown(fieldsArray, element);

        connection.destroy();
    
    })

}

// Get names from results and pass to drop down function

function pipeResultsDropDown(element,fieldname){

    dbtable = targetTable();
    var mysql = require('mysql');
    var connectionInfo = serverDetails();
    var connection = mysql.createConnection(connectionInfo);
    connection.connect();
    var sqlcom = "SELECT * FROM " + dbtable;
    connection.query(sqlcom, function(error, rows, fields){

        var resultsArray = new Array;

        for(var r = 0; r < rows.length; r++){

            resultsArray.push(rows[r][fieldname]);

        }

        resultsArray.sort();

        cleanResults = removeDuplicates(resultsArray);

        dropDown(cleanResults, element);

        connection.destroy();

    })

}

function setOptions(element){

    var Settingsoptions = new Array('Count','Select');
    dropDown(Settingsoptions,element);

}


// This function clears out duplicate entries from array ready for manipulation

function removeDuplicates(targetArray){

    var cleanArray = new Array;

    for(var i = 0;i < targetArray.length; i++){

        if(cleanArray.indexOf(targetArray[i]) == -1){
            
            cleanArray.push(targetArray[i]);
        }
    }

    return cleanArray;

}



// This function will populate a list based upon a drop down box element within a form
// Requires array of data and destination element
function dropDown(array, element){

    document.getElementById(element).innerHTML = "";
    var dditems = document.getElementById(element);


    for (var i = 0;i < array.length; i++){

        var opt = array[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        dditems.appendChild(el);

    }

}

function outputResult(element,resultValue){

    document.getElementById(element).value = resultValue;

}


function processResult(element,condition){


    dbtable = targetTable();
    fieldCondition = document.getElementById('field_list').value;
    searchCondition = document.getElementById('field_list2').value;
    var mysql = require('mysql');
    var connectObj = serverDetails();
    var connection = mysql.createConnection(connectObj);
    connection.connect();

    if(condition == 'Count'){

        sqlcom = "SELECT count(*) FROM " + dbtable + " WHERE " + fieldCondition+"='"+searchCondition+"'"; 

    }
    
    //document.getElementById('pullit').innerHTML =  sqlcom; //uncommment line for debugging
   
    
    connection.query(sqlcom, function(error, rows, fields){

        var fieldname = 'count(*)';
        var result = rows[0][fieldname];
        outputResult(element,result);

        connection.destroy();
    
    })

}

//DEVTOOL

function devprint(arrayCapture){

    var outstream;

    for(var r = 0; r < arrayCapture.length; r++){

        outstream+= arrayCapture[r];

    }

    document.getElementById('pullit').innerHTML =  outstream;
}

function mainDisplaySequence(){


    var dbtable = targetTable();
    pipeFieldsDropDown('field_list',dbtable);

}