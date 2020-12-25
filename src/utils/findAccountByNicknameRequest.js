const API = require('./API');

const findAccountByNicknameRequest = async (nickname) => {

    try {
        const response = await API.get('/list/', {
            params: {
                search: nickname
            }
        });

        if (!response.data.data.length) return {error: 'user not found'};
        return response.data.error ? {error: response.data.error.message} : {result: response.data};

    } catch (error) {
        return {error: error.code}
    }
};

module.exports = findAccountByNicknameRequest;