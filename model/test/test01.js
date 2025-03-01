const ovoteContract = artifacts.require("../contracts/ovote.sol");

contract('ovote', async (accounts) => {
    it("has been deployed successfully", async () => {
        const ovote = await ovoteContract.deployed();
        assert(ovote, "contract failed to deploy");
    });

    it("should append and get sample survey", async () => {
        const ovote = await ovoteContract.deployed();

        await ovote.appendSurvey('First Contract','Nothing...', false,[], ['yes', 'no', 'i dont know'], ['31901', '10941', '2490']);
        const Surveys = await ovote.viewSurveys();
        const actual = Surveys.length;

        const expected = 1;

        assert.equal(actual, expected, 'appending failed !')
    })

    it('should get survey by user address', async() => {
        const ovote = await ovoteContract.deployed();

        await ovote.appendSurvey('Second Contract','Nothing...', true, ['0xC0ffeEBABE5D496B2DDE509f9fa189C25cF29671'], ['yes', 'no', 'i dont know'], ['31901', '10941', '2490']);
        await ovote.appendSurvey('Third Contract','Nothing...', true, ['0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5'], ['yes', 'no', 'i dont know'], ['31901', '10941', '2490']);

        const actual = await ovote.viewSurveysByAddr('0xC0ffeEBABE5D496B2DDE509f9fa189C25cF29671'); // should return First (public) and second (just visible for this addr)

        assert.equal(actual.length, 2,'getting by address failed !')
    })
})