const API = require('./API');

const getStatsRequest = async (account_id) => {

    try {
        const response = await API.get('/info/', {
            params: {
                account_id
            }
        });

        if (response.data.error) return {error: response.data.data.error.message};
        if (!response.data.data) return {error: 'user not found'};

        let {last_battle_time, global_rating, created_at, updated_at} = response.data.data[account_id];
        const allStats = response.data.data[account_id].statistics.all;

        return {
            result: {
                global_rating,
                last_battle_time,
                created_at,
                updated_at,
                ...allStats
            }
        }

    } catch (error) {
        return {error: error.code}
    }
};

module.exports = getStatsRequest;