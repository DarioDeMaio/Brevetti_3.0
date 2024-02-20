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
        
            $.getJSON('../Brevetto.json', function(brevettiData) {
                var brevetti = brevettiData;
                App2.contracts.Brevetto = TruffleContract(brevetti);
            
                // Set the provider for our contract
                App2.contracts.Brevetto.setProvider(App2.web3Provider);
            
                // Call getList only after both JSON files are loaded
                App2.getList();
            });
        });
    },


getList: async function () {
  var factoryInstance;
  try {
      const list = await App2.contracts.Factory.deployed().then(function (instance) {
          factoryInstance = instance;
          return factoryInstance.getList();
      });

      console.log("Gli elementi sono: ");
      console.log(list);

      var tableBody = $("#brevettiTableBody");
      tableBody.empty();

      for (let i = 0; i < list.length; i++) {
          try {
              let data = await fetchIPFSData(list[i]);
              tableBody.append("<tr class='brevetto-row' data-id='" + list[i] + "'><td>" + data.nomeBrevetto + "</td><td>" + data.dataFormattata + "</td></tr>");
          } catch (error) {
              console.error("Errore durante il recupero dei dati da IPFS:", error);
          }
      }

      $(".brevetto-row").hover(function () {
        $(this).css("cursor", "pointer");
      });
      
      $(".brevetto-row").click(function () {
          const brevettoId = $(this).data("id");
          window.location.href = "../html/brevetto.html?id=" + brevettoId;
      });
  } catch (err) {
      console.error(err.message);
  }
}

};


async function fetchIPFSData(el) {
  let x = "";
  try {
      for await (const chunk of window.ipfs.cat(el)) {
          x += chunk;
      }
      const ipfsResultArray = x.split(",");
      const jsonString = ipfsResultArray.map(code => String.fromCharCode(code)).join("");
      return JSON.parse(jsonString);
  } catch (error) {
      console.log("Errore durante il recupero dei dati da IPFS:", error);
      return {};
  }
}