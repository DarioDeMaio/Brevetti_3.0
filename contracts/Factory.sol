// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.22;
//creating smart contract 
import "./Brevetti.sol";
pragma experimental ABIEncoderV2;

contract Factory{
    Brevetti[] listBrevetti;

    constructor() public{}

    function createBrevetto(string memory _id, string memory _name, address user) public{
        Brevetti b = new Brevetti();
        b.setId(_id);
        b.setName(_name);
        b.setUser(user);
        b.setState("attesa");
        listBrevetti.push(b);
    }

    function getList() public view returns(string[] memory){
        string[] memory listId = new string[](listBrevetti.length);
        for(uint i = 0; i < listBrevetti.length; i++){
            listId[i] = listBrevetti[i].getId();
        }
        return listId;
    }

    function getBrevettoUser(string memory brevettoId) public view returns (address) {
        for (uint i = 0; i < listBrevetti.length; i++) {
            if (keccak256(abi.encodePacked(listBrevetti[i].getId())) == keccak256(abi.encodePacked(brevettoId))) {
                return listBrevetti[i].getUser();
            }
        }
        revert("Brevetto non trovato");
    }


}