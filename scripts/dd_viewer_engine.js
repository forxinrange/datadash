// Viewer Engine - DataDash
// Developers - M Bradley

// Check for SQL settings file

function read_config(){

    const fs = require('fs');
    const path = './default.dash';
    if(fs.existsSync(path)){
        console.log("I can see default.dash");
        var config = fs.readFileSync('default.dash').toString().split("\n");
        return config;
    }
    else
    {
        console.log("cant see default.dash for some reason");
        null;
    }

}

function checkDetailsFile(){

    const fs = require('fs');
    const path = './connection_details.txt';
    if(fs.existsSync(path)){

    }
    else{
        document.getElementById('sqlError').innerHTML = "Warning: No connection details configured.  <br>Please configure SQL server details and reload DataDash.";
    }
}

// SQL Connector

function establish_mySQL_connection(){
    var mysql = require('mysql');
    var connectionInfo = read_mySQL_connection_details();
    var activeConnection = mysql.createConnection(connectionInfo);
    return activeConnection;
}

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

function read_target_table(){
    var fs = require('fs');
    var targetTable = fs.readFileSync('connection_details.txt').toString().split("\n");
    return targetTable[4]; // Returns specified table
}

function query_mySQL_database(sql_query,element){
    var connection = establish_mySQL_connection();
    connection.connect();
    connection.query(sql_query, function(error, rows, fields){

        //console.log(fields);
        var output = rows[0]['COUNT(*)'];

        release_target(output,element);

        connection.destroy(); // Kill connection from mySQL server
    })
}



function config_to_SQL(){

    var table_value = read_target_table();
    var con_string = read_config();
    var no_cycles = con_string.length - 1;
    var master_area = document.getElementById("masterArea");

    // Structure section

    for(var y = 0; y < (no_cycles/11); y++){
        
        var p_element = document.createElement("p");
        p_element.id=y+"_area";
        master_area.appendChild(p_element);

        for(var t = 0; t < 2; t++){
            var label_element = document.createElement("label");
            var inp_element = document.createElement("input");
            inp_element.type="text";
            if(t==0){
                label_element.id=y+"_label_A";
                inp_element.id=y+"_sub_A";
            }
            else{
                label_element.id=y+"_label_B";
                inp_element.id=y+"_sub_B";
            }
            p_element.appendChild(label_element);
            p_element.appendChild(inp_element);
            var break_element2 = document.createElement("br");
            p_element.appendChild(break_element2);
            
            if(t == 0){
                var mod_label_breaker = document.createElement("label");
                mod_label_breaker.innerHTML = "Modifier";
                p_element.appendChild(mod_label_breaker);
                var break_element3 = document.createElement("br");
                p_element.appendChild(break_element3);
                var mod_label = document.createElement("input");
                mod_label.id=y+"_mod_label";
                p_element.appendChild(mod_label);
                var break_element = document.createElement("br");
                p_element.appendChild(break_element);
            }
            else{
                var break_element = document.createElement("br");
                p_element.appendChild(break_element);
                var result_label = document.createElement("input");
                result_label.id=y+"_result_label";
                p_element.appendChild(result_label);
            }
        }

    }

    console.log(no_cycles);

    for(var x = 0; x < no_cycles; x = x + 11){

        var block_section = new Array(con_string[x],con_string[x+1],con_string[x+2],con_string[x+3],con_string[x+4],con_string[x+5],con_string[x+6],con_string[x+7],con_string[x+8],con_string[x+9],con_string[x+10],con_string[x+11]);

        var first_sql_string;
        var second_sql_string;

        var element_concat;
        var label_concat;
        var mod_label;

        var element_concat_B;
        var label_concat_B;

        console.log(block_section[2]);
        console.log(x);

        // SECTION A
        if(block_section[2] == 'COUNT'){

            first_sql_string = 'SELECT COUNT(*) FROM ' + table_value + ' WHERE ' + block_section[0] + ' = "' + block_section[1] + '";'; 
            if(x == 0){
                mod_label = '0_mod_label';
                label_concat = '0_label_A';
                element_concat = '0_sub_A';
            }
            else{
                mod_label = (x/11)+"_mod_label";
                label_concat = (x/11)+"_label_A";
                element_concat = (x/11)+"_sub_A";
            }
            set_labels_html(label_concat,block_section[0]+" = "+block_section[1]+"<br>");
            set_labels_value(mod_label,block_section[5]);
            query_mySQL_database(first_sql_string,element_concat);

        }


        // SECTION B
        if(block_section[8] == 'COUNT'){

            second_sql_string = 'SELECT COUNT(*) FROM ' + table_value + ' WHERE ' + block_section[6] + ' = "' + block_section[7] + '";'; 

            if(x == 0){
                label_concat_B = '0_label_B';
                element_concat_B = '0_sub_B';
            }
            else{
                label_concat_B = (x/11)+"_label_B";
                element_concat_B = (x/11)+"_sub_B";
            }
            set_labels_html(label_concat_B,block_section[6]+" = "+block_section[7]+"<br>");
            console.log(label_concat_B);
            query_mySQL_database(second_sql_string,element_concat_B);

        }

        if(x == 0){
            var result_box = '0_result_label';
        }
        else{
            var result_box = (x/11)+"_result_label";
        }

    }

}

function set_labels_value(element, value){

    var elem = document.getElementById(element);
    elem.value = value;

}

function set_labels_html(element, value){

    var elem = document.getElementById(element);
    elem.innerHTML = value;

}

function release_target(value,element){

    var selected_element = document.getElementById(element);
    selected_element.value = parseInt(value);

}

/// refereence ///