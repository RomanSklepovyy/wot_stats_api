const GameProfile = require('./models/gameProfile');
const getStatsRequest = require('./utils/getStatsRequest');
require('./db/mongoose');

(async () => {
    while (true) {
        try {
            let profiles = [];
            profiles = await GameProfile.find({})

            for (let i = 0; i < profiles.length; i++) {
                const requestData = await getStatsRequest(profiles[i].accountId);
                if (requestData.result) {
                    profiles[i].stats = requestData.result;
                    await profiles[i].save();
                    console.log(profiles[i].nickname);
                }
            }
        } catch (e) {
            console.log(e);
        }

        await delay(2 * 60000);
    }
})();

async function delay(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}