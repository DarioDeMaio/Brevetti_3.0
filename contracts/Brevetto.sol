pragma solidity >=0.4.20 <=0.8.19;
pragma experimental ABIEncoderV2;

contract Brevetto{
    string private  id; //hash del documento
    string private  name;
    address private  user;
    string private  state;
    uint256 private balance;
    mapping(address=>string) private vote;
    address[] private voterAddresses;
    uint256 creationTime;

    constructor() {
        
    }

    function setCreationTime(uint256 _date) public {
        creationTime = _date;
    }

    function getCreationTime() public view returns(uint){
        return creationTime;
    }

    function addBalance(uint et) private {
        require(et == 1 ether);
        balance += et;
    }

    function setBalance() public payable {
        require(msg.value == 3 ether, "Il valore del messaggio deve essere esattamente 3 ether");
        balance = msg.value;
    }

    function getBalance() public view returns(uint256){
        return balance;
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

    function addVoter(string memory _vote, uint256 time) public payable{
        require(msg.sender != user);
        for(uint i = 0; i < voterAddresses.length; i++){
            require(msg.sender != voterAddresses[i], "gia votato");
        }
        require((time - creationTime) <= 60000, "Tempo scaduto");
        require(bytes(vote[msg.sender]).length == 0);
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

    function getWinner() private returns (string memory winnerType, uint winnerVotes) {
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


    function rewardWinners(uint256 time) public payable{
        require(msg.sender == user);
        require(keccak256(abi.encodePacked(getState())) == keccak256(abi.encodePacked("attesa")));
        require((time - creationTime) >= 60000, "Tempo non ancora scaduto");
        (string memory winnerType, uint winnerVotes) = getWinner();
        
        if(keccak256(abi.encodePacked(winnerType)) == keccak256(abi.encodePacked("Confermato"))){
            
            for (uint i = 0; i < voterAddresses.length; i++) {
                string memory voteType = vote[voterAddresses[i]];
                if (keccak256(abi.encodePacked(voteType)) == keccak256(abi.encodePacked(winnerType))) {
                    payable(voterAddresses[i]).transfer(300000000000000000);
                }
            }
        }else if(keccak256(abi.encodePacked(winnerType)) == keccak256(abi.encodePacked("Rifiutato"))){
            
            for (uint i = 0; i < voterAddresses.length; i++) {
                string memory voteType = vote[voterAddresses[i]];
                if (keccak256(abi.encodePacked(voteType)) == keccak256(abi.encodePacked(winnerType))) {
                    payable(voterAddresses[i]).transfer(1300000000000000000);
                }
            }
        }
    }

    function checkExpiration(uint256 time) public returns(bool){
        if((time - creationTime) >= 60000){
            return false;
        }
        return true;
    }

    
}