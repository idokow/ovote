const ovoteContract = artifacts.require("../contracts/ovote.sol");

contract('ovote', async (accounts) => {
    it("has been deployed successfully", async () => {
        const ovote = await ovoteContract.deployed();
        assert(ovote, "contract failed to deploy");
    });

    it('should load user dashboard', async() => {
        const ovote = await ovoteContract.deployed();
        await ovote.appendSurvey('First Contract','Nothing...', false,[], ['yes', 'no', 'i dont know'], ['31901', '10941', '2490']);
        await ovote.appendSurvey('Second Contract','Nothing...', true, ['0xC0ffeEBABE5D496B2DDE509f9fa189C25cF29671'], ['yes', 'no', 'i dont know'], ['31901', '10941', '2490']);
        await ovote.appendSurvey('Third Contract','Nothing...', true, ['0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5'], ['yes', 'no', 'i dont know'], ['31901', '10941', '2490']);

        var actual_1 = await ovote.viewSurveysByOwner('0x627306090abaB3A6e1400e9345bC60c78a8BEf57')
        actual_1 = actual_1.length
        const expected_1 = 3

        var actual_2 = await ovote.viewSurveysByOwner('0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5')
        actual_2 = actual_2.length
        const expected_2 = 0

        assert.equal(actual_1,expected_1,'it cant load dashboard !')
        assert.equal(actual_2,expected_2,'it load all surveys for anyone in dashboard !')
    })

    it('should get survey by id', async() => {
        const ovote = await ovoteContract.deployed();

        const actual = await ovote.viewSurveyByID(0)

        assert(actual.id == '0', 'it cant get survey by id')
    })
})