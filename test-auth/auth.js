/*
A AWS Cognito Node.js program

*/


const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

// Pool definition
const POOLDATA = {
    UserPoolId : "eu-west-1_Bne5VF2tU", // Your user pool id here
    ClientId : "279151uu6aqemq5c22g302r2t5" // Your client id here
};

// Connecting to UserPool
const userPool = new AmazonCognitoIdentity.CognitoUserPool(POOLDATA);
if (userPool == null) {
    console.error("FATAL:Impossible to establish connection to User Pool");
    process.exit(16);
}

// =================================================================================================
function RegisterUser(){
    var attributeList = [];
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"name",Value:"Vincent DAGOURY"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"preferred_username",Value:"Vincent"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"gender",Value:"male"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"birthdate",Value:"1974-08-29"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"address",Value:"Whatever"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:"vincent.dagoury@gmail.com"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"phone_number",Value:"+5412614324321"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:scope",Value:"admin"}));
    userPool.signUp('vincent.dagoury@gmail.com', 'SamplePassword123', attributeList, null, function(err, result){
        if (err) {
            console.log(err);
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
    });
}


function Login() {
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username : 'vincent.dagoury@gmail.com',
        Password : 'SamplePassword123',
    });

    var userData = {
        Username : 'vincent.dagoury@gmail.com',
        Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('access token + ' + result.getAccessToken().getJwtToken());
            console.log('id token + ' + result.getIdToken().getJwtToken());
            console.log('refresh token + ' + result.getRefreshToken().getToken());
        },
        onFailure: function(err) {
            console.log(err);
        },

    });
}

// =================================================================================================


// Test : register a user
console.log("Try to register a user");
RegisterUser();

// Test : Login the user
console.log("Try to Login");
Login();



