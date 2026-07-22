const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('world-map.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const code = scriptMatch[1];

// Mock DOM
const elements = {};
function mockEl(id) {
  return {
    id, style: {}, dataset: {},
    classList: { add() {}, remove() {}, toggle() {} },
    addEventListener() {},
    querySelector() { return mockEl('child'); },
    querySelectorAll() { return []; },
    set innerHTML(v) { this._html = v; },
    get innerHTML() { return this._html || ''; },
    set textContent(v) { this._txt = v; },
    get textContent() { return this._txt || ''; }
  };
}
const document = {
  getElementById(id) { return elements[id] || (elements[id] = mockEl(id)); },
  querySelector() { return mockEl('q'); },
  querySelectorAll() { return []; },
  addEventListener() {}
};
const window = { WORLD_GEO_JSON: null, addEventListener() {} };
const setTimeout = function(fn) { fn(); };
const ctx = {
  document, window, setTimeout, console,
  echarts: { registerMap() {}, init() { return { on() {}, setOption() {}, dispatchAction() {}, resize() {} }; } }
};
vm.createContext(ctx);
try {
  vm.runInContext(code, ctx);
  console.log('Script runs OK');
  console.log('renderNews is:', typeof ctx.renderNews);
  if (ctx.renderNews) {
    ctx.renderNews('nyc', false);
    const nl = elements['newsList'];
    console.log('newsList innerHTML length:', (nl._html || '').length);
    console.log('newsCount txt:', elements['newsCount']._txt);
    console.log('title:', elements['newsHdr']._html);
  }
} catch (e) {
  console.log('Runtime error:', e.message);
  console.log('Stack:', e.stack);
}
