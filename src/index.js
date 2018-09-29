const {getUsers, getUser} = require('./Users');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send("Welcome to listen up application");
});

app.get('/users/:username?', async (req, res) => {
    try {
        let result;
        if(!req.params.username) {
            result = await getUsers().catch(error => {
                errorHandler(res,error);
            });
        }
        else {
            result = await getUser(req.params.username).catch(error => {
                errorHandler(res,error);
            });
        }
        res.send(result);
    }
    catch (error) {
        throw error;
    }


});

let server = app.listen(8085, () => {
   console.log("listenup app listening on port 8085");
});

function errorHandler (res, error) {
    let status = error.response ? error.response.status : 500,
        message = error.response ? error.response.statusText : 'internal server error';

    res.status(status).send({status:status, message: message});

}

module.exports = server;
