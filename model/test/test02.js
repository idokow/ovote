const ovoteContract = artifacts.require("../contracts/ovote.sol");

contract('ovote', async (accounts) => {
    it("has been deployed successfully", async () => {
        const ovote = await ovoteContract.deployed();
        assert(ovote, "contract failed to deploy");
    });

    it('should vote surveys', async() => {
        const ovote = await ovoteContract.deployed();
        await ovote.appendSurvey('First Contract','Nothing...', false,[], ['yes', 'no', 'i dont know'], ['31901', '10941', '2490']);
        await ovote.appendSurvey('Second Contract','Nothing...', true, ['0xC0ffeEBABE5D496B2DDE509f9fa189C25cF29671'], ['yes', 'no', 'i dont know'], ['31901', '10941', '2490']);
        await ovote.appendSurvey('Third Contract','Nothing...', true, ['0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5'], ['yes', 'no', 'i dont know'], ['31901', '10941', '2490']);

        const before = await ovote.viewSurveys();

        await ovote.vote(0, 0)

        var after = await ovote.viewSurveys();

        assert.equal(after[0].answers[0][1]-before[0].answers[0][1],1,'it cant vote :(')

        await ovote.vote(0, 0)

        after = await ovote.viewSurveys();

        assert.equal(after[0].answers[0][1]-before[0].answers[0][1],1,'anyone can vote o_O')
    })

    it('should check if user is in survey whitelist', async() => {
        const ovote = await ovoteContract.deployed();

        await ovote.appendSurvey('First Contract','Nothing...', false,[], ['yes', 'no', 'i dont know'], ['31901', '10941', '2490']);
        await ovote.appendSurvey('Second Contract','Nothing...', true, ['0xC0ffeEBABE5D496B2DDE509f9fa189C25cF29671'], ['yes', 'no', 'i dont know'], ['31901', '10941', '2490']);
        await ovote.appendSurvey('Third Contract','Nothing...', true, ['0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5'], ['yes', 'no', 'i dont know'], ['31901', '10941', '2490']);

        const actual_1 = await ovote.checkPermission('0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5', 2)
        const expected_1 = 1

        const actual_2 = await ovote.checkPermission('0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5', 1)
        const expected_2 = 0


        assert.equal(actual_1,expected_1,'it cant return true !')
        assert.equal(actual_2,expected_2,'it cant return false !')
    })
})
