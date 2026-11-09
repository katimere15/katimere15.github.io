import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const apps = JSON.parse(readFileSync(new URL('apps.json', root), 'utf8'));
const escape = (value) => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const ids = new Set();
const cards = apps.filter(app => app.published === true).map(app => {
  for (const key of ['id', 'name', 'englishName', 'category', 'icon', 'tagline', 'description', 'dataNotice', 'storeUrl', 'privacyUrl']) {
    if (typeof app[key] !== 'string' || !app[key].trim()) throw new Error(`Missing ${key}: ${app.id}`);
  }
  if (!/^[a-z][a-z0-9-]*$/.test(app.id) || ids.has(app.id)) throw new Error(`Invalid/duplicate app ID: ${app.id}`);
  ids.add(app.id);
  for (const key of ['storeUrl', 'privacyUrl']) {
    if (new URL(app[key]).protocol !== 'https:') throw new Error(`${app.id}: ${key} must use HTTPS`);
  }
  if (!/^assets\/[a-zA-Z0-9._-]+$/.test(app.icon) || !existsSync(new URL(app.icon, root))) throw new Error(`Missing local icon: ${app.icon}`);
  if (!Array.isArray(app.features) || !app.features.length || app.features.some(item => typeof item !== 'string' || !item.trim())) throw new Error(`Missing features: ${app.id}`);
  const e = Object.fromEntries(Object.entries(app).map(([key, value]) => [key, escape(value)]));
  return `<article class="app-card" aria-labelledby="${e.id}-name">
          <div class="app-identity">
            <img class="app-icon" src="${e.icon}" width="84" height="84" alt="">
            <div><p class="app-category">${e.category}</p><h3 class="app-name" id="${e.id}-name">${e.name}<span class="app-english" lang="en">${e.englishName}</span></h3></div>
          </div>
          <p class="app-tagline">${e.tagline}</p>
          <p class="app-description">${e.description}</p>
          <ul class="app-features">${app.features.map(feature => `<li>${escape(feature)}</li>`).join('')}</ul>
          <div class="app-links"><a class="button" href="${e.storeUrl}" aria-label="${e.name} Google Play에서 보기">Google Play에서 보기</a><a class="privacy-link" href="${e.privacyUrl}" aria-label="${e.name} 개인정보처리방침">개인정보처리방침</a></div>
          <details class="app-notice"><summary>데이터 및 이용 안내</summary><p>${e.dataNotice}</p>${app.disclaimer ? `<p>${e.disclaimer}</p>` : ''}</details>
        </article>`;
});
if (!cards.length) throw new Error('At least one published app is required.');
const template = readFileSync(new URL('templates/index.html', root), 'utf8');
const marker = '<!-- APP_CARDS -->';
if (template.split(marker).length !== 2) throw new Error('Expected one app card marker.');
const output = template.replace(marker, cards.join('\n        '));
const target = new URL('index.html', root);
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8') !== output) throw new Error('index.html is stale. Run node scripts/build.mjs');
  console.log(`Verified ${cards.length} published app(s).`);
} else {
  writeFileSync(target, output);
  console.log(`Built ${cards.length} published app(s): ${fileURLToPath(target)}`);
}
