// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.22;
//creating smart contract 
contract Brevetti {
    string internal  id; //hash del documento
    string internal  name;
    address internal  user;
    string internal  state;
    uint256 internal  timer;


    constructor() public{}
    // constructor(string memory _id, string memory _name, address _user) public{
    //     id = _id;
    //     name = _name;
    //     user = _user;
    //     state = "In attesa";
    // }

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

    function setState(string calldata _state) external{
        if(keccak256(abi.encodePacked(state)) == keccak256(abi.encodePacked("attesa"))){
            state = _state;
        }
    }
}