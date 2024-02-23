# Sistema di Gestione dei Brevetti sulla Blockchain
Il progetto in esame è stato realizzato per il corso di "Sicurezza dei Dati", presso l'Università degli Studi di Salerno. Tale progetto mira a creare un sistema decentralizzato per la gestione dei brevetti utilizzando la blockchain. Gli utenti possono proporre brevetti e ricevere un resoconto dalla comunità degli altri partecipanti. La decisione sulla validità del brevetto avviene attraverso un processo di votazione, con incentivi finanziari per coloro che partecipano al processo. Di seguito, verrà descritto il funzionamento in dettaglio.

## Funzionamento
- Proposta del Brevetto: un utente può proporre un brevetto attraverso l'interfaccia web, compilando il form con i campi "Nome Brevetto" e "Descrizione".
- Votazione: gli altri partecipanti hanno la possibilità di accettare o rifiutare il brevetto proposto entro un tempo limitato. Se un utente accetta, non è tenuto a pagare nulla, mentre in caso di rifiuto, l'utente paga 1 ETH.
- Incentivi: se la maggioranza accetta il brevetto, viene incentivata con una quota in Ether. In caso contrario, se la maggioranza rifiuta, riceverà una quota in Ether più il ritorno dell'Ether inizialmente speso per rifiutare il brevetto.

## Requisiti
Per eseguire il progetto, è necessario avere installati i seguenti componenti:
- [Node.js](https://nodejs.org/en/download)
- [Truffle](https://www.npmjs.com/package/truffle)
- [Ganache](https://trufflesuite.com/ganache/)
- Estensione Metamask

## Configurazione del Progetto
- Clona il repository:
```bash

git clone https://github.com/DarioDeMaio/Brevetti_3.0.git 

```
- Installa le dipendenze:
```bash

npm install

```
- Avvia Ganache e configura una nuova blockchain locale (Quickstart)
- Migrazione dei contratti su Ganache:
```bash

truffle migrate

```
- Aggiungi l'estensione Metamask su Google Chrome
- Inserisci le 12 keyword di MNEMONIC (Ganache) in Metamask
- Inserisci una password
- Aggiungi una rete manualmente:
  - Nome rete = nome_Rete
  - Host RPC = rpc_server_on_ganache
  - Chain ID = 1337
  - Simbolo moneta = ETH
- Esegui il progetto:
```bash

npm run dev

```
  
