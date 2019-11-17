var bodyParser = require('body-parser')
const cors = require('cors');
const express = require('express');
var app = express();

// const auth = require('./middleware/auth');
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", '*');
//     res.header("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     res.header("Access-Control-Allow-Methods", 'OPTIONS, GET, POST, PUT, PATCH, DELETE');

//     if (req.url == '/users/login')
//         next();
//     else
//         auth(req, res, next);
//     // next();
// })

app.use(cors({
    methods: ['OPTION', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));

const auth = require('./middleware/auth');
app.use(auth);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

const customerTypeCtrl = require('./controllers/customer_types');
app.use('/customerTypes', customerTypeCtrl);

const userCtrl = require('./controllers/users');
app.use('/users', userCtrl);

const customerCtrl = require('./controllers/customers');
app.use('/customers', customerCtrl);


app.use((req, res) => {
    res.status(404).send('Api Not Found');
});

var server = app.listen(8081, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Server is running at http://%s:%s', host, port);
})