/**
 * Ledger  ⇄  Google Sheet bridge
 * ---------------------------------------------------------------
 * SETUP (once):
 *   1. Open your Google Sheet.
 *   2. Extensions ▸ Apps Script. Delete any code, paste ALL of this, Save.
 *   3. Deploy ▸ New deployment ▸ type "Web app".
 *        Execute as: Me
 *        Who has access: Anyone
 *      Deploy, authorise, and COPY the Web app URL (ends in /exec).
 *   4. In Ledger ▸ Settings ▸ Google Sheet sync, paste that URL.
 * Push = Ledger updates the sheet (upsert by ID, never deletes).
 * Pull = rows you add in the sheet come back into Ledger.
 */
var SHEET_NAME = 'Ledger Data';
var HEAD = ['Flow','Date','Amount','Currency','Category','Description','Type','ID'];

function sheet_(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (s.getLastRow() === 0) s.getRange(1,1,1,HEAD.length).setValues([HEAD]);
  return s;
}
function isoFromTs_(ts){ return Utilities.formatDate(new Date(ts), Session.getScriptTimeZone(), 'yyyy-MM-dd'); }
function json_(o){ return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doPost(e){
  try{
    var b = JSON.parse(e.postData.contents);
    var cur = (b.settings && b.settings.currency && b.settings.currency.code) || '';
    var rows = [];
    (b.expenses||[]).forEach(function(x){ rows.push(['Expense', isoFromTs_(x.ts), x.amount, cur, x.category, x.description||'', 'One-off', x.id]); });
    (b.recurring||[]).forEach(function(r){ rows.push(['Expense', r.startYM+'-01', r.monthly, cur, r.category, r.description||'', (r.kind==='amortized'?'Amortized':'Recurring'), r.id]); });
    (b.income||[]).forEach(function(x){ rows.push(['Income', isoFromTs_(x.ts), x.amount, cur, x.category, x.description||'', 'One-off', x.id]); });
    (b.incomeRecurring||[]).forEach(function(r){ rows.push(['Income', r.startYM+'-01', r.monthly, cur, r.category, r.description||'', 'Monthly', r.id]); });

    var s = sheet_();
    var data = s.getDataRange().getValues();
    var rowById = {};
    for (var i=1;i<data.length;i++){ if(data[i][7]!=='') rowById[String(data[i][7])] = i+1; }
    rows.forEach(function(row){
      var id = String(row[7]);
      if (rowById[id]) s.getRange(rowById[id],1,1,HEAD.length).setValues([row]);   // update
      else { s.appendRow(row); rowById[id] = s.getLastRow(); }                      // insert (never deletes)
    });
    return json_({ok:true, wrote: rows.length});
  }catch(err){ return json_({ok:false, error:String(err)}); }
}

function doGet(e){
  var s = sheet_();
  var vals = s.getDataRange().getValues();
  var changed = false;
  for (var i=1;i<vals.length;i++){
    if (vals[i][2]===''&&vals[i][2]!==0) continue;          // skip blank rows
    if (!vals[i][7]){ vals[i][7] = 'm'+i+'x'+Math.floor(Math.random()*1e6); changed = true; } // give manual rows a stable ID
  }
  if (changed) s.getRange(1,1,vals.length,vals[0].length).setValues(vals);
  var out = [];
  for (var j=1;j<vals.length;j++){
    var r = vals[j]; if (r[2]===''&&r[2]!==0) continue;
    var d = (r[1] instanceof Date) ? Utilities.formatDate(r[1], Session.getScriptTimeZone(), 'yyyy-MM-dd') : String(r[1]).slice(0,10);
    out.push({flow:r[0], date:d, amount:r[2], currency:r[3], category:r[4], description:r[5], type:r[6], id:String(r[7])});
  }
  var payload = JSON.stringify({ok:true, rows:out});
  var cb = e && e.parameter && e.parameter.callback;
  if (cb) return ContentService.createTextOutput(cb+'('+payload+')').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return json_({ok:true, rows:out});
}
