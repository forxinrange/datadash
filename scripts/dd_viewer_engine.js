// Viewer Engine - DataDash
// Developers - M Bradley



function checkDetailsFile(){

    const fs = require('fs');
    const path = './connection_details.txt';
    if(fs.existsSync(path)){

    }
    else{

        document.getElementById('sqlError').innerHTML = "Warning: No connection details configured.  <br>Please configure SQL server details and reload DataDash.";

    }
}