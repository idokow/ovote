// web3 library
const { Web3 } = require('web3');
import { MetaMaskSDK } from "@metamask/sdk"

// setup contract and web3 and metamask
const ContractABI = require('../../../../../model/build/contracts/ovote.json')['abi']
const ContractAddress = require('../contractAddress.json')['address']
const MMSDK = new MetaMaskSDK({dappMetadata:{name: "ovote",},infuraAPIKey: "r7ZQVyY14ZVa5QpSv6DOZhBzEesM9yRv"})
const web3 = new Web3("https://eth-sepolia.g.alchemy.com/v2/Qf1hLjSGk7qhETRSRlCmoSQMLBD7_XIm")
const contract = new web3.eth.Contract(ContractABI, ContractAddress)

// internal vars
var userAddr = 'null'
var survey
const surveyID = document.getElementById('data_from_django').innerHTML

// onload function
window.onload = async () => {
    const accounts = await ethereum.request({ method: "eth_accounts" })
    userAddr = accounts[0]

    if(accounts.length == 0){
        alert('Please login first')
        window.location.href = '../'
    }
    else{
        let RWsurvey = await contract.methods.viewSurveyByID(surveyID).call({from:userAddr})

        survey = {
            id: RWsurvey[0],
            title: RWsurvey[1],
            owner: RWsurvey[3],
            description: RWsurvey[2],
            answersResult: {}
        }

        RWsurvey[4].forEach(anss => {
            survey['answersResult'][anss[0]]=anss[1]
        });

        if (survey.title == '404' && survey.description == '$internalComunication false'){
            alert('you dont have permission to vote this survey')
            window.location.href = '../'
        }
        else{
            render()
        }
    }
};

// function that renders page
function render(){
    // Populate the survey details
    document.getElementById('survey-title').textContent = survey.title;
    document.getElementById('survey-owner').textContent = `Created by: ${survey.owner}`;
    document.getElementById('survey-description').textContent = survey.description;

    const answersDiv = document.getElementById('answersDIV');
    answersDiv.innerHTML = ''

    // Render answer buttons dynamically
    for (const answer in survey.answersResult) {
        const button = document.createElement('button');
        button.textContent = `${answer} (Votes: ${survey.answersResult[answer]})`;
        button.className = "w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-2";
        button.onclick = () => vote(answer, survey.id);
        answersDiv.appendChild(button);
    }
}

// Vote function
async function vote(answer, id) {
    let answeri = 0
    for (const ianswer in survey.answersResult){
        if (ianswer == answer){
            break
        }
        answeri++
    }

    try {
        const txData = contract.methods.vote(id, answeri).encodeABI()
        
        const tx = {
            from: userAddr,
            to: ContractAddress,
            data: txData,
            gas: "200000",
        };
    
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [tx],
        });

        console.log("Transaction sent! Hash:", txHash);
    } catch (error) {
        console.error("Transaction failed:", error);
    }

    document.getElementById('voted-message').style.visibility = 'visible'
    render()
}

// Back button function
document.getElementById('submit-btn').onclick = () => {
    window.location.href = '../'
}