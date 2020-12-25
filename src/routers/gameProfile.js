const express = require('express');
const GameProfile = require('../models/gameProfile');
const findAccountId = require('./../utils/findAccountByNicknameRequest');
const getStats = require('./../utils/getStatsRequest');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/gameProfiles', auth, async (req, res) => {

    try {
        if (!req.body.nickname.trim().length > 0) return res.status(400).send('Please provide nickname.');

        // Searching account id for new nickname
        const idRequest = await findAccountId(req.body.nickname);
        if (idRequest.error) return res.status(400).send(idRequest.error);
        const accountId = idRequest.result.data[0].account_id;

        // Searching account stats for new nickname
        const statsRequest = await getStats(accountId);
        if (statsRequest.error) return res.status(400).send(statsRequest.error);

        const gameProfile = new GameProfile({
            accountId,
            nickname : req.body.nickname,
            owner: req.user._id,
            stats: statsRequest.result
        });

        await gameProfile.save();
        res.status(201).send(gameProfile);

    } catch (e) {
        res.status(400).send(e.message);
    }
});

// GET /gameProfiles?limit=10&skip=0
// GET /gameProfiles/sortBy=createdAt:desc

router.get('/gameProfiles', auth, async (req, res) => {;
    const sort = {};

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {
        await req.user.populate({
            path: 'gameProfiles',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();

        res.send(req.user.gameProfiles)
    } catch (e) {
        res.status(500).send()
    }
});

router.get('/gameProfiles/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const gameProfile = await GameProfile.findOne({_id, owner: req.user._id})

        if (!gameProfile) {
            return res.status(404).send()
        }

        res.send(gameProfile);
    } catch (e) {
        res.status(500).send()
    }
});

router.patch('/gameProfiles/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['nickname'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid updates!"})
    }

    try {
        // Searching game profile to update
        const gameProfile = await GameProfile.findOne({_id: req.params.id, owner: req.user._id});

        if (!gameProfile) {
            return res.status(404).send();
        }

        // Data for update
        let updateData = req.body;

        // Searching account id for new nickname
        const idRequest = await findAccountId(req.body.nickname);
        if (idRequest.error) return res.status(400).send(idRequest.error);
        const accountId = idRequest.result.data[0].account_id;

        // Searching account stats for new nickname
        const statsRequest = await getStats(accountId);
        if (statsRequest.error) return res.status(400).send(statsRequest.error);
        const stats = statsRequest.result;

        // Insert to list of updates
        updates.push('accountId', 'stats');
        updateData.accountId = accountId;
        updateData.stats = stats;

        // Update
        updates.forEach((update) => gameProfile[update] = updateData[update]);
        await gameProfile.save();

        res.send(gameProfile);
    } catch(e) {
        res.status(404).send(e.message);
    }
});

router.delete('/gameProfiles/:id', auth, async (req, res) => {

    try {
        const gameProfile = await GameProfile.findOneAndDelete({_id: req.params.id, owner: req.user._id});

        if (!gameProfile) {
            return res.status(404).send();
        }

        res.status(200).send(gameProfile);
    } catch(e) {
        res.status(500).send();
    }
});

module.exports = router;