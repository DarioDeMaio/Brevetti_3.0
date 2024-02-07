const express = require('express');
const Web3 = require('web3');
const path = require('path');

const app = express();
const rpcEndpoint = 'HTTP://127.0.0.1:7545';
let web3 = new Web3(rpcEndpoint);

app.use(express.json());

// Funzione per ottenere dinamicamente l'indirizzo dei contratti, viene chiamata nei vari metodi get e post
async function getContractAddress(contractName) {
  const contractJSON = require(`./build/contracts/${contractName}.json`);
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = contractJSON.networks[networkId];

  if (!deployedNetwork) {
    throw new Error(`Contratto ${contractName} non deployato sulla rete con id ${networkId}`);
  }

  return deployedNetwork.address;
}

app.get('/:contractName/number', async (req, res) => {
  const { contractName } = req.params;
  const contractAddress = await getContractAddress(contractName);
  const contractABI = require(`./build/contracts/${contractName}.json`).abi;
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const number = await contract.methods.getNumber().call();
  res.json({ number });
});

app.post('/:contractName/number', async (req, res) => {
  const { contractName } = req.params;
  const { number, address } = req.body;
  //const accounts = await web3.eth.getAccounts();
  const contractAddress = await getContractAddress(contractName);
  const contractABI = require(`./build/contracts/${contractName}.json`).abi;
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const result = await contract.methods.setNumber(number).send({ from: address /*accounts[0] */});
  res.json({ message: 'number set successfully' });
});

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/index.html'));
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
