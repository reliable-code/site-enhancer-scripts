// ==UserScript==
// @name         4pda enhancer
// @description  Fixing links, cleaning UI, smart scrolling with notifications
// @grant        GM_addStyle
// @match        https://4pda.to/forum/index.php?showtopic=*
// @namespace    https://github.com/reliable-code/site-enhancer-scripts
// @version      1.0.78734393
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4pda.to
// @author       reliable-code
// @downloadURL  https://raw.githubusercontent.com/reliable-code/site-enhancer-scripts/main/specific/4pda.user.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/4pda/selectors.js"
/*!*******************************!*\
  !*** ./src/4pda/selectors.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SELECTORS: () => (/* binding */ SELECTORS)
/* harmony export */ });
const SELECTORS = {
  POST_LINKS: 'a[onclick*="link_to_post"]',
  BUTTON_ROWS: 'tr td[class*="formbuttonrow"]',
  POST_DETAILS_CENTER_BLOCK: ".postdetails > center",
  MSG_LINKS: 'td[id^="ph-"][id$="-d2"] div[style*="float:right"] a[href*="findpost"]',
  POST_TABLES: "table.ipbtable[data-post]",
  POST_SIGNATURE: ".signature",
  PAGE_LINK_MENU: ".pagelink-menu"
};


/***/ },

/***/ "./src/4pda/styles.css"
/*!*****************************!*\
  !*** ./src/4pda/styles.css ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("body>div:first-of-type{margin-bottom:160px!important}.user-avatar img{margin-bottom:5px}.forum-hidden{display:none!important}.forum-notification{position:fixed;bottom:10px;left:50%;transform:translate(-50%);padding:10px 40px;border-radius:6px;z-index:9999;font-size:13px;max-width:600px;width:fit-content;text-align:center;font-weight:500;box-shadow:0 2px 8px #0003;white-space:nowrap}.forum-notification-info{background:#000c;color:#fff;animation:fadeInOutInfo 2s forwards}.forum-notification-warning{background:#000c;color:#fff;animation:fadeInOutWarning 4s forwards}@keyframes fadeInOutInfo{0%{opacity:0;transform:translate(-50%) translateY(20px)}20%,80%{opacity:1;transform:translate(-50%) translateY(0)}to{opacity:0;transform:translate(-50%) translateY(-20px)}}@keyframes fadeInOutWarning{0%{opacity:0;transform:translate(-50%) translateY(20px)}15%,85%{opacity:1;transform:translate(-50%) translateY(0)}to{opacity:0;transform:translate(-50%) translateY(-20px)}}.normalname>a{display:inline-block;max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ipbtable>tbody{>tr:nth-child(2)>td{padding-bottom:10px;&:first-child{>br:last-child{display:none}}&:nth-child(2){>div{>div{>.edit,>br:has(+.edit){display:none}}>.signature,>br:has(+.signature){display:none}}}}>tr:nth-child(3){display:none}}#gfooter{margin-top:0}br:has(+#gfooter){display:none}.pagelink-menu-wrap--first{margin-bottom:5px}.pagelink-menu-wrap{.pagelink a,.pagelinklast a,.pagecurrent-wa,.pagelink-menu{padding:4px 8px!important;margin-right:2px!important;display:inline-block!important;font-size:13px!important;font-weight:700!important;border-radius:3px!important}.popupmenu{margin-top:7px;.popupmenu-category{padding:4px 8px;font-size:13px}.popupmenu-item-last{input[type=text]{font-size:13px;padding:4px 8px;width:70px}input[type=button]{font-size:13px;padding:4px 8px}}}}\n");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter/value functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			if(Array.isArray(definition)) {
/******/ 				var i = 0;
/******/ 				while(i < definition.length) {
/******/ 					var key = definition[i++];
/******/ 					var binding = definition[i++];
/******/ 					if(!__webpack_require__.o(exports, key)) {
/******/ 						if(binding === 0) {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, value: definition[i++] });
/******/ 						} else {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, get: binding });
/******/ 						}
/******/ 					} else if(binding === 0) { i++; }
/******/ 				}
/******/ 			} else {
/******/ 				for(var key in definition) {
/******/ 					if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/4pda/index.js ***!
  \***************************/
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.css */ "./src/4pda/styles.css");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./selectors */ "./src/4pda/selectors.js");


const SCROLL_MAX_ATTEMPTS = 5;
const SCROLL_RETRY_DELAY = 100;
const NOTIFICATION_TYPES = {
  INFO: {
    type: "info",
    icon: "\u2139\uFE0F",
    duration: 2e3
  },
  WARNING: {
    type: "warning",
    icon: "\u26A0\uFE0F",
    duration: 4e3
  }
};
function fixPostLinks() {
  const links = document.querySelectorAll(_selectors__WEBPACK_IMPORTED_MODULE_1__.SELECTORS.POST_LINKS);
  links.forEach((link) => {
    link.style.padding = "10px 2px";
    link.removeAttribute("onclick");
    const prevNode = link.previousSibling;
    if (prevNode && prevNode.nodeType === Node.TEXT_NODE) {
      link.insertBefore(prevNode, link.firstChild);
    }
  });
}
function cleanUserInfo() {
  const centerBlocks = document.querySelectorAll(_selectors__WEBPACK_IMPORTED_MODULE_1__.SELECTORS.POST_DETAILS_CENTER_BLOCK);
  centerBlocks.forEach((block) => {
    cleanCenterBlock(block);
    freezeAvatarGif(block);
  });
}
function cleanCenterBlock(centerBlock) {
  let prevNode = null;
  [...centerBlock.childNodes].forEach((node) => {
    if (shouldKeepCenterBlockNode(node, prevNode)) {
      prevNode = node;
    } else {
      node.remove();
    }
  });
}
function shouldKeepCenterBlockNode(node, prevNode) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    const { tagName } = node;
    if (tagName === "A" && node.classList.contains("user-avatar")) return true;
    if (tagName === "BR" && prevNode && prevNode.nodeName !== "BR") return true;
    if (tagName === "B" && prevNode?.nodeType === Node.TEXT_NODE && prevNode.textContent.trim().startsWith("\u0420\u0435\u043F\u0443\u0442\u0430\u0446\u0438\u044F")) return true;
    return false;
  }
  if (node.nodeType === Node.TEXT_NODE) {
    const allowedPatterns = ["\u0420\u0435\u043F\u0443\u0442\u0430\u0446\u0438\u044F", "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F", "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0439"];
    const text = node.textContent.trim();
    return allowedPatterns.some((pattern) => text.startsWith(pattern));
  }
  return false;
}
function freezeAvatarGif(centerBlock) {
  const img = centerBlock.querySelector('.user-avatar img[src$=".gif"]');
  if (!img || img.dataset.frozen) return;
  img.dataset.frozen = "1";
  const freeze = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.style.width = `${img.width}px`;
    canvas.style.height = `${img.height}px`;
    img.replaceWith(canvas);
  };
  if (img.complete) {
    freeze();
  } else {
    img.addEventListener("load", freeze, { once: true });
  }
}
function cleanPostContent() {
  document.querySelectorAll(_selectors__WEBPACK_IMPORTED_MODULE_1__.SELECTORS.POST_SIGNATURE).forEach(cleanSeparatorBeforeSignature);
}
function cleanSeparatorBeforeSignature(signature) {
  let node = signature.previousSibling;
  while (node) {
    const current = node;
    node = node.previousSibling;
    if (current.nodeType === Node.TEXT_NODE) {
      const text = current.textContent.trim();
      if (text === "" || /^-+$/.test(text)) {
        current.remove();
        continue;
      }
    }
    if (current.nodeType === Node.ELEMENT_NODE && current.tagName === "BR") {
      current.remove();
      continue;
    }
    break;
  }
}
function addPageLinkMenuWrapClass() {
  const pageLinkMenus = document.querySelectorAll(_selectors__WEBPACK_IMPORTED_MODULE_1__.SELECTORS.PAGE_LINK_MENU);
  if (!pageLinkMenus.length) return;
  pageLinkMenus.forEach((pageLinkMenu, index) => {
    const pageLinkMenuWrap = pageLinkMenu.parentElement;
    pageLinkMenuWrap.classList.add("pagelink-menu-wrap");
    if (index === 0) {
      pageLinkMenuWrap.classList.add("pagelink-menu-wrap--first");
    }
  });
}
function smartScrollIntoView(element, message, notificationType = NOTIFICATION_TYPES.INFO) {
  if (!element) return;
  const performScroll = () => {
    if (message) showNotification(message, notificationType);
    let attempts = 0;
    const checkAndScroll = () => {
      const rect = element.getBoundingClientRect();
      const inView = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (!inView && attempts < SCROLL_MAX_ATTEMPTS) {
        element.scrollIntoView({ block: "start" });
        attempts += 1;
        setTimeout(checkAndScroll, SCROLL_RETRY_DELAY);
      }
    };
    checkAndScroll();
  };
  if (document.hasFocus() && document.visibilityState === "visible") {
    performScroll();
  } else {
    waitForDocumentFocus(performScroll);
  }
}
function waitForDocumentFocus(callback) {
  const cleanup = () => {
    window.removeEventListener("focus", onFocus);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };
  const onFocus = () => {
    callback();
    cleanup();
  };
  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      onFocus();
    }
  };
  window.addEventListener("focus", onFocus);
  document.addEventListener("visibilitychange", onVisibilityChange);
}
function skipFaqIfNeeded() {
  if (isHashEntryOrSpoil()) return;
  const msgLinks = document.querySelectorAll(_selectors__WEBPACK_IMPORTED_MODULE_1__.SELECTORS.MSG_LINKS);
  if (msgLinks.length < 2) return;
  const postNumbers = Array.from(msgLinks, extractPostNumber).filter(Boolean);
  if (shouldSkipToSecondPost(postNumbers)) {
    const secondTable = msgLinks[1].closest(_selectors__WEBPACK_IMPORTED_MODULE_1__.SELECTORS.POST_TABLES);
    if (secondTable) {
      smartScrollIntoView(secondTable, "\u0417\u0430\u043A\u0440\u0435\u043F\u043B\u0451\u043D\u043D\u044B\u0439 \u043F\u043E\u0441\u0442 \u043F\u0440\u043E\u043F\u0443\u0449\u0435\u043D", NOTIFICATION_TYPES.INFO);
    }
  }
}
function shouldSkipToSecondPost(postNumbers) {
  return postNumbers.length >= 2 && postNumbers[0] === 1 && postNumbers[1] > 2;
}
function extractPostNumber(link) {
  const match = link.textContent.trim().match(/#(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}
function isHashEntryOrSpoil() {
  const { hash } = window.location;
  return hash.startsWith("#entry") || hash.startsWith("#Spoil");
}
function handleMissingEntry() {
  const targetId = extractTargetIdFromHash();
  if (!targetId) return;
  const exactPost = document.querySelector(`${_selectors__WEBPACK_IMPORTED_MODULE_1__.SELECTORS.POST_TABLES}[data-post="${targetId}"]`);
  if (exactPost) {
    smartScrollIntoView(exactPost);
    return;
  }
  const nearestPostInfo = findNearestPost(targetId);
  if (nearestPostInfo) {
    scrollToNearestPost(nearestPostInfo, targetId);
  }
}
function extractTargetIdFromHash() {
  const match = window.location.hash.match(/^#entry(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}
function findNearestPost(targetId) {
  const postIds = getPostIds();
  if (postIds.length === 0) return null;
  const nearestId = findNearestPostId(postIds, targetId);
  if (!nearestId) return null;
  const direction = nearestId > targetId ? "\u043D\u0438\u0436\u0435" : "\u0432\u044B\u0448\u0435";
  const table = document.querySelector(`${_selectors__WEBPACK_IMPORTED_MODULE_1__.SELECTORS.POST_TABLES}[data-post="${nearestId}"]`);
  return { id: nearestId, direction, table };
}
function getPostIds() {
  const postTables = document.querySelectorAll(_selectors__WEBPACK_IMPORTED_MODULE_1__.SELECTORS.POST_TABLES);
  return [...postTables].map((table) => parseInt(table.dataset.post, 10)).filter(Boolean).sort((a, b) => a - b);
}
function findNearestPostId(postIds, targetId) {
  return postIds.find((id) => id > targetId) ?? postIds.findLast((id) => id < targetId);
}
function scrollToNearestPost(postInfo, targetId) {
  const message = `\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 #${targetId} \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E, \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u043E \u0431\u043B\u0438\u0436\u0430\u0439\u0448\u0435\u0435 ${postInfo.direction} \u2013 #${postInfo.id}`;
  smartScrollIntoView(postInfo.table, message, NOTIFICATION_TYPES.WARNING);
}
function showNotification(text, notificationConfig = NOTIFICATION_TYPES.INFO) {
  const notification = document.createElement("div");
  notification.textContent = `${notificationConfig.icon} ${text}`;
  notification.className = `forum-notification forum-notification-${notificationConfig.type}`;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), notificationConfig.duration);
}
function init() {
  GM_addStyle(_styles_css__WEBPACK_IMPORTED_MODULE_0__["default"]);
  fixPostLinks();
  cleanUserInfo();
  cleanPostContent();
  addPageLinkMenuWrapClass();
  skipFaqIfNeeded();
  handleMissingEntry();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LFlBQVk7QUFFdEMsYUFBVyxNQUFNLGFBQWEsT0FBTyxHQUFHLG1CQUFtQixRQUFRO0FBQ3ZFO0FBR0EsU0FBUyxPQUFPO0FBQ1osY0FBWSxtREFBTTtBQUNsQixlQUFhO0FBQ2IsZ0JBQWM7QUFDZCxtQkFBaUI7QUFDakIsMkJBQXlCO0FBQ3pCLGtCQUFnQjtBQUNoQixxQkFBbUI7QUFDdkI7QUFHQSxJQUFJLFNBQVMsZUFBZSxXQUFXO0FBQ25DLFdBQVMsaUJBQWlCLG9CQUFvQixJQUFJO0FBQ3RELE9BQU87QUFDSCxPQUFLO0FBQ1QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvNHBkYS9zZWxlY3RvcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjLzRwZGEvc3R5bGVzLmNzcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vLi9zcmMvNHBkYS9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgU0VMRUNUT1JTID0ge1xuICAgIFBPU1RfTElOS1M6ICdhW29uY2xpY2sqPVwibGlua190b19wb3N0XCJdJyxcbiAgICBCVVRUT05fUk9XUzogJ3RyIHRkW2NsYXNzKj1cImZvcm1idXR0b25yb3dcIl0nLFxuICAgIFBPU1RfREVUQUlMU19DRU5URVJfQkxPQ0s6ICcucG9zdGRldGFpbHMgPiBjZW50ZXInLFxuICAgIE1TR19MSU5LUzogJ3RkW2lkXj1cInBoLVwiXVtpZCQ9XCItZDJcIl0gZGl2W3N0eWxlKj1cImZsb2F0OnJpZ2h0XCJdIGFbaHJlZio9XCJmaW5kcG9zdFwiXScsXG4gICAgUE9TVF9UQUJMRVM6ICd0YWJsZS5pcGJ0YWJsZVtkYXRhLXBvc3RdJyxcbiAgICBQT1NUX1NJR05BVFVSRTogJy5zaWduYXR1cmUnLFxuICAgIFBBR0VfTElOS19NRU5VOiAnLnBhZ2VsaW5rLW1lbnUnLFxufTtcbiIsImV4cG9ydCBkZWZhdWx0IFwiYm9keT5kaXY6Zmlyc3Qtb2YtdHlwZXttYXJnaW4tYm90dG9tOjE2MHB4IWltcG9ydGFudH0udXNlci1hdmF0YXIgaW1ne21hcmdpbi1ib3R0b206NXB4fS5mb3J1bS1oaWRkZW57ZGlzcGxheTpub25lIWltcG9ydGFudH0uZm9ydW0tbm90aWZpY2F0aW9ue3Bvc2l0aW9uOmZpeGVkO2JvdHRvbToxMHB4O2xlZnQ6NTAlO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSk7cGFkZGluZzoxMHB4IDQwcHg7Ym9yZGVyLXJhZGl1czo2cHg7ei1pbmRleDo5OTk5O2ZvbnQtc2l6ZToxM3B4O21heC13aWR0aDo2MDBweDt3aWR0aDpmaXQtY29udGVudDt0ZXh0LWFsaWduOmNlbnRlcjtmb250LXdlaWdodDo1MDA7Ym94LXNoYWRvdzowIDJweCA4cHggIzAwMDM7d2hpdGUtc3BhY2U6bm93cmFwfS5mb3J1bS1ub3RpZmljYXRpb24taW5mb3tiYWNrZ3JvdW5kOiMwMDBjO2NvbG9yOiNmZmY7YW5pbWF0aW9uOmZhZGVJbk91dEluZm8gMnMgZm9yd2FyZHN9LmZvcnVtLW5vdGlmaWNhdGlvbi13YXJuaW5ne2JhY2tncm91bmQ6IzAwMGM7Y29sb3I6I2ZmZjthbmltYXRpb246ZmFkZUluT3V0V2FybmluZyA0cyBmb3J3YXJkc31Aa2V5ZnJhbWVzIGZhZGVJbk91dEluZm97MCV7b3BhY2l0eTowO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSkgdHJhbnNsYXRlWSgyMHB4KX0yMCUsODAle29wYWNpdHk6MTt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUpIHRyYW5zbGF0ZVkoMCl9dG97b3BhY2l0eTowO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSkgdHJhbnNsYXRlWSgtMjBweCl9fUBrZXlmcmFtZXMgZmFkZUluT3V0V2FybmluZ3swJXtvcGFjaXR5OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlKSB0cmFuc2xhdGVZKDIwcHgpfTE1JSw4NSV7b3BhY2l0eToxO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSkgdHJhbnNsYXRlWSgwKX10b3tvcGFjaXR5OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlKSB0cmFuc2xhdGVZKC0yMHB4KX19Lm5vcm1hbG5hbWU+YXtkaXNwbGF5OmlubGluZS1ibG9jazttYXgtd2lkdGg6MTUwcHg7d2hpdGUtc3BhY2U6bm93cmFwO292ZXJmbG93OmhpZGRlbjt0ZXh0LW92ZXJmbG93OmVsbGlwc2lzfS5pcGJ0YWJsZT50Ym9keXs+dHI6bnRoLWNoaWxkKDIpPnRke3BhZGRpbmctYm90dG9tOjEwcHg7JjpmaXJzdC1jaGlsZHs+YnI6bGFzdC1jaGlsZHtkaXNwbGF5Om5vbmV9fSY6bnRoLWNoaWxkKDIpez5kaXZ7PmRpdns+LmVkaXQsPmJyOmhhcygrLmVkaXQpe2Rpc3BsYXk6bm9uZX19Pi5zaWduYXR1cmUsPmJyOmhhcygrLnNpZ25hdHVyZSl7ZGlzcGxheTpub25lfX19fT50cjpudGgtY2hpbGQoMyl7ZGlzcGxheTpub25lfX0jZ2Zvb3RlcnttYXJnaW4tdG9wOjB9YnI6aGFzKCsjZ2Zvb3Rlcil7ZGlzcGxheTpub25lfS5wYWdlbGluay1tZW51LXdyYXAtLWZpcnN0e21hcmdpbi1ib3R0b206NXB4fS5wYWdlbGluay1tZW51LXdyYXB7LnBhZ2VsaW5rIGEsLnBhZ2VsaW5rbGFzdCBhLC5wYWdlY3VycmVudC13YSwucGFnZWxpbmstbWVudXtwYWRkaW5nOjRweCA4cHghaW1wb3J0YW50O21hcmdpbi1yaWdodDoycHghaW1wb3J0YW50O2Rpc3BsYXk6aW5saW5lLWJsb2NrIWltcG9ydGFudDtmb250LXNpemU6MTNweCFpbXBvcnRhbnQ7Zm9udC13ZWlnaHQ6NzAwIWltcG9ydGFudDtib3JkZXItcmFkaXVzOjNweCFpbXBvcnRhbnR9LnBvcHVwbWVudXttYXJnaW4tdG9wOjdweDsucG9wdXBtZW51LWNhdGVnb3J5e3BhZGRpbmc6NHB4IDhweDtmb250LXNpemU6MTNweH0ucG9wdXBtZW51LWl0ZW0tbGFzdHtpbnB1dFt0eXBlPXRleHRde2ZvbnQtc2l6ZToxM3B4O3BhZGRpbmc6NHB4IDhweDt3aWR0aDo3MHB4fWlucHV0W3R5cGU9YnV0dG9uXXtmb250LXNpemU6MTNweDtwYWRkaW5nOjRweCA4cHh9fX19XFxuXCI7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxuY29uc3QgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRjb25zdCBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0Y29uc3QgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdGNvbnN0IGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyL3ZhbHVlIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRpZihBcnJheS5pc0FycmF5KGRlZmluaXRpb24pKSB7XG5cdFx0dmFyIGkgPSAwO1xuXHRcdHdoaWxlKGkgPCBkZWZpbml0aW9uLmxlbmd0aCkge1xuXHRcdFx0dmFyIGtleSA9IGRlZmluaXRpb25baSsrXTtcblx0XHRcdHZhciBiaW5kaW5nID0gZGVmaW5pdGlvbltpKytdO1xuXHRcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRcdGlmKGJpbmRpbmcgPT09IDApIHtcblx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiBkZWZpbml0aW9uW2krK10gfSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGJpbmRpbmcgfSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZihiaW5kaW5nID09PSAwKSB7IGkrKzsgfVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsImltcG9ydCBzdHlsZXMgZnJvbSAnLi9zdHlsZXMuY3NzJztcbmltcG9ydCB7IFNFTEVDVE9SUyB9IGZyb20gJy4vc2VsZWN0b3JzJztcblxuY29uc3QgU0NST0xMX01BWF9BVFRFTVBUUyA9IDU7XG5jb25zdCBTQ1JPTExfUkVUUllfREVMQVkgPSAxMDA7XG5cbi8vINCa0L7QvdGE0LjQs9GD0YDQsNGG0LjRjyDRgtC40L/QvtCyINGD0LLQtdC00L7QvNC70LXQvdC40LlcbmNvbnN0IE5PVElGSUNBVElPTl9UWVBFUyA9IHtcbiAgICBJTkZPOiB7XG4gICAgICAgIHR5cGU6ICdpbmZvJyxcbiAgICAgICAgaWNvbjogJ+KEue+4jycsXG4gICAgICAgIGR1cmF0aW9uOiAyMDAwLFxuICAgIH0sXG4gICAgV0FSTklORzoge1xuICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgIGljb246ICfimqDvuI8nLFxuICAgICAgICBkdXJhdGlvbjogNDAwMCxcbiAgICB9LFxufTtcblxuLy8g0KPQtNCw0LvRj9C10YIgb25jbGljayDQsNGC0YDQuNCx0YPRgtGLINGBINGB0YHRi9C70L7QuiDQvdCwINC/0L7RgdGC0YtcbmZ1bmN0aW9uIGZpeFBvc3RMaW5rcygpIHtcbiAgICBjb25zdCBsaW5rcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1JTLlBPU1RfTElOS1MpO1xuICAgIGxpbmtzLmZvckVhY2goKGxpbmspID0+IHtcbiAgICAgICAgbGluay5zdHlsZS5wYWRkaW5nID0gJzEwcHggMnB4JztcblxuICAgICAgICBsaW5rLnJlbW92ZUF0dHJpYnV0ZSgnb25jbGljaycpO1xuXG4gICAgICAgIGNvbnN0IHByZXZOb2RlID0gbGluay5wcmV2aW91c1NpYmxpbmc7XG4gICAgICAgIGlmIChwcmV2Tm9kZSAmJiBwcmV2Tm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgICAgICAgIGxpbmsuaW5zZXJ0QmVmb3JlKHByZXZOb2RlLCBsaW5rLmZpcnN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8vINCe0YfQuNGJ0LDQtdGCINC40L3RhNC+0YDQvNCw0YbQuNGOINC+INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRj9GFXG5mdW5jdGlvbiBjbGVhblVzZXJJbmZvKCkge1xuICAgIGNvbnN0IGNlbnRlckJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1JTLlBPU1RfREVUQUlMU19DRU5URVJfQkxPQ0spO1xuICAgIGNlbnRlckJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT4ge1xuICAgICAgICBjbGVhbkNlbnRlckJsb2NrKGJsb2NrKTtcbiAgICAgICAgZnJlZXplQXZhdGFyR2lmKGJsb2NrKTtcbiAgICB9KTtcbn1cblxuLy8g0J7Rh9C40YnQsNC10YIg0YbQtdC90YLRgNCw0LvRjNC90YvQuSDQsdC70L7QulxuZnVuY3Rpb24gY2xlYW5DZW50ZXJCbG9jayhjZW50ZXJCbG9jaykge1xuICAgIGxldCBwcmV2Tm9kZSA9IG51bGw7XG5cbiAgICBbLi4uY2VudGVyQmxvY2suY2hpbGROb2Rlc10uZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICBpZiAoc2hvdWxkS2VlcENlbnRlckJsb2NrTm9kZShub2RlLCBwcmV2Tm9kZSkpIHtcbiAgICAgICAgICAgIHByZXZOb2RlID0gbm9kZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLy8g0J7Qv9GA0LXQtNC10LvRj9C10YIsINC90YPQttC90L4g0LvQuCDRgdC+0YXRgNCw0L3QuNGC0Ywg0YPQt9C10LtcbmZ1bmN0aW9uIHNob3VsZEtlZXBDZW50ZXJCbG9ja05vZGUobm9kZSwgcHJldk5vZGUpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgY29uc3QgeyB0YWdOYW1lIH0gPSBub2RlO1xuICAgICAgICBpZiAodGFnTmFtZSA9PT0gJ0EnICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCd1c2VyLWF2YXRhcicpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgaWYgKHRhZ05hbWUgPT09ICdCUicgJiYgcHJldk5vZGUgJiYgcHJldk5vZGUubm9kZU5hbWUgIT09ICdCUicpIHJldHVybiB0cnVlO1xuICAgICAgICBpZiAodGFnTmFtZSA9PT0gJ0InICYmIHByZXZOb2RlPy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiZcbiAgICAgICAgICAgIHByZXZOb2RlLnRleHRDb250ZW50LnRyaW0oKS5zdGFydHNXaXRoKCfQoNC10L/Rg9GC0LDRhtC40Y8nKSkgcmV0dXJuIHRydWU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgICAgY29uc3QgYWxsb3dlZFBhdHRlcm5zID0gWyfQoNC10L/Rg9GC0LDRhtC40Y8nLCAn0KDQtdCz0LjRgdGC0YDQsNGG0LjRjycsICfQodC+0L7QsdGJ0LXQvdC40LknXTtcbiAgICAgICAgY29uc3QgdGV4dCA9IG5vZGUudGV4dENvbnRlbnQudHJpbSgpO1xuICAgICAgICByZXR1cm4gYWxsb3dlZFBhdHRlcm5zLnNvbWUoKHBhdHRlcm4pID0+IHRleHQuc3RhcnRzV2l0aChwYXR0ZXJuKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyDQl9Cw0LzQvtGA0LDQttC40LLQsNC10YIgZ2lmLdCw0LLQsNGC0LDRgNC60YMg0L3QsCDQv9C10YDQstC+0LxcbmZ1bmN0aW9uIGZyZWV6ZUF2YXRhckdpZihjZW50ZXJCbG9jaykge1xuICAgIGNvbnN0IGltZyA9IGNlbnRlckJsb2NrLnF1ZXJ5U2VsZWN0b3IoJy51c2VyLWF2YXRhciBpbWdbc3JjJD1cIi5naWZcIl0nKTtcbiAgICBpZiAoIWltZyB8fCBpbWcuZGF0YXNldC5mcm96ZW4pIHJldHVybjtcbiAgICBpbWcuZGF0YXNldC5mcm96ZW4gPSAnMSc7XG5cbiAgICBjb25zdCBmcmVlemUgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICBjYW52YXMud2lkdGggPSBpbWcubmF0dXJhbFdpZHRoIHx8IGltZy53aWR0aDtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGltZy5uYXR1cmFsSGVpZ2h0IHx8IGltZy5oZWlnaHQ7XG5cbiAgICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXG4gICAgICAgIGNhbnZhcy5zdHlsZS53aWR0aCA9IGAke2ltZy53aWR0aH1weGA7XG4gICAgICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBgJHtpbWcuaGVpZ2h0fXB4YDtcblxuICAgICAgICBpbWcucmVwbGFjZVdpdGgoY2FudmFzKTtcbiAgICB9O1xuXG4gICAgaWYgKGltZy5jb21wbGV0ZSkge1xuICAgICAgICBmcmVlemUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZyZWV6ZSwgeyBvbmNlOiB0cnVlIH0pO1xuICAgIH1cbn1cblxuLy8g0KPQtNCw0LvRj9C10YIg0L/QvtC00L/QuNGB0Lgg0Lgg0LHQu9C+0LrQuCDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC40Lcg0L/QvtGB0YLQvtCyXG5mdW5jdGlvbiBjbGVhblBvc3RDb250ZW50KCkge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1JTLlBPU1RfU0lHTkFUVVJFKS5mb3JFYWNoKGNsZWFuU2VwYXJhdG9yQmVmb3JlU2lnbmF0dXJlKTtcbn1cblxuLy8g0KPQtNCw0LvRj9C10YIgPGJyPiDQuCDRh9C10YDRgtC+0YfQutC4INC/0LXRgNC10LQg0L/QvtC00L/QuNGB0YzRjlxuZnVuY3Rpb24gY2xlYW5TZXBhcmF0b3JCZWZvcmVTaWduYXR1cmUoc2lnbmF0dXJlKSB7XG4gICAgbGV0IG5vZGUgPSBzaWduYXR1cmUucHJldmlvdXNTaWJsaW5nO1xuXG4gICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgICAgY29uc3QgY3VycmVudCA9IG5vZGU7XG4gICAgICAgIG5vZGUgPSBub2RlLnByZXZpb3VzU2libGluZztcblxuICAgICAgICBpZiAoY3VycmVudC5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSBjdXJyZW50LnRleHRDb250ZW50LnRyaW0oKTtcbiAgICAgICAgICAgIGlmICh0ZXh0ID09PSAnJyB8fCAvXi0rJC8udGVzdCh0ZXh0KSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VycmVudC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiYgY3VycmVudC50YWdOYW1lID09PSAnQlInKSB7XG4gICAgICAgICAgICBjdXJyZW50LnJlbW92ZSgpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICB9XG59XG5cbi8vINCU0L7QsdCw0LLQu9GP0LXRgiDQutC70LDRgdGBINC6INC+0LHQtdGA0YLQutC1INC/0LDQs9C40L3QsNGG0LjQuCDRgdGC0YDQsNC90LjRhlxuZnVuY3Rpb24gYWRkUGFnZUxpbmtNZW51V3JhcENsYXNzKCkge1xuICAgIGNvbnN0IHBhZ2VMaW5rTWVudXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SUy5QQUdFX0xJTktfTUVOVSk7XG4gICAgaWYgKCFwYWdlTGlua01lbnVzLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgcGFnZUxpbmtNZW51cy5mb3JFYWNoKChwYWdlTGlua01lbnUsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHBhZ2VMaW5rTWVudVdyYXAgPSBwYWdlTGlua01lbnUucGFyZW50RWxlbWVudDtcbiAgICAgICAgcGFnZUxpbmtNZW51V3JhcC5jbGFzc0xpc3QuYWRkKCdwYWdlbGluay1tZW51LXdyYXAnKTtcblxuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIHBhZ2VMaW5rTWVudVdyYXAuY2xhc3NMaXN0LmFkZCgncGFnZWxpbmstbWVudS13cmFwLS1maXJzdCcpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8vINCj0LzQvdCw0Y8g0L/RgNC+0LrRgNGD0YLQutCwINGBINC/0L7QstGC0L7RgNC10L3QuNC10Lwg0Lgg0YPQstC10LTQvtC80LvQtdC90LjQtdC8XG5mdW5jdGlvbiBzbWFydFNjcm9sbEludG9WaWV3KGVsZW1lbnQsIG1lc3NhZ2UsIG5vdGlmaWNhdGlvblR5cGUgPSBOT1RJRklDQVRJT05fVFlQRVMuSU5GTykge1xuICAgIGlmICghZWxlbWVudCkgcmV0dXJuO1xuXG4gICAgY29uc3QgcGVyZm9ybVNjcm9sbCA9ICgpID0+IHtcbiAgICAgICAgaWYgKG1lc3NhZ2UpIHNob3dOb3RpZmljYXRpb24obWVzc2FnZSwgbm90aWZpY2F0aW9uVHlwZSk7XG4gICAgICAgIGxldCBhdHRlbXB0cyA9IDA7XG5cbiAgICAgICAgY29uc3QgY2hlY2tBbmRTY3JvbGwgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGNvbnN0IGluVmlldyA9IHJlY3QudG9wID49IDAgJiYgcmVjdC5ib3R0b20gPD0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgICAgICAgICBpZiAoIWluVmlldyAmJiBhdHRlbXB0cyA8IFNDUk9MTF9NQVhfQVRURU1QVFMpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNjcm9sbEludG9WaWV3KHsgYmxvY2s6ICdzdGFydCcgfSk7XG4gICAgICAgICAgICAgICAgYXR0ZW1wdHMgKz0gMTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGNoZWNrQW5kU2Nyb2xsLCBTQ1JPTExfUkVUUllfREVMQVkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNoZWNrQW5kU2Nyb2xsKCk7XG4gICAgfTtcblxuICAgIGlmIChkb2N1bWVudC5oYXNGb2N1cygpICYmIGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ3Zpc2libGUnKSB7XG4gICAgICAgIHBlcmZvcm1TY3JvbGwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB3YWl0Rm9yRG9jdW1lbnRGb2N1cyhwZXJmb3JtU2Nyb2xsKTtcbiAgICB9XG59XG5cbi8vINCe0LbQuNC00LDQtdGCINGE0L7QutGD0YHQsCDQvdCwINC00L7QutGD0LzQtdC90YLQtVxuZnVuY3Rpb24gd2FpdEZvckRvY3VtZW50Rm9jdXMoY2FsbGJhY2spIHtcbiAgICBjb25zdCBjbGVhbnVwID0gKCkgPT4ge1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBvbkZvY3VzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11c2UtYmVmb3JlLWRlZmluZVxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgb25WaXNpYmlsaXR5Q2hhbmdlKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11c2UtYmVmb3JlLWRlZmluZVxuICAgIH07XG5cbiAgICBjb25zdCBvbkZvY3VzID0gKCkgPT4ge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICBjbGVhbnVwKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IG9uVmlzaWJpbGl0eUNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ3Zpc2libGUnKSB7XG4gICAgICAgICAgICBvbkZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgb25Gb2N1cyk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIG9uVmlzaWJpbGl0eUNoYW5nZSk7XG59XG5cbi8vINCf0YDQvtC/0YPRgdC60LDQtdGCIEZBUSDQtdGB0LvQuCDQvdC10L7QsdGF0L7QtNC40LzQvlxuZnVuY3Rpb24gc2tpcEZhcUlmTmVlZGVkKCkge1xuICAgIGlmIChpc0hhc2hFbnRyeU9yU3BvaWwoKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgbXNnTGlua3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SUy5NU0dfTElOS1MpO1xuICAgIGlmIChtc2dMaW5rcy5sZW5ndGggPCAyKSByZXR1cm47XG5cbiAgICBjb25zdCBwb3N0TnVtYmVycyA9IEFycmF5LmZyb20obXNnTGlua3MsIGV4dHJhY3RQb3N0TnVtYmVyKS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICBpZiAoc2hvdWxkU2tpcFRvU2Vjb25kUG9zdChwb3N0TnVtYmVycykpIHtcbiAgICAgICAgY29uc3Qgc2Vjb25kVGFibGUgPSBtc2dMaW5rc1sxXS5jbG9zZXN0KFNFTEVDVE9SUy5QT1NUX1RBQkxFUyk7XG4gICAgICAgIGlmIChzZWNvbmRUYWJsZSkge1xuICAgICAgICAgICAgc21hcnRTY3JvbGxJbnRvVmlldyhzZWNvbmRUYWJsZSwgJ9CX0LDQutGA0LXQv9C70ZHQvdC90YvQuSDQv9C+0YHRgiDQv9GA0L7Qv9GD0YnQtdC9JywgTk9USUZJQ0FUSU9OX1RZUEVTLklORk8pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyDQn9GA0L7QstC10YDRj9C10YIsINC90YPQttC90L4g0LvQuCDQv9GA0L7Qv9GD0YHRgtC40YLRjCDQuiDQstGC0L7RgNC+0LzRgyDQv9C+0YHRgtGDXG5mdW5jdGlvbiBzaG91bGRTa2lwVG9TZWNvbmRQb3N0KHBvc3ROdW1iZXJzKSB7XG4gICAgcmV0dXJuIHBvc3ROdW1iZXJzLmxlbmd0aCA+PSAyICYmIHBvc3ROdW1iZXJzWzBdID09PSAxICYmIHBvc3ROdW1iZXJzWzFdID4gMjtcbn1cblxuLy8g0JjQt9Cy0LvQtdC60LDQtdGCINC90L7QvNC10YAg0L/QvtGB0YLQsCDQuNC3INGB0YHRi9C70LrQuFxuZnVuY3Rpb24gZXh0cmFjdFBvc3ROdW1iZXIobGluaykge1xuICAgIGNvbnN0IG1hdGNoID0gbGluay50ZXh0Q29udGVudC50cmltKCkubWF0Y2goLyMoXFxkKykvKTtcbiAgICByZXR1cm4gbWF0Y2ggPyBwYXJzZUludChtYXRjaFsxXSwgMTApIDogbnVsbDtcbn1cblxuLy8g0J/RgNC+0LLQtdGA0Y/QtdGCLCDRj9Cy0LvRj9C10YLRgdGPINC70Lgg0YXQtdGIIGVudHJ5INC40LvQuCBzcG9pbFxuZnVuY3Rpb24gaXNIYXNoRW50cnlPclNwb2lsKCkge1xuICAgIGNvbnN0IHsgaGFzaCB9ID0gd2luZG93LmxvY2F0aW9uO1xuICAgIHJldHVybiBoYXNoLnN0YXJ0c1dpdGgoJyNlbnRyeScpIHx8IGhhc2guc3RhcnRzV2l0aCgnI1Nwb2lsJyk7XG59XG5cbi8vINCe0LHRgNCw0LHQsNGC0YvQstCw0LXRgiDQvtGC0YHRg9GC0YHRgtCy0YPRjtGJ0LjQtSDQt9Cw0L/QuNGB0LhcbmZ1bmN0aW9uIGhhbmRsZU1pc3NpbmdFbnRyeSgpIHtcbiAgICBjb25zdCB0YXJnZXRJZCA9IGV4dHJhY3RUYXJnZXRJZEZyb21IYXNoKCk7XG4gICAgaWYgKCF0YXJnZXRJZCkgcmV0dXJuO1xuXG4gICAgY29uc3QgZXhhY3RQb3N0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHtTRUxFQ1RPUlMuUE9TVF9UQUJMRVN9W2RhdGEtcG9zdD1cIiR7dGFyZ2V0SWR9XCJdYCk7XG4gICAgaWYgKGV4YWN0UG9zdCkge1xuICAgICAgICBzbWFydFNjcm9sbEludG9WaWV3KGV4YWN0UG9zdCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZWFyZXN0UG9zdEluZm8gPSBmaW5kTmVhcmVzdFBvc3QodGFyZ2V0SWQpO1xuICAgIGlmIChuZWFyZXN0UG9zdEluZm8pIHtcbiAgICAgICAgc2Nyb2xsVG9OZWFyZXN0UG9zdChuZWFyZXN0UG9zdEluZm8sIHRhcmdldElkKTtcbiAgICB9XG59XG5cbi8vINCY0LfQstC70LXQutCw0LXRgiBJRCDRhtC10LvQuCDQuNC3INGF0LXRiNCwIFVSTFxuZnVuY3Rpb24gZXh0cmFjdFRhcmdldElkRnJvbUhhc2goKSB7XG4gICAgY29uc3QgbWF0Y2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5tYXRjaCgvXiNlbnRyeShcXGQrKSQvKTtcbiAgICByZXR1cm4gbWF0Y2ggPyBwYXJzZUludChtYXRjaFsxXSwgMTApIDogbnVsbDtcbn1cblxuLy8g0J3QsNGF0L7QtNC40YIg0LHQu9C40LbQsNC50YjQuNC5INC/0L7RgdGCXG5mdW5jdGlvbiBmaW5kTmVhcmVzdFBvc3QodGFyZ2V0SWQpIHtcbiAgICBjb25zdCBwb3N0SWRzID0gZ2V0UG9zdElkcygpO1xuICAgIGlmIChwb3N0SWRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBuZWFyZXN0SWQgPSBmaW5kTmVhcmVzdFBvc3RJZChwb3N0SWRzLCB0YXJnZXRJZCk7XG4gICAgaWYgKCFuZWFyZXN0SWQpIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgZGlyZWN0aW9uID0gbmVhcmVzdElkID4gdGFyZ2V0SWQgPyAn0L3QuNC20LUnIDogJ9Cy0YvRiNC1JztcbiAgICBjb25zdCB0YWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7U0VMRUNUT1JTLlBPU1RfVEFCTEVTfVtkYXRhLXBvc3Q9XCIke25lYXJlc3RJZH1cIl1gKTtcblxuICAgIHJldHVybiB7IGlkOiBuZWFyZXN0SWQsIGRpcmVjdGlvbiwgdGFibGUgfTtcbn1cblxuZnVuY3Rpb24gZ2V0UG9zdElkcygpIHtcbiAgICBjb25zdCBwb3N0VGFibGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUlMuUE9TVF9UQUJMRVMpO1xuICAgIHJldHVybiBbLi4ucG9zdFRhYmxlc11cbiAgICAgICAgLm1hcCgodGFibGUpID0+IHBhcnNlSW50KHRhYmxlLmRhdGFzZXQucG9zdCwgMTApKVxuICAgICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG59XG5cbmZ1bmN0aW9uIGZpbmROZWFyZXN0UG9zdElkKHBvc3RJZHMsIHRhcmdldElkKSB7XG4gICAgcmV0dXJuIHBvc3RJZHMuZmluZCgoaWQpID0+IGlkID4gdGFyZ2V0SWQpID8/IHBvc3RJZHMuZmluZExhc3QoKGlkKSA9PiBpZCA8IHRhcmdldElkKTtcbn1cblxuLy8g0J/RgNC+0LrRgNGD0YfQuNCy0LDQtdGCINC6INCx0LvQuNC20LDQudGI0LXQvNGDINC/0L7RgdGC0YNcbmZ1bmN0aW9uIHNjcm9sbFRvTmVhcmVzdFBvc3QocG9zdEluZm8sIHRhcmdldElkKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IGDQodC+0L7QsdGJ0LXQvdC40LUgIyR7dGFyZ2V0SWR9INC90LUg0L3QsNC50LTQtdC90L4sINC/0L7QutCw0LfQsNC90L4g0LHQu9C40LbQsNC50YjQtdC1ICR7cG9zdEluZm8uZGlyZWN0aW9ufSDigJMgIyR7cG9zdEluZm8uaWR9YDtcbiAgICBzbWFydFNjcm9sbEludG9WaWV3KHBvc3RJbmZvLnRhYmxlLCBtZXNzYWdlLCBOT1RJRklDQVRJT05fVFlQRVMuV0FSTklORyk7XG59XG5cbi8vINCf0L7QutCw0LfRi9Cy0LDQtdGCINGD0LLQtdC00L7QvNC70LXQvdC40LVcbmZ1bmN0aW9uIHNob3dOb3RpZmljYXRpb24odGV4dCwgbm90aWZpY2F0aW9uQ29uZmlnID0gTk9USUZJQ0FUSU9OX1RZUEVTLklORk8pIHtcbiAgICBjb25zdCBub3RpZmljYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBub3RpZmljYXRpb24udGV4dENvbnRlbnQgPSBgJHtub3RpZmljYXRpb25Db25maWcuaWNvbn0gJHt0ZXh0fWA7XG4gICAgbm90aWZpY2F0aW9uLmNsYXNzTmFtZSA9IGBmb3J1bS1ub3RpZmljYXRpb24gZm9ydW0tbm90aWZpY2F0aW9uLSR7bm90aWZpY2F0aW9uQ29uZmlnLnR5cGV9YDtcblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobm90aWZpY2F0aW9uKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4gbm90aWZpY2F0aW9uLnJlbW92ZSgpLCBub3RpZmljYXRpb25Db25maWcuZHVyYXRpb24pO1xufVxuXG4vLyDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdC60YDQuNC/0YLQsFxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBHTV9hZGRTdHlsZShzdHlsZXMpO1xuICAgIGZpeFBvc3RMaW5rcygpO1xuICAgIGNsZWFuVXNlckluZm8oKTtcbiAgICBjbGVhblBvc3RDb250ZW50KCk7XG4gICAgYWRkUGFnZUxpbmtNZW51V3JhcENsYXNzKCk7XG4gICAgc2tpcEZhcUlmTmVlZGVkKCk7XG4gICAgaGFuZGxlTWlzc2luZ0VudHJ5KCk7XG59XG5cbi8vINCX0LDQv9GD0YHQulxuaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdsb2FkaW5nJykge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbml0KTtcbn0gZWxzZSB7XG4gICAgaW5pdCgpO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9