// ==UserScript==
// @name         Asana enhancer
// @description  UI tweaks
// @grant        GM_addStyle
// @match        https://app.asana.com/*
// @namespace    https://github.com/reliable-code/site-enhancer-scripts
// @version      1.0.78734393
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asana.com
// @author       reliable-code
// @downloadURL  https://raw.githubusercontent.com/reliable-code/site-enhancer-scripts/main/specific/asana.user.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/asana/index.js"
/*!****************************!*\
  !*** ./src/asana/index.js ***!
  \****************************/
(module, __unused_webpack___webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.css */ "./src/asana/styles.css");
/* harmony import */ var _common_dom_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/dom/utils */ "./src/common/dom/utils.js");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selectors */ "./src/asana/selectors.js");



GM_addStyle(_styles_css__WEBPACK_IMPORTED_MODULE_0__["default"]);
await initMods();
async function initMods() {
  await expandProjectsList();
}
async function expandProjectsList() {
  const showMoreButton = await (0,_common_dom_utils__WEBPACK_IMPORTED_MODULE_1__.waitForElement)(document, _selectors__WEBPACK_IMPORTED_MODULE_2__.SELECTORS.SHOW_MORE_BUTTON);
  showMoreButton.click();
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ },

/***/ "./src/asana/selectors.js"
/*!********************************!*\
  !*** ./src/asana/selectors.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SELECTORS: () => (/* binding */ SELECTORS)
/* harmony export */ });
const SELECTORS = {
  SHOW_MORE_BUTTON: ".SidebarProjectsSectionProjectList-projects .SidebarProjectsSectionProjectList-showMoreButton"
};


/***/ },

/***/ "./src/common/dom/logging.js"
/*!***********************************!*\
  !*** ./src/common/dom/logging.js ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   logElementSearch: () => (/* binding */ logElementSearch),
/* harmony export */   logElementWait: () => (/* binding */ logElementWait)
/* harmony export */ });
const IS_DEBUG = "development" === "development";
function logIfDebug(...args) {
  if (!IS_DEBUG) return;
  console.log(...args);
}
function logElementSearch(selector, parentNode, result) {
  const found = result instanceof NodeList ? result.length > 0 : Boolean(result);
  logIfDebug(
    `${found ? "\u2705 Found element" : "\u274C Not found element"}`,
    "\n \u251C\u2500 Selector:",
    `"${selector}"`,
    "\n \u251C\u2500 Parent:",
    parentNode,
    "\n \u2514\u2500 Result:",
    result
  );
}
function logElementWait(selector, parentNode) {
  logIfDebug(
    "\u23F3 Waiting for element",
    "\n \u251C\u2500 Selector:",
    `"${selector}"`,
    "\n \u2514\u2500 Parent:",
    parentNode
  );
}


/***/ },

/***/ "./src/common/dom/utils.js"
/*!*********************************!*\
  !*** ./src/common/dom/utils.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   waitForElement: () => (/* binding */ waitForElement)
/* harmony export */ });
/* unused harmony exports waitUntilElementGone, waitUntilElementStabilized, debounce, runWhenVisible, runOnceOnIntersection, clearIntersectionObserver, clearObserver */
/* harmony import */ var _logging__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logging */ "./src/common/dom/logging.js");

function waitForElement(parentNode, selector, timeout = null, logOnDebug = false) {
  const existingElement = parentNode.querySelector(selector);
  if (existingElement) {
    if (logOnDebug) (0,_logging__WEBPACK_IMPORTED_MODULE_0__.logElementSearch)(selector, parentNode, existingElement);
    return Promise.resolve(existingElement);
  }
  if (logOnDebug) (0,_logging__WEBPACK_IMPORTED_MODULE_0__.logElementWait)(selector, parentNode);
  return new Promise((resolve) => {
    const observer = new MutationObserver(mutationCallback);
    observer.observe(parentNode, {
      childList: true,
      subtree: true
    });
    let timeoutId;
    if (timeout) {
      timeoutId = setTimeout(() => {
        observer.disconnect();
        if (logOnDebug) (0,_logging__WEBPACK_IMPORTED_MODULE_0__.logElementSearch)(selector, parentNode, null);
        resolve(null);
      }, timeout);
    }
    function mutationCallback() {
      const element = parentNode.querySelector(selector);
      if (!element) return;
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
      if (logOnDebug) (0,_logging__WEBPACK_IMPORTED_MODULE_0__.logElementSearch)(selector, parentNode, element);
      resolve(element);
    }
  });
}
function waitUntilElementGone(parentNode, selector) {
  const existingElement = parentNode.querySelector(selector);
  if (!existingElement) return Promise.resolve();
  return new Promise((resolve) => {
    const observer = new MutationObserver(mutationCallback);
    observer.observe(parentNode, {
      childList: true,
      subtree: true
    });
    function mutationCallback() {
      if (parentNode.querySelector(selector)) return;
      observer.disconnect();
      resolve();
    }
  });
}
function waitUntilElementStabilized(element, timeout = 400) {
  return new Promise((resolve) => {
    let timeoutId;
    const observer = new MutationObserver(() => {
      clearTimeout(timeoutId);
      scheduleCompletion();
    });
    function scheduleCompletion() {
      timeoutId = setTimeout(() => {
        observer.disconnect();
        resolve();
      }, timeout);
    }
    scheduleCompletion();
    observer.observe(element, {
      childList: true,
      subtree: true
    });
  });
}
function debounce(func, wait = 250) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), wait);
  };
}
async function runWhenVisible(callback) {
  if (document.visibilityState === "visible") {
    await callback();
  } else {
    document.addEventListener("visibilitychange", async () => {
      if (document.visibilityState === "visible") {
        await callback();
      }
    }, { once: true });
  }
}
function runOnceOnIntersection(element, callback) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      callback();
      clearIntersectionObserver(element);
    });
  });
  element.intersectionObserver = observer;
  observer.observe(element);
}
function clearIntersectionObserver(element) {
  if (!element.intersectionObserver) return;
  element.intersectionObserver.disconnect();
  element.intersectionObserver = null;
}
function clearObserver(observer) {
  if (!observer) return;
  observer.disconnect();
  observer = null;
}


/***/ },

/***/ "./src/asana/styles.css"
/*!******************************!*\
  !*** ./src/asana/styles.css ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("[aria-label=More].AsanaModeNavButton,.SortableList-sortableItemContainer:has([aria-label=Agents]),.SidebarFooterUpgradeButton,.SidebarInvite,.SidebarFooter-content:has(.SidebarFooterUpgradeButton):has(.SidebarInvite):not(:has(>*:not(.SidebarFooterUpgradeButton):not(.SidebarInvite))),.TrialCalloutCard,.TopbarSettingsMenu-upgradeItem,.CustomizableHomePage-widget:has(>.SortableItem div[aria-label=People]),.StaticCard:has(.CurrentUserProfileGoalsWidgetContent-header),.SidebarModesNavigationCardPresentation:has([aria-label=Portfolios],[aria-label=\\41f\\43e\\440\\442\\444\\435\\43b\\438]),[role=menuitem]:has([data-testid=PremiumSmallIcon]){display:none!important}.OmnibuttonButtonCard-iconContainer{background:#418768!important;body.DesignTokenThemeSelectors-theme--grayNav &{background:#5da182!important}}.ThemeableCardPresentation:has(svg.BoardCardCustomPropertiesAndTags-tag--colorPink){border-color:#ffe6ea!important;.BoardCardLayout{background-color:#ffe6ea!important}}\n");

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
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		const webpackQueues = Symbol("webpack queues");
/******/ 		const webpackExports = Symbol("webpack exports");
/******/ 		const webpackError = Symbol("webpack error");
/******/ 		
/******/ 		const resolveQueue = (queue) => {
/******/ 			if(queue?.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		const wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 		
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					const queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					const obj = {};
/******/ 		
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			const ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			let queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			const depQueues = new Set();
/******/ 			const exports = module.exports;
/******/ 			let currentDeps;
/******/ 			let outerResolve;
/******/ 			let reject;
/******/ 			const promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			const handle = (deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				let fn;
/******/ 				const getResult = () => (currentDeps.map((d) => {
/******/ 		
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				const promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					const fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.forEach((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}
/******/ 			const done = (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue))
/******/ 		
/******/ 			body(handle, done);
/******/ 			queue?.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	let __webpack_exports__ = __webpack_require__("./src/asana/index.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q04sMkNBQTJDLGdDQUFnQztXQUMzRTtXQUNBLEtBQUsseUJBQXlCO1dBQzlCO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSwwQ0FBMEMsd0NBQXdDO1dBQ2xGO1dBQ0E7V0FDQTtXQUNBLEU7Ozs7O1dDdEJBLHdGOzs7OztVRUFBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2FzYW5hL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9hc2FuYS9zZWxlY3RvcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9kb20vbG9nZ2luZy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL2RvbS91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXNhbmEvc3R5bGVzLmNzcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9hc3luYyBtb2R1bGUiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHN0eWxlcyBmcm9tICcuL3N0eWxlcy5jc3MnO1xuaW1wb3J0IHsgd2FpdEZvckVsZW1lbnQgfSBmcm9tICcuLi9jb21tb24vZG9tL3V0aWxzJztcbmltcG9ydCB7IFNFTEVDVE9SUyB9IGZyb20gJy4vc2VsZWN0b3JzJztcblxuR01fYWRkU3R5bGUoc3R5bGVzKTtcblxuYXdhaXQgaW5pdE1vZHMoKTtcblxuYXN5bmMgZnVuY3Rpb24gaW5pdE1vZHMoKSB7XG4gICAgYXdhaXQgZXhwYW5kUHJvamVjdHNMaXN0KCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGV4cGFuZFByb2plY3RzTGlzdCgpIHtcbiAgICBjb25zdCBzaG93TW9yZUJ1dHRvbiA9IGF3YWl0IHdhaXRGb3JFbGVtZW50KGRvY3VtZW50LCBTRUxFQ1RPUlMuU0hPV19NT1JFX0JVVFRPTik7XG4gICAgc2hvd01vcmVCdXR0b24uY2xpY2soKTtcbn1cbiIsImV4cG9ydCBjb25zdCBTRUxFQ1RPUlMgPSB7XG4gICAgU0hPV19NT1JFX0JVVFRPTjogJy5TaWRlYmFyUHJvamVjdHNTZWN0aW9uUHJvamVjdExpc3QtcHJvamVjdHMgLlNpZGViYXJQcm9qZWN0c1NlY3Rpb25Qcm9qZWN0TGlzdC1zaG93TW9yZUJ1dHRvbicsXG59O1xuIiwiY29uc3QgSVNfREVCVUcgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JztcblxuZnVuY3Rpb24gbG9nSWZEZWJ1ZyguLi5hcmdzKSB7XG4gICAgaWYgKCFJU19ERUJVRykgcmV0dXJuO1xuICAgIGNvbnNvbGUubG9nKC4uLmFyZ3MpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9nRWxlbWVudFNlYXJjaChzZWxlY3RvciwgcGFyZW50Tm9kZSwgcmVzdWx0KSB7XG4gICAgY29uc3QgZm91bmQgPSByZXN1bHQgaW5zdGFuY2VvZiBOb2RlTGlzdCA/IHJlc3VsdC5sZW5ndGggPiAwIDogQm9vbGVhbihyZXN1bHQpO1xuXG4gICAgbG9nSWZEZWJ1ZyhcbiAgICAgICAgYCR7Zm91bmQgPyAn4pyFIEZvdW5kIGVsZW1lbnQnIDogJ+KdjCBOb3QgZm91bmQgZWxlbWVudCd9YCxcbiAgICAgICAgJ1xcbiDilJzilIAgU2VsZWN0b3I6JyxcbiAgICAgICAgYFwiJHtzZWxlY3Rvcn1cImAsXG4gICAgICAgICdcXG4g4pSc4pSAIFBhcmVudDonLFxuICAgICAgICBwYXJlbnROb2RlLFxuICAgICAgICAnXFxuIOKUlOKUgCBSZXN1bHQ6JyxcbiAgICAgICAgcmVzdWx0LFxuICAgICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dFbGVtZW50V2FpdChzZWxlY3RvciwgcGFyZW50Tm9kZSkge1xuICAgIGxvZ0lmRGVidWcoXG4gICAgICAgICfij7MgV2FpdGluZyBmb3IgZWxlbWVudCcsXG4gICAgICAgICdcXG4g4pSc4pSAIFNlbGVjdG9yOicsXG4gICAgICAgIGBcIiR7c2VsZWN0b3J9XCJgLFxuICAgICAgICAnXFxuIOKUlOKUgCBQYXJlbnQ6JyxcbiAgICAgICAgcGFyZW50Tm9kZSxcbiAgICApO1xufVxuIiwiaW1wb3J0IHsgbG9nRWxlbWVudFNlYXJjaCwgbG9nRWxlbWVudFdhaXQgfSBmcm9tICcuL2xvZ2dpbmcnO1xuXG5leHBvcnQgZnVuY3Rpb24gd2FpdEZvckVsZW1lbnQocGFyZW50Tm9kZSwgc2VsZWN0b3IsIHRpbWVvdXQgPSBudWxsLCBsb2dPbkRlYnVnID0gZmFsc2UpIHtcbiAgICBjb25zdCBleGlzdGluZ0VsZW1lbnQgPSBwYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgIGlmIChleGlzdGluZ0VsZW1lbnQpIHtcbiAgICAgICAgaWYgKGxvZ09uRGVidWcpIGxvZ0VsZW1lbnRTZWFyY2goc2VsZWN0b3IsIHBhcmVudE5vZGUsIGV4aXN0aW5nRWxlbWVudCk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZXhpc3RpbmdFbGVtZW50KTtcbiAgICB9XG5cbiAgICBpZiAobG9nT25EZWJ1ZykgbG9nRWxlbWVudFdhaXQoc2VsZWN0b3IsIHBhcmVudE5vZGUpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIobXV0YXRpb25DYWxsYmFjayk7XG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUocGFyZW50Tm9kZSwge1xuICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IHRpbWVvdXRJZDtcbiAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICBpZiAobG9nT25EZWJ1ZykgbG9nRWxlbWVudFNlYXJjaChzZWxlY3RvciwgcGFyZW50Tm9kZSwgbnVsbCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbXV0YXRpb25DYWxsYmFjaygpIHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBwYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50KSByZXR1cm47XG5cbiAgICAgICAgICAgIGlmICh0aW1lb3V0SWQpIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgaWYgKGxvZ09uRGVidWcpIGxvZ0VsZW1lbnRTZWFyY2goc2VsZWN0b3IsIHBhcmVudE5vZGUsIGVsZW1lbnQpO1xuICAgICAgICAgICAgcmVzb2x2ZShlbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2FpdFVudGlsRWxlbWVudEdvbmUocGFyZW50Tm9kZSwgc2VsZWN0b3IpIHtcbiAgICBjb25zdCBleGlzdGluZ0VsZW1lbnQgPSBwYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgIGlmICghZXhpc3RpbmdFbGVtZW50KSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihtdXRhdGlvbkNhbGxiYWNrKTtcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShwYXJlbnROb2RlLCB7XG4gICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBtdXRhdGlvbkNhbGxiYWNrKCkge1xuICAgICAgICAgICAgaWYgKHBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihzZWxlY3RvcikpIHJldHVybjtcblxuICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3YWl0VW50aWxFbGVtZW50U3RhYmlsaXplZChlbGVtZW50LCB0aW1lb3V0ID0gNDAwKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGxldCB0aW1lb3V0SWQ7XG5cbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgICAgIHNjaGVkdWxlQ29tcGxldGlvbigpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBzY2hlZHVsZUNvbXBsZXRpb24oKSB7XG4gICAgICAgICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgIH1cblxuICAgICAgICBzY2hlZHVsZUNvbXBsZXRpb24oKTtcblxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQsIHtcbiAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCA9IDI1MCkge1xuICAgIGxldCB0aW1lb3V0SWQ7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IGZ1bmMuYXBwbHkodGhpcywgYXJncyksIHdhaXQpO1xuICAgIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBydW5XaGVuVmlzaWJsZShjYWxsYmFjaykge1xuICAgIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICd2aXNpYmxlJykge1xuICAgICAgICBhd2FpdCBjYWxsYmFjaygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAndmlzaWJsZScpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7IG9uY2U6IHRydWUgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcnVuT25jZU9uSW50ZXJzZWN0aW9uKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKGVudHJpZXMpID0+IHtcbiAgICAgICAgZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFlbnRyeS5pc0ludGVyc2VjdGluZykgcmV0dXJuO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIGNsZWFySW50ZXJzZWN0aW9uT2JzZXJ2ZXIoZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZWxlbWVudC5pbnRlcnNlY3Rpb25PYnNlcnZlciA9IG9ic2VydmVyO1xuICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckludGVyc2VjdGlvbk9ic2VydmVyKGVsZW1lbnQpIHtcbiAgICBpZiAoIWVsZW1lbnQuaW50ZXJzZWN0aW9uT2JzZXJ2ZXIpIHJldHVybjtcblxuICAgIGVsZW1lbnQuaW50ZXJzZWN0aW9uT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgIGVsZW1lbnQuaW50ZXJzZWN0aW9uT2JzZXJ2ZXIgPSBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJPYnNlcnZlcihvYnNlcnZlcikge1xuICAgIGlmICghb2JzZXJ2ZXIpIHJldHVybjtcbiAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgb2JzZXJ2ZXIgPSBudWxsO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgXCJbYXJpYS1sYWJlbD1Nb3JlXS5Bc2FuYU1vZGVOYXZCdXR0b24sLlNvcnRhYmxlTGlzdC1zb3J0YWJsZUl0ZW1Db250YWluZXI6aGFzKFthcmlhLWxhYmVsPUFnZW50c10pLC5TaWRlYmFyRm9vdGVyVXBncmFkZUJ1dHRvbiwuU2lkZWJhckludml0ZSwuU2lkZWJhckZvb3Rlci1jb250ZW50OmhhcyguU2lkZWJhckZvb3RlclVwZ3JhZGVCdXR0b24pOmhhcyguU2lkZWJhckludml0ZSk6bm90KDpoYXMoPio6bm90KC5TaWRlYmFyRm9vdGVyVXBncmFkZUJ1dHRvbik6bm90KC5TaWRlYmFySW52aXRlKSkpLC5UcmlhbENhbGxvdXRDYXJkLC5Ub3BiYXJTZXR0aW5nc01lbnUtdXBncmFkZUl0ZW0sLkN1c3RvbWl6YWJsZUhvbWVQYWdlLXdpZGdldDpoYXMoPi5Tb3J0YWJsZUl0ZW0gZGl2W2FyaWEtbGFiZWw9UGVvcGxlXSksLlN0YXRpY0NhcmQ6aGFzKC5DdXJyZW50VXNlclByb2ZpbGVHb2Fsc1dpZGdldENvbnRlbnQtaGVhZGVyKSwuU2lkZWJhck1vZGVzTmF2aWdhdGlvbkNhcmRQcmVzZW50YXRpb246aGFzKFthcmlhLWxhYmVsPVBvcnRmb2xpb3NdLFthcmlhLWxhYmVsPVxcXFw0MWZcXFxcNDNlXFxcXDQ0MFxcXFw0NDJcXFxcNDQ0XFxcXDQzNVxcXFw0M2JcXFxcNDM4XSksW3JvbGU9bWVudWl0ZW1dOmhhcyhbZGF0YS10ZXN0aWQ9UHJlbWl1bVNtYWxsSWNvbl0pe2Rpc3BsYXk6bm9uZSFpbXBvcnRhbnR9Lk9tbmlidXR0b25CdXR0b25DYXJkLWljb25Db250YWluZXJ7YmFja2dyb3VuZDojNDE4NzY4IWltcG9ydGFudDtib2R5LkRlc2lnblRva2VuVGhlbWVTZWxlY3RvcnMtdGhlbWUtLWdyYXlOYXYgJntiYWNrZ3JvdW5kOiM1ZGExODIhaW1wb3J0YW50fX0uVGhlbWVhYmxlQ2FyZFByZXNlbnRhdGlvbjpoYXMoc3ZnLkJvYXJkQ2FyZEN1c3RvbVByb3BlcnRpZXNBbmRUYWdzLXRhZy0tY29sb3JQaW5rKXtib3JkZXItY29sb3I6I2ZmZTZlYSFpbXBvcnRhbnQ7LkJvYXJkQ2FyZExheW91dHtiYWNrZ3JvdW5kLWNvbG9yOiNmZmU2ZWEhaW1wb3J0YW50fX1cXG5cIjsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG5jb25zdCBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGNvbnN0IGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHRjb25zdCBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0Y29uc3QgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImNvbnN0IHdlYnBhY2tRdWV1ZXMgPSBTeW1ib2woXCJ3ZWJwYWNrIHF1ZXVlc1wiKTtcbmNvbnN0IHdlYnBhY2tFeHBvcnRzID0gU3ltYm9sKFwid2VicGFjayBleHBvcnRzXCIpO1xuY29uc3Qgd2VicGFja0Vycm9yID0gU3ltYm9sKFwid2VicGFjayBlcnJvclwiKTtcblxuY29uc3QgcmVzb2x2ZVF1ZXVlID0gKHF1ZXVlKSA9PiB7XG5cdGlmKHF1ZXVlPy5kIDwgMSkge1xuXHRcdHF1ZXVlLmQgPSAxO1xuXHRcdHF1ZXVlLmZvckVhY2goKGZuKSA9PiAoZm4uci0tKSk7XG5cdFx0cXVldWUuZm9yRWFjaCgoZm4pID0+IChmbi5yLS0gPyBmbi5yKysgOiBmbigpKSk7XG5cdH1cbn1cbmNvbnN0IHdyYXBEZXBzID0gKGRlcHMpID0+IChkZXBzLm1hcCgoZGVwKSA9PiB7XG5cdGlmKGRlcCAhPT0gbnVsbCAmJiB0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKSB7XG5cblx0XHRpZihkZXBbd2VicGFja1F1ZXVlc10pIHJldHVybiBkZXA7XG5cdFx0aWYoZGVwLnRoZW4pIHtcblx0XHRcdGNvbnN0IHF1ZXVlID0gW107XG5cdFx0XHRxdWV1ZS5kID0gMDtcblx0XHRcdGRlcC50aGVuKChyKSA9PiB7XG5cdFx0XHRcdG9ialt3ZWJwYWNrRXhwb3J0c10gPSByO1xuXHRcdFx0XHRyZXNvbHZlUXVldWUocXVldWUpO1xuXHRcdFx0fSwgKGUpID0+IHtcblx0XHRcdFx0b2JqW3dlYnBhY2tFcnJvcl0gPSBlO1xuXHRcdFx0XHRyZXNvbHZlUXVldWUocXVldWUpO1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBvYmogPSB7fTtcblxuXHRcdFx0b2JqW3dlYnBhY2tRdWV1ZXNdID0gKGZuKSA9PiAoZm4ocXVldWUpKTtcblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fVxuXHR9XG5cdGNvbnN0IHJldCA9IHt9O1xuXHRyZXRbd2VicGFja1F1ZXVlc10gPSB4ID0+IHt9O1xuXHRyZXRbd2VicGFja0V4cG9ydHNdID0gZGVwO1xuXHRyZXR1cm4gcmV0O1xufSkpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5hID0gKG1vZHVsZSwgYm9keSwgaGFzQXdhaXQpID0+IHtcblx0bGV0IHF1ZXVlO1xuXHRoYXNBd2FpdCAmJiAoKHF1ZXVlID0gW10pLmQgPSAtMSk7XG5cdGNvbnN0IGRlcFF1ZXVlcyA9IG5ldyBTZXQoKTtcblx0Y29uc3QgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzO1xuXHRsZXQgY3VycmVudERlcHM7XG5cdGxldCBvdXRlclJlc29sdmU7XG5cdGxldCByZWplY3Q7XG5cdGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqKSA9PiB7XG5cdFx0cmVqZWN0ID0gcmVqO1xuXHRcdG91dGVyUmVzb2x2ZSA9IHJlc29sdmU7XG5cdH0pO1xuXHRwcm9taXNlW3dlYnBhY2tFeHBvcnRzXSA9IGV4cG9ydHM7XG5cdHByb21pc2Vbd2VicGFja1F1ZXVlc10gPSAoZm4pID0+IChxdWV1ZSAmJiBmbihxdWV1ZSksIGRlcFF1ZXVlcy5mb3JFYWNoKGZuKSwgcHJvbWlzZVtcImNhdGNoXCJdKHggPT4ge30pKTtcblx0bW9kdWxlLmV4cG9ydHMgPSBwcm9taXNlO1xuXHRjb25zdCBoYW5kbGUgPSAoZGVwcykgPT4ge1xuXHRcdGN1cnJlbnREZXBzID0gd3JhcERlcHMoZGVwcyk7XG5cdFx0bGV0IGZuO1xuXHRcdGNvbnN0IGdldFJlc3VsdCA9ICgpID0+IChjdXJyZW50RGVwcy5tYXAoKGQpID0+IHtcblxuXHRcdFx0aWYoZFt3ZWJwYWNrRXJyb3JdKSB0aHJvdyBkW3dlYnBhY2tFcnJvcl07XG5cdFx0XHRyZXR1cm4gZFt3ZWJwYWNrRXhwb3J0c107XG5cdFx0fSkpXG5cdFx0Y29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cdFx0XHRmbiA9ICgpID0+IChyZXNvbHZlKGdldFJlc3VsdCkpO1xuXHRcdFx0Zm4uciA9IDA7XG5cdFx0XHRjb25zdCBmblF1ZXVlID0gKHEpID0+IChxICE9PSBxdWV1ZSAmJiAhZGVwUXVldWVzLmhhcyhxKSAmJiAoZGVwUXVldWVzLmFkZChxKSwgcSAmJiAhcS5kICYmIChmbi5yKyssIHEucHVzaChmbikpKSk7XG5cdFx0XHRjdXJyZW50RGVwcy5mb3JFYWNoKChkZXApID0+IChkZXBbd2VicGFja1F1ZXVlc10oZm5RdWV1ZSkpKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gZm4uciA/IHByb21pc2UgOiBnZXRSZXN1bHQoKTtcblx0fVxuXHRjb25zdCBkb25lID0gKGVycikgPT4gKChlcnIgPyByZWplY3QocHJvbWlzZVt3ZWJwYWNrRXJyb3JdID0gZXJyKSA6IG91dGVyUmVzb2x2ZShleHBvcnRzKSksIHJlc29sdmVRdWV1ZShxdWV1ZSkpXG5cblx0Ym9keShoYW5kbGUsIGRvbmUpO1xuXHRxdWV1ZT8uZCA8IDAgJiYgKHF1ZXVlLmQgPSAwKTtcbn07IiwiLy8gZGVmaW5lIGdldHRlci92YWx1ZSBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0aWYoQXJyYXkuaXNBcnJheShkZWZpbml0aW9uKSkge1xuXHRcdHZhciBpID0gMDtcblx0XHR3aGlsZShpIDwgZGVmaW5pdGlvbi5sZW5ndGgpIHtcblx0XHRcdHZhciBrZXkgPSBkZWZpbml0aW9uW2krK107XG5cdFx0XHR2YXIgYmluZGluZyA9IGRlZmluaXRpb25baSsrXTtcblx0XHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0XHRpZihiaW5kaW5nID09PSAwKSB7XG5cdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogZGVmaW5pdGlvbltpKytdIH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBiaW5kaW5nIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYoYmluZGluZyA9PT0gMCkgeyBpKys7IH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ21vZHVsZScgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxubGV0IF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXNhbmEvaW5kZXguanNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=