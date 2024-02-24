App = {
    web3Provider:null,
    contracts: {},
    account: null,

    init: async function() {
      return await App.initWeb3();
    },

    initWeb3: async function() {
    
        if (window.ethereum) {
          App.web3Provider = window.ethereum;
          try {
              await window.ethereum.request({ method: 'eth_requestAccounts' });
              App.account = window.ethereum.selectedAddress;
          } catch (error) {
              console.error("User denied account access")
          }
      }
        else if (window.web3) {
          App.web3Provider = window.web3.currentProvider;
        }
        else {
          App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);
    
    
        return App.initContract();
      },

      initContract: function() {
    
        $.getJSON('../Factory.json', function(data) {
          var factory = data;
          App.contracts.Factory = TruffleContract(factory);
        
          App.contracts.Factory.setProvider(App.web3Provider);
        
        });

        $.getJSON('../Brevetto.json', function(data) {
            var brevetti = data;
            App.contracts.Brevetto = TruffleContract(brevetti);
          
            App.contracts.Brevetto.setProvider(App.web3Provider);
          
          });
        
    
        return App.bindEvents();
      },



      bindEvents: function() {
        $(document).on('click', '.submit', App.sendRequest);
      },

      sendRequest: async function(event){
        
        event.preventDefault();

        var nomeBrevetto = document.getElementById('nomeBrevetto').value;
        var descrizione = document.getElementById('descrizione').value;
        var dataCorrente = new Date();

        var anno = dataCorrente.getFullYear();
        var mese = dataCorrente.getMonth() + 1; 
        var giorno = dataCorrente.getDate();

        var dataFormattata = anno + "-" + mese + "-" + giorno;

        let brevettoData = JSON.stringify({
            nomeBrevetto: nomeBrevetto,
            descrizione: descrizione,
            dataFormattata : dataFormattata,
            state: "attesa",
            user: App.account
        });
        const amountToSend = web3.utils.toWei('3', 'ether');

        const ipfs = window.ipfs;
        const result = await ipfs.add(brevettoData);
        const cid = result.path;

        var factoryInstance;
        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
              console.log(error);
            }
      
            App.contracts.Factory.deployed().then(function(instance) {
              factoryInstance = instance;
                
              return factoryInstance.createBrevetto(cid, nomeBrevetto, App.account, {from:App.account, value: amountToSend});
            }).catch(function(err) {
              console.log(err.message);
            });
          });
      }
};