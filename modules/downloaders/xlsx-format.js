const Excel = require('exceljs');
const _ = require('lodash');

const columns = [
    {key: 'rowId', width: 3},
    {key: 'orderId', width: 10},
    {key: 'row', width: 9},
    {key: 'clientId', width: 9},
    {key: 'clientName', width: 45},
    {key: 'sku', width: 9},
    {key: 'quantity', width: 9},
    {key: 'notes', width: 9},
    {key: 'nodatetes', width: 9},
];

module.exports.generateFiles = (orders, filename) => {

    let workbook = new Excel.Workbook();

    let worksheet = workbook.addWorksheet('Sheet1');

    worksheet.columns = columns;

    let rowKey = 0;
    let dayTotals = 0;

    _.each(orders, (order, key) => {
            worksheet.addRow([++rowKey, 'FACTURA', '', order.client.folio, order.client.fullName, '', '', '', 'FECHA', order.date]);
            worksheet.addRow([++rowKey, 'FOLIO', order.folio, 'NOTAS:', order.notes, '', '', '', 'VEND:', order.client.promoter.fullName]);
            worksheet.addRow([++rowKey, 'CODIGO', 'CANT.', 'EXIST.', 'CONCEPTO', 'PU', 'IVA', 'DESC.', 'STL', 'ESTATUS']);
        _.each(order.items, (item, key) => {
            worksheet.addRow([++rowKey, item.sku, item.quantity, '', item.description, item.price/100, item.iva/100, item.discountValue/100, item.totals/100, order.status]);
            dayTotals += order.totals;
        });
            worksheet.addRow([++rowKey, '', '', '', '', '', '', 'TOTAL:', order.totals/100, '']);
            worksheet.addRow([++rowKey]);
            worksheet.addRow([++rowKey, '', '', '', '', '', 'TOTAL DEL DIA:', '', dayTotals/100, '']);
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



