App3 = {
    web3Provider: null,
    contracts: {},
    account: null,
    init: async function () {
        await App3.initWeb3();
    },
    

    initWeb3: async function () {
        if (window.ethereum) {
            App3.web3Provider = window.ethereum;
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                App3.account = window.ethereum.selectedAddress;
            } catch (error) {
                console.error("User denied account access");
            }
        } else if (window.web3) {
            App3.web3Provider = window.web3.currentProvider;
        } else {
            App3.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(window.ethereum);

        return App3.initContract();
    },

    initContract: function() {
        $.getJSON('../Factory.json', function(factoryData) {
            var factory = factoryData;
            App3.contracts.Factory = TruffleContract(factory);
        
            // Set the provider for our contract
            App3.contracts.Factory.setProvider(App3.web3Provider);
        
            $.getJSON('../Brevetti.json', function(brevettiData) {
                var brevetti = brevettiData;
                App3.contracts.Brevetti = TruffleContract(brevetti);
            
                // Set the provider for our contract
                App3.contracts.Brevetti.setProvider(App3.web3Provider);
            
                // Call getList only after both JSON files are loaded
                App3.getBrevettoDetails();
            });
        });
    },
    

    getBrevettoDetails: async function () {
        // Ottieni il parametro dall'URL
        const urlParams = new URLSearchParams(window.location.search);
        const brevettoId = urlParams.get('id');
        var brevettoUser = null;

        // Ottieni i dettagli del brevetto tramite l'ID dalla blockchain
        var factoryInstance;
        try {
            
            factoryInstance = await App3.contracts.Factory.deployed();
            
            brevettoUser = factoryInstance.getBrevetto(brevettoId);
            console.log("Mammt " + brevettoUser.getUser);
            

            const brevettoDetails = await fetchIPFSData(brevettoId);
            console.log("Dettagli del brevetto:", brevettoDetails);

            var brevettoDetailsDiv = $("#brevettoDetails");
            brevettoDetailsDiv.append("<p><strong>Nome Brevetto:</strong> " + brevettoDetails.nomeBrevetto + "</p>");
            brevettoDetailsDiv.append("<p><strong>Data di Inserimento:</strong> " + brevettoDetails.dataFormattata + "</p>");
            brevettoDetailsDiv.append("<p><strong>Descrizione:</strong> " + brevettoDetails.descrizione + "</p>");
            brevettoDetailsDiv.append("<p><strong>Stato:</strong> " + brevettoDetails.state + "</p>");

            var isVoter = await check(brevettoUser);
            
            if(!isVoter)
            {
                brevettoDetailsDiv.append('<button id="accettazioneBtn" class="btn btn-success" style="margin-right: 20px;">Accettazione</button>');
                brevettoDetailsDiv.append('<button id="rifiutoBtn" class="btn btn-danger">Rifiuto</button>');

                $("#accettazioneBtn").on("click", function () {
                    document.getElementById("accettazioneBtn").disabled = true;
                    document.getElementById("rifiutoBtn").disabled = true;
                    vote("Confermato");
                    console.log("Brevetto accettato!");
                });
    
                
                $("#rifiutoBtn").on("click", function () {
                    document.getElementById("rifiutoBtn").disabled = true;
                    document.getElementById("accettazioneBtn").disabled = true;
                    vote("Rifiutato");
                    console.log("Brevetto rifiutato!");
                });
            }            
        } catch (error) {
            console.error("Errore durante il recupero dei dettagli del brevetto:", error);
        }
    }
    
};

async function check(brevettoUser) {
    try {
        var brevettiInstance = await App3.contracts.Brevetti.deployed();
        const list = await brevettiInstance.getVoterAddresses();

        console.log("Account corrente:", App3.account);
        console.log("Creatore del brevetto:", brevettoUser);
        
        if (App3.account === brevettoUser) {
            console.log("Sei l'utente creatore del brevetto.");
            return true;
        }

        return list.some(addr => App3.account.toUpperCase() === addr.toUpperCase());
    } catch (error) {
        console.error("Errore durante il controllo:", error);
        return false;
    }
}


function vote(v){
    var brevettiInstance;
        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }
    
            App3.contracts.Brevetti.deployed().then(function(instance) {
                brevettiInstance = instance;
                return brevettiInstance.addVoter(v, {from: App3.account});
            }).catch(function(err) {
                console.log(err.message);
            });
        });
}
