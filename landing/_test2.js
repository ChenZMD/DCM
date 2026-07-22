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
  
  // Test 1: renderNews with city name
  ctx.renderNews('纽约', false);
  console.log('--- Test 1: 纽约 ---');
  console.log('Count:', elements['newsCount']._txt);
  console.log('Title:', elements['newsHdr']._html);
  console.log('List length:', (elements['newsList']._html || '').length);
  
  // Test 2: renderNews with country name
  ctx.renderNews('中国', false);
  console.log('--- Test 2: 中国 ---');
  console.log('Count:', elements['newsCount']._txt);
  console.log('Title:', elements['newsHdr']._html);
  
  // Test 3: renderNews with null (global)
  ctx.renderNews(null, false);
  console.log('--- Test 3: Global ---');
  console.log('Count:', elements['newsCount']._txt);
  console.log('Title:', elements['newsHdr']._html);
  
  // Test 4: renderNews with unknown city
  ctx.renderNews('巴黎', false);
  console.log('--- Test 4: 巴黎 ---');
  console.log('Count:', elements['newsCount']._txt);
  console.log('Title:', elements['newsHdr']._html);
  
} catch (e) {
  console.log('Runtime error:', e.message);
  console.log('Stack:', e.stack);
}
