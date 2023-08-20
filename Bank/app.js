const express = require('express');
const app = express();
require('dotenv/config');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*', cors())

const api = process.env.API_URL;

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(errorHandler);

//Routes
const accountsRoutes = require('./routes/accounts');
const transactionsRoutes = require('./routes/transactions');

app.use(`${api}/accounts`, accountsRoutes);
app.use(`${api}/transactions`, transactionsRoutes);

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
app.listen(2002, ()=>{

    console.log('bank is running http://localhost:2002');
})