const express = require('express');
const jwt = require('jsonwebtoken');
const crypt = require('../utils/helper');
const { User } = require('../models/db');
const { ErrorResult, Result } = require('../utils/base_response')
const router = express.Router();
router.use((req, res, next) => {
    next();
});

router.post('/', (req, res) => {
    req.body.password = crypt.hash(req.body.password);
    User.create(req.body).then(type => {
        res.json(type);
    }).catch(err => {
        return res.status(400).send(err.errors);
    });
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            account: req.body.account,
            password: crypt.hash(req.body.password)
        }
    }).then(aUser => {
        if (aUser != null) {
            const token = jwt.sign({ userId: aUser.id, account: aUser.account },
                crypt.appKey, { expiresIn: '1h' });
            res.json(Result({
                id: aUser.id,
                account: aUser.account,
                fullName: aUser.fullName,
                token: token
            }));
        } else {
            res.status(200).send(ErrorResult(401, 'Invalid username or password'));
        }
    });
});

module.exports = router;