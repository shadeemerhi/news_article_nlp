const dotenv = require('dotenv');
dotenv.config();

var path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js');
const { fileURLToPath } = require('url');
const text = require('body-parser');
const { post } = require('jquery');

const app = express()

app.use(express.static('dist'))
app.use(text.urlencoded({ extended: false }))
app.use(text.json())

console.log(__dirname)

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
    // res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})


app.get('/test', function (request, response) {
    response.send(mockAPIResponse);
})


// API work below

// Empty JS object
// let newInput = {};
let projectData = {};
let baseURL = 'https://api.meaningcloud.com/sentiment-2.1=';

const application_key = process.env.API_KEY;

// Posting user response from client to server
app.post('/userInput', function (request, response) {
    let newInput = {
        userInput: request.userInput
    }
    response.send(newInput);

    console.log('HI');
    getTextAnalysis(baseURL, application_key, newInput.userInput)
    .then(function(data) {
        postData('/addTextData', {
            agreement: data.agreement
        })
    })

    const postData = async (url = '', data = {}) => {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        try {
            const newData = await response.json();
        }catch(error) {
            console.log('error', error);
        }
    }
})


const getTextAnalysis = async (baseURL, apiKey, input) => {

    const response = await fetch(baseURL+apiKey+'&of='+input);
    try {
        const newData = response.json();
        return newData;
    }catch(error) {
        console.log('ERROR', error);
    }
}

// Posting API results
app.post('/addTextData', function (request, response) {
    let newEntry = {
        agreement: request.body.agreement,
    }
    projectData = newEntry;
    response.send(projectData);
})

app.get('/all', function (request, response) {
    response.send(projectData);
    console.log('Reponse Sent');
})




// app.get('/api', function (request, response) {
//     response.send({key: application_key});
// })

