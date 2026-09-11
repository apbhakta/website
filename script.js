var PAGE_URL = {"home": "index.html", "rooms": "rooms.html", "amenities": "amenities.html", "pets": "pet-policy.html", "groups": "groups.html", "attractions": "explore-clifton.html", "gallery": "gallery.html", "business": "business.html", "faq": "faq.html", "policies": "policies.html", "contact": "contact.html", "official": "official-booking.html", "terms": "terms.html", "privacy": "privacy.html", "accessibility": "accessibility.html"};



// ===== Velkommen Inn Assistant =====
// AI MODE: after deploying velkommen-ai-worker.js to Cloudflare, paste your worker URL below.
// Leave empty ('') to use the built-in knowledge base only.
var VK_AI_ENDPOINT = '';
var vkHistory = [];
var VK_BOOK = 'https://reservation.asiwebres.com/v5/RoomAvailability.aspx?id=6e5e44aa3b1b4949b6ed9c297569f595&lang=en&Curr=1';
var VK_KB = [
 {k:['fridge','refrigerator','mini fridge','microwave','coffee','coffee maker','kitchenette'], w:2,
  a:'Yes! Every room includes a <strong>mini refrigerator</strong>, <strong>microwave</strong>, and <strong>single-cup coffee maker</strong> — great for snacks, leftovers, and your morning cup before our free breakfast (6&ndash;9 AM).', c:['Room types','Breakfast','Book a room']},
 {k:['tv','television','directv','streaming','netflix','cable','channels','watch'], w:2,
  a:'Every room has a <strong>flat-screen TV with DIRECTV and streaming apps</strong> — so you can catch the game or sign into your favorite streaming service.', c:['Room types','Amenities']},
 {k:['iron','ironing','hair dryer','hairdryer','blow dryer'], w:2,
  a:'Yes — every room includes an <strong>iron &amp; ironing board</strong> and a <strong>hair dryer</strong>.', c:['Room types','Amenities']},
 {k:['sofa','couch','desk in room','work desk','lounge chair','seating'], w:2,
  a:'Our <strong>King rooms</strong> include a work desk and a two-seater sofa; our <strong>2 Queen room</strong> includes a comfortable lounge chair. Every room has individual climate control.', c:['Room types','Business travel']},
 {k:['book','booking','reserve','reservation','availability','available','room available','vacancy','make a reservation'], w:2,
  a:'The best way to book is directly with us — <a href="'+VK_BOOK+'" target="_blank" rel="noopener">book online here</a> or call <strong>(254) 675-8999</strong> (24-hour front desk). Booking direct guarantees our best rate with no third-party fees.', c:['Room types','Check-in time','Cancellation policy']},
 {k:['rate','price','cost','how much is a room','room price','nightly','cheap','deal','discount'], w:1,
  a:'Rates vary by date, room type, and demand. For tonight\'s exact price, <a href="'+VK_BOOK+'" target="_blank" rel="noopener">check live rates here</a> or call <strong>(254) 675-8999</strong> — we match or beat any legitimate price when you book direct.', c:['Book a room','Room types']},
 {k:['room type','rooms','what rooms','bed','beds','king','queen','double','suite'], w:1,
  a:'We offer four room types: <strong>2 Queen Beds</strong>, <strong>1 King Bed</strong> (with work desk &amp; two-seater sofa), <strong>1 King ADA Accessible</strong>, and <strong>2 Queen ADA Accessible</strong>. Every room includes free high-speed Wi-Fi, flat-screen TV with DIRECTV &amp; streaming apps, mini refrigerator, microwave, single-cup coffee maker, iron &amp; board, hair dryer, and individual climate control — all 100% non-smoking. <a href="#" onclick="go(\'rooms\');vkToggle();return false">See the Rooms page →</a>', c:['ADA rooms','Book a room','Amenities']},
 {k:['ada','accessible','wheelchair','disability','handicap','mobility','accessible room'], w:2,
  a:'Yes — we have <strong>ADA-accessible rooms</strong> in both King and 2-Queen configurations, with accessible bathrooms and wider doorways. Accessible parking and indoor corridors too. Please call <strong>(254) 675-8999</strong> to reserve so we can confirm features — accessible rooms book quickly. Service animals are always welcome at no charge.', c:['Room types','Pet policy']},
 {k:['check in','check-in','checkin','arrival','what time can i arrive','early check'], w:2,
  a:'Check-in is at <strong>2:00 PM</strong> and check-out is at <strong>11:00 AM</strong>. Need an early check-in or late check-out? Call ahead at <strong>(254) 675-8999</strong> and we\'ll do our best based on availability (a fee may apply). You\'ll need a valid photo ID and a credit card at check-in, and guests must be 18+.', c:['Check-out time','Payment','Book a room']},
 {k:['check out','check-out','checkout','departure','late check'], w:2,
  a:'Check-out is at <strong>11:00 AM</strong>. Late check-out may be available for a fee depending on availability — just call the front desk at <strong>(254) 675-8999</strong>.', c:['Check-in time','Cancellation policy']},
 {k:['breakfast','morning meal','continental','coffee','eat in the morning','food included'], w:2,
  a:'Yes! A <strong>complimentary continental breakfast</strong> is served daily from <strong>6:00 to 9:00 AM</strong> — perfect before work, travel, or a day at the lake.', c:['Amenities','Restaurants nearby']},
 {k:['wifi','wi-fi','internet','wireless'], w:2,
  a:'<strong>Free high-speed Wi-Fi</strong> is included in every room and throughout the property.', c:['Amenities','Business travel']},
 {k:['parking','park','truck','trailer','vehicle','rv','semi'], w:2,
  a:'<strong>Parking is free</strong> for all guests, including room for work trucks and trailers. For oversized vehicles, give us a quick call at <strong>(254) 675-8999</strong> so we can plan space for you.', c:['EV charging','Amenities']},
 {k:['ev','electric vehicle','charging','charger','tesla','charge my car'], w:2,
  a:'Yes — <strong>Level 2 EV charging</strong> is available on-site for an additional fee. Regular parking is free.', c:['Parking','Amenities']},
 {k:['pool','swim','swimming'], w:2,
  a:'We have a <strong>seasonal outdoor pool</strong> with a rock waterfall feature, loungers, and an <strong>ADA pool lift</strong> — a great spot to cool off with countryside views. Posted pool rules apply and children must be supervised (no lifeguard on duty).', c:['Amenities','Fitness center']},
 {k:['gym','fitness','workout','exercise'], w:2,
  a:'Yes, our <strong>on-site fitness center</strong> is available to guests at no charge during your stay.', c:['Pool','Amenities']},
 {k:['laundry','wash clothes','washer','dryer'], w:2,
  a:'<strong>Guest laundry</strong> is available on-site — very handy for extended stays, work crews, and family trips.', c:['Extended stay','Amenities']},
 {k:['business center','print','printing','copy','fax'], w:2,
  a:'Our <strong>business center</strong> is available for printing, copies, and quick work needs. Every room also has a work desk and free Wi-Fi.', c:['Business travel','Amenities']},
 {k:['amenities','amenity','features','facilities','what do you have','what do you offer'], w:1,
  a:'Highlights: free continental breakfast (6–9 AM), free Wi-Fi, free parking, EV charging (fee), seasonal outdoor pool, fitness center, business center, guest laundry, indoor corridors, 24-hour front desk, and dog-friendly rooms. <a href="#" onclick="go(\'amenities\');vkToggle();return false">Full amenities list →</a>', c:['Breakfast','Pool','Pet policy']},
 {k:['pet','pets','dog','dogs','puppy','pet friendly','pet-friendly','bring my dog','animal'], w:1,
  a:'We\'re dog-friendly! <strong>Dogs only</strong> (no cats or other pets), max <strong>2 dogs per room</strong>, in designated pet-friendly rooms with <strong>advance approval</strong> — please call <strong>(254) 675-8999</strong> before arrival. Pet fees: 1 dog/1 night $35 · 2 dogs/1 night $50 · 1 dog/2 nights $50 · 2 dogs/2 nights $60. Undisclosed pets incur a $150/day/pet violation fee. Service animals always welcome free.', c:['Pet fees','Service animals','Book a room']},
 {k:['cat','cats','kitten'], w:3,
  a:'We\'re sorry — Velkommen Inn accepts <strong>dogs only</strong>. Cats and other pets are not permitted. ADA service animals are always welcome at no charge.', c:['Pet policy','Service animals']},
 {k:['pet fee','pet fees','dog fee','how much for dog','cost for pet'], w:3,
  a:'Pet fees (charged separately): <strong>1 dog / 1 night: $35</strong> · <strong>2 dogs / 1 night: $50</strong> · <strong>1 dog / 2 nights: $50</strong> · <strong>2 dogs / 2 nights: $60</strong>. Longer stays: call <strong>(254) 675-8999</strong>. Undisclosed pets: $150 per day per pet.', c:['Pet policy','Book a room']},
 {k:['service animal','service dog','esa','emotional support'], w:3,
  a:'<strong>Service animals</strong> as defined by the ADA are always welcome at no charge — they\'re never treated as pets. Please let us know at booking so we can prepare. (Note: emotional support animals are not service animals under the ADA; our standard dogs-only pet policy and fees apply to them.)', c:['Pet policy','ADA rooms']},
 {k:['smoke','smoking','vape','vaping','cigarette','non-smoking','non smoking'], w:2,
  a:'Velkommen Inn is a <strong>100% non-smoking hotel</strong> — no smoking or vaping anywhere inside. Smoking is permitted outside only, at least <strong>50 feet from the building</strong>. Indoor smoking incurs a <strong>$150 damage/cleaning fee</strong>.', c:['Policies','Quiet hours']},
 {k:['cancel','cancellation','change my reservation','modify','refund'], w:2,
  a:'Standard policy: <strong>free cancellation up to 48 hours before arrival</strong> (rate-specific terms shown at booking control if different). Within 48 hours: one night\'s rate + tax. No-shows may be charged the entire reserved stay. To cancel or modify a direct booking, call <strong>(254) 675-8999</strong> or email info@velkommeninncliftontx.com. Third-party bookings must be changed through that platform.', c:['No-show policy','Book a room']},
 {k:['no show','no-show','noshow','miss my reservation','didn\'t arrive'], w:3,
  a:'If you don\'t arrive and haven\'t cancelled, it\'s treated as a <strong>no-show</strong> and you may be charged for the <strong>entire reserved stay</strong> including taxes. Running very late? Just call us at <strong>(254) 675-8999</strong> — we\'ll hold your room.', c:['Cancellation policy']},
 {k:['pay','payment','credit card','debit','cash','deposit','card'], w:1,
  a:'We accept Visa, Mastercard, American Express, and Discover. A valid credit card guarantees your reservation, and room charges are collected at check-in. Paying <strong>cash</strong>? That\'s fine at check-in with a <strong>$100 refundable deposit</strong>, returned at check-out after room inspection. Please keep a valid card on file — if a required authorization fails, we\'ll make a reasonable attempt to reach you for a replacement before a reservation is cancelled.', c:['Check-in time','Policies']},
 {k:['age','how old','minor','18','minimum age'], w:2,
  a:'Guests must be at least <strong>18 years old</strong> to reserve a room and check in, with a valid photo ID.', c:['Check-in time','Policies']},
 {k:['where','address','location','located','directions','how do i get','find you','map'], w:1,
  a:'We\'re at <strong>1215 N Avenue G, Clifton, TX 76634</strong> — on Highway 6 in Bosque County, the Norwegian Capital of Texas. Easy drive from Waco, Hillsboro, and Meridian. <a href="https://share.google/nfAYBrF7597feHEzX" target="_blank" rel="noopener">Open in Google Maps →</a>', c:['Things to do','Contact us']},
 {k:['things to do','attractions','activities','what is there to do','sightseeing','visit','explore'], w:1,
  a:'So much! <strong>Historic downtown Clifton</strong> (shops, dining, murals), the <strong>Bosque Museum</strong>, <strong>Bosque Arts Center</strong>, <strong>L.A. Thompson Gallery</strong>, the historic <strong>Cliftex Theatre</strong>, <strong>Bosque River &amp; City Park</strong>, the <strong>Meyer Observatory</strong> (scheduled star-viewing nights), plus <strong>Lake Whitney</strong> and <strong>Meridian State Park</strong> a short drive away. <a href="#" onclick="go(\'attractions\');vkToggle();return false">Explore Clifton page →</a>', c:['Lake Whitney','Restaurants nearby','Norse heritage']},
 {k:['lake whitney','whitney','fishing','boating','lake'], w:2,
  a:'<strong>Lake Whitney State Park</strong> is about 30 minutes away — swimming, camping, boating, and some of Central Texas\'s best fishing. <strong>Lake Aquilla</strong> is also nearby for quieter bass and crappie fishing.', c:['Things to do','Book a room']},
 {k:['norse','norwegian','heritage','history','why norwegian'], w:2,
  a:'Clifton is the official <strong>Norwegian Capital of Texas</strong>! Norwegian immigrants settled the nearby Norse community in the 1850s. "Velkommen" means "welcome" in Norwegian — visit the historic Norse churches and the Bosque Museum to explore the heritage.', c:['Things to do','About the hotel']},
 {k:['restaurant','food','dinner','lunch','eat','dining','bbq','barbecue'], w:1,
  a:'Clifton has great local dining — Texas BBQ, family diners, and local favorites along the main corridor and courthouse square. Our front desk loves giving recommendations: <strong>(254) 675-8999</strong>. And remember breakfast here is free, 6–9 AM!', c:['Breakfast','Things to do']},
 {k:['group','groups','block','team','crew','reunion','wedding','church'], w:1,
  a:'We host family reunions, sports teams, work crews, wedding parties, and more. Group blocks must be booked <strong>directly by phone</strong> — call <strong>(254) 675-8999</strong> with your group size and dates, and we\'ll set up rooms under one contact with group rates.', c:['Extended stay','Contact us']},
 {k:['extended stay','long term','weekly','monthly','work crew','long stay'], w:2,
  a:'We accommodate extended stays for work assignments and long visits — with guest laundry, free breakfast, and truck parking to make it easy. Call <strong>(254) 675-8999</strong> to ask about weekly/monthly rate options.', c:['Groups','Business travel'] },
 {k:['corporate','business travel','invoice','direct billing','company account'], w:2,
  a:'We offer <strong>direct billing and invoicing</strong> for qualifying corporate accounts, plus free Wi-Fi, in-room work desks, a business center, and early 6 AM breakfast for crews. Call <strong>(254) 675-8999</strong> to set up a company account.', c:['Extended stay','Amenities']},
 {k:['phone','call','contact','email','reach you','front desk','speak to someone','human','person','staff','talk to'], w:1,
  a:'You can reach a real person 24 hours a day: <strong>(254) 675-8999</strong> · Email: <strong>info@velkommeninncliftontx.com</strong> · Or use the message form on our <a href="#" onclick="go(\'contact\');vkToggle();return false">Contact page</a>.', c:['Book a room','Location']},
 {k:['hours','open','24 hour','front desk hours','always open'], w:1,
  a:'Our <strong>front desk is staffed 24 hours a day</strong>, every day — check in late, ask questions anytime, or call <strong>(254) 675-8999</strong> around the clock.', c:['Check-in time','Contact us']},
 {k:['third party','expedia','booking.com','hotels.com','priceline','official','scam','fake site'], w:2,
  a:'Good instinct to check! This is the <strong>official Velkommen Inn website</strong>. Third-party booking sites charge commissions, may show wrong info, and control your reservation if problems arise. Verify: our only site is <strong>velkommeninncliftontx.com</strong> and our only phone is <strong>(254) 675-8999</strong>. <a href="#" onclick="go(\'official\');vkToggle();return false">Official Booking Notice →</a>', c:['Book a room','Contact us']},
 {k:['best western','used to be','former','old name','rebrand'], w:2,
  a:'Yes — Velkommen Inn is at the location formerly operated as the <strong>Best Western</strong> in Clifton. We\'re now <strong>independently owned</strong> (no longer affiliated with Best Western), with a name honoring Clifton\'s Norwegian heritage. Same convenient Highway 6 location — velkommen back!', c:['About the hotel','Book a room']},
 {k:['quiet hours','noise','party'], w:2,
  a:'Quiet hours are <strong>10:00 PM to 7:00 AM</strong>. Parties and events in guest rooms aren\'t permitted — we keep things peaceful so everyone rests well.', c:['Policies']},
 {k:['policy','policies','rules','terms'], w:1,
  a:'Quick highlights: check-in 2 PM / out 11 AM · 18+ to register · 100% non-smoking ($150 fee) · dogs only with approval · free cancellation up to 48 hrs · quiet hours 10 PM–7 AM · cash accepted with $100 refundable deposit. <a href="#" onclick="go(\'policies\');vkToggle();return false">Guest Policies →</a> · <a href="#" onclick="go(\'terms\');vkToggle();return false">Full Terms →</a>', c:['Cancellation policy','Pet policy','Smoking policy']},
 {k:['tax','taxes','occupancy tax'], w:2,
  a:'Quoted room rates don\'t include applicable state, local, and hotel occupancy taxes unless stated otherwise — the exact total shows during booking.', c:['Payment','Book a room']},
 {k:['about','tell me about','who are you','the hotel','this hotel'], w:1,
  a:'Velkommen Inn is an independently owned hotel at <strong>1215 N Avenue G, Clifton, TX</strong> — the Norwegian Capital of Texas. Clean, comfortable rooms, free breakfast, free parking, indoor corridors, pool, fitness center, and a 24-hour front desk with genuine small-town hospitality. "Velkommen" means welcome — and you are!', c:['Room types','Amenities','Things to do']},
 {k:['gallery','photos','pictures','video','tour','360','see the hotel','what does it look like'], w:1,
  a:'Take a look around! Our <a href="#" onclick="go(\'gallery\');vkToggle();return false">Gallery page</a> has photos, an interactive 360° map view, and video sections. Want details on a specific room before booking? Call us and we\'ll describe it: <strong>(254) 675-8999</strong>.', c:['Room types','Book a room']},
 {k:['weather','hot','cold','season'], w:1,
  a:'Central Texas weather! Summers are hot (perfect for our seasonal pool and Lake Whitney), winters are mild with the occasional cold snap. Spring and fall are gorgeous for exploring Bosque County. Our rooms have individual climate control year-round.', c:['Pool','Things to do']},
 {k:['accessibility options','screen reader','bigger text','contrast'], w:2,
  a:'This website has a built-in <strong>accessibility menu</strong> — click the blue accessibility button (top-right) or press <strong>Ctrl+U</strong> for bigger text, high contrast, dyslexia-friendly font, and more. For accessible room accommodations, call <strong>(254) 675-8999</strong>.', c:['ADA rooms']}
];
var vkOpened = false;
function vkNoteInit(){
  if(VK_AI_ENDPOINT){ var n=document.getElementById('vkNote'); if(n) n.innerHTML='AI assistant &middot; may occasionally err &mdash; confirm details at <strong>(254) 675-8999</strong>'; }
}
function vkToggle(){
  vkNoteInit();
  var c = document.getElementById('vkChat'), b = document.getElementById('vkChatBtn');
  var open = !c.classList.contains('open');
  c.classList.toggle('open', open);
  b.style.display = open ? 'none' : 'flex';
  if(open){
    if(!vkOpened){ vkOpened = true; vkBot('Velkommen! 👋 I\'m the Velkommen Inn assistant. Ask me anything about our rooms, breakfast, pet policy, local attractions, or booking — or tap a topic below.', ['Book a room','Room types','Pet policy','Breakfast','Things to do']); }
    document.getElementById('vkInput').focus();
  } else { b.focus(); }
}
function vkAdd(text, who){
  var m = document.createElement('div');
  m.className = 'vk-msg ' + who;
  if(who === 'bot'){ m.innerHTML = text; } else { m.textContent = text; }
  document.getElementById('vkMsgs').appendChild(m);
  m.scrollIntoView({behavior:'smooth', block:'end'});
}
function vkChipsSet(chips){
  var el = document.getElementById('vkChips');
  el.innerHTML = '';
  (chips || []).forEach(function(c){
    var b = document.createElement('button');
    b.className = 'vk-chip'; b.type = 'button'; b.textContent = c;
    b.onclick = function(){ vkAsk(c); };
    el.appendChild(b);
  });
}
function vkBot(text, chips){
  var t = document.createElement('div');
  t.className = 'vk-typing'; t.innerHTML = '<i></i><i></i><i></i>';
  var box = document.getElementById('vkMsgs');
  box.appendChild(t); t.scrollIntoView({block:'end'});
  setTimeout(function(){ t.remove(); vkAdd(text, 'bot'); vkChipsSet(chips); }, 550 + Math.random()*450);
}
function vkAnswer(q){
  var s = ' ' + q.toLowerCase().replace(/[^a-z0-9\s'-]/g,' ').replace(/\s+/g,' ') + ' ';
  if(/^\s*(hi|hello|hey|howdy|good (morning|afternoon|evening))\b/.test(s.trim()))
    return {a:'Velkommen — hello! 😊 How can I help with your stay? Try asking about rooms, pets, breakfast, or anything else.', c:['Book a room','Room types','Pet policy','Amenities']};
  if(/\b(thank|thanks|appreciate)\b/.test(s))
    return {a:'You\'re so welcome! Anything else I can help with? We\'d love to have you stay — <a href="'+VK_BOOK+'" target="_blank" rel="noopener">book direct here</a> or call <strong>(254) 675-8999</strong>.', c:['Book a room','Things to do']};
  if(/\b(bye|goodbye|see you|that\'s all)\b/.test(s))
    return {a:'Ha det bra — goodbye! Safe travels, and velkommen anytime. 🌟', c:['Book a room']};
  var best = null, bestScore = 0;
  VK_KB.forEach(function(item){
    var score = 0;
    item.k.forEach(function(kw){
      if(s.indexOf(' '+kw+' ') !== -1 || (kw.indexOf(' ')!==-1 && s.indexOf(kw) !== -1)){
        score += (item.w||1) + (kw.indexOf(' ')!==-1 ? 2 : 0) + kw.length/12;
      }
    });
    if(score > bestScore){ bestScore = score; best = item; }
  });
  if(best && bestScore >= 1) return {a:best.a, c:best.c};
  return {a:'Great question — I want to make sure you get the right answer, so please call our 24-hour front desk at <strong>(254) 675-8999</strong> or email <strong>info@velkommeninncliftontx.com</strong>. Meanwhile, here are topics I can help with:', c:['Book a room','Room types','Pet policy','Breakfast','Cancellation policy','Things to do','Contact us']};
}
function vkAsk(q){
  vkAdd(q, 'user');
  vkChipsSet([]);
  vkHistory.push({role:'user', content:q});
  if(VK_AI_ENDPOINT){
    var t = document.createElement('div');
    t.className = 'vk-typing'; t.innerHTML = '<i></i><i></i><i></i>';
    var box = document.getElementById('vkMsgs');
    box.appendChild(t); t.scrollIntoView({block:'end'});
    fetch(VK_AI_ENDPOINT, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({messages: vkHistory.slice(-12)})
    }).then(function(r){ if(!r.ok) throw 0; return r.json(); })
    .then(function(d){
      t.remove();
      if(!d.reply) throw 0;
      vkHistory.push({role:'assistant', content:d.reply});
      var safe = d.reply
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
        .replace(/(https?:\/\/[^\s)]+)/g, function(u){ return '<a href="'+u+'" target="_blank" rel="noopener">'+(u.length>42?u.slice(0,40)+'…':u)+'</a>'; })
        .replace(/\n/g,'<br>');
      vkAdd(safe, 'bot');
      vkChipsSet(['Book a room','Pet policy','Things to do','Contact us']);
    }).catch(function(){
      t.remove();
      var r = vkAnswer(q);
      vkHistory.push({role:'assistant', content:'(kb) '});
      vkBot(r.a, r.c);
    });
  } else {
    var r = vkAnswer(q);
    vkHistory.push({role:'assistant', content:'(kb) '});
    vkBot(r.a, r.c);
  }
}
function vkSend(){
  var inp = document.getElementById('vkInput');
  var q = inp.value.trim();
  if(!q) return;
  inp.value = '';
  vkAsk(q);
}

// ===== Accessibility widget (UserWay-style) =====
var a11yState = {contrast:0, links:0, text:0, spacing:0, motion:0, noimg:0, font:0, cursor:0, guide:0, line:0, align:0, sat:0};
var a11yLevels = {contrast:3, text:3, spacing:3, line:3, align:3, sat:4};
var a11yLabels = {
  contrast:['','HIGH','DARK'], text:['','+12%','+25%'], spacing:['','WIDE','WIDER'],
  line:['','2.0','2.5'], align:['','LEFT','CENTER'], sat:['','LOW','HIGH','GRAY']
};
function a11yLoad(){
  try{ var s = JSON.parse(localStorage.getItem('vk_a11y')||'{}'); for(var k in a11yState){ if(s[k]) a11yState[k]=s[k]; } }catch(e){}
  a11yApply();
}
function a11ySave(){ try{ localStorage.setItem('vk_a11y', JSON.stringify(a11yState)); }catch(e){} }
function a11ySet(mode){
  var max = a11yLevels[mode] || 2;
  a11yState[mode] = (a11yState[mode]+1) % max;
  a11yApply(); a11ySave();
}
function a11yApply(){
  var b = document.body;
  ['contrast','text','spacing','line','align','sat'].forEach(function(m){
    for(var i=1;i<(a11yLevels[m]);i++){ b.classList.toggle('a11y-'+m+'-'+i, a11yState[m]===i); }
  });
  ['links','motion','noimg','font','cursor','guide'].forEach(function(m){
    b.classList.toggle('a11y-'+(m==='noimg'?'noimg':m), !!a11yState[m]);
  });
  document.querySelectorAll('.a11y-tile').forEach(function(t){
    var m = t.dataset.mode, v = a11yState[m], on = v>0;
    t.classList.toggle('on', on);
    t.setAttribute('aria-pressed', on?'true':'false');
    var st = t.querySelector('.t-state');
    if(st){ st.textContent = (a11yLabels[m] && a11yLabels[m][v]) ? a11yLabels[m][v] : (on?'ON':''); }
  });
}
function a11yToggle(){
  var p = document.getElementById('a11yPanel'), o = document.getElementById('a11yOverlay'), btn = document.getElementById('a11yBtn');
  var open = !p.classList.contains('open');
  p.classList.toggle('open', open);
  o.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open?'true':'false');
  if(open){ var first = p.querySelector('.a11y-tile'); if(first) first.focus(); }
  else{ btn.focus(); }
}
function a11yReset(){ for(var k in a11yState){ a11yState[k]=0; } a11yApply(); a11ySave(); }
document.addEventListener('keydown', function(e){
  if(e.ctrlKey && (e.key==='u' || e.key==='U')){ e.preventDefault(); a11yToggle(); }
  if(e.key==='Escape'){ var p=document.getElementById('a11yPanel'); if(p && p.classList.contains('open')) a11yToggle(); }
});
document.addEventListener('mousemove', function(e){
  if(document.body.classList.contains('a11y-guide')){ var r=document.getElementById('a11y-ruler'); if(r) r.style.top=(e.clientY-7)+'px'; }
});
document.addEventListener('DOMContentLoaded', a11yLoad);

// ===== Accessibility layer =====
document.addEventListener('DOMContentLoaded', function(){
  // Make onclick-only anchors keyboard-focusable and prevent hash jumps
  document.querySelectorAll('a[onclick]:not([href])').forEach(function(a){
    a.setAttribute('href','#');
    a.addEventListener('click', function(e){ e.preventDefault(); });
  });
  // Decorative SVGs hidden from screen readers
  document.querySelectorAll('svg').forEach(function(s){ s.setAttribute('aria-hidden','true'); s.setAttribute('focusable','false'); });
  // Gallery photo items: real buttons for keyboard + screen readers
  document.querySelectorAll('#gpane-photos .gitem').forEach(function(g,i){
    g.setAttribute('role','button');
    g.setAttribute('tabindex','0');
    g.setAttribute('aria-label','View photo: ' + (g.dataset.cap ? g.dataset.cap.replace(/&[a-z]+;/g,' ') : 'gallery image ' + (i+1)));
    g.addEventListener('keydown', function(e){
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); g.click(); }
    });
  });
  // Video posters
  document.querySelectorAll('.vposter').forEach(function(v){
    var t = v.closest('.video-card').querySelector('h3');
    v.setAttribute('role','button');
    v.setAttribute('tabindex','0');
    v.setAttribute('aria-label','Play video: ' + (t ? t.textContent : 'hotel video') + ' (coming soon)');
    v.addEventListener('keydown', function(e){
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); v.click(); }
    });
  });
  // Gallery tab buttons: aria-selected
  document.querySelectorAll('.gtab').forEach(function(t){
    t.setAttribute('aria-selected', t.classList.contains('active') ? 'true' : 'false');
  });
});
var _lbLastFocus = null;

function go(id){ var u = PAGE_URL[id]; if(u){ location.href = u; } }


function tscroll(id){
  var el=document.getElementById(id);
  if(el){el.scrollIntoView({behavior:'smooth',block:'start'});}
}
function exMap(q){
  var card = document.querySelector('.ex-map-card');
  if(card){ card.scrollIntoView({behavior:'smooth', block:'start'}); }
  document.querySelectorAll('.map-chip').forEach(function(c){ c.classList.remove('active'); });
  var chips = document.querySelectorAll('.map-chip');
  for(var i=0;i<chips.length;i++){
    if(chips[i].getAttribute('onclick') && chips[i].getAttribute('onclick').indexOf(q) !== -1){ chips[i].classList.add('active'); break; }
  }
  var f = document.getElementById('explore-map');
  if(f){ f.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(q) + '&z=14&output=embed'; }
}
function rslide(btn, dir){
  var t = btn.closest('.rslider').querySelector('.rtrack');
  var w = t.clientWidth;
  var i = Math.round(t.scrollLeft / w) + dir;
  var n = t.children.length;
  if(i < 0) i = n - 1;
  if(i > n - 1) i = 0;
  t.scrollTo({left: i * w, behavior: 'smooth'});
}
function rgo(dot, i){
  var t = dot.closest('.rslider').querySelector('.rtrack');
  t.scrollTo({left: i * t.clientWidth, behavior: 'smooth'});
}
function rdotsSync(t){
  var i = Math.round(t.scrollLeft / t.clientWidth);
  var dots = t.closest('.rslider').querySelectorAll('.rdots button');
  dots.forEach(function(d, k){ d.classList.toggle('on', k === i); });
}
function mapGo(btn, q){
  document.querySelectorAll('.map-chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('explore-map').src = 'https://maps.google.com/maps?q=' + encodeURIComponent(q) + '&z=13&output=embed';
}
// Gallery tabs
function gtab(id){
  document.querySelectorAll('.gpane').forEach(p=>p.classList.remove('active'));
  document.getElementById('gpane-'+id).classList.add('active');
  document.querySelectorAll('.gtab').forEach(t=>{t.classList.toggle('active', t.dataset.pane===id); t.setAttribute('aria-selected', t.dataset.pane===id ? 'true':'false');});
}
// Lightbox
var lbIndex=0;
function lbItems(){return Array.from(document.querySelectorAll('#gpane-photos .gitem'));}
function lb(i){
  _lbLastFocus = document.activeElement;
  if(typeof i !== 'number'){ i = lbItems().indexOf(i); if(i<0) i=0; }
  lbIndex=i; lbRender();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow='hidden';
  var c = document.querySelector('.lb-close'); if(c) c.focus();
}
function lbRender(){
  var items=lbItems(); if(!items.length)return;
  lbIndex=(lbIndex+items.length)%items.length;
  var it=items[lbIndex];
  var ph=it.querySelector('.photo').cloneNode(true);
  var inner=document.getElementById('lb-inner');
  inner.innerHTML='';
  inner.appendChild(ph);
  var cap=document.createElement('div');
  cap.className='lb-cap';
  cap.innerHTML=(lbIndex+1)+' / '+items.length+' &mdash; '+(it.dataset.cap||'');
  inner.appendChild(cap);
}
function lbStep(d){lbIndex+=d;lbRender();}
function lbClose(){
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow='';
  if(_lbLastFocus && _lbLastFocus.focus) _lbLastFocus.focus();
}
document.addEventListener('keydown',function(e){
  var lbEl=document.getElementById('lightbox');
  if(!lbEl.classList.contains('open'))return;
  if(e.key==='Escape')lbClose();
  if(e.key==='ArrowLeft')lbStep(-1);
  if(e.key==='ArrowRight')lbStep(1);
});
// Video placeholder message
function vmsg(el){
  var b=el.querySelector('.vplay');
  b.innerHTML='<span style="font-size:11px;font-weight:700;color:#6C1A2E;letter-spacing:.5px">SOON</span>';
  setTimeout(function(){b.innerHTML='<svg width="24" height="24" viewBox="0 0 24 24" fill="#6C1A2E"><path d="M8 5v14l11-7z"/></svg>';},1400);
}

// Set sensible default dates
(function(){
  var t=new Date(), tm=new Date(Date.now()+864e5);
  function f(d){return d.toISOString().slice(0,10);}
  var ci=document.getElementById('ci'), co=document.getElementById('co');
  if(ci){ci.value=f(t);ci.min=f(t);}
  if(co){co.value=f(tm);co.min=f(t);}
})();

// ===== Cookie consent =====
function ckGet(){ try{ return JSON.parse(localStorage.getItem('vk_consent')||'null'); }catch(e){ return null; } }
function ckSet(v){ try{ localStorage.setItem('vk_consent', JSON.stringify(v)); }catch(e){} }
function vkAnalyticsAllowed(){ var c = ckGet(); return !!(c && c.analytics); }
function ckApply(){
  if(vkAnalyticsAllowed() && typeof vkLoadAnalytics === 'function'){ vkLoadAnalytics(); }
}
function ckChoose(all){
  ckSet({analytics: !!all, ts: Date.now()});
  document.getElementById('ckBar').classList.remove('show');
  document.body.classList.remove('ck-open');
  ckApply();
}
function ckPanel(){
  var p = document.getElementById('ckPanel');
  p.classList.toggle('open');
  var c = ckGet();
  document.getElementById('ckAnalytics').checked = !!(c && c.analytics);
}
function ckSaveCustom(){
  ckSet({analytics: document.getElementById('ckAnalytics').checked, ts: Date.now()});
  document.getElementById('ckBar').classList.remove('show');
  document.body.classList.remove('ck-open');
  ckApply();
}
function ckOpen(){
  var b = document.getElementById('ckBar');
  b.classList.add('show');
  document.body.classList.add('ck-open');
  document.getElementById('ckPanel').classList.add('open');
  var c = ckGet();
  document.getElementById('ckAnalytics').checked = !!(c && c.analytics);
}
document.addEventListener('DOMContentLoaded', function(){
  if(!ckGet()){ var b = document.getElementById('ckBar'); if(b){ b.classList.add('show'); document.body.classList.add('ck-open'); } }
  else { ckApply(); }
});
// GA4 loader stub — activated when a Measurement ID is added:
// function vkLoadAnalytics(){ /* gtag snippet goes here, gated behind consent */ }

// ===== WOW layer =====
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // header depth
  var hd = document.querySelector('header');
  if(hd){ window.addEventListener('scroll', function(){ hd.classList.toggle('scrolled', window.scrollY > 8); }, {passive:true}); }
  if(reduce || !('IntersectionObserver' in window)) return;
  // scroll reveals with stagger
  var sels = '.section-h,.lede,.card,.excard,.offer,.room-card,.wcard,.dcard,.day-step,.gitem,.rev-band,.ex-cta,.split > *,.ramen,.exp-band h2,.exp-band p,.notice,.faq-list details';
  var els = document.querySelectorAll(sels);
  var perParent = {};
  els.forEach(function(el){
    el.classList.add('rv');
    var p = el.parentElement;
    var key = p ? (p.className || 'x') : 'x';
    perParent[key] = (perParent[key] || 0) + 1;
    var idx = perParent[key] - 1;
    el.style.transitionDelay = Math.min(idx * 70, 350) + 'ms';
  });
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold: 0.12, rootMargin: '0px 0px -40px 0px'});
  els.forEach(function(el){ io.observe(el); });
})();
