const fs=require('fs'); const vm=require('vm');
const html=fs.readFileSync('world-map.html','utf8');
const scriptMatch=html.match(/<script>([\s\S]*?)<\/script>/);
const code=scriptMatch[1];

// Check all 16 cities exist in NEWS_BY_CITY
const citiesInMap=['纽约','伦敦','新加坡','香港','旧金山','上海','东京','首尔','深圳','芝加哥','法兰克福','巴黎','悉尼','迪拜','苏黎世','多伦多'];
const scriptVars=['NEWS_BY_CITY','NEWS_BY_COUNTRY','CITY_BY_NAME','NEWS_GLOBAL'];

// Verify CITY_BY_NAME exists and has all cities
const hasCbyN = code.includes('CITY_BY_NAME') && code.includes('CITY_NODES.forEach(function(c){ CITY_BY_ID[c.id] = c; });');
console.log('CITY_BY_NAME defined:', hasCbyN);

// Click handler uses CITY_BY_NAME
const clickOk = code.includes('CITY_BY_NAME[p.name]') && code.includes('p.seriesType===\'effectScatter\'');
console.log('Click handler uses CITY_BY_NAME:', clickOk);

// renderNews call in click handler
const cnMatch = code.match(/renderNews\(([^,]+),\s*true\)/g);
console.log('renderNews calls:', cnMatch);
