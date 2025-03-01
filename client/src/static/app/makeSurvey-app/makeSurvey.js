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

// onload function
window.onload = async () => {
    await MMSDK.connect()
    const accounts = await ethereum.request({method: "eth_requestAccounts"})
    userAddr = accounts[0]
}

// frontend setup
const whitelistBox = document.getElementById('whitelist-box-div');
const whitelistCheckbox = document.getElementById('whitelist-toggle');
whitelistCheckbox.onclick = function toggleWhitelist() {
    whitelistBox.classList.toggle('hidden');
}

// submiting button setup
document.getElementById('submit-btn').onclick = async () => {
    if (userAddr != 'null'){
        const titleInp = document.getElementById('title-box').value
        const descInp = document.getElementById('desc-box').value
        const ansInp = document.getElementById('ans-box').value
        const whitelistCheckboxInp = whitelistCheckbox.checked
        const whitelistBoxInp = document.getElementById('whitelist-box').value

        let zeros = []
        for (let i = 0; i < ansInp.split(',').length; i++){
            zeros.push('0')
        }
        
        let whitelistBoxInp_ = whitelistBoxInp.split(',')
        if (whitelistBoxInp == '' || whitelistCheckboxInp == false){
            whitelistBoxInp_ = []
        }

        try {
            const txData = contract.methods.appendSurvey(titleInp,descInp,whitelistCheckboxInp, whitelistBoxInp_, ansInp.split(','), zeros).encodeABI(); 
        
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

        window.location.href = '../dashboard'
    }
    else{
        document.getElementById('submit-btn').textContent = 'Please login'
        setTimeout(function() { document.getElementById('submit-btn').textContent = 'Create Survey' }, 2000);
    }
}