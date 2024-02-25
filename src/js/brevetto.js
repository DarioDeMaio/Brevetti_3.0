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
        
            App3.contracts.Factory.setProvider(App3.web3Provider);
        
            $.getJSON('../Brevetto.json', function(brevettiData) {
                var brevetti = brevettiData;
                App3.contracts.Brevetto = TruffleContract(brevetti);
            
                App3.contracts.Brevetto.setProvider(App3.web3Provider);
            
                App3.getBrevettoDetails();
            });
        });
    },
    

    getBrevettoDetails: async function () {
        const urlParams = new URLSearchParams(window.location.search);
        const brevettoId = urlParams.get('id');
        

        var factoryInstance;
        try {
            
            factoryInstance = await App3.contracts.Factory.deployed();
            
            const creatorAddress = await factoryInstance.getBrevettoUser(brevettoId);

            const brevettoDetails = await fetchIPFSData(brevettoId);
            
            var brevettoDetailsDiv = $("#brevettoDetails");
            brevettoDetailsDiv.append("<p><strong>Nome Brevetto:</strong> " + brevettoDetails.nomeBrevetto + "</p>");
            brevettoDetailsDiv.append("<p><strong>Data di Inserimento:</strong> " + brevettoDetails.dataFormattata + "</p>");
            brevettoDetailsDiv.append("<p><strong>Descrizione:</strong> " + brevettoDetails.descrizione + "</p>");
            brevettoDetailsDiv.append("<p><strong>Stato:</strong> " + brevettoDetails.state + "</p>");
            brevettoDetailsDiv.append("<button id='reward' onClick='reward(\"" + brevettoId + "\", " + JSON.stringify(brevettoDetails) + ")'>Reward</button>");

            var isVoter = await check(creatorAddress, factoryInstance, brevettoId);
            
            if(!isVoter)
            {
                
                brevettoDetailsDiv.append('<button id="accettazioneBtn" class="btn btn-success" style="margin-right: 20px;">Accettazione</button>');
                brevettoDetailsDiv.append('<button id="rifiutoBtn" class="btn btn-danger">Rifiuto</button>');

                $("#accettazioneBtn").on("click", function () {
                    document.getElementById("accettazioneBtn").disabled = true;
                    document.getElementById("rifiutoBtn").disabled = true;
                    vote("Confermato", brevettoId);
                    
                });
    
                $("#rifiutoBtn").on("click", function () {
                    document.getElementById("rifiutoBtn").disabled = true;
                    document.getElementById("accettazioneBtn").disabled = true;
                    vote("Rifiutato", brevettoId);
                    
                });
            }            
        } catch (error) {
            console.error("Errore durante il recupero dei dettagli del brevetto:", error);
        }
    }
};

async function check(creatorAddress, factoryInstance, brevettoId) {
    try {
        var list= await getListBrevetti();
        
        var brevettiInstance = null;
        for(let i = 0; i < list.length; i++){
            brevettiInstance = await App3.contracts.Brevetto.at(list[i]);
            if(brevettoId === await brevettiInstance.getId()){
                break;
            }
        }
        var a = await brevettiInstance.getVotes();
        var addresses = a[0];

        if (App3.account.toUpperCase() === creatorAddress.toUpperCase()) {
            return true;
        }
        for(let i = 0; i < addresses.length; i++){
            if(addresses[i].toUpperCase() === App3.account.toUpperCase()){
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error("Errore durante il controllo:", error);
        return false;
    }
}

async function vote(v, brevettoId){
    try {
        var list = await getListBrevetti();
        
        for(let i = 0; i < list.length; i++){
            var brevettiInstance = await App3.contracts.Brevetto.at(list[i]);
            
            if(brevettoId === await brevettiInstance.getId()){
                web3.eth.getAccounts(function(error, accounts) {
                    if (error) {
                        console.log(error);
                    }
                    
                    if (v === 'Rifiutato') {
                        const amountToSend = web3.utils.toWei('1', 'ether');
                        return brevettiInstance.addVoter(v, { from: App3.account, value: amountToSend });
                    }
                    return brevettiInstance.addVoter(v, {from: App3.account});
                });
            }
        }
    } catch (error) {
        console.error("Errore durante il voto:", error);
    }
}

async function getListBrevetti() {
    try {
        const factoryInstance = await App3.contracts.Factory.deployed();
        const brevettiList = factoryInstance.getListBrevetti();
        return brevettiList;
    } catch (error) {
        console.error("Errore durante il recupero dell'elenco dei brevetti:", error);
    }
}

async function reward(brevettoId, brevettoDetails) {
    var winner = null;
    var brevettiInstance = null;
    var list = await getListBrevetti();
    try {
        for(let i = 0; i < list.length; i++) {
            brevettiInstance = await App3.contracts.Brevetto.at(list[i]);
            if(brevettoId === await brevettiInstance.getId()) {
                break;
            } 
        }
        console.log(await brevettiInstance.getExpiryTime.call());
        let creationTime = await brevettiInstance.getCreationTime.call();
        let date = new Date(creationTime * 1000); // moltiplica per 1000 perché JavaScript lavora con millisecondi
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();

        console.log("Ora:", hour);
        console.log("Minuto:", minute);
        console.log("Secondo:", second);
        
        try {
            await brevettiInstance.rewardWinners({from: App3.account});
        } catch (error) {
            return;
        }

        const updatedState = await brevettiInstance.getState();

            let brevettoData = JSON.stringify({
                nomeBrevetto: brevettoDetails.nomeBrevetto,
                descrizione: brevettoDetails.descrizione,
                dataFormattata : brevettoDetails.dataFormattata,
                state: updatedState,
                user: brevettoDetails.user
            });

            const ipfs = window.ipfs;
            const result = await ipfs.add(brevettoData);
            const cid = result.path;

            console.log(cid);

            await brevettiInstance.setId(cid, {from: App3.account});

        
        
        window.location.href = "../html/brevettiList.html";
        
    } catch (error) {
        console.error("Error during rewards:", error);
    }
}