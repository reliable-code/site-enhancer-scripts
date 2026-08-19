// ==UserScript==
// @name         4pda enhancer
// @description  Fixing links, cleaning UI, smart scrolling with notifications
// @grant        GM_addStyle
// @match        https://4pda.to/forum/index.php?showtopic=*
// @namespace    https://github.com/reliable-code/site-enhancer-scripts
// @version      1.0.78714669
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4pda.to
// @author       reliable-code
// @downloadURL  https://raw.githubusercontent.com/reliable-code/site-enhancer-scripts/main/specific/4pda.user.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/4pda/selectors.js":
/*!*******************************!*\
  !*** ./src/4pda/selectors.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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


/***/ }),

/***/ "./src/4pda/styles.css":
/*!*****************************!*\
  !*** ./src/4pda/styles.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("body>div:first-of-type{margin-bottom:160px!important}.user-avatar img{margin-bottom:5px}.forum-hidden{display:none!important}.forum-notification{position:fixed;bottom:10px;left:50%;transform:translate(-50%);padding:10px 40px;border-radius:6px;z-index:9999;font-size:13px;max-width:600px;width:fit-content;text-align:center;font-weight:500;box-shadow:0 2px 8px #0003;white-space:nowrap}.forum-notification-info{background:#000c;color:#fff;animation:fadeInOutInfo 2s forwards}.forum-notification-warning{background:#000c;color:#fff;animation:fadeInOutWarning 4s forwards}@keyframes fadeInOutInfo{0%{opacity:0;transform:translate(-50%) translateY(20px)}20%,80%{opacity:1;transform:translate(-50%) translateY(0)}to{opacity:0;transform:translate(-50%) translateY(-20px)}}@keyframes fadeInOutWarning{0%{opacity:0;transform:translate(-50%) translateY(20px)}15%,85%{opacity:1;transform:translate(-50%) translateY(0)}to{opacity:0;transform:translate(-50%) translateY(-20px)}}.normalname>a{display:inline-block;max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ipbtable>tbody{>tr:nth-child(2)>td{padding-bottom:10px;&:first-child{>br:last-child{display:none}}&:nth-child(2){>div{>div{>.edit,>br:has(+.edit){display:none}}>.signature,>br:has(+.signature){display:none}}}}>tr:nth-child(3){display:none}}#gfooter{margin-top:0}br:has(+#gfooter){display:none}.pagelink-menu-wrap--first{margin-bottom:5px}.pagelink-menu-wrap{.pagelink a,.pagelinklast a,.pagecurrent-wa,.pagelink-menu{padding:4px 8px!important;margin-right:2px!important;display:inline-block!important;font-size:13px!important;font-weight:700!important;border-radius:3px!important}.popupmenu{margin-top:7px;.popupmenu-category{padding:4px 8px;font-size:13px}.popupmenu-item-last{input[type=text]{font-size:13px;padding:4px 8px;width:70px}input[type=button]{font-size:13px;padding:4px 8px}}}}\n");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
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
var __webpack_exports__ = {};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDdkI7QUFHQSxJQUFJLFNBQVMsZUFBZSxXQUFXO0FBQ25DLFdBQVMsaUJBQWlCLG9CQUFvQixJQUFJO0FBQ3RELE9BQU87QUFDSCxPQUFLO0FBQ1QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvNHBkYS9zZWxlY3RvcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjLzRwZGEvc3R5bGVzLmNzcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vLi9zcmMvNHBkYS9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgU0VMRUNUT1JTID0ge1xuICAgIFBPU1RfTElOS1M6ICdhW29uY2xpY2sqPVwibGlua190b19wb3N0XCJdJyxcbiAgICBCVVRUT05fUk9XUzogJ3RyIHRkW2NsYXNzKj1cImZvcm1idXR0b25yb3dcIl0nLFxuICAgIFBPU1RfREVUQUlMU19DRU5URVJfQkxPQ0s6ICcucG9zdGRldGFpbHMgPiBjZW50ZXInLFxuICAgIE1TR19MSU5LUzogJ3RkW2lkXj1cInBoLVwiXVtpZCQ9XCItZDJcIl0gZGl2W3N0eWxlKj1cImZsb2F0OnJpZ2h0XCJdIGFbaHJlZio9XCJmaW5kcG9zdFwiXScsXG4gICAgUE9TVF9UQUJMRVM6ICd0YWJsZS5pcGJ0YWJsZVtkYXRhLXBvc3RdJyxcbiAgICBQT1NUX1NJR05BVFVSRTogJy5zaWduYXR1cmUnLFxuICAgIFBBR0VfTElOS19NRU5VOiAnLnBhZ2VsaW5rLW1lbnUnLFxufTtcbiIsImV4cG9ydCBkZWZhdWx0IFwiYm9keT5kaXY6Zmlyc3Qtb2YtdHlwZXttYXJnaW4tYm90dG9tOjE2MHB4IWltcG9ydGFudH0udXNlci1hdmF0YXIgaW1ne21hcmdpbi1ib3R0b206NXB4fS5mb3J1bS1oaWRkZW57ZGlzcGxheTpub25lIWltcG9ydGFudH0uZm9ydW0tbm90aWZpY2F0aW9ue3Bvc2l0aW9uOmZpeGVkO2JvdHRvbToxMHB4O2xlZnQ6NTAlO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSk7cGFkZGluZzoxMHB4IDQwcHg7Ym9yZGVyLXJhZGl1czo2cHg7ei1pbmRleDo5OTk5O2ZvbnQtc2l6ZToxM3B4O21heC13aWR0aDo2MDBweDt3aWR0aDpmaXQtY29udGVudDt0ZXh0LWFsaWduOmNlbnRlcjtmb250LXdlaWdodDo1MDA7Ym94LXNoYWRvdzowIDJweCA4cHggIzAwMDM7d2hpdGUtc3BhY2U6bm93cmFwfS5mb3J1bS1ub3RpZmljYXRpb24taW5mb3tiYWNrZ3JvdW5kOiMwMDBjO2NvbG9yOiNmZmY7YW5pbWF0aW9uOmZhZGVJbk91dEluZm8gMnMgZm9yd2FyZHN9LmZvcnVtLW5vdGlmaWNhdGlvbi13YXJuaW5ne2JhY2tncm91bmQ6IzAwMGM7Y29sb3I6I2ZmZjthbmltYXRpb246ZmFkZUluT3V0V2FybmluZyA0cyBmb3J3YXJkc31Aa2V5ZnJhbWVzIGZhZGVJbk91dEluZm97MCV7b3BhY2l0eTowO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSkgdHJhbnNsYXRlWSgyMHB4KX0yMCUsODAle29wYWNpdHk6MTt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUpIHRyYW5zbGF0ZVkoMCl9dG97b3BhY2l0eTowO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSkgdHJhbnNsYXRlWSgtMjBweCl9fUBrZXlmcmFtZXMgZmFkZUluT3V0V2FybmluZ3swJXtvcGFjaXR5OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlKSB0cmFuc2xhdGVZKDIwcHgpfTE1JSw4NSV7b3BhY2l0eToxO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSkgdHJhbnNsYXRlWSgwKX10b3tvcGFjaXR5OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlKSB0cmFuc2xhdGVZKC0yMHB4KX19Lm5vcm1hbG5hbWU+YXtkaXNwbGF5OmlubGluZS1ibG9jazttYXgtd2lkdGg6MTUwcHg7d2hpdGUtc3BhY2U6bm93cmFwO292ZXJmbG93OmhpZGRlbjt0ZXh0LW92ZXJmbG93OmVsbGlwc2lzfS5pcGJ0YWJsZT50Ym9keXs+dHI6bnRoLWNoaWxkKDIpPnRke3BhZGRpbmctYm90dG9tOjEwcHg7JjpmaXJzdC1jaGlsZHs+YnI6bGFzdC1jaGlsZHtkaXNwbGF5Om5vbmV9fSY6bnRoLWNoaWxkKDIpez5kaXZ7PmRpdns+LmVkaXQsPmJyOmhhcygrLmVkaXQpe2Rpc3BsYXk6bm9uZX19Pi5zaWduYXR1cmUsPmJyOmhhcygrLnNpZ25hdHVyZSl7ZGlzcGxheTpub25lfX19fT50cjpudGgtY2hpbGQoMyl7ZGlzcGxheTpub25lfX0jZ2Zvb3RlcnttYXJnaW4tdG9wOjB9YnI6aGFzKCsjZ2Zvb3Rlcil7ZGlzcGxheTpub25lfS5wYWdlbGluay1tZW51LXdyYXAtLWZpcnN0e21hcmdpbi1ib3R0b206NXB4fS5wYWdlbGluay1tZW51LXdyYXB7LnBhZ2VsaW5rIGEsLnBhZ2VsaW5rbGFzdCBhLC5wYWdlY3VycmVudC13YSwucGFnZWxpbmstbWVudXtwYWRkaW5nOjRweCA4cHghaW1wb3J0YW50O21hcmdpbi1yaWdodDoycHghaW1wb3J0YW50O2Rpc3BsYXk6aW5saW5lLWJsb2NrIWltcG9ydGFudDtmb250LXNpemU6MTNweCFpbXBvcnRhbnQ7Zm9udC13ZWlnaHQ6NzAwIWltcG9ydGFudDtib3JkZXItcmFkaXVzOjNweCFpbXBvcnRhbnR9LnBvcHVwbWVudXttYXJnaW4tdG9wOjdweDsucG9wdXBtZW51LWNhdGVnb3J5e3BhZGRpbmc6NHB4IDhweDtmb250LXNpemU6MTNweH0ucG9wdXBtZW51LWl0ZW0tbGFzdHtpbnB1dFt0eXBlPXRleHRde2ZvbnQtc2l6ZToxM3B4O3BhZGRpbmc6NHB4IDhweDt3aWR0aDo3MHB4fWlucHV0W3R5cGU9YnV0dG9uXXtmb250LXNpemU6MTNweDtwYWRkaW5nOjRweCA4cHh9fX19XFxuXCI7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCJpbXBvcnQgc3R5bGVzIGZyb20gJy4vc3R5bGVzLmNzcyc7XG5pbXBvcnQgeyBTRUxFQ1RPUlMgfSBmcm9tICcuL3NlbGVjdG9ycyc7XG5cbmNvbnN0IFNDUk9MTF9NQVhfQVRURU1QVFMgPSA1O1xuY29uc3QgU0NST0xMX1JFVFJZX0RFTEFZID0gMTAwO1xuXG4vLyDQmtC+0L3RhNC40LPRg9GA0LDRhtC40Y8g0YLQuNC/0L7QsiDRg9Cy0LXQtNC+0LzQu9C10L3QuNC5XG5jb25zdCBOT1RJRklDQVRJT05fVFlQRVMgPSB7XG4gICAgSU5GTzoge1xuICAgICAgICB0eXBlOiAnaW5mbycsXG4gICAgICAgIGljb246ICfihLnvuI8nLFxuICAgICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICB9LFxuICAgIFdBUk5JTkc6IHtcbiAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICBpY29uOiAn4pqg77iPJyxcbiAgICAgICAgZHVyYXRpb246IDQwMDAsXG4gICAgfSxcbn07XG5cbi8vINCj0LTQsNC70Y/QtdGCIG9uY2xpY2sg0LDRgtGA0LjQsdGD0YLRiyDRgSDRgdGB0YvQu9C+0Log0L3QsCDQv9C+0YHRgtGLXG5mdW5jdGlvbiBmaXhQb3N0TGlua3MoKSB7XG4gICAgY29uc3QgbGlua3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SUy5QT1NUX0xJTktTKTtcbiAgICBsaW5rcy5mb3JFYWNoKChsaW5rKSA9PiB7XG4gICAgICAgIGxpbmsuc3R5bGUucGFkZGluZyA9ICcxMHB4IDJweCc7XG5cbiAgICAgICAgbGluay5yZW1vdmVBdHRyaWJ1dGUoJ29uY2xpY2snKTtcblxuICAgICAgICBjb25zdCBwcmV2Tm9kZSA9IGxpbmsucHJldmlvdXNTaWJsaW5nO1xuICAgICAgICBpZiAocHJldk5vZGUgJiYgcHJldk5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICAgICAgICBsaW5rLmluc2VydEJlZm9yZShwcmV2Tm9kZSwgbGluay5maXJzdENoaWxkKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vLyDQntGH0LjRidCw0LXRgiDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y/RhVxuZnVuY3Rpb24gY2xlYW5Vc2VySW5mbygpIHtcbiAgICBjb25zdCBjZW50ZXJCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SUy5QT1NUX0RFVEFJTFNfQ0VOVEVSX0JMT0NLKTtcbiAgICBjZW50ZXJCbG9ja3MuZm9yRWFjaCgoYmxvY2spID0+IHtcbiAgICAgICAgY2xlYW5DZW50ZXJCbG9jayhibG9jayk7XG4gICAgICAgIGZyZWV6ZUF2YXRhckdpZihibG9jayk7XG4gICAgfSk7XG59XG5cbi8vINCe0YfQuNGJ0LDQtdGCINGG0LXQvdGC0YDQsNC70YzQvdGL0Lkg0LHQu9C+0LpcbmZ1bmN0aW9uIGNsZWFuQ2VudGVyQmxvY2soY2VudGVyQmxvY2spIHtcbiAgICBsZXQgcHJldk5vZGUgPSBudWxsO1xuXG4gICAgWy4uLmNlbnRlckJsb2NrLmNoaWxkTm9kZXNdLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgaWYgKHNob3VsZEtlZXBDZW50ZXJCbG9ja05vZGUobm9kZSwgcHJldk5vZGUpKSB7XG4gICAgICAgICAgICBwcmV2Tm9kZSA9IG5vZGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8vINCe0L/RgNC10LTQtdC70Y/QtdGCLCDQvdGD0LbQvdC+INC70Lgg0YHQvtGF0YDQsNC90LjRgtGMINGD0LfQtdC7XG5mdW5jdGlvbiBzaG91bGRLZWVwQ2VudGVyQmxvY2tOb2RlKG5vZGUsIHByZXZOb2RlKSB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgIGNvbnN0IHsgdGFnTmFtZSB9ID0gbm9kZTtcbiAgICAgICAgaWYgKHRhZ05hbWUgPT09ICdBJyAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygndXNlci1hdmF0YXInKSkgcmV0dXJuIHRydWU7XG4gICAgICAgIGlmICh0YWdOYW1lID09PSAnQlInICYmIHByZXZOb2RlICYmIHByZXZOb2RlLm5vZGVOYW1lICE9PSAnQlInKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgaWYgKHRhZ05hbWUgPT09ICdCJyAmJiBwcmV2Tm9kZT8ubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmXG4gICAgICAgICAgICBwcmV2Tm9kZS50ZXh0Q29udGVudC50cmltKCkuc3RhcnRzV2l0aCgn0KDQtdC/0YPRgtCw0YbQuNGPJykpIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICAgIGNvbnN0IGFsbG93ZWRQYXR0ZXJucyA9IFsn0KDQtdC/0YPRgtCw0YbQuNGPJywgJ9Cg0LXQs9C40YHRgtGA0LDRhtC40Y8nLCAn0KHQvtC+0LHRidC10L3QuNC5J107XG4gICAgICAgIGNvbnN0IHRleHQgPSBub2RlLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICAgICAgcmV0dXJuIGFsbG93ZWRQYXR0ZXJucy5zb21lKChwYXR0ZXJuKSA9PiB0ZXh0LnN0YXJ0c1dpdGgocGF0dGVybikpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLy8g0JfQsNC80L7RgNCw0LbQuNCy0LDQtdGCIGdpZi3QsNCy0LDRgtCw0YDQutGDINC90LAg0L/QtdGA0LLQvtC8XG5mdW5jdGlvbiBmcmVlemVBdmF0YXJHaWYoY2VudGVyQmxvY2spIHtcbiAgICBjb25zdCBpbWcgPSBjZW50ZXJCbG9jay5xdWVyeVNlbGVjdG9yKCcudXNlci1hdmF0YXIgaW1nW3NyYyQ9XCIuZ2lmXCJdJyk7XG4gICAgaWYgKCFpbWcgfHwgaW1nLmRhdGFzZXQuZnJvemVuKSByZXR1cm47XG4gICAgaW1nLmRhdGFzZXQuZnJvemVuID0gJzEnO1xuXG4gICAgY29uc3QgZnJlZXplID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgY2FudmFzLndpZHRoID0gaW1nLm5hdHVyYWxXaWR0aCB8fCBpbWcud2lkdGg7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBpbWcubmF0dXJhbEhlaWdodCB8fCBpbWcuaGVpZ2h0O1xuXG4gICAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcblxuICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggPSBgJHtpbWcud2lkdGh9cHhgO1xuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gYCR7aW1nLmhlaWdodH1weGA7XG5cbiAgICAgICAgaW1nLnJlcGxhY2VXaXRoKGNhbnZhcyk7XG4gICAgfTtcblxuICAgIGlmIChpbWcuY29tcGxldGUpIHtcbiAgICAgICAgZnJlZXplKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmcmVlemUsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICB9XG59XG5cbi8vINCj0LTQsNC70Y/QtdGCINC/0L7QtNC/0LjRgdC4INC4INCx0LvQvtC60Lgg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQuNC3INC/0L7RgdGC0L7QslxuZnVuY3Rpb24gY2xlYW5Qb3N0Q29udGVudCgpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SUy5QT1NUX1NJR05BVFVSRSkuZm9yRWFjaChjbGVhblNlcGFyYXRvckJlZm9yZVNpZ25hdHVyZSk7XG59XG5cbi8vINCj0LTQsNC70Y/QtdGCIDxicj4g0Lgg0YfQtdGA0YLQvtGH0LrQuCDQv9C10YDQtdC0INC/0L7QtNC/0LjRgdGM0Y5cbmZ1bmN0aW9uIGNsZWFuU2VwYXJhdG9yQmVmb3JlU2lnbmF0dXJlKHNpZ25hdHVyZSkge1xuICAgIGxldCBub2RlID0gc2lnbmF0dXJlLnByZXZpb3VzU2libGluZztcblxuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSBub2RlO1xuICAgICAgICBub2RlID0gbm9kZS5wcmV2aW91c1NpYmxpbmc7XG5cbiAgICAgICAgaWYgKGN1cnJlbnQubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gY3VycmVudC50ZXh0Q29udGVudC50cmltKCk7XG4gICAgICAgICAgICBpZiAodGV4dCA9PT0gJycgfHwgL14tKyQvLnRlc3QodGV4dCkpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJlbnQubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmIGN1cnJlbnQudGFnTmFtZSA9PT0gJ0JSJykge1xuICAgICAgICAgICAgY3VycmVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgfVxufVxuXG4vLyDQlNC+0LHQsNCy0LvRj9C10YIg0LrQu9Cw0YHRgSDQuiDQvtCx0LXRgNGC0LrQtSDQv9Cw0LPQuNC90LDRhtC40Lgg0YHRgtGA0LDQvdC40YZcbmZ1bmN0aW9uIGFkZFBhZ2VMaW5rTWVudVdyYXBDbGFzcygpIHtcbiAgICBjb25zdCBwYWdlTGlua01lbnVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUlMuUEFHRV9MSU5LX01FTlUpO1xuICAgIGlmICghcGFnZUxpbmtNZW51cy5sZW5ndGgpIHJldHVybjtcblxuICAgIHBhZ2VMaW5rTWVudXMuZm9yRWFjaCgocGFnZUxpbmtNZW51LCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBwYWdlTGlua01lbnVXcmFwID0gcGFnZUxpbmtNZW51LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIHBhZ2VMaW5rTWVudVdyYXAuY2xhc3NMaXN0LmFkZCgncGFnZWxpbmstbWVudS13cmFwJyk7XG5cbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICBwYWdlTGlua01lbnVXcmFwLmNsYXNzTGlzdC5hZGQoJ3BhZ2VsaW5rLW1lbnUtd3JhcC0tZmlyc3QnKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vLyDQo9C80L3QsNGPINC/0YDQvtC60YDRg9GC0LrQsCDRgSDQv9C+0LLRgtC+0YDQtdC90LjQtdC8INC4INGD0LLQtdC00L7QvNC70LXQvdC40LXQvFxuZnVuY3Rpb24gc21hcnRTY3JvbGxJbnRvVmlldyhlbGVtZW50LCBtZXNzYWdlLCBub3RpZmljYXRpb25UeXBlID0gTk9USUZJQ0FUSU9OX1RZUEVTLklORk8pIHtcbiAgICBpZiAoIWVsZW1lbnQpIHJldHVybjtcblxuICAgIGNvbnN0IHBlcmZvcm1TY3JvbGwgPSAoKSA9PiB7XG4gICAgICAgIGlmIChtZXNzYWdlKSBzaG93Tm90aWZpY2F0aW9uKG1lc3NhZ2UsIG5vdGlmaWNhdGlvblR5cGUpO1xuICAgICAgICBsZXQgYXR0ZW1wdHMgPSAwO1xuXG4gICAgICAgIGNvbnN0IGNoZWNrQW5kU2Nyb2xsID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBjb25zdCBpblZpZXcgPSByZWN0LnRvcCA+PSAwICYmIHJlY3QuYm90dG9tIDw9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgICAgICAgICAgaWYgKCFpblZpZXcgJiYgYXR0ZW1wdHMgPCBTQ1JPTExfTUFYX0FUVEVNUFRTKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zY3JvbGxJbnRvVmlldyh7IGJsb2NrOiAnc3RhcnQnIH0pO1xuICAgICAgICAgICAgICAgIGF0dGVtcHRzICs9IDE7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChjaGVja0FuZFNjcm9sbCwgU0NST0xMX1JFVFJZX0RFTEFZKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjaGVja0FuZFNjcm9sbCgpO1xuICAgIH07XG5cbiAgICBpZiAoZG9jdW1lbnQuaGFzRm9jdXMoKSAmJiBkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICd2aXNpYmxlJykge1xuICAgICAgICBwZXJmb3JtU2Nyb2xsKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgd2FpdEZvckRvY3VtZW50Rm9jdXMocGVyZm9ybVNjcm9sbCk7XG4gICAgfVxufVxuXG4vLyDQntC20LjQtNCw0LXRgiDRhNC+0LrRg9GB0LAg0L3QsCDQtNC+0LrRg9C80LXQvdGC0LVcbmZ1bmN0aW9uIHdhaXRGb3JEb2N1bWVudEZvY3VzKGNhbGxiYWNrKSB7XG4gICAgY29uc3QgY2xlYW51cCA9ICgpID0+IHtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgb25Gb2N1cyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdXNlLWJlZm9yZS1kZWZpbmVcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIG9uVmlzaWJpbGl0eUNoYW5nZSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdXNlLWJlZm9yZS1kZWZpbmVcbiAgICB9O1xuXG4gICAgY29uc3Qgb25Gb2N1cyA9ICgpID0+IHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgY2xlYW51cCgpO1xuICAgIH07XG5cbiAgICBjb25zdCBvblZpc2liaWxpdHlDaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICd2aXNpYmxlJykge1xuICAgICAgICAgICAgb25Gb2N1cygpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIG9uRm9jdXMpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBvblZpc2liaWxpdHlDaGFuZ2UpO1xufVxuXG4vLyDQn9GA0L7Qv9GD0YHQutCw0LXRgiBGQVEg0LXRgdC70Lgg0L3QtdC+0LHRhdC+0LTQuNC80L5cbmZ1bmN0aW9uIHNraXBGYXFJZk5lZWRlZCgpIHtcbiAgICBpZiAoaXNIYXNoRW50cnlPclNwb2lsKCkpIHJldHVybjtcblxuICAgIGNvbnN0IG1zZ0xpbmtzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUlMuTVNHX0xJTktTKTtcbiAgICBpZiAobXNnTGlua3MubGVuZ3RoIDwgMikgcmV0dXJuO1xuXG4gICAgY29uc3QgcG9zdE51bWJlcnMgPSBBcnJheS5mcm9tKG1zZ0xpbmtzLCBleHRyYWN0UG9zdE51bWJlcikuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgaWYgKHNob3VsZFNraXBUb1NlY29uZFBvc3QocG9zdE51bWJlcnMpKSB7XG4gICAgICAgIGNvbnN0IHNlY29uZFRhYmxlID0gbXNnTGlua3NbMV0uY2xvc2VzdChTRUxFQ1RPUlMuUE9TVF9UQUJMRVMpO1xuICAgICAgICBpZiAoc2Vjb25kVGFibGUpIHtcbiAgICAgICAgICAgIHNtYXJ0U2Nyb2xsSW50b1ZpZXcoc2Vjb25kVGFibGUsICfQl9Cw0LrRgNC10L/Qu9GR0L3QvdGL0Lkg0L/QvtGB0YIg0L/RgNC+0L/Rg9GJ0LXQvScsIE5PVElGSUNBVElPTl9UWVBFUy5JTkZPKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8g0J/RgNC+0LLQtdGA0Y/QtdGCLCDQvdGD0LbQvdC+INC70Lgg0L/RgNC+0L/Rg9GB0YLQuNGC0Ywg0Log0LLRgtC+0YDQvtC80YMg0L/QvtGB0YLRg1xuZnVuY3Rpb24gc2hvdWxkU2tpcFRvU2Vjb25kUG9zdChwb3N0TnVtYmVycykge1xuICAgIHJldHVybiBwb3N0TnVtYmVycy5sZW5ndGggPj0gMiAmJiBwb3N0TnVtYmVyc1swXSA9PT0gMSAmJiBwb3N0TnVtYmVyc1sxXSA+IDI7XG59XG5cbi8vINCY0LfQstC70LXQutCw0LXRgiDQvdC+0LzQtdGAINC/0L7RgdGC0LAg0LjQtyDRgdGB0YvQu9C60LhcbmZ1bmN0aW9uIGV4dHJhY3RQb3N0TnVtYmVyKGxpbmspIHtcbiAgICBjb25zdCBtYXRjaCA9IGxpbmsudGV4dENvbnRlbnQudHJpbSgpLm1hdGNoKC8jKFxcZCspLyk7XG4gICAgcmV0dXJuIG1hdGNoID8gcGFyc2VJbnQobWF0Y2hbMV0sIDEwKSA6IG51bGw7XG59XG5cbi8vINCf0YDQvtCy0LXRgNGP0LXRgiwg0Y/QstC70Y/QtdGC0YHRjyDQu9C4INGF0LXRiCBlbnRyeSDQuNC70Lggc3BvaWxcbmZ1bmN0aW9uIGlzSGFzaEVudHJ5T3JTcG9pbCgpIHtcbiAgICBjb25zdCB7IGhhc2ggfSA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICByZXR1cm4gaGFzaC5zdGFydHNXaXRoKCcjZW50cnknKSB8fCBoYXNoLnN0YXJ0c1dpdGgoJyNTcG9pbCcpO1xufVxuXG4vLyDQntCx0YDQsNCx0LDRgtGL0LLQsNC10YIg0L7RgtGB0YPRgtGB0YLQstGD0Y7RidC40LUg0LfQsNC/0LjRgdC4XG5mdW5jdGlvbiBoYW5kbGVNaXNzaW5nRW50cnkoKSB7XG4gICAgY29uc3QgdGFyZ2V0SWQgPSBleHRyYWN0VGFyZ2V0SWRGcm9tSGFzaCgpO1xuICAgIGlmICghdGFyZ2V0SWQpIHJldHVybjtcblxuICAgIGNvbnN0IGV4YWN0UG9zdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7U0VMRUNUT1JTLlBPU1RfVEFCTEVTfVtkYXRhLXBvc3Q9XCIke3RhcmdldElkfVwiXWApO1xuICAgIGlmIChleGFjdFBvc3QpIHtcbiAgICAgICAgc21hcnRTY3JvbGxJbnRvVmlldyhleGFjdFBvc3QpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmVhcmVzdFBvc3RJbmZvID0gZmluZE5lYXJlc3RQb3N0KHRhcmdldElkKTtcbiAgICBpZiAobmVhcmVzdFBvc3RJbmZvKSB7XG4gICAgICAgIHNjcm9sbFRvTmVhcmVzdFBvc3QobmVhcmVzdFBvc3RJbmZvLCB0YXJnZXRJZCk7XG4gICAgfVxufVxuXG4vLyDQmNC30LLQu9C10LrQsNC10YIgSUQg0YbQtdC70Lgg0LjQtyDRhdC10YjQsCBVUkxcbmZ1bmN0aW9uIGV4dHJhY3RUYXJnZXRJZEZyb21IYXNoKCkge1xuICAgIGNvbnN0IG1hdGNoID0gd2luZG93LmxvY2F0aW9uLmhhc2gubWF0Y2goL14jZW50cnkoXFxkKykkLyk7XG4gICAgcmV0dXJuIG1hdGNoID8gcGFyc2VJbnQobWF0Y2hbMV0sIDEwKSA6IG51bGw7XG59XG5cbi8vINCd0LDRhdC+0LTQuNGCINCx0LvQuNC20LDQudGI0LjQuSDQv9C+0YHRglxuZnVuY3Rpb24gZmluZE5lYXJlc3RQb3N0KHRhcmdldElkKSB7XG4gICAgY29uc3QgcG9zdElkcyA9IGdldFBvc3RJZHMoKTtcbiAgICBpZiAocG9zdElkcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgbmVhcmVzdElkID0gZmluZE5lYXJlc3RQb3N0SWQocG9zdElkcywgdGFyZ2V0SWQpO1xuICAgIGlmICghbmVhcmVzdElkKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGRpcmVjdGlvbiA9IG5lYXJlc3RJZCA+IHRhcmdldElkID8gJ9C90LjQttC1JyA6ICfQstGL0YjQtSc7XG4gICAgY29uc3QgdGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke1NFTEVDVE9SUy5QT1NUX1RBQkxFU31bZGF0YS1wb3N0PVwiJHtuZWFyZXN0SWR9XCJdYCk7XG5cbiAgICByZXR1cm4geyBpZDogbmVhcmVzdElkLCBkaXJlY3Rpb24sIHRhYmxlIH07XG59XG5cbmZ1bmN0aW9uIGdldFBvc3RJZHMoKSB7XG4gICAgY29uc3QgcG9zdFRhYmxlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1JTLlBPU1RfVEFCTEVTKTtcbiAgICByZXR1cm4gWy4uLnBvc3RUYWJsZXNdXG4gICAgICAgIC5tYXAoKHRhYmxlKSA9PiBwYXJzZUludCh0YWJsZS5kYXRhc2V0LnBvc3QsIDEwKSlcbiAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xufVxuXG5mdW5jdGlvbiBmaW5kTmVhcmVzdFBvc3RJZChwb3N0SWRzLCB0YXJnZXRJZCkge1xuICAgIHJldHVybiBwb3N0SWRzLmZpbmQoKGlkKSA9PiBpZCA+IHRhcmdldElkKSA/PyBwb3N0SWRzLmZpbmRMYXN0KChpZCkgPT4gaWQgPCB0YXJnZXRJZCk7XG59XG5cbi8vINCf0YDQvtC60YDRg9GH0LjQstCw0LXRgiDQuiDQsdC70LjQttCw0LnRiNC10LzRgyDQv9C+0YHRgtGDXG5mdW5jdGlvbiBzY3JvbGxUb05lYXJlc3RQb3N0KHBvc3RJbmZvLCB0YXJnZXRJZCkge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBg0KHQvtC+0LHRidC10L3QuNC1ICMke3RhcmdldElkfSDQvdC1INC90LDQudC00LXQvdC+LCDQv9C+0LrQsNC30LDQvdC+INCx0LvQuNC20LDQudGI0LXQtSAke3Bvc3RJbmZvLmRpcmVjdGlvbn0g4oCTICMke3Bvc3RJbmZvLmlkfWA7XG4gICAgc21hcnRTY3JvbGxJbnRvVmlldyhwb3N0SW5mby50YWJsZSwgbWVzc2FnZSwgTk9USUZJQ0FUSU9OX1RZUEVTLldBUk5JTkcpO1xufVxuXG4vLyDQn9C+0LrQsNC30YvQstCw0LXRgiDRg9Cy0LXQtNC+0LzQu9C10L3QuNC1XG5mdW5jdGlvbiBzaG93Tm90aWZpY2F0aW9uKHRleHQsIG5vdGlmaWNhdGlvbkNvbmZpZyA9IE5PVElGSUNBVElPTl9UWVBFUy5JTkZPKSB7XG4gICAgY29uc3Qgbm90aWZpY2F0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbm90aWZpY2F0aW9uLnRleHRDb250ZW50ID0gYCR7bm90aWZpY2F0aW9uQ29uZmlnLmljb259ICR7dGV4dH1gO1xuICAgIG5vdGlmaWNhdGlvbi5jbGFzc05hbWUgPSBgZm9ydW0tbm90aWZpY2F0aW9uIGZvcnVtLW5vdGlmaWNhdGlvbi0ke25vdGlmaWNhdGlvbkNvbmZpZy50eXBlfWA7XG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG5vdGlmaWNhdGlvbik7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IG5vdGlmaWNhdGlvbi5yZW1vdmUoKSwgbm90aWZpY2F0aW9uQ29uZmlnLmR1cmF0aW9uKTtcbn1cblxuLy8g0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQutGA0LjQv9GC0LBcbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgR01fYWRkU3R5bGUoc3R5bGVzKTtcbiAgICBmaXhQb3N0TGlua3MoKTtcbiAgICBjbGVhblVzZXJJbmZvKCk7XG4gICAgY2xlYW5Qb3N0Q29udGVudCgpO1xuICAgIGFkZFBhZ2VMaW5rTWVudVdyYXBDbGFzcygpO1xuICAgIHNraXBGYXFJZk5lZWRlZCgpO1xuICAgIGhhbmRsZU1pc3NpbmdFbnRyeSgpO1xufVxuXG4vLyDQl9Cw0L/Rg9GB0LpcbmlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnbG9hZGluZycpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdCk7XG59IGVsc2Uge1xuICAgIGluaXQoKTtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==