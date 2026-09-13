/**
 * Google Apps Script backend for the Bingo Night pre-order form and cashier dashboard.
 * Paste this file into the Apps Script project attached to the order spreadsheet,
 * then deploy a new version of the web app.
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents || '{}');
  sheet.appendRow([
    new Date(),
    data.familyName || '',
    data.email || '',
    data.phone || '',
    data.student || '',
    data.pizzaType || '',
    Number(data.extraPizzas || 0),
    data.extraPizzaTypes || '',
    '$' + Number(data.total || 0),
    data.notes || ''
  ]);
  return output_({ result: 'success' }, '');
}

function doGet(e) {
  var params = (e && e.parameter) || {};
  var callback = validCallback_(params.callback);
  if (params.action !== 'listOrders') {
    return output_({ error: 'Unknown action.' }, callback);
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return output_({ orders: [], generatedAt: new Date().toISOString() }, callback);
  }

  var headers = values.shift().map(function(header) {
    return String(header).toLowerCase().replace(/[^a-z0-9]/g, '');
  });
  var index = {};
  headers.forEach(function(header, position) { index[header] = position; });

  var orders = values.filter(function(row) {
    return row.some(function(value) { return value !== '' && value !== null; });
  }).map(function(row, rowIndex) {
    var value = function(name) {
      return index[name] === undefined ? '' : row[index[name]];
    };
    return {
      id: rowIndex + 2,
      timestamp: serialize_(value('timestamp')),
      familyName: String(value('familyname') || ''),
      pizzaType: String(value('pizzatype') || ''),
      extraPizzas: Number(value('extrapizzas') || 0),
      extraPizzaTypes: String(value('extrapizzatypes') || ''),
      total: parseMoney_(value('total')),
      notes: String(value('notes') || '')
    };
  });

  return output_({ orders: orders, generatedAt: new Date().toISOString() }, callback);
}

function serialize_(value) {
  return value instanceof Date ? value.toISOString() : String(value || '');
}

function parseMoney_(value) {
  var number = parseFloat(String(value || '').replace(/[^0-9.-]/g, ''));
  return isNaN(number) ? null : number;
}

function validCallback_(callback) {
  var value = String(callback || '');
  return /^[A-Za-z_$][0-9A-Za-z_$]*(\.[A-Za-z_$][0-9A-Za-z_$]*)*$/.test(value) ? value : '';
}

function output_(payload, callback) {
  var json = JSON.stringify(payload);
  if (callback) {
    return ContentService.createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
