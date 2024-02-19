// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.22;
//creating smart contract 
import "./Brevetti.sol";
pragma experimental ABIEncoderV2;

contract Factory{
    Brevetti[] listBrevetti;

    constructor() public{}

    function createBrevetto(string memory _id, string memory _name) public{
        Brevetti b = new Brevetti();
        b.setId(_id);
        b.setName(_name);
        b.setUser(msg.sender);
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

    function getBrevetto(string memory brevettoId) public view returns (Brevetti) {
        for (uint i = 0; i < listBrevetti.length; i++) {
            if (keccak256(abi.encodePacked(listBrevetti[i])) == keccak256(abi.encodePacked(brevettoId))) {
                return listBrevetti[i];
            }
        }
    }


}