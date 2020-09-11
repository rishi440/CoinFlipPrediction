import "./Ownable.sol";
pragma solidity 0.5.12;

contract CoinFlipBet is Ownable{


	address player;	//Stores address of wallet currently interacting with app
	uint betValue;	//Ether to bet 
	uint outcome;	//Whether the coin landed on heads or tails 
	uint private balance; //Stores the balance of the contract

	event fundingHappened(address owner, uint funding);
	event result(address user, uint bet, bool);


	/*Takes a prediction of heads or tails from user. This prediction 
	  value is then compared with that of the outcome generated by
	  the "outcomeGenerator()" function to decide if player has won or lost*/

	function coinFlip(uint prediction) public payable returns (bool winner){

		//require(msg.value > 0 ether, "Error: Player has to make a bet");	
		require(balance >= msg.value, "The contract does not have enough to payout the bet");	



		uint toTransfer = msg.value*2;
		outcome = outcomeGenerator();
		balance += msg.value;




		if(outcome == prediction) {
			winner = true;
			balance -= msg.value*2;
			msg.sender.transfer(toTransfer);


		}
		else {
			winner = false;
		}
        
        emit result(msg.sender, msg.value, winner);
		return winner;

	}

	
	//Returns a uint value of 0 or 1 to depict heads or tails

	function outcomeGenerator() public view returns (uint) {

		return now % 2;
	}


	//Return balance of smart contract

	function getBalance() public onlyOwner view returns(uint) {
    return balance;
  }

  	//Transfers all funds from Smart contract to contract owner

  	function withdrawAll() public onlyOwner returns(uint) {

  	uint toTransfer = balance;
    balance = 0;
    msg.sender.transfer(toTransfer);
    return toTransfer;

  	}

  	//Function for contract owner to be able to add funds to contract balance
  	function deposit() public onlyOwner payable returns (uint) {

  		balance += msg.value;
  		emit fundingHappened(msg.sender, msg.value);
  		return balance;

  	}
}