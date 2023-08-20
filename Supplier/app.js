const express = require('express');
const app = express();
require('dotenv/config');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('./helpers/error-handler');

const api = process.env.API_URL;

app.use(cors());
app.options('*', cors())

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(errorHandler);

//Routes
const sellsRoutes = require('./routes/sells');
app.use(`${api}/sells`, sellsRoutes);


//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'E-SHOP'
})
.then(()=>{
    console.log('Database Connection is ready...')
})
.catch((err)=> {
    console.log(err);
})


//Server
app.listen(2001, ()=>{

    console.log('supplier is running http://localhost:2001');
})