const fs=require('fs');
const vm=require('vm');
const html=fs.readFileSync('world-map.html','utf8');
const scriptMatch=html.match(/<script>([\s\S]*?)<\/script>/);
const code=scriptMatch[1];

// Mock DOM
const elements={};
function mockEl(id){
  return {
    id, style:{}, dataset:{}, _html:'', _txt:'',
    classList:{ add(){}, remove(){}, toggle(){} },
    addEventListener(){},
    querySelector(){ return mockSelEl(); },
    querySelectorAll(){ return []; },
    set innerHTML(v){ this._html=v; },
    get innerHTML(){ return this._html||''; },
    set textContent(v){ this._txt=v; },
    get textContent(){ return this._txt||''; }
  };
}
function mockSelEl(){ return mockEl('sel'); }
function getEl(id){ return elements[id]||(elements[id]=mockEl(id)); }

const document={
  getElementById:getEl,
  querySelector(){ return mockSelEl(); },
  querySelectorAll(){ return []; },
  addEventListener(){}
};
const window={ WORLD_GEO_JSON:null };
window.addEventListener=function(){};
const setTimeout=function(fn){ fn(); };

const ctx={
  document, window, setTimeout, console,
  echarts:{ registerMap(){}, init(){ return { on(){}, setOption(){}, dispatchAction(){}, resize(){} }; } }
};
vm.createContext(ctx);

try{
  vm.runInContext(code, ctx);
  console.log('Script runs OK');
  console.log('typeof renderNews:', typeof ctx.renderNews);
  // Test 1: Click New York city node
  ctx.renderNews('纽约', true);
  console.log('纽约 → count txt:', getEl('newsCount')._txt);
  console.log('纽约 → title html:', getEl('newsHdr')._html);
  // Test 2: Click China (country)
  ctx.renderNews('中国', true);
  console.log('中国 → count txt:', getEl('newsCount')._txt);
  // Test 3: Empty node
  ctx.renderNews('暂无 " Atlantis " 相关资讯', true);
  console.log('空态 → count txt:', getEl('newsCount')._txt);
  console.log('空态 → title html:', getEl('newsHdr')._html);
  // Test 4: Global
  ctx.renderNews(null, false);
  console.log('Global → count txt:', getEl('newsCount')._txt);
  // Test 5: City not in dict
  ctx.renderNews('巴黎', true);
  console.log('巴黎 → count txt:', getEl('newsCount')._txt);
}catch(e){
  console.log('Runtime error:', e.message);
  console.log(e.stack);
}
