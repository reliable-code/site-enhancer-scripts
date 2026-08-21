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

/***/ "./src/asana/styles.css"
/*!******************************!*\
  !*** ./src/asana/styles.css ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("[aria-label=More].AsanaModeNavButton,.SortableList-sortableItemContainer:has([aria-label=Agents]),.SidebarFooterUpgradeButton,.SidebarInvite,.SidebarFooter-content:has(.SidebarFooterUpgradeButton):has(.SidebarInvite):not(:has(>*:not(.SidebarFooterUpgradeButton):not(.SidebarInvite))),.TrialCalloutCard,.TopbarSettingsMenu-upgradeItem,.CustomizableHomePage-widget:has(>.SortableItem div[aria-label=People]),.StaticCard:has(.CurrentUserProfileGoalsWidgetContent-header),.SidebarModesNavigationCardPresentation:has([aria-label=Portfolios],[aria-label=\\41f\\43e\\440\\442\\444\\435\\43b\\438]),[role=menuitem]:has([data-testid=PremiumSmallIcon]){display:none!important}.OmnibuttonButtonCard-iconContainer{background:#418768!important;body.DesignTokenThemeSelectors-theme--grayNav &{background:#5da182!important}}\n");

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
/*!****************************!*\
  !*** ./src/asana/index.js ***!
  \****************************/
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.css */ "./src/asana/styles.css");

GM_addStyle(_styles_css__WEBPACK_IMPORTED_MODULE_0__["default"]);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNhbmEudXNlci5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsaUVBQWUsb29CQUFvb0IsdUJBQXVCLG9DQUFvQyw2QkFBNkIsZ0RBQWdELDhCQUE4QixHQUFHLEU7Ozs7OztVQ0E1ekI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0M1QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsMkNBQTJDLDBDQUEwQztXQUNyRixNQUFNO1dBQ04sMkNBQTJDLGdDQUFnQztXQUMzRTtXQUNBLEtBQUsseUJBQXlCO1dBQzlCO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSwwQ0FBMEMsd0NBQXdDO1dBQ2xGO1dBQ0E7V0FDQTtXQUNBLEU7Ozs7O1dDdEJBLHdGOzs7Ozs7Ozs7OztBQ0FtQjtBQUVuQixZQUFZLG1EQUFNIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2FzYW5hL3N0eWxlcy5jc3MiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FzYW5hL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IFwiW2FyaWEtbGFiZWw9TW9yZV0uQXNhbmFNb2RlTmF2QnV0dG9uLC5Tb3J0YWJsZUxpc3Qtc29ydGFibGVJdGVtQ29udGFpbmVyOmhhcyhbYXJpYS1sYWJlbD1BZ2VudHNdKSwuU2lkZWJhckZvb3RlclVwZ3JhZGVCdXR0b24sLlNpZGViYXJJbnZpdGUsLlNpZGViYXJGb290ZXItY29udGVudDpoYXMoLlNpZGViYXJGb290ZXJVcGdyYWRlQnV0dG9uKTpoYXMoLlNpZGViYXJJbnZpdGUpOm5vdCg6aGFzKD4qOm5vdCguU2lkZWJhckZvb3RlclVwZ3JhZGVCdXR0b24pOm5vdCguU2lkZWJhckludml0ZSkpKSwuVHJpYWxDYWxsb3V0Q2FyZCwuVG9wYmFyU2V0dGluZ3NNZW51LXVwZ3JhZGVJdGVtLC5DdXN0b21pemFibGVIb21lUGFnZS13aWRnZXQ6aGFzKD4uU29ydGFibGVJdGVtIGRpdlthcmlhLWxhYmVsPVBlb3BsZV0pLC5TdGF0aWNDYXJkOmhhcyguQ3VycmVudFVzZXJQcm9maWxlR29hbHNXaWRnZXRDb250ZW50LWhlYWRlciksLlNpZGViYXJNb2Rlc05hdmlnYXRpb25DYXJkUHJlc2VudGF0aW9uOmhhcyhbYXJpYS1sYWJlbD1Qb3J0Zm9saW9zXSxbYXJpYS1sYWJlbD1cXFxcNDFmXFxcXDQzZVxcXFw0NDBcXFxcNDQyXFxcXDQ0NFxcXFw0MzVcXFxcNDNiXFxcXDQzOF0pLFtyb2xlPW1lbnVpdGVtXTpoYXMoW2RhdGEtdGVzdGlkPVByZW1pdW1TbWFsbEljb25dKXtkaXNwbGF5Om5vbmUhaW1wb3J0YW50fS5PbW5pYnV0dG9uQnV0dG9uQ2FyZC1pY29uQ29udGFpbmVye2JhY2tncm91bmQ6IzQxODc2OCFpbXBvcnRhbnQ7Ym9keS5EZXNpZ25Ub2tlblRoZW1lU2VsZWN0b3JzLXRoZW1lLS1ncmF5TmF2ICZ7YmFja2dyb3VuZDojNWRhMTgyIWltcG9ydGFudH19XFxuXCI7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxuY29uc3QgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRjb25zdCBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0Y29uc3QgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdGNvbnN0IGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyL3ZhbHVlIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRpZihBcnJheS5pc0FycmF5KGRlZmluaXRpb24pKSB7XG5cdFx0dmFyIGkgPSAwO1xuXHRcdHdoaWxlKGkgPCBkZWZpbml0aW9uLmxlbmd0aCkge1xuXHRcdFx0dmFyIGtleSA9IGRlZmluaXRpb25baSsrXTtcblx0XHRcdHZhciBiaW5kaW5nID0gZGVmaW5pdGlvbltpKytdO1xuXHRcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRcdGlmKGJpbmRpbmcgPT09IDApIHtcblx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiBkZWZpbml0aW9uW2krK10gfSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGJpbmRpbmcgfSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZihiaW5kaW5nID09PSAwKSB7IGkrKzsgfVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsImltcG9ydCBzdHlsZXMgZnJvbSAnLi9zdHlsZXMuY3NzJztcblxuR01fYWRkU3R5bGUoc3R5bGVzKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==