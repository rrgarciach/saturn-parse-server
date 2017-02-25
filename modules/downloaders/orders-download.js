const express = require('express');
import Order from '../../models/order.model';

const adminpaqFormat = require('./adminpaq-format');

function handleError(err, req, res) {
    alert('Error: ' + err.code + ' ' + err.message);
    res.status(500).end();
}

module.exports = function (app) {

    app.get('/orders/export/:folio', function (req, res) {

        const folio = parseInt(req.params.folio);
        let query = new Parse.Query(Order);
        query.equalTo('folio', folio);
        query.include('client');
        query.include('client.profile');
        query.include('client.profile.address');
        query.first({
            success: order => {
                let items = order.relation('items');
                items.query().include('product').find({
                    success: _items => {
                        order.items = _items;

                        res.setHeader('Content-disposition', 'attachment; filename=theDocument.txt');
                        res.setHeader('Content-type', 'text/plain');
                        res.charset = 'UTF-8';
                        let text = adminpaqFormat(order);
                        res.write(text);
                        res.end();
                    },
                    error: err => {
                        handleError(err, req, res);
                    }
                });
            },
            error: err => {
                alert('Error: ' + err.code + ' ' + err.message);
                res.status(500).end();
            }
        });

    });

};
