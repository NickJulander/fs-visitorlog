const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const dbservice = require('./dbservice');
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// create
app.post('/insert', (request, response) => {
  const {name} = request.body;
  const db = dbservice.getDbServiceInstance();

  const result = db.insertNewName(name);

  result
  .then(data => response.json({ data:data}))
  .catch(err => console.log(err));

});

//read
app.get('/getAll', (request, response) =>  {
  const db = dbservice.getDbServiceInstance();
  const result = db.getAllData();

  result
  .then(data => response.json({data: data}))
  .catch(err => console.logg(err));
  // response.json({
  //   success: true
  // });
});

//update
app.patch('/update', (request, response) => {
  const db = dbservice.getDbServiceInstance();
  const { id, name } = request.body;
  const result = db.updateRowByID(id, name);
  result
  .then(data => response.json({ success : data}))
  .catch(err => console.log(err));
});


//delete
app.delete('/delete/:id', (request, response) => {

  const { id } = request.params;
  const db = dbservice.getDbServiceInstance();
  const result = db.deleteRowByID(id);
  result
  .then(data => response.json({ success : data}))
  .catch(err => console.log(err));
});


///Search
app.get('/search/:name', (request, response) => {
  const { name } = request.params;
  const db = dbservice.getDbServiceInstance();
  const result = db.searchRowByName(name);
  result
  .then(data => response.json( {data : data}))
  .catch(err => console.log(err));
});

app.listen(5000, () => console.log("app is running"));