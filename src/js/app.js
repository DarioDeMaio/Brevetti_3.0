App = {
    web3Provider:null,
    contracts: {},

    init: async function() {
      return await App.initWeb3();
    },

    initWeb3: async function() {
    
        // Modern dapp browsers...
        if (window.ethereum) {
          console.log("primo if");
          App.web3Provider = window.ethereum;
          try {
              // Request account access
              //await window.ethereum.enable();
              await window.ethereum.request({ method: 'eth_requestAccounts' });
          } catch (error) {
              // User denied account access...
              console.error("User denied account access")
          }
      }
        // Legacy dapp browsers...
        else if (window.web3) {
          console.log("sec if");
          App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
          console.log("ter if");
          App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);
    
    
        return App.initContract();
      },

      initContract: function() {
    
        $.getJSON('Factory.json', function(data) {
          // Get the necessary contract artifact file and instantiate it with @truffle/contract
          var factory = data;
          App.contracts.Factory = TruffleContract(factory);
        
          // Set the provider for our contract
          App.contracts.Factory.setProvider(App.web3Provider);
        
        });

        $.getJSON('Brevetti.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with @truffle/contract
            var brevetti = data;
            App.contracts.Brevetti = TruffleContract(brevetti);
          
            // Set the provider for our contract
            App.contracts.Brevetti.setProvider(App.web3Provider);
          
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
            dataFormattata : dataFormattata
        });

        const ipfs = window.ipfs;
        const result = await ipfs.add(brevettoData);
        const cid = result.cid.toString();

        // console.log(brevettoData,"\n");
        // console.log(cid);

        var factoryInstance;
        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
              console.log(error);
            }
      
            var account = accounts[0];
            //console.log(typeof account);
      
            App.contracts.Factory.deployed().then(function(instance) {
                factoryInstance = instance;
                //console.log(factoryInstance.getList());
              // Execute adopt as a transaction by sending account
              return  factoryInstance.createBrevetto(cid, nomeBrevetto, {from: account});
            }).catch(function(err) {
              console.log(err.message);
            });
          });


      }
};
// $(function() {
//   $(window).load(function() {
//     App.init();
//   });
// });