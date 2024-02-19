// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.22;
pragma experimental ABIEncoderV2;
//creating smart contract 
contract Brevetti {
    string internal  id; //hash del documento
    string internal  name;
    address internal  user;
    string internal  state;
    mapping(address=>string) internal vote;
    address[] internal voterAddresses;

    constructor() public {}

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

    function addVoter(string memory _vote) public {
        require(bytes(vote[msg.sender]).length == 0);
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

    function setState(string calldata _state) external{
        if(keccak256(abi.encodePacked(state)) == keccak256(abi.encodePacked("attesa"))){
            state = _state;
        }
    }
}