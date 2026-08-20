// ==UserScript==
// @name         Kinozal extended search filters
// @description  Kinozal extended filters on search page
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @match        https://kinozal.tv/browse.php*
// @namespace    https://github.com/reliable-code/site-enhancer-scripts
// @version      1.0.78723631
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kinozal.tv
// @author       reliable-code
// @downloadURL  https://raw.githubusercontent.com/reliable-code/site-enhancer-scripts/main/specific/kinozal.user.js
// ==/UserScript==

(()=>{(()=>{"use strict";var g,M;function U(e,t,n=null,r=!1){const i=e.querySelector(t);return i?(r&&g(t,e,i),Promise.resolve(i)):(r&&M(t,e),new Promise(s=>{const l=new MutationObserver(d);l.observe(e,{childList:!0,subtree:!0});let c;n&&(c=setTimeout(()=>{l.disconnect(),r&&g(t,e,null),s(null)},n));function d(){const u=e.querySelector(t);u&&(c&&clearTimeout(c),l.disconnect(),r&&g(t,e,u),s(u))}}))}function W(e,t){return e.querySelector(t)?new Promise(r=>{const i=new MutationObserver(s);i.observe(e,{childList:!0,subtree:!0});function s(){e.querySelector(t)||(i.disconnect(),r())}}):Promise.resolve()}function j(e,t=400){return new Promise(n=>{let r;const i=new MutationObserver(()=>{clearTimeout(r),s()});function s(){r=setTimeout(()=>{i.disconnect(),n()},t)}s(),i.observe(e,{childList:!0,subtree:!0})})}function I(e,t=250){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>e.apply(this,r),t)}}async function Q(e){document.visibilityState==="visible"?await e():document.addEventListener("visibilitychange",async()=>{document.visibilityState==="visible"&&await e()},{once:!0})}function H(e,t){const n=new IntersectionObserver(r=>{r.forEach(i=>{i.isIntersecting&&(t(),x(e))})});e.intersectionObserver=n,n.observe(e)}function x(e){e.intersectionObserver&&(e.intersectionObserver.disconnect(),e.intersectionObserver=null)}function Y(e){e&&(e.disconnect(),e=null)}const F=`<table class="tables1">\r
    <tbody>\r
    <tr>\r
        <td colspan="6">\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0444\u0438\u043B\u044C\u0442\u0440\u044B</td>\r
    </tr>\r
    <tr>\r
        <td>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435</td>\r
        <td>\u041F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u044B\u0439</td>\r
        <td>\u041C\u0438\u043D. \u0440\u0430\u0437\u043C\u0435\u0440 (\u0413\u0411)</td>\r
        <td>\u041C\u0430\u043A\u0441. \u0440\u0430\u0437\u043C\u0435\u0440 (\u0413\u0411)</td>\r
        <td>\u041C\u0438\u043D. \u0441\u0438\u0434\u043E\u0432</td>\r
        <td></td>\r
    </tr>\r
    <tr>\r
        <td>\r
            <input type="text" id="filter-name" class="w98p" placeholder="\u041E\u0431\u044B\u0447\u043D\u044B\u0439 \u0444\u0438\u043B\u044C\u0442\u0440">\r
        </td>\r
        <td>\r
            <input type="text" id="filter-permanent" class="w98p" placeholder="\u041F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u044B\u0439">\r
        </td>\r
        <td>\r
            <input type="number" id="filter-min-size" class="w98p" placeholder="\u041C\u0438\u043D. (\u0413\u0411)" step="1" min="0">\r
        </td>\r
        <td>\r
            <input type="number" id="filter-max-size" class="w98p" placeholder="\u041C\u0430\u043A\u0441. (\u0413\u0411)" step="1" min="0">\r
        </td>\r
        <td>\r
            <input type="number" id="filter-min-seeds" class="w98p" placeholder="\u041C\u0438\u043D. \u0441\u0438\u0434\u043E\u0432" step="1" min="0">\r
        </td>\r
        <td class="center">\r
            <input type="button" id="reset-filters" value="\u0421\u0431\u0440\u043E\u0441" class="buttonS w98p">\r
        </td>\r
    </tr>\r
    <tr id="custom-counter">\r
        <td colspan="6"><span class="bulet"></span><span id="counter-text">\u041F\u043E\u043A\u0430\u0437\u0430\u043D\u043E 0 \u0438\u0437 0 \u0440\u0430\u0437\u0434\u0430\u0447</span></td>\r
    </tr>\r
    </tbody>\r
</table>\r
`,o={get:(e,t=null)=>{try{return GM_getValue(e,t)}catch(n){return console.warn(`Storage get error for key "${e}":`,n),t}},set:(e,t)=>{try{return GM_setValue(e,t),!0}catch(n){return console.warn(`Storage set error for key "${e}":`,n),!1}},update:(e,t,n=null)=>{try{const r=o.get(e,n),i=t(r);return o.set(e,i),i}catch(r){return console.warn(`Storage update error for key "${e}":`,r),o.get(e,n)}},remove:e=>{try{return GM_deleteValue(e),!0}catch(t){return console.warn(`Storage remove error for key "${e}":`,t),!1}},has:e=>{try{return o.keys().includes(e)}catch(t){return console.warn(`Storage has error for key "${e}":`,t),!1}},keys:()=>{try{return GM_listValues()}catch(e){return console.warn("Storage keys error:",e),[]}},clear:(e=null)=>{try{return(e||o.keys()).forEach(n=>GM_deleteValue(n)),!0}catch(t){return console.warn("Storage clear error:",t),!1}},getMultiple:(e,t=null)=>{const n={};return e.forEach(r=>{n[r]=o.get(r,t)}),n},setMultiple:e=>{try{return Object.entries(e).forEach(([t,n])=>{GM_setValue(t,n)}),!0}catch(t){return console.warn("Storage setMultiple error:",t),!1}},removeMultiple:e=>{if(!Array.isArray(e)||e.length===0)return console.warn("Storage removeMultiple: keysToRemove must be a non-empty array"),!1;try{return e.forEach(t=>GM_deleteValue(t)),!0}catch(t){return console.warn("Storage removeMultiple error:",t),!1}},count:()=>{try{return o.keys().length}catch(e){return console.warn("Storage count error:",e),0}},getAll:()=>{try{const e=o.keys(),t={};return e.forEach(n=>{t[n]=GM_getValue(n)}),t}catch(e){return console.warn("Storage getAll error:",e),{}}},clearAll:(e=!1)=>{if(e!==!0)return console.warn("Storage clearAll: confirmClear must be explicitly set to true"),!1;try{return o.keys().forEach(n=>GM_deleteValue(n)),!0}catch(t){return console.warn("Storage clearAll error:",t),!1}},isEmpty:()=>{try{return o.keys().length===0}catch(e){return console.warn("Storage isEmpty error:",e),!0}}},f={PERMANENT:"kinozal_permanent_filter",MIN_SEEDS:"kinozal_min_seeds_filter"},m={getPermanent:()=>o.get(f.PERMANENT,""),setPermanent:e=>{const t=String(e||"").trim();o.set(f.PERMANENT,t)},clearPermanent:()=>o.remove(f.PERMANENT),hasPermanent:()=>!!m.getPermanent(),getMinSeeds:()=>o.get(f.MIN_SEEDS,0),setMinSeeds:e=>{const t=parseInt(e,10)||0;o.set(f.MIN_SEEDS,t)},clearMinSeeds:()=>o.remove(f.MIN_SEEDS),hasMinSeeds:()=>m.getMinSeeds()>0};function z(e){return e?e.toLowerCase().split(",").map(C).filter(Boolean):[]}function C(e){const t=e.split("/").map(r=>r.trim()).filter(Boolean);if(t.length===0)return null;const n=t.map(w).filter(Boolean);return n.length>0?n:null}function w(e){const t=e.startsWith("!"),n=t?e.slice(1).trim():e;return n?{term:n,isNegative:t}:null}function B(e,t){if(!t)return!0;const n=z(t);return _(e,n)}function _(e,t){if(!t||!t.length)return!0;const n=(e||"").toLowerCase();return t.every(r=>T(n,r))}function T(e,t){return t.some(({term:n,isNegative:r})=>{const i=e.includes(n);return r?!i:i})}let y=null,a=null;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",E):setTimeout(E,100);function E(){const e=document.querySelector("div.bx1_0");if(!e)return;const t=document.createElement("div");t.className="bx1_0",t.style.padding="3px 38px 3px 5px",t.style.marginBottom="7px",t.innerHTML=F,e.parentNode.insertBefore(t,e.nextSibling);const{minSizeInput:n,maxSizeInput:r,nameFilterInput:i,permanentFilterInput:s,minSeedsInput:l,resetButton:c}=S();if(s&&(s.value=m.getPermanent()),l){const u=m.getMinSeeds();l.value=u>0?u:""}const d=I(b,250);n&&n.addEventListener("input",d),r&&r.addEventListener("input",d),i&&i.addEventListener("input",d),s&&s.addEventListener("input",u=>{m.setPermanent(u.target.value),d()}),l&&l.addEventListener("input",u=>{m.setMinSeeds(u.target.value),d()}),c&&c.addEventListener("click",P),setTimeout(()=>{if(A(),a&&a.length>0){v(a.length,a.length);const u=s&&s.value,h=l&&l.value;(u||h)&&b()}},100)}function S(){return y||(y={minSizeInput:document.getElementById("filter-min-size"),maxSizeInput:document.getElementById("filter-max-size"),nameFilterInput:document.getElementById("filter-name"),permanentFilterInput:document.getElementById("filter-permanent"),minSeedsInput:document.getElementById("filter-min-seeds"),resetButton:document.getElementById("reset-filters"),counterText:document.getElementById("counter-text")},y)}function P(){const{minSizeInput:e,maxSizeInput:t,nameFilterInput:n,permanentFilterInput:r,minSeedsInput:i}=S();[e,t,n,r,i].forEach(l=>{l&&(l.value="")}),m.clearPermanent(),m.clearMinSeeds(),a&&(a.forEach(l=>{l.element.style.display=""}),v(a.length,a.length))}function A(){if(a)return;const t=document.querySelector(".t_peer")?.querySelectorAll("tbody tr:not(.mn)")||[];a=Array.from(t).map(n=>{const r=n.querySelector(".nam a");if(!r)return null;const i=r.textContent.trim(),s=G(n),l=L(s),c=N(n);return{element:n,title:i,fileSizeGB:l,seedsCount:c}}).filter(Boolean)}function v(e,t){const{counterText:n}=S();n&&(n.textContent=`\u041F\u043E\u043A\u0430\u0437\u0430\u043D\u043E ${e} \u0438\u0437 ${t} \u0440\u0430\u0437\u0434\u0430\u0447`)}function b(){const{minSizeInput:e,maxSizeInput:t,nameFilterInput:n,permanentFilterInput:r,minSeedsInput:i}=S(),s=e?.value?parseFloat(e.value):0,l=t?.value?parseFloat(t.value):1/0,c=n?.value||"",d=r?.value||"",u=i?.value?parseInt(i.value,10):0;if(!a)return;let h=0;const k=a.length;a.forEach(p=>{const R=O(p,s,l),$=V(p.title,c,d),K=q(p,u);R&&$&&K?(p.element.style.display="",h+=1):p.element.style.display="none"}),v(h,k)}function G(e){const t=e.querySelectorAll("td.s");if(t.length===0)return"";const n=Array.from(t).findLast(r=>/(МБ|ГБ|MB|GB)/i.test(r.textContent));return n?n.textContent.trim():""}function L(e){if(!e)return 0;const n=e.replace(/\s+/g," ").trim().match(/([\d,.]+)\s*(МБ|ГБ|MB|GB)/i);if(!n)return 0;const r=parseFloat(n[1].replace(",",".")),i=n[2].toUpperCase();return i==="\u041C\u0411"||i==="MB"?r/1024:r}function N(e){const t=e.querySelector("td.sl_s");if(!t)return 0;const n=t.textContent.trim(),r=parseInt(n,10);return Number.isNaN(r)?0:r}function O(e,t,n){return e.fileSizeGB>=t&&(n===0||e.fileSizeGB<=n)}function V(e,t,n){const r=[t,n].filter(i=>i&&i.trim()).join(",");return B(e,r)}function q(e,t){return e.seedsCount>=t}})();})();
