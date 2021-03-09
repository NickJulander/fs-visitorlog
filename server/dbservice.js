const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

var instance = null;

const connection = mysql.createConnection({
  host: "webapp-db.cidvrcdxzgx0.us-west-1.rds.amazonaws.com",
  user: "admin",
  password: "password",
  database: "fsadb",
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.log("ERROR " + err.message);
  }
  console.log('db ' + connection.state);
});

class DbService {

  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  async getAllData() {
    try {
      const response = await new Promise((resolve, reject) => {

       const query = "SELECT * FROM namelog;";

       connection.query(query, (err, result) => {
         if (err) reject(new Error(err.message));
         resolve(result);
       });
      });
      return response;

    } catch (error) {
      console.log(error);
    }
  }

  async insertNewName(name){
    try {
       const dateAdded = new Date();
       const insertId = await new Promise((resolve, reject) => {
       const query = "INSERT INTO namelog (name, date) VALUES (?,?);";

       connection.query(query, [name, dateAdded], (err, result) => {
         if (err) reject(new Error(err.message));
         resolve(result.insertId);
       });
      });
      console.log(insertId);
      return {
        id: insertId,
        name: name,
        date: dateAdded,
      };

    } catch (error) {
      console.log(error);
    }
  }

  async deleteRowByID(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM namelog WHERE id = (?);";
        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });
      console.log(response);
      return response === 1 ? true : false;
    } catch(error) {
      console.log(error);
    }
  }

  async updateRowByID(id, name){
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "UPDATE namelog SET name = ? WHERE id = ?";
        connection.query(query, [name, id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return response === 1 ? true : false;
    } catch(error) {
      console.log(error);
    }
  }

  async searchRowByName(name) {
    try {
      // id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM namelog WHERE name = ?";
        connection.query(query, [name], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return response;
    } catch(error) {
      console.log(error);
    }
  }
}

module.exports = DbService;
