// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.22;
//creating smart contract 
import "./Brevetti.sol";
pragma experimental ABIEncoderV2;

contract Factory{
    Brevetti[] listBrevetti;
    mapping(string => string) brevettoStates; // Mappatura per associare l'ID del brevetto al suo stato

    constructor() public{}

    function createBrevetto(string memory _id, string memory _name) public{
        Brevetti b = new Brevetti();
        b.setId(_id);
        b.setName(_name);
        b.setUser(msg.sender);
        b.setState("attesa");
        listBrevetti.push(b);

        // Aggiungi l'ID del brevetto e il suo stato alla mappatura
        brevettoStates[_id] = "attesa";
    }

    function getList() public view returns(string[] memory){
        string[] memory listId = new string[](listBrevetti.length);
        for(uint i = 0; i < listBrevetti.length; i++){
            listId[i] = listBrevetti[i].getId();
        }
        return listId;
    }

    function getBrevettoState(string memory brevettoId) public view returns (string memory) {
        return brevettoStates[brevettoId];
    }

}