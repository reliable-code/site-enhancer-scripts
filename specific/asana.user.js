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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNhbmEudXNlci5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsaUVBQWUsb29CQUFvb0IsdUJBQXVCLG9DQUFvQyw2QkFBNkIsZ0RBQWdELDhCQUE4QixvRkFBb0YsK0JBQStCLGlCQUFpQixvQ0FBb0MsR0FBRyxFOzs7Ozs7VUNBcCtCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDNUJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLDJDQUEyQywwQ0FBMEM7V0FDckYsTUFBTTtXQUNOLDJDQUEyQyxnQ0FBZ0M7V0FDM0U7V0FDQSxLQUFLLHlCQUF5QjtXQUM5QjtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsMENBQTBDLHdDQUF3QztXQUNsRjtXQUNBO1dBQ0E7V0FDQSxFOzs7OztXQ3RCQSx3Rjs7Ozs7Ozs7Ozs7QUNBbUI7QUFFbkIsWUFBWSxtREFBTSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9hc2FuYS9zdHlsZXMuY3NzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy8uL3NyYy9hc2FuYS9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBcIlthcmlhLWxhYmVsPU1vcmVdLkFzYW5hTW9kZU5hdkJ1dHRvbiwuU29ydGFibGVMaXN0LXNvcnRhYmxlSXRlbUNvbnRhaW5lcjpoYXMoW2FyaWEtbGFiZWw9QWdlbnRzXSksLlNpZGViYXJGb290ZXJVcGdyYWRlQnV0dG9uLC5TaWRlYmFySW52aXRlLC5TaWRlYmFyRm9vdGVyLWNvbnRlbnQ6aGFzKC5TaWRlYmFyRm9vdGVyVXBncmFkZUJ1dHRvbik6aGFzKC5TaWRlYmFySW52aXRlKTpub3QoOmhhcyg+Kjpub3QoLlNpZGViYXJGb290ZXJVcGdyYWRlQnV0dG9uKTpub3QoLlNpZGViYXJJbnZpdGUpKSksLlRyaWFsQ2FsbG91dENhcmQsLlRvcGJhclNldHRpbmdzTWVudS11cGdyYWRlSXRlbSwuQ3VzdG9taXphYmxlSG9tZVBhZ2Utd2lkZ2V0Omhhcyg+LlNvcnRhYmxlSXRlbSBkaXZbYXJpYS1sYWJlbD1QZW9wbGVdKSwuU3RhdGljQ2FyZDpoYXMoLkN1cnJlbnRVc2VyUHJvZmlsZUdvYWxzV2lkZ2V0Q29udGVudC1oZWFkZXIpLC5TaWRlYmFyTW9kZXNOYXZpZ2F0aW9uQ2FyZFByZXNlbnRhdGlvbjpoYXMoW2FyaWEtbGFiZWw9UG9ydGZvbGlvc10sW2FyaWEtbGFiZWw9XFxcXDQxZlxcXFw0M2VcXFxcNDQwXFxcXDQ0MlxcXFw0NDRcXFxcNDM1XFxcXDQzYlxcXFw0MzhdKSxbcm9sZT1tZW51aXRlbV06aGFzKFtkYXRhLXRlc3RpZD1QcmVtaXVtU21hbGxJY29uXSl7ZGlzcGxheTpub25lIWltcG9ydGFudH0uT21uaWJ1dHRvbkJ1dHRvbkNhcmQtaWNvbkNvbnRhaW5lcntiYWNrZ3JvdW5kOiM0MTg3NjghaW1wb3J0YW50O2JvZHkuRGVzaWduVG9rZW5UaGVtZVNlbGVjdG9ycy10aGVtZS0tZ3JheU5hdiAme2JhY2tncm91bmQ6IzVkYTE4MiFpbXBvcnRhbnR9fS5UaGVtZWFibGVDYXJkUHJlc2VudGF0aW9uOmhhcyhzdmcuQm9hcmRDYXJkQ3VzdG9tUHJvcGVydGllc0FuZFRhZ3MtdGFnLS1jb2xvclBpbmspe2JvcmRlci1jb2xvcjojZmZlNmVhIWltcG9ydGFudDsuQm9hcmRDYXJkTGF5b3V0e2JhY2tncm91bmQtY29sb3I6I2ZmZTZlYSFpbXBvcnRhbnR9fVxcblwiOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbmNvbnN0IF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0Y29uc3QgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdGNvbnN0IG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHRjb25zdCBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlci92YWx1ZSBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0aWYoQXJyYXkuaXNBcnJheShkZWZpbml0aW9uKSkge1xuXHRcdHZhciBpID0gMDtcblx0XHR3aGlsZShpIDwgZGVmaW5pdGlvbi5sZW5ndGgpIHtcblx0XHRcdHZhciBrZXkgPSBkZWZpbml0aW9uW2krK107XG5cdFx0XHR2YXIgYmluZGluZyA9IGRlZmluaXRpb25baSsrXTtcblx0XHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0XHRpZihiaW5kaW5nID09PSAwKSB7XG5cdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogZGVmaW5pdGlvbltpKytdIH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBiaW5kaW5nIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYoYmluZGluZyA9PT0gMCkgeyBpKys7IH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCJpbXBvcnQgc3R5bGVzIGZyb20gJy4vc3R5bGVzLmNzcyc7XG5cbkdNX2FkZFN0eWxlKHN0eWxlcyk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=