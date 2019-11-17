const express = require('express');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const { CustomerType } = require('./../models/db')
const { ErrorResult, Result, PagingResult } = require('../utils/base_response')
const router = express.Router();
router.use((req, res, next) => {
    //authorize here
    next();
});

//fill customer apis here
router.get('/', (req, res) => {
    // CustomerType.findAll().then(types => {
    //     res.json(Result(types))
    // });
    let page = 0;
    if (req.query.p) page = parseInt(req.query.p);
    let pageSize = 20;
    if (req.query.s) pageSize = parseInt(req.query.s);
    let queryString = '';
    if (req.query.q) queryString = '%' + decodeURIComponent(req.query.q) + '%';
    let sortColumn = 'name';
    let sortDirection = 'ASC';
    if (req.query.so) {
        const sortStr = decodeURIComponent(req.query.so).split(' ');
        sortColumn = sortStr[0];
        if (sortStr.length == 2) sortDirection = sortStr[1];
    }

    const offset = (page) * pageSize;
    const limit = parseInt(pageSize);
    if (queryString.length <= 2) {
        CustomerType.count().then(numRow => {
            const totalRows = numRow;
            const totalPages = Math.ceil(totalRows / pageSize);
            CustomerType.findAll({
                order: [
                    [sortColumn, sortDirection]
                ],
                offset: offset,
                limit: limit
            }).then(customer_types => {
                return res.json(PagingResult(customer_types, {
                    pageNumber: page,
                    pageSize: pageSize,
                    totalRows: totalRows,
                    totalPages: totalPages
                }))
            })
        })
    } else { // search
        // conditions
        const whereClause = {
            [Op.or]: [{
                    name: {
                        [Op.like]: queryString
                    }
                },
                {
                    commission: {
                        [Op.like]: queryString
                    }
                }
            ]
        };
        CustomerType.count({ where: whereClause }).then(numRow => {
            const totalRows = numRow;
            const totalPages = Math.ceil(totalRows / pageSize);
            CustomerType.findAll({
                where: whereClause,
                offset: offset,
                limit: limit
            }).then(customer_types => {
                return res.json(PagingResult(customer_types, {
                    pageNumber: page,
                    pageSize: pageSize,
                    totalRows: totalRows,
                    totalPages: totalPages
                }))
            })
        })
    }
});

router.get('/:id', (req, res) => {
    CustomerType.findByPk(req.params.id).then(type => {
        if (type != null) {
            res.json(Result(type))
        } else {
            res.status(404).json(ErrorResult(404, 'Not Found!'));
        }
    });
});

router.post('/', (req, res) => {
    CustomerType.create(req.body).then(type => {
        res.json(Result(type))
    }).catch(err => {
        return res.status(400).send(ErrorResult(400, err.errors));
    });
});

router.put('/:id', (req, res) => {
    CustomerType.findByPk(req.params.id).then(type => {
        if (type != null) {
            type.update({
                name: req.body.name,
                commission: req.body.commission
            }).then(type => {
                res.json(Result(type))
            }).catch(err => {
                return res.status(400).send(ErrorResult(400, err.errors));
            });
        } else {
            res.status(404).json(ErrorResult(404, 'Not Found!'));
        }
    });
});

router.delete('/:id', (req, res) => {
    CustomerType.destroy({
        where: {
            id: req.params.id
        }
    }).then(type => {
        res.json(Result(type))
    }).catch(err => {
        return res.status(500).send(ErrorResult(500, err.errors));
    });
});

module.exports = router;