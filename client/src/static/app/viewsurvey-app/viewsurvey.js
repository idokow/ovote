// web3 library
const { Web3 } = require('web3');
import { MetaMaskSDK } from "@metamask/sdk"

// internal vars
const PublicAddress = '0x0E915D474074a73e69b3C84a1F7a59B871985a83'
var userAddr = 'null'
var surveys

// setup contract and web3 and metamask
const ContractABI = require('../../../../../model/build/contracts/ovote.json')['abi']
const ContractAddress = require('../contractAddress.json')['address']
const MMSDK = new MetaMaskSDK({dappMetadata:{name: "ovote",},infuraAPIKey: "r7ZQVyY14ZVa5QpSv6DOZhBzEesM9yRv"})
const web3 = new Web3("https://eth-sepolia.g.alchemy.com/v2/Qf1hLjSGk7qhETRSRlCmoSQMLBD7_XIm")
const contract = new web3.eth.Contract(ContractABI, ContractAddress)

// onload function
window.onload = async () => {
  const result = await ethereum.request({ 
    method: "eth_accounts"
  })
  if (result.length > 0){
    userAddr = result[0]
    document.getElementById('connect-btn').textContent = userAddr.slice(0,5) + '...'
    document.getElementById('makenew-btn').style.visibility = 'visible'
  }
  surveys = await viewchain(userAddr)
  renderSurveys()
  document.getElementById('search-box').onkeyup = filterSurveys
};

// handel connecting to metamask account
document.getElementById('connect-btn').onclick = async () => {
  if (userAddr == 'null'){
    try {
      await MMSDK.connect()
      const accounts = await ethereum.request({ 
        method: "eth_accounts", 
        params: [] 
      })
      userAddr = accounts[0]
    } catch {
      userAddr = 'null'
    }

    if (userAddr != 'null') {
      document.getElementById('connect-btn').textContent = userAddr.slice(0,5) + '...'
      document.getElementById('makenew-btn').style.visibility = 'visible'
    }
  }
}

// function to render surveys
function renderSurveys(filteredSurveys = surveys) {
  const surveyList = document.getElementById('survey-list');
  surveyList.innerHTML = '';

  filteredSurveys.forEach(survey => {
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
  if (MSGsender == 'null'){
    const RAWresult = await contract.methods.viewSurveys().call({from:PublicAddress});
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
  else{
    const RAWresult = await contract.methods.viewSurveysByAddr(MSGsender).call({from:MSGsender});
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
}

// function for search box
function filterSurveys() {
  const searchQuery = document.getElementById('search-box').value.toLowerCase();
  const filteredSurveys = surveys.filter(survey => 
    survey.title.toLowerCase().includes(searchQuery) ||
    survey.owner.toLowerCase().includes(searchQuery) ||
    survey.description.toLowerCase().includes(searchQuery)
  );
  renderSurveys(filteredSurveys);
}