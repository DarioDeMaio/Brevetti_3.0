// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.22;
//creating smart contract 
contract Brevetto { 
	uint256 private myNumber; 
	
    //defining function 
	function getNumber() public view returns (uint256) { 
		return myNumber; 
	} 

	function setNumber(uint256 _number) public { 
		myNumber = _number; 
	} 
}
