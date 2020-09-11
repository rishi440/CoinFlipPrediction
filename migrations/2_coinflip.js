const CoinFlipBet = artifacts.require("CoinFlipBet");

module.exports = function(deployer) {
  deployer.deploy(CoinFlipBet);
};