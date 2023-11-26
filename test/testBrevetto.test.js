const Brevetto = artifacts.require("Brevetto");

contract("Brevetto", (accounts) => {
    let brevetto;

    before(async () => {
        brevetto = await Brevetto.deployed();
    });

    describe("setting and getting a number", async () => {
        it("should set a number using setNumber method", async () => {
            const numberToSet = 42;
            await brevetto.setNumber(numberToSet, { from: accounts[0] });
            const storedNumber = await brevetto.getNumber.call();
            
            assert.strictEqual(
                storedNumber.toNumber(),
                numberToSet,
                "The stored number should match the number set"
            );
        });
    });
});
