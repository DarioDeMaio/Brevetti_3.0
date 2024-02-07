const Brevetti = artifacts.require("Brevetti");

module.exports = function(deployer){
    deployer.deploy(Brevetti);
};