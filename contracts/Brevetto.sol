// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.22;
pragma experimental ABIEncoderV2;

contract Brevetto{
    string private  id; //hash del documento
    string private  name;
    address private  user;
    string private  state;
    uint private balance;
    mapping(address=>string) private vote;
    address[] private voterAddresses;

    event LogBalance(uint balance);
    constructor() public {
        balance = address(this).balance;
    }

    function addBalance(uint et) private {
        require(et == 1 ether);
        balance += et;
    }

    function setBalance(uint et) public payable{
        require(et == 3 ether);
        balance = et;
    }

    function getVoterAddresses() public view returns (address[] memory){
        return voterAddresses;
    } 

    function getVotes() public view returns (address[] memory, string[] memory) {
        uint256 votersCount = voterAddresses.length;
        string[] memory votesList = new string[](votersCount);
        for (uint256 i = 0; i < votersCount; i++) {
            address voter = voterAddresses[i];
            votesList[i] = vote[voter];
        }
        return (voterAddresses, votesList);
    }

    function addVoter(string memory _vote) public payable{
        require(bytes(vote[msg.sender]).length == 0);
        require(msg.sender != user);
        if (keccak256(abi.encodePacked(_vote)) == keccak256(abi.encodePacked("Rifiutato"))) {
            addBalance(msg.value);
        }
        voterAddresses.push(msg.sender);
        vote[msg.sender] = _vote;
    }
    

    function getId() public view returns (string memory){
        return id;
    } 

    function setId(string memory _id) public{
        id = _id;
    }

    function getName() public view returns (string memory){
        return name;
    }

    function setName(string memory _name) public{
        name = _name;
    }

    function getUser() public view returns (address){
        return user;
    }

    function setUser(address _user) public{
        user = _user;
    } 


    function getState() public view returns (string memory){
        return state;
    }

    function setState(string memory _state) public{
        if(keccak256(abi.encodePacked(state)) == keccak256(abi.encodePacked("attesa"))){
            state = _state;
        }

        if(keccak256(abi.encodePacked(_state)) == keccak256(abi.encodePacked("attesa"))){
            state = _state;
        }
    }


    function getWinner() public returns (string memory winnerType, uint winnerVotes) {
        require(voterAddresses.length > 0);
        uint confirmedVotes = 0;
        uint rejectedVotes = 0;

        for (uint i = 0; i < voterAddresses.length; i++) {
            string memory voteType = vote[voterAddresses[i]];
            if (keccak256(abi.encodePacked(voteType)) == keccak256(abi.encodePacked("Confermato"))) {
                confirmedVotes++;
            } else if (keccak256(abi.encodePacked(voteType)) == keccak256(abi.encodePacked("Rifiutato"))) {
                rejectedVotes++;
            }
        }

        if (confirmedVotes >= rejectedVotes) {
            setState("Confermato");
            return ("Confermato", confirmedVotes);
        } else if (rejectedVotes > confirmedVotes) {
            setState("Rifiutato");
            return ("Rifiutato", rejectedVotes);
        }
    }


    function rewardWinners() public{
        emit LogBalance(balance);
        (string memory winnerType, uint winnerVotes) = getWinner();
        uint amountToSend = 0;

        if (keccak256(abi.encodePacked(winnerType)) == keccak256(abi.encodePacked("Confermato"))) {
            amountToSend = balance / winnerVotes;
        } else if (keccak256(abi.encodePacked(winnerType)) == keccak256(abi.encodePacked("Rifiutato"))) {
            amountToSend = (balance / winnerVotes) + 1;
        }

        require(amountToSend > 0, "Nessun importo da trasferire");

        // Verifica che il saldo sia sufficiente
        require(balance >= amountToSend * winnerVotes, "Fondi insufficienti nel contratto");

        // Trasferisci i fondi ai vincitori
        for (uint i = 0; i < voterAddresses.length; i++) {
            string memory voteType = vote[voterAddresses[i]];
            if (keccak256(abi.encodePacked(voteType)) == keccak256(abi.encodePacked(winnerType))) {
                address(uint160(voterAddresses[i])).transfer(amountToSend * 1 ether);
            }
        }

        // Aggiorna il saldo del contratto
        balance -= amountToSend * winnerVotes;
        }
}