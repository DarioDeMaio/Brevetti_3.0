App3 = {
    web3Provider: null,
    contracts: {},

    init: async function () {
        await App3.initWeb3();
    },
    

    initWeb3: async function () {
        if (window.ethereum) {
            App3.web3Provider = window.ethereum;
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
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

        // Ottieni i dettagli del brevetto tramite l'ID dalla blockchain
        var factoryInstance;
        try {
            factoryInstance = await App3.contracts.Factory.deployed();
            const brevettoDetails = await fetchIPFSData(brevettoId);
            console.log("Dettagli del brevetto:", brevettoDetails);

            var brevettoDetailsDiv = $("#brevettoDetails");
            brevettoDetailsDiv.append("<p><strong>Nome Brevetto:</strong> " + brevettoDetails.nomeBrevetto + "</p>");
            brevettoDetailsDiv.append("<p><strong>Data di Inserimento:</strong> " + brevettoDetails.dataFormattata + "</p>");
            brevettoDetailsDiv.append("<p><strong>Descrizione:</strong> " + brevettoDetails.descrizione + "</p>");


            // if per controllare lo stato del brevetto
            // se è già accettato, non devono uscire i bottoni
            // se è ancora in attesa, i bottoni devono uscire
            brevettoDetailsDiv.append('<button id="accettazioneBtn" class="btn btn-success" style="margin-right: 20px;">Accettazione</button>');
            brevettoDetailsDiv.append('<button id="rifiutoBtn" class="btn btn-danger">Rifiuto</button>');

            
            $("#accettazioneBtn").on("click", function () {
                // Aggiungi qui la logica per l'accettazione del brevetto
                console.log("Brevetto accettato!");
            });

            
            $("#rifiutoBtn").on("click", function () {
                // Aggiungi qui la logica per il rifiuto del brevetto
                console.log("Brevetto rifiutato!");
            });
        } catch (error) {
            console.error("Errore durante il recupero dei dettagli del brevetto:", error);
        }
    }
};
