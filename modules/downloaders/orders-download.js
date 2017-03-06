const express = require('express');
const url = require('url');
const moment = require('moment');
const momentTimezone = require('moment-timezone');
const fs = require('fs');
const _ = require('lodash');

// import Order from '../../models/order.model';
const adminpaqFormat = require('./adminpaq-format');
const excelFormat = require('./xlsx-format');

function handleError(err, req, res) {
    alert('Error: ' + err.code + ' ' + err.message);
    res.status(500).end();
}

module.exports = function (app) {

    // app.get('/orders/export/txt/:folio', function (req, res) {
    //
    //     const folio = parseInt(req.params.folio);
    //     let query = new Parse.Query(Order);
    //     query.equalTo('folio', folio);
    //     query.include('client');
    //     query.include('client.profile');
    //     query.include('client.profile.address');
    //     query.first({
    //         success: order => {
    //             let items = order.relation('items');
    //             items.query().include('product').find({
    //                 success: _items => {
    //                     order.items = _items;
    //
    //                     res.setHeader('Content-disposition', 'attachment; filename=theDocument.txt');
    //                     res.setHeader('Content-type', 'text/plain');
    //                     res.charset = 'UTF-8';
    //                     let text = adminpaqFormat(order);
    //                     res.write(text);
    //                     res.end();
    //                 },
    //                 error: err => {
    //                     handleError(err, req, res);
    //                 }
    //             });
    //         },
    //         error: err => {
    //             alert('Error: ' + err.code + ' ' + err.message);
    //             res.status(500).end();
    //         }
    //     });
    //
    // });

    app.get('/orders/download/xls', function (req, res) {
        // const reqDate = new Date(req.params.date);
        const urlParams = url.parse(req.url, true);
        const dateString = urlParams.query.date;
        const reqDate = new Date(dateString);

        const localDate = momentTimezone.tz(reqDate, 'America/Chihuahua');
        const serverDate = localDate.clone().tz('UTC');

        let start = new moment(serverDate);
        start.startOf('day');
        let finish = new moment(start);
        finish.add(1, 'day');

        let query = new Parse.Query('Order');
        query.greaterThanOrEqualTo('createdAt', start.toDate());
        query.lessThan('createdAt', finish.toDate());
        query.include('client');
        query.include('client.profile');
        query.include('client.profile.address');
        query.find({
            success: orders => {

                let itemsPromises = [];

                _.each(orders, order => {
                    let items = order.relation('items');
                    let promise = items.query().include('product').find({
                        success: _items => {
                            order.items = _items;
                        },
                        error: err => {
                            handleError(err, req, res);
                        }
                    });
                    itemsPromises.push(promise);
                });

                Promise.all(itemsPromises)
                    .then(() => {
                        const filename = `${__dirname}/${dateString}.xlsx`;
                        excelFormat.generateFiles(orders, filename)
                            .then(() => {
                                res.download(filename);
                                res.on('finish', () => {
                                    fs.unlinkSync(filename);
                                });
                            });
                    });
            },
            error: err => {
                alert('Error: ' + err.code + ' ' + err.message);
                res.status(500).end();
            }

        });

    });

    // app.get('/orders/export/xls/folio/:folio', function (req, res) {
    //     const folio = parseInt(req.params.folio);
    //
    //     let query = new Parse.Query('Order');
    //     query.equalTo('folio', folio);
    //     query.include('client');
    //     query.include('client.profile');
    //     query.include('client.profile.address');
    //     query.first({
    //         success: order => {
    //             let items = order.relation('items');
    //             items.query().include('product').find({
    //                 success: _items => {
    //                     order.items = _items;
    //
    //                     const filename = `${__dirname}/orders.xlsx`;
    //                     excelFormat.generateFile(order, filename)
    //                         .then(() => {
    //                             res.download(filename);
    //                             res.on('finish', () => {
    //                                 fs.unlinkSync(filename);
    //                             });
    //                         });
    //
    //                 },
    //                 error: err => {
    //                     handleError(err, req, res);
    //                 }
    //             });
    //         },
    //         error: err => {
    //             alert('Error: ' + err.code + ' ' + err.message);
    //             res.status(500).end();
    //         }
    //
    //     });
    //
    // });

};
