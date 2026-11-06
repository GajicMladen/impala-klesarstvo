/**
 * Impala Klesarstvo – interna analitika (Google Apps Script web app).
 *
 * Postavljanje (≈ 5 minuta):
 *  1. Napravi novu Google tablicu, npr. "Impala analitika".
 *  2. Proširenja → Apps Script → zalijepi ovaj fajl umjesto Code.gs.
 *  3. Postavke projekta (zupčanik) → Svojstva skripte:
 *       TOKEN = tajna lozinka za čitanje statistike (stranica /analitika)
 *       KEY   = (opcionalno) tajna koja se šalje uz svaki događaj; isti string ide u VITE_ANALYTICS_KEY
 *  4. Implementiraj → Nova implementacija → Web-aplikacija → Izvrši kao: ja · Pristup: svi → kopiraj URL.
 *  5. U .env sajta: VITE_ANALYTICS_ENDPOINT=<URL>  (i VITE_ANALYTICS_KEY ako si postavio KEY), zatim `npm run deploy`.
 *
 * Događaji se upisuju u list "events"; statistika se čita s GET ?token=...&days=30.
 */
var SHEET_NAME = 'events';
var HEADER = ['ts', 'event', 'path', 'ref', 'sid', 'vid', 'device', 'lang', 'w', 'props'];

function props_() { return PropertiesService.getScriptProperties(); }

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADER);
    sh.setFrozenRows(1);
  }
  return sh;
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/** Upis jednog događaja (POST, tijelo = JSON). */
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var key = props_().getProperty('KEY') || '';
    if (key && d.key !== key) return out_({ ok: false, error: 'forbidden' });
    var lock = LockService.getScriptLock();
    lock.waitLock(5000);
    sheet_().appendRow([
      d.ts || new Date().toISOString(), String(d.event || ''), String(d.path || ''), String(d.ref || ''),
      String(d.sid || ''), String(d.vid || ''), String(d.device || ''), String(d.lang || ''), Number(d.w) || 0, String(d.props || ''),
    ]);
    lock.releaseLock();
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  }
}

/** Statistika (GET ?token=...&days=30). */
function doGet(e) {
  var p = (e && e.parameter) || {};
  var token = props_().getProperty('TOKEN') || '';
  if (!token || p.token !== token) return out_({ ok: false, error: 'unauthorized' });
  var days = Math.max(1, Math.min(365, Number(p.days) || 30));
  return out_(stats_(days));
}

function stats_(days) {
  var rows = sheet_().getDataRange().getValues().slice(1);
  var now = new Date();
  var since = now.getTime() - days * 864e5;
  var byDay = {};
  for (var i = days - 1; i >= 0; i--) {
    var d = new Date(now.getTime() - i * 864e5);
    byDay[isoDay_(d)] = { day: isoDay_(d), sessions: {}, views: 0, inquiries: 0, phone: 0 };
  }
  var totals = {}, sessions = {}, visitors = {}, devices = {}, pages = {}, materials = {}, refs = {};
  rows.forEach(function (r) {
    var t = new Date(r[0]).getTime();
    if (!(t >= since)) return;
    var ev = String(r[1]);
    totals[ev] = (totals[ev] || 0) + 1;
    var day = byDay[isoDay_(new Date(t))];
    if (!day) return;
    if (ev === 'page_view') {
      day.views++;
      day.sessions[r[4]] = 1;
      sessions[r[4]] = 1;
      visitors[r[5]] = 1;
      devices[r[6]] = (devices[r[6]] || 0) + 1;
      pages[r[2]] = (pages[r[2]] || 0) + 1;
      var h = refHost_(r[3]);
      refs[h] = (refs[h] || 0) + 1;
    }
    if (ev === 'inquiry_sent') day.inquiries++;
    if (ev === 'phone_click') day.phone++;
    if (ev === 'material_open' || ev === 'inquiry_sent') {
      try {
        var pr = JSON.parse(r[9] || '{}');
        if (pr.material) materials[pr.material] = (materials[pr.material] || 0) + 1;
      } catch (_) {}
    }
  });
  return {
    ok: true, days: days, generatedAt: now.toISOString(), totals: totals,
    sessions: Object.keys(sessions).length, visitors: Object.keys(visitors).length,
    byDay: Object.keys(byDay).sort().map(function (k) {
      var x = byDay[k];
      return { day: x.day, sessions: Object.keys(x.sessions).length, views: x.views, inquiries: x.inquiries, phone: x.phone };
    }),
    devices: devices, pages: top_(pages, 8), materials: top_(materials, 8), refs: top_(refs, 8),
  };
}

function isoDay_(d) { return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd'); }
function refHost_(ref) {
  if (!ref) return 'izravno / nepoznato';
  try { return String(ref).replace(/^https?:\/\//, '').split('/')[0]; } catch (_) { return 'ostalo'; }
}
function top_(obj, n) {
  return Object.keys(obj).map(function (k) { return [k, obj[k]]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, n);
}
