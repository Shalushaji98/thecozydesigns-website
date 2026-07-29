/* ============================================================
   SHOP DATA LOADER
   ============================================================
   Products, photos, descriptions, prices and the shop's WhatsApp
   number now live in editable JSON files:

     data/kids.json      → Kids Wear catalog
     data/ladies.json    → Ladies Wear catalog
     data/settings.json  → WhatsApp number

   The shop owner can edit all of this WITHOUT touching code, by
   logging in at yourdomain.com/admin — that's a git-based admin
   panel (Decap CMS) that commits changes straight to this repo,
   and Netlify rebuilds the site automatically.

   You only need to edit the JSON files directly if you're not
   using the /admin panel for some reason (e.g. testing locally).
   ============================================================ */

let WHATSAPP_NUMBER = "919074816251"; // fallback used only if data/settings.json can't be loaded

async function loadSettings(){
  try{
    const r = await fetch('data/settings.json', {cache:"no-store"});
    if(r.ok){
      const s = await r.json();
      if(s && s.whatsapp) WHATSAPP_NUMBER = s.whatsapp;
    }
  }catch(e){ /* keep fallback number */ }
}

/* Loads a catalog JSON file (data/kids.json or data/ladies.json)
   and returns its "categories" array — or [] if it can't be reached. */
async function loadCatalog(path){
  try{
    const r = await fetch(path, {cache:"no-store"});
    if(r.ok){
      const data = await r.json();
      return Array.isArray(data.categories) ? data.categories : [];
    }
  }catch(e){ /* fall through */ }
  return [];
}

/* ---- shared helpers (no need to edit) ---- */
function ladiesImgsOf(it){
  if(Array.isArray(it.images)) return it.images.filter(s=>s && s.trim());
  return [];
}
function ladiesWaLink(p){
  const bits = ['Hi! I\'m interested in "'+p.name+'"'];
  if(p.code)  bits.push('(Code: '+p.code+')');
  if(p.price) bits.push('('+p.price+')');
  bits.push('— could you share more details?');
  return 'https://wa.me/'+WHATSAPP_NUMBER+'?text='+encodeURIComponent(bits.join(' '));
}
