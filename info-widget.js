/* ═══════════ معطيات المؤسسة — زر الشريط العلوي في البوابة ═══════════
   لوحة إدخال الهوية الرسمية للمؤسسة (الولاية، المديرية، الدائرة، البلدية،
   الرقم الميكانوغرافي، رقم الحساب، رمز الآمر بالصرف، السنة الدراسية)
   — حفظ محلي فقط في هذا المتصفح (localStorage): لا رفع، لا تحميل، لا مزامنة
   — كل متصفح/جهاز مستقل بمعطياته، ولا تنتقل المعلومات بين الموظفين أو المؤسسات
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var LS_INFO = 'instInfoV1';
  var LS_MECANO = 'instInfoMecanoV1';
  var LS_UPDATED = 'instInfoUpdatedAtV1';

  var FIELDS = [
    { key: 'institution', label: 'اسم المؤسسة' },
    { key: 'wilaya', label: 'الولاية' },
    { key: 'direction', label: 'المديرية' },
    { key: 'daira', label: 'الدائرة' },
    { key: 'commune', label: 'البلدية' },
    { key: 'mecano', label: 'الرقم الميكانوغرافي' },
    { key: 'account', label: 'رقم الحساب' },
    { key: 'ordonnateurCode', label: 'رمز الآمر بالصرف' },
    { key: 'academicYear', label: 'السنة الدراسية/المالية' },
  ];

  function getLS(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function setLS(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function getInfo() { try { return JSON.parse(getLS(LS_INFO) || '{}') || {}; } catch (e) { return {}; } }
  function getMecano() { return getLS(LS_MECANO) || ''; }
  function getUpdated() { return getLS(LS_UPDATED) || ''; }
  function collect() {
    var o = {};
    FIELDS.forEach(function (f) { o[f.key] = (document.getElementById('iih-' + f.key) || {}).value || ''; });
    return o;
  }
  function fill(info) {
    FIELDS.forEach(function (f) {
      var el = document.getElementById('iih-' + f.key);
      if (el) el.value = info[f.key] || '';
    });
  }
  function fmtWhen(iso) {
    try { return new Date(iso).toLocaleString('ar-dz'); } catch (e) { return iso || ''; }
  }

  var st = document.createElement('style');
  st.textContent =
    '.iih{font-family:"IBM Plex Sans Arabic","Cairo",Tahoma,sans-serif;direction:rtl}' +
    '.iih-dot{display:none;position:absolute;top:-4px;left:-4px;width:10px;height:10px;border-radius:50%;' +
    'background:#ef4444;border:2px solid #fff;box-shadow:0 0 6px #ef4444}' +
    '.iih-dot.on{display:block;animation:iihPulse 1.2s infinite}' +
    '@keyframes iihPulse{50%{opacity:.45}}' +
    '.iih-ov{position:fixed;inset:0;z-index:100000;background:rgba(15,23,42,.55);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);' +
    'display:none;align-items:center;justify-content:center;padding:1rem}' +
    '.iih-ov.open{display:flex}' +
    '.iih-pn{background:#fff;width:100%;max-width:520px;max-height:88vh;display:flex;flex-direction:column;' +
    'border-radius:1.25rem;border:1px solid #a7f3d0;box-shadow:0 25px 50px -12px rgba(0,0,0,.4);overflow:hidden}' +
    '.iih-hd{background:linear-gradient(90deg,#064e3b,#065f46,#134e4a);color:#fff;border-bottom:3px solid #f59e0b;' +
    'padding:.85rem 1.25rem;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}' +
    '.iih-hd h3{font-size:1.05rem;font-weight:700;margin:0}' +
    '.iih-x{background:rgba(255,255,255,.15);border:0;color:#fff;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:14px}' +
    '.iih-x:hover{background:rgba(255,255,255,.3)}' +
    '.iih-bd{padding:1rem 1.15rem;overflow-y:auto}' +
    '.iih-grid{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}' +
    '@media(max-width:520px){.iih-grid{grid-template-columns:1fr}}' +
    '.iih-f{display:flex;flex-direction:column;gap:3px}' +
    '.iih-f.wide{grid-column:1/-1}' +
    '.iih-f label{font-size:11px;font-weight:700;color:#334155}' +
    '.iih-f input{border:1px solid #cbd5e1;border-radius:.6rem;padding:.45rem .65rem;font-family:inherit;font-size:.9rem;font-weight:600;color:#0f172a}' +
    '.iih-f input:focus{outline:0;border-color:#059669;box-shadow:0 0 0 2px rgba(5,150,105,.2)}' +
    '.iih-note{font-size:11px;color:#64748b;line-height:1.8;margin:.6rem 0 0}' +
    '.iih-msg{display:none;font-size:12px;font-weight:700;padding:.5rem .75rem;border-radius:.6rem;margin-top:.6rem}' +
    '.iih-msg.ok{display:block;background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0}' +
    '.iih-msg.err{display:block;background:#fef2f2;color:#b91c1c;border:1px solid #fecaca}' +
    '.iih-acts{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.9rem;padding-top:.9rem;border-top:1px dashed #cbd5e1}' +
    '.iih-acts button{border:0;border-radius:.7rem;padding:.5rem .9rem;font-family:inherit;font-size:12px;font-weight:800;cursor:pointer;' +
    'display:inline-flex;align-items:center;gap:5px}' +
    '.iih-save{background:#059669;color:#fff}' +
    '.iih-save:hover{background:#047857}' +
    '.iih-up{background:#f59e0b;color:#020617;border:1px solid #fde68a}' +
    '.iih-up:hover{background:#fbbf24}' +
    '.iih-dl{background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe}' +
    '.iih-dl:hover{background:#dbeafe}' +
  document.head.appendChild(st);

  /* زر معطيات المؤسسة داخل الكادر — مقابل «تطبيقات موحّدة» */
  function bindStat() {
    var el = document.getElementById('instInfoStat');
    if (!el) return;
    el.addEventListener('click', openPanel);
  }

  /* زر عائم ثانٍ بنفس التسمية — أسفل اليسار بجانب زر الاتصال */
  function bindFloating() {
    if (document.getElementById('iih-float-btn')) return;
    var b = document.createElement('button');
    b.id = 'iih-float-btn';
    b.type = 'button';
    b.title = 'معطيات المؤسسة الرسمية — محفوظة محلياً في هذا المتصفح فقط';
    b.textContent = '🏛 معطيات المؤسسة';
    b.style.cssText = 'position:fixed;bottom:18px;left:92px;z-index:99999;border:2px solid #fbbf24;cursor:pointer;' +
      'font-family:"IBM Plex Sans Arabic","Cairo",Tahoma,sans-serif;font-weight:800;font-size:12px;padding:.55rem .9rem;border-radius:999px;' +
      'background:linear-gradient(145deg,#065f46,#047857 55%,#134e4a);color:#fff;box-shadow:0 3px 0 #022c22';
    b.addEventListener('click', openPanel);
    document.body.appendChild(b);
  }

  function refreshStatHint() {
    var m = document.getElementById('instInfoStatHint');
    if (!m) return;
    var mecano = getMecano();
    var u = getUpdated();
    m.textContent = mecano
      ? 'المؤسسة الحالية: ' + mecano + (u ? ' — آخر حفظ محلي: ' + fmtWhen(u) : '')
      : 'اضغط لتعبئة الهوية الرسمية — تُحفظ محلياً في هذا المتصفح فقط';
    refreshHeaderName();
  }

  /* ترويسة البوابة تعرض اسم المؤسسة من المعطيات المحفوظة محلياً في هذا المتصفح،
     لا الاسم القصير المكتوب ثابتًا في الصفحة */
  function refreshHeaderName() {
    var el = document.getElementById('portal-inst-name');
    if (!el) return;
    var name = String((getInfo().institution || '')).trim();
    if (name) el.textContent = name;
  }

  /* اللوحة */
  var ov = document.createElement('div');
  ov.className = 'iih-ov iih';
  ov.innerHTML =
    '<div class="iih-pn">' +
    '<div class="iih-hd"><h3>🏛 معطيات المؤسسة</h3><button class="iih-x" title="إغلاق">✕</button></div>' +
    '<div class="iih-bd">' +
    '<div class="iih-grid">' +
    FIELDS.map(function (f) {
      return '<div class="iih-f' + (f.key === 'institution' || f.key === 'account' ? ' wide' : '') + '">' +
        '<label>' + f.label + ':</label>' +
        '<input id="iih-' + f.key + '" type="text">' +
        '</div>';
    }).join('') +
    '</div>' +
    '<p class="iih-note">اضغط «حفظ» — تُحفظ المعطيات في <b>هذا المتصفح فقط</b> ولا تُرفع إلى أي خادم ولا تظهر في أجهزة أو متصفحات أخرى. كل موظف يحتفظ بنسخته المحلية الخاصة. الرقم الميكانوغرافي يُحفظ محلياً ليُمرَّر للتطبيقات من هذا المتصفح.</p>' +
    '<div class="iih-acts">' +
    '<button class="iih-save" id="iih-save">💾 حفظ محلياً</button>' +
    '</div>' +
    '<div class="iih-meta" id="iih-meta"></div>' +
    '<div class="iih-msg" id="iih-msg"></div>' +
    '</div>' +
    '</div>';
  document.body.appendChild(ov);

  var msg = ov.querySelector('#iih-msg');
  var meta = ov.querySelector('#iih-meta');
  
  function say(text, ok) {
    msg.textContent = text;
    msg.className = 'iih-msg ' + (ok ? 'ok' : 'err');
    clearTimeout(say._t);
    say._t = setTimeout(function () { msg.className = 'iih-msg'; }, 5000);
  }
  function refreshMeta() {
    var mecano = getMecano();
    var u = getUpdated();
    meta.textContent = mecano
      ? 'المؤسسة الحالية: ' + mecano + (u ? ' — آخر حفظ محلي: ' + fmtWhen(u) : '')
      : 'لم يُحدَّد الرقم الميكانوغرافي بعد';
  }
  function refreshDot() {
    // لا اتصال بأي مركز: النقطة كانت تنبّه لنسخة أحدث على الخادم، ولم يعد هناك خادم
    var dot = document.getElementById('iih-dot');
    if (dot) dot.className = 'iih-dot';
  }

  function openPanel() {
    fill(getInfo());
    refreshMeta();
    refreshDot();
    refreshStatHint();
    ov.classList.add('open');
  }

  /* حفظ محلي فقط — في متصفح هذا الجهاز، دون أي إرسال خارجي */
  ov.querySelector('#iih-save').addEventListener('click', function () {
    var info = collect();
    var mecano = String(info.mecano || '').trim().toLowerCase().replace(/\s+/g, '-');
    if (!mecano) { say('أدخل الرقم الميكانوغرافي أولًا — يُحفظ محلياً ليُمرَّر للتطبيقات من هذا المتصفح', false); return; }
    info.mecano = mecano;
    setLS(LS_INFO, JSON.stringify(info));
    setLS(LS_MECANO, mecano);
    setLS(LS_UPDATED, new Date().toISOString());
    if (window.syncEntryLinks) window.syncEntryLinks();
    refreshMeta();
    refreshDot();
    refreshStatHint();
    say('✓ حُفظت المعطيات محلياً في هذا المتصفح فقط — لن تظهر في أجهزة أخرى', true);
  });


  ov.querySelector('.iih-x').addEventListener('click', function () { ov.classList.remove('open'); });
  ov.addEventListener('click', function (e) { if (e.target === ov) ov.classList.remove('open'); });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { bindStat(); bindFloating(); });
  else { bindStat(); bindFloating(); }

  /* عند فتح البوابة: لا مزامنة ولا جلب خارجي — تُستخدم المعطيات المحفوظة محلياً في هذا المتصفح فقط */

  if (getMecano()) refreshDot();
    refreshStatHint();
  window.InstitutionInfo = { open: openPanel };
})();
