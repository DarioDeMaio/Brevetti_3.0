App2 = {
    web3Provider:null,
    contracts: {},

    init: async function() {
      return App2.initWeb3();
    },

    initWeb3: async function() {
    
        // Modern dapp browsers...
        if (window.ethereum) {
          App2.web3Provider = window.ethereum;
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
          App2.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
          App2.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App2.web3Provider);
    
    
        return App2.initContract();
      },
    
      initContract: function() {
        $.getJSON('../Factory.json', function(factoryData) {
            var factory = factoryData;
            App2.contracts.Factory = TruffleContract(factory);
        
            // Set the provider for our contract
            App2.contracts.Factory.setProvider(App2.web3Provider);
        
            $.getJSON('../Brevetti.json', function(brevettiData) {
                var brevetti = brevettiData;
                App2.contracts.Brevetti = TruffleContract(brevetti);
            
                // Set the provider for our contract
                App2.contracts.Brevetti.setProvider(App2.web3Provider);
            
                // Call getList only after both JSON files are loaded
                App2.getList();
            });
        });
    },

        
        getList : function(){
            var factoryInstance;
        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
              console.log(error);
            }
      
            var account = accounts[0];
            //console.log(typeof account);
      
            App2.contracts.Factory.deployed().then(function(instance) {
                factoryInstance = instance;
                let list = factoryInstance.getList();
                console.log("Gli elementi sono: ");
                console.log(list);
                return factoryInstance.getList();
            }).catch(function(err) {
              console.log(err.message);
            });
          });


      }
};

$(function() {
  $(document).ready(function() {
    App2.init();
  });
});