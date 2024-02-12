// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.22;
//creating smart contract 
import "./Brevetti.sol";

contract Factory{
    Brevetti[] listBrevetti;

    constructor() public{}

    function createBrevetto(string memory _id, string memory _name, address _user) public{
        Brevetti b = new Brevetti();
        b.setId(_id);
        b.setName(_name);
        b.setUser(_user);
        listBrevetti.push(b);
    }

    function getList() public view returns(Brevetti[] memory){
        return listBrevetti;
    }

}