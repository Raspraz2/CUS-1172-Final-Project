
// Filename:  ./components/db_module/fsdb.js

// must install module using: npm install fs 
// fs module allows us to access the file system.  
const fs = require('fs');  

// The function loads the database from the filesystem, if available 
// or creates an empty database. 
// Returns: a the db connection object

let loadDatabase = (db_connection, schema = {}) => {
  // If database is not initalized, create an empty schema
  if (!fs.existsSync(db_connection)) {
    fs.writeFileSync(db_connection,JSON.stringify(schema));
   }
   // load the database from file system. 
   let model = require(db_connection);  

   // create the db object
   let db = {
     model : model,
     filename : db_connection,
     update : () => {
        fs.writeFileSync(db_connection,JSON.stringify(model));
     },
     addCollection : (collection) => {
       model['collection'] = [];
     }
   }
   return db;
}
// export the loadDatabase method 
module.exports = loadDatabase;