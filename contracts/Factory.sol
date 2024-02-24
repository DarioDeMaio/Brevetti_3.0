pragma solidity >=0.4.20 <=0.8.19; 
import "./Brevetto.sol";
pragma experimental ABIEncoderV2;

contract Factory{
    Brevetto[] listBrevetti;

    constructor() {}

    function createBrevetto(string memory _id, string memory _name, address user) public payable{
        require(msg.value == 3 ether);
        Brevetto b = new Brevetto();
        b.setId(_id);
        b.setName(_name);
        b.setUser(user);
        b.setState("attesa");
        b.setBalance{value: 3 ether}();
        
        listBrevetti.push(b);
    }

    function getList() public view returns(string[] memory){
        string[] memory listId = new string[](listBrevetti.length);
        for(uint i = 0; i < listBrevetti.length; i++){
            listId[i] = listBrevetti[i].getId();
        }
        return listId;
    }

    function getListBrevetti() public view returns(Brevetto[] memory){
        return listBrevetti;
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