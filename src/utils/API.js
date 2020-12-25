const axios = require('axios');

const API = axios.create({
    baseURL:'https://api.worldoftanks.ru/wot/account',
    responseType: "json",
    params: {
        application_id: '72162eed7ddb10efb29038d5fe8ed86d'
    }
});

module.exports = API;