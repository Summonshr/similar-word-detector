const selector = require('./database/query')
const oracledb = require('oracledb')
const credentials = require('./credentials.js')
const fs = require('fs')
function createConnection(){
	let pass = credentials;

	if(process.oracle && process.oracle.close()){
		process.oracle.close();
	}

	oracledb.getConnection(pass).then((connection)=>{

		process.oracle = connection;

		oracledb.stmtCacheSize = 100;

		oracledb.extendedMetaData = true;

	}).catch(console.log);
}

createConnection();
setTimeout(()=>{
    selector("select acct_name from custom.gam_acct_names --fetch all").then(results=>{
        console.log(results.rows.length)
        fs.writeFile("array.txt", results.rows.map(e=>e[0].trim().toLowerCase().replace(/[^a-z0-9 ]/g, "")).join('||'), 'utf8',function(err) {

            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    })
}, 2000)