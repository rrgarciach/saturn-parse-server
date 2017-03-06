const Excel = require('exceljs');
const _ = require('lodash');

const columns = [
    {header: 'Orden', key: 'orderId', width: 10},
    {header: 'Renglon', key: 'row', width: 5},
    {header: 'Cliente', key: 'clientId', width: 10},
    {header: 'Nombre', key: 'clientName', width: 30},
    {header: 'Codigo', key: 'sku', width: 15},
    {header: 'Cantidad', key: 'quantity', width: 10},
    {header: 'Notas', key: 'notes', width: 50},
    {header: 'Fecha', key: 'nodatetes', width: 10},
];

module.exports.generateFiles = (orders, filename) => {

    let workbook = new Excel.Workbook();

    let worksheet = workbook.addWorksheet('Sheet1');

    worksheet.columns = columns;

    _.each(orders, (order, key) => {
        _.each(order.items, (item, key) => {
            worksheet.addRow([order.folio, (key + 1), order.client.folio, order.client.fullName, item.sku, item.quantity, order.notes, order.date]);
        });
    });

    return workbook.xlsx.writeFile(filename);

};

module.exports.generateFile = (order, filename) => {

    let workbook = new Excel.Workbook();

    let worksheet = workbook.addWorksheet('Sheet1');

    worksheet.columns = columns;

    // worksheet.addRow(['018', 'Ruy Garcia', '22606', 12, 'Notas y mas notas']);

    // const MemoryStream = require('memory-streams');
    // let stream = new MemoryStream.WritableStream();

    _.each(order.items, (item, key) => {
        worksheet.addRow([order.folio, (key + 1), order.client.folio, order.client.fullName, item.sku, item.quantity, order.notes, order.date]);
    });

    return workbook.xlsx.writeFile(filename);

    // workbook.xlsx.write(stream)
    // return stream;

};



