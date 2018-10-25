function grabData(hostname,username,dbpassword,dbdatabase,dbtable){

    var mysql = require('mysql');

    var connection = mysql.createConnection({

        host : hostname,
        user : username,
        password : dbpassword,
        database : dbdatabase
        
    });

    connection.connect();

    var tableentry = dbtable;

    var sqlquery1 = "SELECT * FROM " + tableentry; 

    connection.query(sqlquery1, function(error, rows, fields){

        var fieldArray = new Array;
        var outstream;
        var genOb = 'gender';

        for(var f = 0; f < fields.length; f++){

            fieldArray.push(fields[f].name);
        }

        for(var name = 0; name < fields.length; name++){
            
            outstream+= '<br>';
            outstream+= fieldArray[name];
            
            for(var r = 0; r < rows.length; r++){

                outstream+= '<br>';
                outstream+= rows[r][fieldArray[name]];
            }

        }

        document.getElementById('pullit').innerHTML =  outstream;

    })
}
