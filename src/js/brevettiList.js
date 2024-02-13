App2 = {
    web3Provider:null,
    contracts: {},

    init: async function() {
      return App.initWeb3();
    },

    initWeb3: async function() {
    
        // Modern dapp browsers...
        if (window.ethereum) {
          App.web3Provider = window.ethereum;
          try {
            // Request account access
            await window.ethereum.enable();
          } catch (error) {
            // User denied account access...
            console.error("User denied account access")
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
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
          return App.getList();
        },
        
        getList : function(){
            var factoryInstance;
        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
              console.log(error);
            }
      
            var account = accounts[0];
            //console.log(typeof account);
      
            App.contracts.Factory.deployed().then(function(instance) {
                factoryInstance = instance;
                let list = factoryInstance.getList();
                console.log(list);
                return factoryInstance.getList();
            }).catch(function(err) {
              console.log(err.message);
            });
          });


      }
};

$(function() {
  $(window).load(function() {
    App2.init();
  });
});