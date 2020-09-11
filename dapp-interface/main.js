var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable()
    .then(function(accounts){
        contractInstance = new web3.eth.Contract(abi,"0xfD59e4B3f36BCf27602f6e8FcA6333AdC58580dA",{from: accounts[0]});
        console.log(contractInstance);
    });

    $("#bet_heads_button").click({prediction:1} , placeBet);
    $("#bet_tails_button").click({prediction:0} , placeBet);
    $("#deposit_button").click(deposit);
   $("#withdraw_button").click(withdraw);
   $("#get_balance_button").click(getBalance);
});

function withdraw() {
  var config = {};
  contractInstance.methods.withdrawAll()
  .send(config)
  .on("transactionHash", function(hash) {
    console.log("transactionHash =" + hash);
  })
  .on("confirmation", function(confirmationNr) {
      console.log("Confirmation = " + confirmationNr);
  })
  .on("receipt", function(receipt) {
    console.log(receipt);
  })
};

function deposit() {

 var config = {value: web3.utils.toWei("2", "ether")};

  contractInstance.methods.deposit().send(config)
  .on("transactionHash", function(hash) {
    console.log("transactionHash =" + hash);
  })
  .on("confirmation", function(confirmationNr) {
      console.log("Confirmation = " + confirmationNr);
  })
  .on("receipt", function(receipt) {
    console.log(receipt);
  })

};

function getBalance() {
  contractInstance.methods.getBalance().call().then(function(res) {
  	console.log(res);
    $("#balance").text(" = " + web3.utils.fromWei(res, "ether") + " ETH");
  });
}

function placeBet(obj){

	var amount = $("#amount_input").val();
	var config = {value: web3.utils.toWei(amount, "ether")};
	var prediction = obj.data.prediction;


	contractInstance.methods.coinFlip(prediction).send(config)
	 .on("transactionHash", function(hash) {
    console.log("transactionHash =" + hash);
  })
  .on("confirmation", function(confirmationNr) {
      console.log("Confirmation = " + confirmationNr);
  })
  .on("receipt", function(receipt) {
    console.log(receipt);
    if (receipt.events.result.returnValues["2"]) {
    	console.log("entered here");
      $("#outcome_output").text("CONTRATS!!! YOU'VE WON");
      $("#gains_output").text(web3.utils.fromWei(receipt.events.result.returnValues["1"],"ether") + " ETH");
    }
    else {
    	console.log("entered here");
      $("#outcome_output").text("YOU'VE LOST");
    }
    //$("#gains_output").text(web3.utils.fromWei(receipt.events.result.returnValues["1"],"ether") + " ETH");
  })
};