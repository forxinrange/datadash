
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


//function pipeFieldsDropDown(element,hostname,username,dbpassword,dbdatabase,dbtable){
    
function pipeFieldsDropDown(element,dbtable){

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

// Get names from results  

function pipeResultsDropDown(element,dbtable,fieldname){

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

        dropDown(resultsArray, element);

        connection.destroy();

    })

}

// This function will populate a list based upon a drop down box element within a form
// Requires array of data and destination element
function dropDown(array, element){

    var dditems = document.getElementById(element);

    for (var i = 0;i < array.length; i++){

        var opt = array[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        dditems.appendChild(el);

    }

}

//DEVTOOL

function devprint(arrayCapture){

    var outstream;

    for(var r = 0; r < arrayCapture.length; r++){

        outstream+= arrayCapture[r];

    }

    document.getElementById('pullit').innerHTML =  outstream;
}

function mainDisplaySequence(dbtable){

    pipeFieldsDropDown('field_list',dbtable);
    pipeResultsDropDown('field_list2',dbtable,'last_name') // DEV 311018 insert field name here

}