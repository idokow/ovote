// web3 library
const { Web3 } = require('web3');
import { MetaMaskSDK } from "@metamask/sdk"

// internal vars
var userAddr = 'null'
var surveys;

// setup contract and web3 and metamask
const ContractABI = require('../../../../../model/build/contracts/ovote.json')['abi']
const ContractAddress = require('../contractAddress.json')['address']
const MMSDK = new MetaMaskSDK({dappMetadata: {name: "ovote",},infuraAPIKey: "r7ZQVyY14ZVa5QpSv6DOZhBzEesM9yRv"})
const web3 = new Web3("https://eth-sepolia.g.alchemy.com/v2/Qf1hLjSGk7qhETRSRlCmoSQMLBD7_XIm")
const contract = new web3.eth.Contract(ContractABI, ContractAddress)

// onload function
window.onload = () => {
    login()
};

// function that checks login
async function login() {
    try{
        await MMSDK.connect()
        const accounts = await ethereum.request({ 
            method: "eth_accounts", 
        })

        userAddr = accounts[0]
    } catch (error) {
        userAddr = 'null'
    }

    const container = document.getElementById('name-header')
    if (userAddr != 'null') { // logged in 
        container.innerHTML = `
            <h2 class="text-2xl font-bold text-gray-800">Welcome, ${userAddr}!</h2>
            <p class="mt-2 text-gray-700">Here are your surveys:</p>`
        renderSurveys(userAddr)
    }
    else{
        container.innerHTML = `
            <h3 class="text-2xl font-bold text-gray-800">Please login first</h3>`
    }
}

// function for render surveys after login
async function renderSurveys() {
    // loading
    surveys = await viewchain(userAddr)

    const surveyList = document.getElementById('survey-list');
    surveyList.innerHTML = '';

    surveys.forEach(survey => {
        const surveyCard = document.createElement('div');
        surveyCard.className = 'bg-white shadow rounded-lg p-4';

        surveyCard.innerHTML = `
        <h2 class="text-lg font-semibold text-gray-800">${survey.title}</h2>
        <p class="text-sm text-gray-600">Owner: ${survey.owner}</p>
        <p class="mt-2 text-gray-700">${survey.description}</p>
        `;

        const answerCard = document.createElement('div');
        answerCard.className = 'mt-4 space-y-2';

        for (var i in survey.answersResult){
        answerCard.innerHTML += `<p class="px-4 py-2 bg-gray-100 rounded-lg">${i} : ${survey.answersResult[i]}</p>`
        }

        surveyCard.appendChild(answerCard)

        surveyCard.onclick = () => {
        window.location.href = '../vote/' + survey.id
        }

        surveyList.appendChild(surveyCard)
    });
}

// function that connects to blockchain
const viewchain = async (MSGsender) => {
    const RAWresult = await contract.methods.viewSurveysByOwner(MSGsender).call({from:MSGsender});
    let result = []

    RAWresult.forEach(element => {
        let newSur = {
            id: element[0],
            title: element[1],
            owner: element[3].slice(0,15)+'...',
            description: element[2],
            answersResult: {}
        }

        element[4].forEach(anss => {
            newSur['answersResult'][anss[0]]=anss[1]
        });

        result.push(newSur)
    });
    return result;
}