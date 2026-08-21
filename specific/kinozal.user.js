// ==UserScript==
// @name         Kinozal extended search filters
// @description  Kinozal extended filters on search page
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @match        https://kinozal.tv/browse.php*
// @namespace    https://github.com/reliable-code/site-enhancer-scripts
// @version      1.0.78734393
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kinozal.tv
// @author       reliable-code
// @downloadURL  https://raw.githubusercontent.com/reliable-code/site-enhancer-scripts/main/specific/kinozal.user.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
/* harmony export */   debounce: () => (/* binding */ debounce)
/* harmony export */ });
/* unused harmony exports waitForElement, waitUntilElementGone, waitUntilElementStabilized, runWhenVisible, runOnceOnIntersection, clearIntersectionObserver, clearObserver */
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

/***/ "./src/common/filter/compare.js"
/*!**************************************!*\
  !*** ./src/common/filter/compare.js ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isMatchTextFilter: () => (/* binding */ isMatchTextFilter)
/* harmony export */ });
/* unused harmony export matchesQuery */
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/common/filter/helpers.js");

function isMatchTextFilter(parameterValue, filterValue) {
  if (!filterValue) return true;
  const requirements = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.parseFilterQuery)(filterValue);
  return matchesQuery(parameterValue, requirements);
}
function matchesQuery(text, requirements) {
  if (!requirements || !requirements.length) return true;
  const normalizedText = (text || "").toLowerCase();
  return requirements.every((group) => checkGroupMatch(normalizedText, group));
}
function checkGroupMatch(text, groupConditions) {
  return groupConditions.some(({ term, isNegative }) => {
    const includes = text.includes(term);
    return isNegative ? !includes : includes;
  });
}


/***/ },

/***/ "./src/common/filter/helpers.js"
/*!**************************************!*\
  !*** ./src/common/filter/helpers.js ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseFilterQuery: () => (/* binding */ parseFilterQuery)
/* harmony export */ });
function parseFilterQuery(queryString) {
  if (!queryString) return [];
  return queryString.toLowerCase().split(",").map(parseGroup).filter(Boolean);
}
function parseGroup(groupString) {
  const tokens = groupString.split("/").map((s) => s.trim()).filter(Boolean);
  if (tokens.length === 0) return null;
  const conditions = tokens.map(createCondition).filter(Boolean);
  return conditions.length > 0 ? conditions : null;
}
function createCondition(rawToken) {
  const isNegative = rawToken.startsWith("!");
  const term = isNegative ? rawToken.slice(1).trim() : rawToken;
  if (!term) return null;
  return {
    term,
    isNegative
  };
}


/***/ },

/***/ "./src/common/storage.js"
/*!*******************************!*\
  !*** ./src/common/storage.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   storage: () => (/* binding */ storage)
/* harmony export */ });
const storage = {
  /**
   * Получение данных из GM storage
   * @param {string} key - ключ
   * @param {*} defaultValue - значение по умолчанию
   * @returns {*} значение или defaultValue
   */
  get: (key, defaultValue = null) => {
    try {
      return GM_getValue(key, defaultValue);
    } catch (error) {
      console.warn(`Storage get error for key "${key}":`, error);
      return defaultValue;
    }
  },
  /**
   * Сохранение данных в GM storage
   * @param {string} key - ключ
   * @param {*} value - значение (любой тип)
   * @returns {boolean} успешность операции
   */
  set: (key, value) => {
    try {
      GM_setValue(key, value);
      return true;
    } catch (error) {
      console.warn(`Storage set error for key "${key}":`, error);
      return false;
    }
  },
  /**
   * Обновление существующих данных через функцию
   * @param {string} key - ключ
   * @param {Function} updateFn - функция обновления (получает текущее значение, возвращает новое)
   * @param {*} defaultValue - значение по умолчанию если ключ не существует
   * @returns {*} новое значение
   */
  update: (key, updateFn, defaultValue = null) => {
    try {
      const currentValue = storage.get(key, defaultValue);
      const newValue = updateFn(currentValue);
      storage.set(key, newValue);
      return newValue;
    } catch (error) {
      console.warn(`Storage update error for key "${key}":`, error);
      return storage.get(key, defaultValue);
    }
  },
  /**
   * Удаление данных из GM storage
   * @param {string} key - ключ
   * @returns {boolean} успешность операции
   */
  remove: (key) => {
    try {
      GM_deleteValue(key);
      return true;
    } catch (error) {
      console.warn(`Storage remove error for key "${key}":`, error);
      return false;
    }
  },
  /**
   * Проверка существования ключа
   * @param {string} key - ключ
   * @returns {boolean}
   */
  has: (key) => {
    try {
      return storage.keys().includes(key);
    } catch (error) {
      console.warn(`Storage has error for key "${key}":`, error);
      return false;
    }
  },
  /**
   * Получение всех ключей
   * @returns {string[]} массив ключей
   */
  keys: () => {
    try {
      return GM_listValues();
    } catch (error) {
      console.warn("Storage keys error:", error);
      return [];
    }
  },
  /**
   * Очистка данных скрипта
   * @param {string[]} keysToRemove - массив ключей для удаления
   * @returns {boolean} успешность операции
   */
  clear: (keysToRemove = null) => {
    try {
      const allKeys = keysToRemove || storage.keys();
      allKeys.forEach((key) => GM_deleteValue(key));
      return true;
    } catch (error) {
      console.warn("Storage clear error:", error);
      return false;
    }
  },
  /**
   * Массовое получение данных
   * @param {string[]} keysList - массив ключей
   * @param {*} defaultValue - значение по умолчанию для отсутствующих ключей
   * @returns {Object} объект с парами ключ-значение
   */
  getMultiple: (keysList, defaultValue = null) => {
    const result = {};
    keysList.forEach((key) => {
      result[key] = storage.get(key, defaultValue);
    });
    return result;
  },
  /**
   * Массовое сохранение данных
   * @param {Object} data - объект с парами ключ-значение
   * @returns {boolean} успешность всех операций
   */
  setMultiple: (data) => {
    try {
      Object.entries(data).forEach(([key, value]) => {
        GM_setValue(key, value);
      });
      return true;
    } catch (error) {
      console.warn("Storage setMultiple error:", error);
      return false;
    }
  },
  /**
   * Удаление нескольких ключей
   * @param {string[]} keysToRemove - массив ключей для удаления (обязательный параметр)
   * @returns {boolean} успешность операции
   */
  removeMultiple: (keysToRemove) => {
    if (!Array.isArray(keysToRemove) || keysToRemove.length === 0) {
      console.warn("Storage removeMultiple: keysToRemove must be a non-empty array");
      return false;
    }
    try {
      keysToRemove.forEach((key) => GM_deleteValue(key));
      return true;
    } catch (error) {
      console.warn("Storage removeMultiple error:", error);
      return false;
    }
  },
  /**
   * Получение количества сохраненных ключей
   * @returns {number} количество ключей
   */
  count: () => {
    try {
      return storage.keys().length;
    } catch (error) {
      console.warn("Storage count error:", error);
      return 0;
    }
  },
  /**
   * Получение всех данных в виде объекта
   * @returns {Object} объект со всеми сохраненными данными
   */
  getAll: () => {
    try {
      const allKeys = storage.keys();
      const result = {};
      allKeys.forEach((key) => {
        result[key] = GM_getValue(key);
      });
      return result;
    } catch (error) {
      console.warn("Storage getAll error:", error);
      return {};
    }
  },
  /**
   * ОПАСНО: Очистка всех данных скрипта
   * @param {boolean} confirmClear - обязательный флаг подтверждения (должен быть true)
   * @returns {boolean} успешность операции
   */
  clearAll: (confirmClear = false) => {
    if (confirmClear !== true) {
      console.warn("Storage clearAll: confirmClear must be explicitly set to true");
      return false;
    }
    try {
      const allKeys = storage.keys();
      allKeys.forEach((key) => GM_deleteValue(key));
      return true;
    } catch (error) {
      console.warn("Storage clearAll error:", error);
      return false;
    }
  },
  /**
   * Проверка пустоты хранилища
   * @returns {boolean} true если хранилище пустое
   */
  isEmpty: () => {
    try {
      return storage.keys().length === 0;
    } catch (error) {
      console.warn("Storage isEmpty error:", error);
      return true;
    }
  }
};


/***/ },

/***/ "./src/kinozal/storage.js"
/*!********************************!*\
  !*** ./src/kinozal/storage.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   filterStorage: () => (/* binding */ filterStorage)
/* harmony export */ });
/* unused harmony export FILTER_KEYS */
/* harmony import */ var _common_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/storage */ "./src/common/storage.js");

const FILTER_KEYS = {
  PERMANENT: "kinozal_permanent_filter",
  MIN_SEEDS: "kinozal_min_seeds_filter"
};
const filterStorage = {
  /**
   * Получает сохраненный постоянный фильтр
   * @returns {string} Постоянный фильтр или пустая строка
   */
  getPermanent: () => _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.get(FILTER_KEYS.PERMANENT, ""),
  /**
   * Сохраняет постоянный фильтр
   * @param {string|null|undefined} value - Фильтр для сохранения
   */
  setPermanent: (value) => {
    const normalizedValue = String(value || "").trim();
    _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.set(FILTER_KEYS.PERMANENT, normalizedValue);
  },
  /**
   * Удаляет сохраненный постоянный фильтр
   */
  clearPermanent: () => _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.remove(FILTER_KEYS.PERMANENT),
  /**
   * Проверяет, есть ли сохраненный фильтр
   * @returns {boolean} true, если фильтр сохранен
   */
  hasPermanent: () => Boolean(filterStorage.getPermanent()),
  /**
   * Получает сохраненное минимальное количество сидов
   * @returns {number} Минимальное количество сидов или 0
   */
  getMinSeeds: () => _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.get(FILTER_KEYS.MIN_SEEDS, 0),
  /**
   * Сохраняет минимальное количество сидов
   * @param {string|number|null|undefined} value - Минимальное количество сидов
   */
  setMinSeeds: (value) => {
    const normalizedValue = parseInt(value, 10) || 0;
    _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.set(FILTER_KEYS.MIN_SEEDS, normalizedValue);
  },
  /**
   * Удаляет сохраненное минимальное количество сидов
   */
  clearMinSeeds: () => _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.remove(FILTER_KEYS.MIN_SEEDS),
  /**
   * Проверяет, установлен ли фильтр по минимальному количеству сидов
   * @returns {boolean} true, если фильтр установлен (больше 0)
   */
  hasMinSeeds: () => filterStorage.getMinSeeds() > 0
};


/***/ },

/***/ "./src/kinozal/filters-template.html"
/*!*******************************************!*\
  !*** ./src/kinozal/filters-template.html ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<table class=\"tables1\">\r\n    <tbody>\r\n    <tr>\r\n        <td colspan=\"6\">Дополнительные фильтры</td>\r\n    </tr>\r\n    <tr>\r\n        <td>Название</td>\r\n        <td>Постоянный</td>\r\n        <td>Мин. размер (ГБ)</td>\r\n        <td>Макс. размер (ГБ)</td>\r\n        <td>Мин. сидов</td>\r\n        <td></td>\r\n    </tr>\r\n    <tr>\r\n        <td>\r\n            <input type=\"text\" id=\"filter-name\" class=\"w98p\" placeholder=\"Обычный фильтр\">\r\n        </td>\r\n        <td>\r\n            <input type=\"text\" id=\"filter-permanent\" class=\"w98p\" placeholder=\"Постоянный\">\r\n        </td>\r\n        <td>\r\n            <input type=\"number\" id=\"filter-min-size\" class=\"w98p\" placeholder=\"Мин. (ГБ)\" step=\"1\" min=\"0\">\r\n        </td>\r\n        <td>\r\n            <input type=\"number\" id=\"filter-max-size\" class=\"w98p\" placeholder=\"Макс. (ГБ)\" step=\"1\" min=\"0\">\r\n        </td>\r\n        <td>\r\n            <input type=\"number\" id=\"filter-min-seeds\" class=\"w98p\" placeholder=\"Мин. сидов\" step=\"1\" min=\"0\">\r\n        </td>\r\n        <td class=\"center\">\r\n            <input type=\"button\" id=\"reset-filters\" value=\"Сброс\" class=\"buttonS w98p\">\r\n        </td>\r\n    </tr>\r\n    <tr id=\"custom-counter\">\r\n        <td colspan=\"6\"><span class=\"bulet\"></span><span id=\"counter-text\">Показано 0 из 0 раздач</span></td>\r\n    </tr>\r\n    </tbody>\r\n</table>\r\n");

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
/*!******************************!*\
  !*** ./src/kinozal/index.js ***!
  \******************************/
/* harmony import */ var _common_dom_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/dom/utils */ "./src/common/dom/utils.js");
/* harmony import */ var _filters_template_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filters-template.html */ "./src/kinozal/filters-template.html");
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./storage */ "./src/kinozal/storage.js");
/* harmony import */ var _common_filter_compare__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/filter/compare */ "./src/common/filter/compare.js");




let filterControls = null;
let torrentRowsCache = null;
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createAdditionalFilters);
} else {
  setTimeout(createAdditionalFilters, 100);
}
function createAdditionalFilters() {
  const originalFilterDiv = document.querySelector("div.bx1_0");
  if (!originalFilterDiv) return;
  const customFiltersDiv = document.createElement("div");
  customFiltersDiv.className = "bx1_0";
  customFiltersDiv.style.padding = "3px 38px 3px 5px";
  customFiltersDiv.style.marginBottom = "7px";
  customFiltersDiv.innerHTML = _filters_template_html__WEBPACK_IMPORTED_MODULE_1__["default"];
  originalFilterDiv.parentNode.insertBefore(customFiltersDiv, originalFilterDiv.nextSibling);
  const {
    minSizeInput,
    maxSizeInput,
    nameFilterInput,
    permanentFilterInput,
    minSeedsInput,
    resetButton
  } = getFilterControls();
  if (permanentFilterInput) {
    permanentFilterInput.value = _storage__WEBPACK_IMPORTED_MODULE_2__.filterStorage.getPermanent();
  }
  if (minSeedsInput) {
    const savedMinSeeds = _storage__WEBPACK_IMPORTED_MODULE_2__.filterStorage.getMinSeeds();
    minSeedsInput.value = savedMinSeeds > 0 ? savedMinSeeds : "";
  }
  const debouncedFilter = (0,_common_dom_utils__WEBPACK_IMPORTED_MODULE_0__.debounce)(applyFilters, 250);
  if (minSizeInput) {
    minSizeInput.addEventListener("input", debouncedFilter);
  }
  if (maxSizeInput) {
    maxSizeInput.addEventListener("input", debouncedFilter);
  }
  if (nameFilterInput) {
    nameFilterInput.addEventListener("input", debouncedFilter);
  }
  if (permanentFilterInput) {
    permanentFilterInput.addEventListener("input", (e) => {
      _storage__WEBPACK_IMPORTED_MODULE_2__.filterStorage.setPermanent(e.target.value);
      debouncedFilter();
    });
  }
  if (minSeedsInput) {
    minSeedsInput.addEventListener("input", (e) => {
      _storage__WEBPACK_IMPORTED_MODULE_2__.filterStorage.setMinSeeds(e.target.value);
      debouncedFilter();
    });
  }
  if (resetButton) {
    resetButton.addEventListener("click", resetFilters);
  }
  setTimeout(() => {
    initializeTorrentRowsCache();
    if (torrentRowsCache && torrentRowsCache.length > 0) {
      updateCounter(torrentRowsCache.length, torrentRowsCache.length);
      const hasPermanentFilter = permanentFilterInput && permanentFilterInput.value;
      const hasMinSeedsFilter = minSeedsInput && minSeedsInput.value;
      if (hasPermanentFilter || hasMinSeedsFilter) {
        applyFilters();
      }
    }
  }, 100);
}
function getFilterControls() {
  if (filterControls) return filterControls;
  filterControls = {
    minSizeInput: document.getElementById("filter-min-size"),
    maxSizeInput: document.getElementById("filter-max-size"),
    nameFilterInput: document.getElementById("filter-name"),
    permanentFilterInput: document.getElementById("filter-permanent"),
    minSeedsInput: document.getElementById("filter-min-seeds"),
    resetButton: document.getElementById("reset-filters"),
    counterText: document.getElementById("counter-text")
  };
  return filterControls;
}
function resetFilters() {
  const {
    minSizeInput,
    maxSizeInput,
    nameFilterInput,
    permanentFilterInput,
    minSeedsInput
  } = getFilterControls();
  const inputs = [
    minSizeInput,
    maxSizeInput,
    nameFilterInput,
    permanentFilterInput,
    minSeedsInput
  ];
  inputs.forEach((input) => {
    if (input) input.value = "";
  });
  _storage__WEBPACK_IMPORTED_MODULE_2__.filterStorage.clearPermanent();
  _storage__WEBPACK_IMPORTED_MODULE_2__.filterStorage.clearMinSeeds();
  if (torrentRowsCache) {
    torrentRowsCache.forEach((rowData) => {
      rowData.element.style.display = "";
    });
    updateCounter(torrentRowsCache.length, torrentRowsCache.length);
  }
}
function initializeTorrentRowsCache() {
  if (torrentRowsCache) return;
  const torrentTable = document.querySelector(".t_peer");
  const torrentRows = torrentTable?.querySelectorAll("tbody tr:not(.mn)") || [];
  torrentRowsCache = Array.from(torrentRows).map((row) => {
    const titleCell = row.querySelector(".nam a");
    if (!titleCell) return null;
    const title = titleCell.textContent.trim();
    const sizeText = findFileSize(row);
    const fileSizeGB = parseFileSize(sizeText);
    const seedsCount = parseSeedsCount(row);
    return {
      element: row,
      title,
      fileSizeGB,
      seedsCount
    };
  }).filter(Boolean);
}
function updateCounter(visible, total) {
  const { counterText } = getFilterControls();
  if (!counterText) return;
  counterText.textContent = `\u041F\u043E\u043A\u0430\u0437\u0430\u043D\u043E ${visible} \u0438\u0437 ${total} \u0440\u0430\u0437\u0434\u0430\u0447`;
}
function applyFilters() {
  const {
    minSizeInput,
    maxSizeInput,
    nameFilterInput,
    permanentFilterInput,
    minSeedsInput
  } = getFilterControls();
  const minSize = minSizeInput?.value ? parseFloat(minSizeInput.value) : 0;
  const maxSize = maxSizeInput?.value ? parseFloat(maxSizeInput.value) : Infinity;
  const nameFilter = nameFilterInput?.value || "";
  const permanentFilter = permanentFilterInput?.value || "";
  const minSeeds = minSeedsInput?.value ? parseInt(minSeedsInput.value, 10) : 0;
  if (!torrentRowsCache) return;
  let visibleCount = 0;
  const totalCount = torrentRowsCache.length;
  torrentRowsCache.forEach((rowData) => {
    const sizeMatches = matchesSizeFilters(rowData, minSize, maxSize);
    const nameMatches = matchesNameFilters(rowData.title, nameFilter, permanentFilter);
    const seedsMatches = matchesSeedsFilter(rowData, minSeeds);
    if (sizeMatches && nameMatches && seedsMatches) {
      rowData.element.style.display = "";
      visibleCount += 1;
    } else {
      rowData.element.style.display = "none";
    }
  });
  updateCounter(visibleCount, totalCount);
}
function findFileSize(row) {
  const sizeCells = row.querySelectorAll("td.s");
  if (sizeCells.length === 0) return "";
  const sizeCell = Array.from(sizeCells).findLast((cell) => /(МБ|ГБ|MB|GB)/i.test(cell.textContent));
  return sizeCell ? sizeCell.textContent.trim() : "";
}
function parseFileSize(sizeText) {
  if (!sizeText) return 0;
  const cleanText = sizeText.replace(/\s+/g, " ").trim();
  const match = cleanText.match(/([\d,.]+)\s*(МБ|ГБ|MB|GB)/i);
  if (!match) return 0;
  const size = parseFloat(match[1].replace(",", "."));
  const unit = match[2].toUpperCase();
  if (unit === "\u041C\u0411" || unit === "MB") {
    return size / 1024;
  }
  return size;
}
function parseSeedsCount(row) {
  const seedsCell = row.querySelector("td.sl_s");
  if (!seedsCell) return 0;
  const seedsText = seedsCell.textContent.trim();
  const seedsCount = parseInt(seedsText, 10);
  return Number.isNaN(seedsCount) ? 0 : seedsCount;
}
function matchesSizeFilters(rowData, minSize, maxSize) {
  return rowData.fileSizeGB >= minSize && (maxSize === 0 || rowData.fileSizeGB <= maxSize);
}
function matchesNameFilters(title, searchFilter, permanentFilter) {
  const allFilters = [searchFilter, permanentFilter].filter((f) => f && f.trim()).join(",");
  return (0,_common_filter_compare__WEBPACK_IMPORTED_MODULE_3__.isMatchTextFilter)(title, allFilters);
}
function matchesSeedsFilter(rowData, minSeeds) {
  return rowData.seedsCount >= minSeeds;
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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UUFBTSxZQUFZLElBQUksY0FBYyxTQUFTO0FBQzdDLE1BQUksQ0FBQyxVQUFXLFFBQU87QUFFdkIsUUFBTSxZQUFZLFVBQVUsWUFBWSxLQUFLO0FBQzdDLFFBQU0sYUFBYSxTQUFTLFdBQVcsRUFBRTtBQUV6QyxTQUFPLE9BQU8sTUFBTSxVQUFVLElBQUksSUFBSTtBQUMxQztBQUVBLFNBQVMsbUJBQW1CLFNBQVMsU0FBUyxTQUFTO0FBQ25ELFNBQU8sUUFBUSxjQUFjLFlBQVksWUFBWSxLQUFLLFFBQVEsY0FBYztBQUNwRjtBQUVBLFNBQVMsbUJBQW1CLE9BQU8sY0FBYyxpQkFBaUI7QUFDOUQsUUFBTSxhQUFhLENBQUMsY0FBYyxlQUFlLEVBQzVDLE9BQU8sQ0FBQyxNQUFNLEtBQUssRUFBRSxLQUFLLENBQUMsRUFDM0IsS0FBSyxHQUFHO0FBRWIsU0FBTyx5RUFBaUIsQ0FBQyxPQUFPLFVBQVU7QUFDOUM7QUFFQSxTQUFTLG1CQUFtQixTQUFTLFVBQVU7QUFDM0MsU0FBTyxRQUFRLGNBQWM7QUFDakMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL2RvbS9sb2dnaW5nLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vZG9tL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vZmlsdGVyL2NvbXBhcmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9maWx0ZXIvaGVscGVycy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL3N0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tpbm96YWwvc3RvcmFnZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMva2lub3phbC9maWx0ZXJzLXRlbXBsYXRlLmh0bWwiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tpbm96YWwvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgSVNfREVCVUcgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JztcblxuZnVuY3Rpb24gbG9nSWZEZWJ1ZyguLi5hcmdzKSB7XG4gICAgaWYgKCFJU19ERUJVRykgcmV0dXJuO1xuICAgIGNvbnNvbGUubG9nKC4uLmFyZ3MpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9nRWxlbWVudFNlYXJjaChzZWxlY3RvciwgcGFyZW50Tm9kZSwgcmVzdWx0KSB7XG4gICAgY29uc3QgZm91bmQgPSByZXN1bHQgaW5zdGFuY2VvZiBOb2RlTGlzdCA/IHJlc3VsdC5sZW5ndGggPiAwIDogQm9vbGVhbihyZXN1bHQpO1xuXG4gICAgbG9nSWZEZWJ1ZyhcbiAgICAgICAgYCR7Zm91bmQgPyAn4pyFIEZvdW5kIGVsZW1lbnQnIDogJ+KdjCBOb3QgZm91bmQgZWxlbWVudCd9YCxcbiAgICAgICAgJ1xcbiDilJzilIAgU2VsZWN0b3I6JyxcbiAgICAgICAgYFwiJHtzZWxlY3Rvcn1cImAsXG4gICAgICAgICdcXG4g4pSc4pSAIFBhcmVudDonLFxuICAgICAgICBwYXJlbnROb2RlLFxuICAgICAgICAnXFxuIOKUlOKUgCBSZXN1bHQ6JyxcbiAgICAgICAgcmVzdWx0LFxuICAgICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dFbGVtZW50V2FpdChzZWxlY3RvciwgcGFyZW50Tm9kZSkge1xuICAgIGxvZ0lmRGVidWcoXG4gICAgICAgICfij7MgV2FpdGluZyBmb3IgZWxlbWVudCcsXG4gICAgICAgICdcXG4g4pSc4pSAIFNlbGVjdG9yOicsXG4gICAgICAgIGBcIiR7c2VsZWN0b3J9XCJgLFxuICAgICAgICAnXFxuIOKUlOKUgCBQYXJlbnQ6JyxcbiAgICAgICAgcGFyZW50Tm9kZSxcbiAgICApO1xufVxuIiwiaW1wb3J0IHsgbG9nRWxlbWVudFNlYXJjaCwgbG9nRWxlbWVudFdhaXQgfSBmcm9tICcuL2xvZ2dpbmcnO1xuXG5leHBvcnQgZnVuY3Rpb24gd2FpdEZvckVsZW1lbnQocGFyZW50Tm9kZSwgc2VsZWN0b3IsIHRpbWVvdXQgPSBudWxsLCBsb2dPbkRlYnVnID0gZmFsc2UpIHtcbiAgICBjb25zdCBleGlzdGluZ0VsZW1lbnQgPSBwYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgIGlmIChleGlzdGluZ0VsZW1lbnQpIHtcbiAgICAgICAgaWYgKGxvZ09uRGVidWcpIGxvZ0VsZW1lbnRTZWFyY2goc2VsZWN0b3IsIHBhcmVudE5vZGUsIGV4aXN0aW5nRWxlbWVudCk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZXhpc3RpbmdFbGVtZW50KTtcbiAgICB9XG5cbiAgICBpZiAobG9nT25EZWJ1ZykgbG9nRWxlbWVudFdhaXQoc2VsZWN0b3IsIHBhcmVudE5vZGUpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIobXV0YXRpb25DYWxsYmFjayk7XG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUocGFyZW50Tm9kZSwge1xuICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IHRpbWVvdXRJZDtcbiAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICBpZiAobG9nT25EZWJ1ZykgbG9nRWxlbWVudFNlYXJjaChzZWxlY3RvciwgcGFyZW50Tm9kZSwgbnVsbCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbXV0YXRpb25DYWxsYmFjaygpIHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBwYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50KSByZXR1cm47XG5cbiAgICAgICAgICAgIGlmICh0aW1lb3V0SWQpIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgaWYgKGxvZ09uRGVidWcpIGxvZ0VsZW1lbnRTZWFyY2goc2VsZWN0b3IsIHBhcmVudE5vZGUsIGVsZW1lbnQpO1xuICAgICAgICAgICAgcmVzb2x2ZShlbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2FpdFVudGlsRWxlbWVudEdvbmUocGFyZW50Tm9kZSwgc2VsZWN0b3IpIHtcbiAgICBjb25zdCBleGlzdGluZ0VsZW1lbnQgPSBwYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgIGlmICghZXhpc3RpbmdFbGVtZW50KSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihtdXRhdGlvbkNhbGxiYWNrKTtcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShwYXJlbnROb2RlLCB7XG4gICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBtdXRhdGlvbkNhbGxiYWNrKCkge1xuICAgICAgICAgICAgaWYgKHBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihzZWxlY3RvcikpIHJldHVybjtcblxuICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3YWl0VW50aWxFbGVtZW50U3RhYmlsaXplZChlbGVtZW50LCB0aW1lb3V0ID0gNDAwKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGxldCB0aW1lb3V0SWQ7XG5cbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgICAgIHNjaGVkdWxlQ29tcGxldGlvbigpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBzY2hlZHVsZUNvbXBsZXRpb24oKSB7XG4gICAgICAgICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgIH1cblxuICAgICAgICBzY2hlZHVsZUNvbXBsZXRpb24oKTtcblxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQsIHtcbiAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCA9IDI1MCkge1xuICAgIGxldCB0aW1lb3V0SWQ7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IGZ1bmMuYXBwbHkodGhpcywgYXJncyksIHdhaXQpO1xuICAgIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBydW5XaGVuVmlzaWJsZShjYWxsYmFjaykge1xuICAgIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICd2aXNpYmxlJykge1xuICAgICAgICBhd2FpdCBjYWxsYmFjaygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAndmlzaWJsZScpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7IG9uY2U6IHRydWUgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcnVuT25jZU9uSW50ZXJzZWN0aW9uKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKGVudHJpZXMpID0+IHtcbiAgICAgICAgZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFlbnRyeS5pc0ludGVyc2VjdGluZykgcmV0dXJuO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIGNsZWFySW50ZXJzZWN0aW9uT2JzZXJ2ZXIoZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZWxlbWVudC5pbnRlcnNlY3Rpb25PYnNlcnZlciA9IG9ic2VydmVyO1xuICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckludGVyc2VjdGlvbk9ic2VydmVyKGVsZW1lbnQpIHtcbiAgICBpZiAoIWVsZW1lbnQuaW50ZXJzZWN0aW9uT2JzZXJ2ZXIpIHJldHVybjtcblxuICAgIGVsZW1lbnQuaW50ZXJzZWN0aW9uT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgIGVsZW1lbnQuaW50ZXJzZWN0aW9uT2JzZXJ2ZXIgPSBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJPYnNlcnZlcihvYnNlcnZlcikge1xuICAgIGlmICghb2JzZXJ2ZXIpIHJldHVybjtcbiAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgb2JzZXJ2ZXIgPSBudWxsO1xufVxuIiwiaW1wb3J0IHsgcGFyc2VGaWx0ZXJRdWVyeSB9IGZyb20gJy4vaGVscGVycyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc01hdGNoVGV4dEZpbHRlcihwYXJhbWV0ZXJWYWx1ZSwgZmlsdGVyVmFsdWUpIHtcbiAgICBpZiAoIWZpbHRlclZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCByZXF1aXJlbWVudHMgPSBwYXJzZUZpbHRlclF1ZXJ5KGZpbHRlclZhbHVlKTtcbiAgICByZXR1cm4gbWF0Y2hlc1F1ZXJ5KHBhcmFtZXRlclZhbHVlLCByZXF1aXJlbWVudHMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWF0Y2hlc1F1ZXJ5KHRleHQsIHJlcXVpcmVtZW50cykge1xuICAgIGlmICghcmVxdWlyZW1lbnRzIHx8ICFyZXF1aXJlbWVudHMubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcblxuICAgIGNvbnN0IG5vcm1hbGl6ZWRUZXh0ID0gKHRleHQgfHwgJycpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICByZXR1cm4gcmVxdWlyZW1lbnRzLmV2ZXJ5KChncm91cCkgPT4gY2hlY2tHcm91cE1hdGNoKG5vcm1hbGl6ZWRUZXh0LCBncm91cCkpO1xufVxuXG5mdW5jdGlvbiBjaGVja0dyb3VwTWF0Y2godGV4dCwgZ3JvdXBDb25kaXRpb25zKSB7XG4gICAgcmV0dXJuIGdyb3VwQ29uZGl0aW9ucy5zb21lKCh7IHRlcm0sIGlzTmVnYXRpdmUgfSkgPT4ge1xuICAgICAgICBjb25zdCBpbmNsdWRlcyA9IHRleHQuaW5jbHVkZXModGVybSk7XG4gICAgICAgIHJldHVybiBpc05lZ2F0aXZlID8gIWluY2x1ZGVzIDogaW5jbHVkZXM7XG4gICAgfSk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gcGFyc2VGaWx0ZXJRdWVyeShxdWVyeVN0cmluZykge1xuICAgIGlmICghcXVlcnlTdHJpbmcpIHJldHVybiBbXTtcblxuICAgIHJldHVybiBxdWVyeVN0cmluZy50b0xvd2VyQ2FzZSgpXG4gICAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAgIC5tYXAocGFyc2VHcm91cClcbiAgICAgICAgLmZpbHRlcihCb29sZWFuKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VHcm91cChncm91cFN0cmluZykge1xuICAgIGNvbnN0IHRva2VucyA9IGdyb3VwU3RyaW5nLnNwbGl0KCcvJylcbiAgICAgICAgLm1hcCgocykgPT4gcy50cmltKCkpXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICBpZiAodG9rZW5zLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBjb25kaXRpb25zID0gdG9rZW5zXG4gICAgICAgIC5tYXAoY3JlYXRlQ29uZGl0aW9uKVxuICAgICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgcmV0dXJuIGNvbmRpdGlvbnMubGVuZ3RoID4gMCA/IGNvbmRpdGlvbnMgOiBudWxsO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb25kaXRpb24ocmF3VG9rZW4pIHtcbiAgICBjb25zdCBpc05lZ2F0aXZlID0gcmF3VG9rZW4uc3RhcnRzV2l0aCgnIScpO1xuICAgIGNvbnN0IHRlcm0gPSBpc05lZ2F0aXZlID8gcmF3VG9rZW4uc2xpY2UoMSkudHJpbSgpIDogcmF3VG9rZW47XG5cbiAgICBpZiAoIXRlcm0pIHJldHVybiBudWxsO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGVybSxcbiAgICAgICAgaXNOZWdhdGl2ZSxcbiAgICB9O1xufVxuXG4iLCJleHBvcnQgY29uc3Qgc3RvcmFnZSA9IHtcbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LXQvdC40LUg0LTQsNC90L3Ri9GFINC40LcgR00gc3RvcmFnZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSDQutC70Y7Rh1xuICAgICAqIEBwYXJhbSB7Kn0gZGVmYXVsdFZhbHVlIC0g0LfQvdCw0YfQtdC90LjQtSDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxuICAgICAqIEByZXR1cm5zIHsqfSDQt9C90LDRh9C10L3QuNC1INC40LvQuCBkZWZhdWx0VmFsdWVcbiAgICAgKi9cbiAgICBnZXQ6IChrZXksIGRlZmF1bHRWYWx1ZSA9IG51bGwpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBHTV9nZXRWYWx1ZShrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFN0b3JhZ2UgZ2V0IGVycm9yIGZvciBrZXkgXCIke2tleX1cIjpgLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCh0L7RhdGA0LDQvdC10L3QuNC1INC00LDQvdC90YvRhSDQsiBHTSBzdG9yYWdlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtINC60LvRjtGHXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSAtINC30L3QsNGH0LXQvdC40LUgKNC70Y7QsdC+0Lkg0YLQuNC/KVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSDRg9GB0L/QtdGI0L3QvtGB0YLRjCDQvtC/0LXRgNCw0YbQuNC4XG4gICAgICovXG4gICAgc2V0OiAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgR01fc2V0VmFsdWUoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgU3RvcmFnZSBzZXQgZXJyb3IgZm9yIGtleSBcIiR7a2V5fVwiOmAsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdGD0YnQtdGB0YLQstGD0Y7RidC40YUg0LTQsNC90L3Ri9GFINGH0LXRgNC10Lcg0YTRg9C90LrRhtC40Y5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0g0LrQu9GO0YdcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSB1cGRhdGVGbiAtINGE0YPQvdC60YbQuNGPINC+0LHQvdC+0LLQu9C10L3QuNGPICjQv9C+0LvRg9GH0LDQtdGCINGC0LXQutGD0YnQtdC1INC30L3QsNGH0LXQvdC40LUsINCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINC90L7QstC+0LUpXG4gICAgICogQHBhcmFtIHsqfSBkZWZhdWx0VmFsdWUgLSDQt9C90LDRh9C10L3QuNC1INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC10YHQu9C4INC60LvRjtGHINC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YJcbiAgICAgKiBAcmV0dXJucyB7Kn0g0L3QvtCy0L7QtSDQt9C90LDRh9C10L3QuNC1XG4gICAgICovXG4gICAgdXBkYXRlOiAoa2V5LCB1cGRhdGVGbiwgZGVmYXVsdFZhbHVlID0gbnVsbCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFZhbHVlID0gc3RvcmFnZS5nZXQoa2V5LCBkZWZhdWx0VmFsdWUpO1xuICAgICAgICAgICAgY29uc3QgbmV3VmFsdWUgPSB1cGRhdGVGbihjdXJyZW50VmFsdWUpO1xuICAgICAgICAgICAgc3RvcmFnZS5zZXQoa2V5LCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gbmV3VmFsdWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFN0b3JhZ2UgdXBkYXRlIGVycm9yIGZvciBrZXkgXCIke2tleX1cIjpgLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmFnZS5nZXQoa2V5LCBkZWZhdWx0VmFsdWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCj0LTQsNC70LXQvdC40LUg0LTQsNC90L3Ri9GFINC40LcgR00gc3RvcmFnZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSDQutC70Y7Rh1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSDRg9GB0L/QtdGI0L3QvtGB0YLRjCDQvtC/0LXRgNCw0YbQuNC4XG4gICAgICovXG4gICAgcmVtb3ZlOiAoa2V5KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBHTV9kZWxldGVWYWx1ZShrZXkpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFN0b3JhZ2UgcmVtb3ZlIGVycm9yIGZvciBrZXkgXCIke2tleX1cIjpgLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0J/RgNC+0LLQtdGA0LrQsCDRgdGD0YnQtdGB0YLQstC+0LLQsNC90LjRjyDQutC70Y7Rh9CwXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtINC60LvRjtGHXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaGFzOiAoa2V5KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmFnZS5rZXlzKCkuaW5jbHVkZXMoa2V5KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgU3RvcmFnZSBoYXMgZXJyb3IgZm9yIGtleSBcIiR7a2V5fVwiOmAsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LXQvdC40LUg0LLRgdC10YUg0LrQu9GO0YfQtdC5XG4gICAgICogQHJldHVybnMge3N0cmluZ1tdfSDQvNCw0YHRgdC40LIg0LrQu9GO0YfQtdC5XG4gICAgICovXG4gICAga2V5czogKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIEdNX2xpc3RWYWx1ZXMoKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSBrZXlzIGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQntGH0LjRgdGC0LrQsCDQtNCw0L3QvdGL0YUg0YHQutGA0LjQv9GC0LBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBrZXlzVG9SZW1vdmUgLSDQvNCw0YHRgdC40LIg0LrQu9GO0YfQtdC5INC00LvRjyDRg9C00LDQu9C10L3QuNGPXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59INGD0YHQv9C10YjQvdC+0YHRgtGMINC+0L/QtdGA0LDRhtC40LhcbiAgICAgKi9cbiAgICBjbGVhcjogKGtleXNUb1JlbW92ZSA9IG51bGwpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGFsbEtleXMgPSBrZXlzVG9SZW1vdmUgfHwgc3RvcmFnZS5rZXlzKCk7XG4gICAgICAgICAgICBhbGxLZXlzLmZvckVhY2goKGtleSkgPT4gR01fZGVsZXRlVmFsdWUoa2V5KSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSBjbGVhciBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0JzQsNGB0YHQvtCy0L7QtSDQv9C+0LvRg9GH0LXQvdC40LUg0LTQsNC90L3Ri9GFXG4gICAgICogQHBhcmFtIHtzdHJpbmdbXX0ga2V5c0xpc3QgLSDQvNCw0YHRgdC40LIg0LrQu9GO0YfQtdC5XG4gICAgICogQHBhcmFtIHsqfSBkZWZhdWx0VmFsdWUgLSDQt9C90LDRh9C10L3QuNC1INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC00LvRjyDQvtGC0YHRg9GC0YHRgtCy0YPRjtGJ0LjRhSDQutC70Y7Rh9C10LlcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSDQvtCx0YrQtdC60YIg0YEg0L/QsNGA0LDQvNC4INC60LvRjtGHLdC30L3QsNGH0LXQvdC40LVcbiAgICAgKi9cbiAgICBnZXRNdWx0aXBsZTogKGtleXNMaXN0LCBkZWZhdWx0VmFsdWUgPSBudWxsKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgICAgICBrZXlzTGlzdC5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gc3RvcmFnZS5nZXQoa2V5LCBkZWZhdWx0VmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0JzQsNGB0YHQvtCy0L7QtSDRgdC+0YXRgNCw0L3QtdC90LjQtSDQtNCw0L3QvdGL0YVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtINC+0LHRitC10LrRgiDRgSDQv9Cw0YDQsNC80Lgg0LrQu9GO0Yct0LfQvdCw0YfQtdC90LjQtVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSDRg9GB0L/QtdGI0L3QvtGB0YLRjCDQstGB0LXRhSDQvtC/0LXRgNCw0YbQuNC5XG4gICAgICovXG4gICAgc2V0TXVsdGlwbGU6IChkYXRhKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyhkYXRhKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICAgICAgICBHTV9zZXRWYWx1ZShrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2Ugc2V0TXVsdGlwbGUgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCj0LTQsNC70LXQvdC40LUg0L3QtdGB0LrQvtC70YzQutC40YUg0LrQu9GO0YfQtdC5XG4gICAgICogQHBhcmFtIHtzdHJpbmdbXX0ga2V5c1RvUmVtb3ZlIC0g0LzQsNGB0YHQuNCyINC60LvRjtGH0LXQuSDQtNC70Y8g0YPQtNCw0LvQtdC90LjRjyAo0L7QsdGP0LfQsNGC0LXQu9GM0L3Ri9C5INC/0LDRgNCw0LzQtdGC0YApXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59INGD0YHQv9C10YjQvdC+0YHRgtGMINC+0L/QtdGA0LDRhtC40LhcbiAgICAgKi9cbiAgICByZW1vdmVNdWx0aXBsZTogKGtleXNUb1JlbW92ZSkgPT4ge1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoa2V5c1RvUmVtb3ZlKSB8fCBrZXlzVG9SZW1vdmUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgcmVtb3ZlTXVsdGlwbGU6IGtleXNUb1JlbW92ZSBtdXN0IGJlIGEgbm9uLWVtcHR5IGFycmF5Jyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAga2V5c1RvUmVtb3ZlLmZvckVhY2goKGtleSkgPT4gR01fZGVsZXRlVmFsdWUoa2V5KSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSByZW1vdmVNdWx0aXBsZSBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0J/QvtC70YPRh9C10L3QuNC1INC60L7Qu9C40YfQtdGB0YLQstCwINGB0L7RhdGA0LDQvdC10L3QvdGL0YUg0LrQu9GO0YfQtdC5XG4gICAgICogQHJldHVybnMge251bWJlcn0g0LrQvtC70LjRh9C10YHRgtCy0L4g0LrQu9GO0YfQtdC5XG4gICAgICovXG4gICAgY291bnQ6ICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yYWdlLmtleXMoKS5sZW5ndGg7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgY291bnQgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0J/QvtC70YPRh9C10L3QuNC1INCy0YHQtdGFINC00LDQvdC90YvRhSDQsiDQstC40LTQtSDQvtCx0YrQtdC60YLQsFxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9INC+0LHRitC10LrRgiDRgdC+INCy0YHQtdC80Lgg0YHQvtGF0YDQsNC90LXQvdC90YvQvNC4INC00LDQvdC90YvQvNC4XG4gICAgICovXG4gICAgZ2V0QWxsOiAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBhbGxLZXlzID0gc3RvcmFnZS5rZXlzKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAgICAgICAgIGFsbEtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBHTV9nZXRWYWx1ZShrZXkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIGdldEFsbCBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0J7Qn9CQ0KHQndCeOiDQntGH0LjRgdGC0LrQsCDQstGB0LXRhSDQtNCw0L3QvdGL0YUg0YHQutGA0LjQv9GC0LBcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmZpcm1DbGVhciAtINC+0LHRj9C30LDRgtC10LvRjNC90YvQuSDRhNC70LDQsyDQv9C+0LTRgtCy0LXRgNC20LTQtdC90LjRjyAo0LTQvtC70LbQtdC9INCx0YvRgtGMIHRydWUpXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59INGD0YHQv9C10YjQvdC+0YHRgtGMINC+0L/QtdGA0LDRhtC40LhcbiAgICAgKi9cbiAgICBjbGVhckFsbDogKGNvbmZpcm1DbGVhciA9IGZhbHNlKSA9PiB7XG4gICAgICAgIGlmIChjb25maXJtQ2xlYXIgIT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSBjbGVhckFsbDogY29uZmlybUNsZWFyIG11c3QgYmUgZXhwbGljaXRseSBzZXQgdG8gdHJ1ZScpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGFsbEtleXMgPSBzdG9yYWdlLmtleXMoKTtcbiAgICAgICAgICAgIGFsbEtleXMuZm9yRWFjaCgoa2V5KSA9PiBHTV9kZWxldGVWYWx1ZShrZXkpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIGNsZWFyQWxsIGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQn9GA0L7QstC10YDQutCwINC/0YPRgdGC0L7RgtGLINGF0YDQsNC90LjQu9C40YnQsFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlINC10YHQu9C4INGF0YDQsNC90LjQu9C40YnQtSDQv9GD0YHRgtC+0LVcbiAgICAgKi9cbiAgICBpc0VtcHR5OiAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmFnZS5rZXlzKCkubGVuZ3RoID09PSAwO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIGlzRW1wdHkgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxufTtcbiIsImltcG9ydCB7IHN0b3JhZ2UgfSBmcm9tICcuLi9jb21tb24vc3RvcmFnZSc7XG5cbi8qKlxuICog0JrQu9GO0YfQuCDQtNC70Y8g0YXRgNCw0L3QtdC90LjRjyDRhNC40LvRjNGC0YDQvtCyINCyINGF0YDQsNC90LjQu9C40YnQtSBUYW1wZXJtb25rZXlcbiAqIEByZWFkb25seVxuICovXG5leHBvcnQgY29uc3QgRklMVEVSX0tFWVMgPSB7XG4gICAgUEVSTUFORU5UOiAna2lub3phbF9wZXJtYW5lbnRfZmlsdGVyJyxcbiAgICBNSU5fU0VFRFM6ICdraW5vemFsX21pbl9zZWVkc19maWx0ZXInLFxufTtcblxuLyoqXG4gKiDQntCx0YrQtdC60YIg0LTQu9GPINGA0LDQsdC+0YLRiyDRgSDQv9C+0YHRgtC+0Y/QvdC90YvQvNC4INGE0LjQu9GM0YLRgNCw0LzQuCBLaW5vemFsXG4gKi9cbmV4cG9ydCBjb25zdCBmaWx0ZXJTdG9yYWdlID0ge1xuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQsNC10YIg0YHQvtGF0YDQsNC90LXQvdC90YvQuSDQv9C+0YHRgtC+0Y/QvdC90YvQuSDRhNC40LvRjNGC0YBcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSDQn9C+0YHRgtC+0Y/QvdC90YvQuSDRhNC40LvRjNGC0YAg0LjQu9C4INC/0YPRgdGC0LDRjyDRgdGC0YDQvtC60LBcbiAgICAgKi9cbiAgICBnZXRQZXJtYW5lbnQ6ICgpID0+IHN0b3JhZ2UuZ2V0KEZJTFRFUl9LRVlTLlBFUk1BTkVOVCwgJycpLFxuXG4gICAgLyoqXG4gICAgICog0KHQvtGF0YDQsNC90Y/QtdGCINC/0L7RgdGC0L7Rj9C90L3Ri9C5INGE0LjQu9GM0YLRgFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bGx8dW5kZWZpbmVkfSB2YWx1ZSAtINCk0LjQu9GM0YLRgCDQtNC70Y8g0YHQvtGF0YDQsNC90LXQvdC40Y9cbiAgICAgKi9cbiAgICBzZXRQZXJtYW5lbnQ6ICh2YWx1ZSkgPT4ge1xuICAgICAgICBjb25zdCBub3JtYWxpemVkVmFsdWUgPSBTdHJpbmcodmFsdWUgfHwgJycpLnRyaW0oKTtcbiAgICAgICAgc3RvcmFnZS5zZXQoRklMVEVSX0tFWVMuUEVSTUFORU5ULCBub3JtYWxpemVkVmFsdWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQo9C00LDQu9GP0LXRgiDRgdC+0YXRgNCw0L3QtdC90L3Ri9C5INC/0L7RgdGC0L7Rj9C90L3Ri9C5INGE0LjQu9GM0YLRgFxuICAgICAqL1xuICAgIGNsZWFyUGVybWFuZW50OiAoKSA9PiBzdG9yYWdlLnJlbW92ZShGSUxURVJfS0VZUy5QRVJNQU5FTlQpLFxuXG4gICAgLyoqXG4gICAgICog0J/RgNC+0LLQtdGA0Y/QtdGCLCDQtdGB0YLRjCDQu9C4INGB0L7RhdGA0LDQvdC10L3QvdGL0Lkg0YTQuNC70YzRgtGAXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUsINC10YHQu9C4INGE0LjQu9GM0YLRgCDRgdC+0YXRgNCw0L3QtdC9XG4gICAgICovXG4gICAgaGFzUGVybWFuZW50OiAoKSA9PiBCb29sZWFuKGZpbHRlclN0b3JhZ2UuZ2V0UGVybWFuZW50KCkpLFxuXG4gICAgLyoqXG4gICAgICog0J/QvtC70YPRh9Cw0LXRgiDRgdC+0YXRgNCw0L3QtdC90L3QvtC1INC80LjQvdC40LzQsNC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0YHQuNC00L7QslxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9INCc0LjQvdC40LzQsNC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0YHQuNC00L7QsiDQuNC70LggMFxuICAgICAqL1xuICAgIGdldE1pblNlZWRzOiAoKSA9PiBzdG9yYWdlLmdldChGSUxURVJfS0VZUy5NSU5fU0VFRFMsIDApLFxuXG4gICAgLyoqXG4gICAgICog0KHQvtGF0YDQsNC90Y/QtdGCINC80LjQvdC40LzQsNC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0YHQuNC00L7QslxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcnxudWxsfHVuZGVmaW5lZH0gdmFsdWUgLSDQnNC40L3QuNC80LDQu9GM0L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INGB0LjQtNC+0LJcbiAgICAgKi9cbiAgICBzZXRNaW5TZWVkczogKHZhbHVlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRWYWx1ZSA9IHBhcnNlSW50KHZhbHVlLCAxMCkgfHwgMDtcbiAgICAgICAgc3RvcmFnZS5zZXQoRklMVEVSX0tFWVMuTUlOX1NFRURTLCBub3JtYWxpemVkVmFsdWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQo9C00LDQu9GP0LXRgiDRgdC+0YXRgNCw0L3QtdC90L3QvtC1INC80LjQvdC40LzQsNC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0YHQuNC00L7QslxuICAgICAqL1xuICAgIGNsZWFyTWluU2VlZHM6ICgpID0+IHN0b3JhZ2UucmVtb3ZlKEZJTFRFUl9LRVlTLk1JTl9TRUVEUyksXG5cbiAgICAvKipcbiAgICAgKiDQn9GA0L7QstC10YDRj9C10YIsINGD0YHRgtCw0L3QvtCy0LvQtdC9INC70Lgg0YTQuNC70YzRgtGAINC/0L4g0LzQuNC90LjQvNCw0LvRjNC90L7QvNGDINC60L7Qu9C40YfQtdGB0YLQstGDINGB0LjQtNC+0LJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSwg0LXRgdC70Lgg0YTQuNC70YzRgtGAINGD0YHRgtCw0L3QvtCy0LvQtdC9ICjQsdC+0LvRjNGI0LUgMClcbiAgICAgKi9cbiAgICBoYXNNaW5TZWVkczogKCkgPT4gZmlsdGVyU3RvcmFnZS5nZXRNaW5TZWVkcygpID4gMCxcbn07XG4iLCJleHBvcnQgZGVmYXVsdCBcIjx0YWJsZSBjbGFzcz1cXFwidGFibGVzMVxcXCI+XFxyXFxuICAgIDx0Ym9keT5cXHJcXG4gICAgPHRyPlxcclxcbiAgICAgICAgPHRkIGNvbHNwYW49XFxcIjZcXFwiPtCU0L7Qv9C+0LvQvdC40YLQtdC70YzQvdGL0LUg0YTQuNC70YzRgtGA0Ys8L3RkPlxcclxcbiAgICA8L3RyPlxcclxcbiAgICA8dHI+XFxyXFxuICAgICAgICA8dGQ+0J3QsNC30LLQsNC90LjQtTwvdGQ+XFxyXFxuICAgICAgICA8dGQ+0J/QvtGB0YLQvtGP0L3QvdGL0Lk8L3RkPlxcclxcbiAgICAgICAgPHRkPtCc0LjQvS4g0YDQsNC30LzQtdGAICjQk9CRKTwvdGQ+XFxyXFxuICAgICAgICA8dGQ+0JzQsNC60YEuINGA0LDQt9C80LXRgCAo0JPQkSk8L3RkPlxcclxcbiAgICAgICAgPHRkPtCc0LjQvS4g0YHQuNC00L7QsjwvdGQ+XFxyXFxuICAgICAgICA8dGQ+PC90ZD5cXHJcXG4gICAgPC90cj5cXHJcXG4gICAgPHRyPlxcclxcbiAgICAgICAgPHRkPlxcclxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBpZD1cXFwiZmlsdGVyLW5hbWVcXFwiIGNsYXNzPVxcXCJ3OThwXFxcIiBwbGFjZWhvbGRlcj1cXFwi0J7QsdGL0YfQvdGL0Lkg0YTQuNC70YzRgtGAXFxcIj5cXHJcXG4gICAgICAgIDwvdGQ+XFxyXFxuICAgICAgICA8dGQ+XFxyXFxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGlkPVxcXCJmaWx0ZXItcGVybWFuZW50XFxcIiBjbGFzcz1cXFwidzk4cFxcXCIgcGxhY2Vob2xkZXI9XFxcItCf0L7RgdGC0L7Rj9C90L3Ri9C5XFxcIj5cXHJcXG4gICAgICAgIDwvdGQ+XFxyXFxuICAgICAgICA8dGQ+XFxyXFxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcIm51bWJlclxcXCIgaWQ9XFxcImZpbHRlci1taW4tc2l6ZVxcXCIgY2xhc3M9XFxcInc5OHBcXFwiIHBsYWNlaG9sZGVyPVxcXCLQnNC40L0uICjQk9CRKVxcXCIgc3RlcD1cXFwiMVxcXCIgbWluPVxcXCIwXFxcIj5cXHJcXG4gICAgICAgIDwvdGQ+XFxyXFxuICAgICAgICA8dGQ+XFxyXFxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcIm51bWJlclxcXCIgaWQ9XFxcImZpbHRlci1tYXgtc2l6ZVxcXCIgY2xhc3M9XFxcInc5OHBcXFwiIHBsYWNlaG9sZGVyPVxcXCLQnNCw0LrRgS4gKNCT0JEpXFxcIiBzdGVwPVxcXCIxXFxcIiBtaW49XFxcIjBcXFwiPlxcclxcbiAgICAgICAgPC90ZD5cXHJcXG4gICAgICAgIDx0ZD5cXHJcXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwibnVtYmVyXFxcIiBpZD1cXFwiZmlsdGVyLW1pbi1zZWVkc1xcXCIgY2xhc3M9XFxcInc5OHBcXFwiIHBsYWNlaG9sZGVyPVxcXCLQnNC40L0uINGB0LjQtNC+0LJcXFwiIHN0ZXA9XFxcIjFcXFwiIG1pbj1cXFwiMFxcXCI+XFxyXFxuICAgICAgICA8L3RkPlxcclxcbiAgICAgICAgPHRkIGNsYXNzPVxcXCJjZW50ZXJcXFwiPlxcclxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJidXR0b25cXFwiIGlkPVxcXCJyZXNldC1maWx0ZXJzXFxcIiB2YWx1ZT1cXFwi0KHQsdGA0L7RgVxcXCIgY2xhc3M9XFxcImJ1dHRvblMgdzk4cFxcXCI+XFxyXFxuICAgICAgICA8L3RkPlxcclxcbiAgICA8L3RyPlxcclxcbiAgICA8dHIgaWQ9XFxcImN1c3RvbS1jb3VudGVyXFxcIj5cXHJcXG4gICAgICAgIDx0ZCBjb2xzcGFuPVxcXCI2XFxcIj48c3BhbiBjbGFzcz1cXFwiYnVsZXRcXFwiPjwvc3Bhbj48c3BhbiBpZD1cXFwiY291bnRlci10ZXh0XFxcIj7Qn9C+0LrQsNC30LDQvdC+IDAg0LjQtyAwINGA0LDQt9C00LDRhzwvc3Bhbj48L3RkPlxcclxcbiAgICA8L3RyPlxcclxcbiAgICA8L3Rib2R5PlxcclxcbjwvdGFibGU+XFxyXFxuXCI7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxuY29uc3QgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRjb25zdCBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0Y29uc3QgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdGNvbnN0IGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyL3ZhbHVlIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRpZihBcnJheS5pc0FycmF5KGRlZmluaXRpb24pKSB7XG5cdFx0dmFyIGkgPSAwO1xuXHRcdHdoaWxlKGkgPCBkZWZpbml0aW9uLmxlbmd0aCkge1xuXHRcdFx0dmFyIGtleSA9IGRlZmluaXRpb25baSsrXTtcblx0XHRcdHZhciBiaW5kaW5nID0gZGVmaW5pdGlvbltpKytdO1xuXHRcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRcdGlmKGJpbmRpbmcgPT09IDApIHtcblx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiBkZWZpbml0aW9uW2krK10gfSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGJpbmRpbmcgfSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZihiaW5kaW5nID09PSAwKSB7IGkrKzsgfVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsImltcG9ydCB7IGRlYm91bmNlIH0gZnJvbSAnLi4vY29tbW9uL2RvbS91dGlscyc7XG5pbXBvcnQgZmlsdGVyc1RlbXBsYXRlIGZyb20gJy4vZmlsdGVycy10ZW1wbGF0ZS5odG1sJztcbmltcG9ydCB7IGZpbHRlclN0b3JhZ2UgfSBmcm9tICcuL3N0b3JhZ2UnO1xuaW1wb3J0IHsgaXNNYXRjaFRleHRGaWx0ZXIgfSBmcm9tICcuLi9jb21tb24vZmlsdGVyL2NvbXBhcmUnO1xuXG4vLyDQmtGN0YjQuNGA0L7QstCw0L3QuNC1INGB0YLQsNGC0LjRh9C90YvRhSDRjdC70LXQvNC10L3RgtC+0LIg0YPQv9GA0LDQstC70LXQvdC40Y9cbmxldCBmaWx0ZXJDb250cm9scyA9IG51bGw7XG5cbi8vINCa0Y3RiCDQv9GA0LXQtNC+0LHRgNCw0LHQvtGC0LDQvdC90YvRhSDQtNCw0L3QvdGL0YUg0YHRgtGA0L7QuiDRgtCw0LHQu9C40YbRi1xubGV0IHRvcnJlbnRSb3dzQ2FjaGUgPSBudWxsO1xuXG4vLyDQltC00LXQvCDQt9Cw0LPRgNGD0LfQutC4IERPTSDQuCDRgdC+0LfQtNCw0LXQvCDRhNC40LvRjNGC0YDRi1xuaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdsb2FkaW5nJykge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBjcmVhdGVBZGRpdGlvbmFsRmlsdGVycyk7XG59IGVsc2Uge1xuICAgIHNldFRpbWVvdXQoY3JlYXRlQWRkaXRpb25hbEZpbHRlcnMsIDEwMCk7XG59XG5cbi8vINCh0L7Qt9C00LDQvdC40LUg0LTQvtC/0L7Qu9C90LjRgtC10LvRjNC90YvRhSDRhNC40LvRjNGC0YDQvtCyXG5mdW5jdGlvbiBjcmVhdGVBZGRpdGlvbmFsRmlsdGVycygpIHtcbiAgICAvLyDQmNGJ0LXQvCBkaXYg0YEg0LrQu9Cw0YHRgdC+0LwgYngxXzAgKNCx0LvQvtC6INGBINC+0YDQuNCz0LjQvdCw0LvRjNC90YvQvNC4INGE0LjQu9GM0YLRgNCw0LzQuClcbiAgICBjb25zdCBvcmlnaW5hbEZpbHRlckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5ieDFfMCcpO1xuICAgIGlmICghb3JpZ2luYWxGaWx0ZXJEaXYpIHJldHVybjtcblxuICAgIC8vINCh0L7Qt9C00LDQtdC8INC+0YLQtNC10LvRjNC90YvQuSDQsdC70L7QuiDQtNC70Y8g0LrQsNGB0YLQvtC80L3Ri9GFINGE0LjQu9GM0YLRgNC+0LJcbiAgICBjb25zdCBjdXN0b21GaWx0ZXJzRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY3VzdG9tRmlsdGVyc0Rpdi5jbGFzc05hbWUgPSAnYngxXzAnO1xuICAgIGN1c3RvbUZpbHRlcnNEaXYuc3R5bGUucGFkZGluZyA9ICczcHggMzhweCAzcHggNXB4JztcbiAgICBjdXN0b21GaWx0ZXJzRGl2LnN0eWxlLm1hcmdpbkJvdHRvbSA9ICc3cHgnO1xuICAgIGN1c3RvbUZpbHRlcnNEaXYuaW5uZXJIVE1MID0gZmlsdGVyc1RlbXBsYXRlO1xuXG4gICAgLy8g0JLRgdGC0LDQstC70Y/QtdC8INCx0LvQvtC6INC/0L7RgdC70LUg0L7RgNC40LPQuNC90LDQu9GM0L3QvtCz0L4g0LHQu9C+0LrQsCDRgSDRhNC40LvRjNGC0YDQsNC80LhcbiAgICBvcmlnaW5hbEZpbHRlckRpdi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShjdXN0b21GaWx0ZXJzRGl2LCBvcmlnaW5hbEZpbHRlckRpdi5uZXh0U2libGluZyk7XG5cbiAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INGN0LvQtdC80LXQvdGC0Ysg0YPQv9GA0LDQstC70LXQvdC40Y8gKNC60Y3RiCDRgdC+0LfQtNCw0LXRgtGB0Y8g0L/RgNC4INC/0LXRgNCy0L7QvCDQstGL0LfQvtCy0LUpXG4gICAgY29uc3Qge1xuICAgICAgICBtaW5TaXplSW5wdXQsXG4gICAgICAgIG1heFNpemVJbnB1dCxcbiAgICAgICAgbmFtZUZpbHRlcklucHV0LFxuICAgICAgICBwZXJtYW5lbnRGaWx0ZXJJbnB1dCxcbiAgICAgICAgbWluU2VlZHNJbnB1dCxcbiAgICAgICAgcmVzZXRCdXR0b24sXG4gICAgfSA9IGdldEZpbHRlckNvbnRyb2xzKCk7XG5cbiAgICAvLyDQl9Cw0LPRgNGD0LbQsNC10Lwg0YHQvtGF0YDQsNC90LXQvdC90YvQtSDQt9C90LDRh9C10L3QuNGPINGE0LjQu9GM0YLRgNC+0LJcbiAgICBpZiAocGVybWFuZW50RmlsdGVySW5wdXQpIHtcbiAgICAgICAgcGVybWFuZW50RmlsdGVySW5wdXQudmFsdWUgPSBmaWx0ZXJTdG9yYWdlLmdldFBlcm1hbmVudCgpO1xuICAgIH1cbiAgICBpZiAobWluU2VlZHNJbnB1dCkge1xuICAgICAgICBjb25zdCBzYXZlZE1pblNlZWRzID0gZmlsdGVyU3RvcmFnZS5nZXRNaW5TZWVkcygpO1xuICAgICAgICBtaW5TZWVkc0lucHV0LnZhbHVlID0gc2F2ZWRNaW5TZWVkcyA+IDAgPyBzYXZlZE1pblNlZWRzIDogJyc7XG4gICAgfVxuXG4gICAgLy8g0KHQvtC30LTQsNC10LwgZGVib3VuY2VkINCy0LXRgNGB0LjRjiDRhNGD0L3QutGG0LjQuCDRhNC40LvRjNGC0YDQsNGG0LjQuFxuICAgIGNvbnN0IGRlYm91bmNlZEZpbHRlciA9IGRlYm91bmNlKGFwcGx5RmlsdGVycywgMjUwKTtcblxuICAgIC8vINCU0L7QsdCw0LLQu9GP0LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC4INGB0L7QsdGL0YLQuNC5XG4gICAgaWYgKG1pblNpemVJbnB1dCkge1xuICAgICAgICBtaW5TaXplSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBkZWJvdW5jZWRGaWx0ZXIpO1xuICAgIH1cbiAgICBpZiAobWF4U2l6ZUlucHV0KSB7XG4gICAgICAgIG1heFNpemVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlYm91bmNlZEZpbHRlcik7XG4gICAgfVxuICAgIGlmIChuYW1lRmlsdGVySW5wdXQpIHtcbiAgICAgICAgbmFtZUZpbHRlcklucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZGVib3VuY2VkRmlsdGVyKTtcbiAgICB9XG4gICAgaWYgKHBlcm1hbmVudEZpbHRlcklucHV0KSB7XG4gICAgICAgIHBlcm1hbmVudEZpbHRlcklucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcbiAgICAgICAgICAgIGZpbHRlclN0b3JhZ2Uuc2V0UGVybWFuZW50KGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgIGRlYm91bmNlZEZpbHRlcigpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG1pblNlZWRzSW5wdXQpIHtcbiAgICAgICAgbWluU2VlZHNJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XG4gICAgICAgICAgICBmaWx0ZXJTdG9yYWdlLnNldE1pblNlZWRzKGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgIGRlYm91bmNlZEZpbHRlcigpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHJlc2V0QnV0dG9uKSB7XG4gICAgICAgIHJlc2V0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVzZXRGaWx0ZXJzKTtcbiAgICB9XG5cbiAgICAvLyDQn9GA0LjQvNC10L3Rj9C10Lwg0YTQuNC70YzRgtGA0Ysg0L/RgNC4INC30LDQs9GA0YPQt9C60LUgKNC10YHQu9C4INC10YHRgtGMINGB0L7RhdGA0LDQvdC10L3QvdGL0LUg0YTQuNC70YzRgtGA0YspXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGluaXRpYWxpemVUb3JyZW50Um93c0NhY2hlKCk7XG4gICAgICAgIGlmICh0b3JyZW50Um93c0NhY2hlICYmIHRvcnJlbnRSb3dzQ2FjaGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdXBkYXRlQ291bnRlcih0b3JyZW50Um93c0NhY2hlLmxlbmd0aCwgdG9ycmVudFJvd3NDYWNoZS5sZW5ndGgpO1xuICAgICAgICAgICAgY29uc3QgaGFzUGVybWFuZW50RmlsdGVyID0gcGVybWFuZW50RmlsdGVySW5wdXQgJiYgcGVybWFuZW50RmlsdGVySW5wdXQudmFsdWU7XG4gICAgICAgICAgICBjb25zdCBoYXNNaW5TZWVkc0ZpbHRlciA9IG1pblNlZWRzSW5wdXQgJiYgbWluU2VlZHNJbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIGlmIChoYXNQZXJtYW5lbnRGaWx0ZXIgfHwgaGFzTWluU2VlZHNGaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICBhcHBseUZpbHRlcnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIDEwMCk7XG59XG5cbmZ1bmN0aW9uIGdldEZpbHRlckNvbnRyb2xzKCkge1xuICAgIGlmIChmaWx0ZXJDb250cm9scykgcmV0dXJuIGZpbHRlckNvbnRyb2xzO1xuXG4gICAgZmlsdGVyQ29udHJvbHMgPSB7XG4gICAgICAgIG1pblNpemVJbnB1dDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbHRlci1taW4tc2l6ZScpLFxuICAgICAgICBtYXhTaXplSW5wdXQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWx0ZXItbWF4LXNpemUnKSxcbiAgICAgICAgbmFtZUZpbHRlcklucHV0OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsdGVyLW5hbWUnKSxcbiAgICAgICAgcGVybWFuZW50RmlsdGVySW5wdXQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWx0ZXItcGVybWFuZW50JyksXG4gICAgICAgIG1pblNlZWRzSW5wdXQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWx0ZXItbWluLXNlZWRzJyksXG4gICAgICAgIHJlc2V0QnV0dG9uOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzZXQtZmlsdGVycycpLFxuICAgICAgICBjb3VudGVyVGV4dDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvdW50ZXItdGV4dCcpLFxuICAgIH07XG5cbiAgICByZXR1cm4gZmlsdGVyQ29udHJvbHM7XG59XG5cbi8vINCk0YPQvdC60YbQuNGPINGB0LHRgNC+0YHQsCDRhNC40LvRjNGC0YDQvtCyXG5mdW5jdGlvbiByZXNldEZpbHRlcnMoKSB7XG4gICAgY29uc3Qge1xuICAgICAgICBtaW5TaXplSW5wdXQsIG1heFNpemVJbnB1dCwgbmFtZUZpbHRlcklucHV0LCBwZXJtYW5lbnRGaWx0ZXJJbnB1dCwgbWluU2VlZHNJbnB1dCxcbiAgICB9ID0gZ2V0RmlsdGVyQ29udHJvbHMoKTtcblxuICAgIC8vINCc0LDRgdGB0LjQsiBpbnB1dHMg0LTQu9GPINC40YLQtdGA0LDRhtC40LhcbiAgICBjb25zdCBpbnB1dHMgPSBbXG4gICAgICAgIG1pblNpemVJbnB1dCwgbWF4U2l6ZUlucHV0LCBuYW1lRmlsdGVySW5wdXQsIHBlcm1hbmVudEZpbHRlcklucHV0LCBtaW5TZWVkc0lucHV0LFxuICAgIF07XG4gICAgaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgICAgIGlmIChpbnB1dCkgaW5wdXQudmFsdWUgPSAnJztcbiAgICB9KTtcblxuICAgIC8vINCh0LHRgNCw0YHRi9Cy0LDQtdC8INGB0L7RhdGA0LDQvdC10L3QvdGL0LUg0YTQuNC70YzRgtGA0YtcbiAgICBmaWx0ZXJTdG9yYWdlLmNsZWFyUGVybWFuZW50KCk7XG4gICAgZmlsdGVyU3RvcmFnZS5jbGVhck1pblNlZWRzKCk7XG5cbiAgICAvLyDQn9C+0LrQsNC30YvQstCw0LXQvCDQstGB0LUg0YHRgtGA0L7QutC4XG4gICAgaWYgKHRvcnJlbnRSb3dzQ2FjaGUpIHtcbiAgICAgICAgdG9ycmVudFJvd3NDYWNoZS5mb3JFYWNoKChyb3dEYXRhKSA9PiB7XG4gICAgICAgICAgICByb3dEYXRhLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyDQntCx0L3QvtCy0LvRj9C10Lwg0YHRh9C10YLRh9C40LpcbiAgICAgICAgdXBkYXRlQ291bnRlcih0b3JyZW50Um93c0NhY2hlLmxlbmd0aCwgdG9ycmVudFJvd3NDYWNoZS5sZW5ndGgpO1xuICAgIH1cbn1cblxuLy8g0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LrRjdGI0LAg0L/RgNC10LTQvtCx0YDQsNCx0L7RgtCw0L3QvdGL0YUg0LTQsNC90L3Ri9GFINGB0YLRgNC+0Log0YLQsNCx0LvQuNGG0YtcbmZ1bmN0aW9uIGluaXRpYWxpemVUb3JyZW50Um93c0NhY2hlKCkge1xuICAgIGlmICh0b3JyZW50Um93c0NhY2hlKSByZXR1cm47IC8vINCa0Y3RiCDRg9C20LUg0YHQvtC30LTQsNC9XG5cbiAgICBjb25zdCB0b3JyZW50VGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudF9wZWVyJyk7XG4gICAgY29uc3QgdG9ycmVudFJvd3MgPSB0b3JyZW50VGFibGU/LnF1ZXJ5U2VsZWN0b3JBbGwoJ3Rib2R5IHRyOm5vdCgubW4pJykgfHwgW107XG5cbiAgICB0b3JyZW50Um93c0NhY2hlID0gQXJyYXkuZnJvbSh0b3JyZW50Um93cykubWFwKChyb3cpID0+IHtcbiAgICAgICAgY29uc3QgdGl0bGVDZWxsID0gcm93LnF1ZXJ5U2VsZWN0b3IoJy5uYW0gYScpO1xuICAgICAgICBpZiAoIXRpdGxlQ2VsbCkgcmV0dXJuIG51bGw7IC8vINCf0YDQvtC/0YPRgdC60LDQtdC8INC90LXQstCw0LvQuNC00L3Ri9C1INGB0YLRgNC+0LrQuFxuXG4gICAgICAgIGNvbnN0IHRpdGxlID0gdGl0bGVDZWxsLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICAgICAgY29uc3Qgc2l6ZVRleHQgPSBmaW5kRmlsZVNpemUocm93KTtcbiAgICAgICAgY29uc3QgZmlsZVNpemVHQiA9IHBhcnNlRmlsZVNpemUoc2l6ZVRleHQpO1xuICAgICAgICBjb25zdCBzZWVkc0NvdW50ID0gcGFyc2VTZWVkc0NvdW50KHJvdyk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVsZW1lbnQ6IHJvdyxcbiAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgZmlsZVNpemVHQixcbiAgICAgICAgICAgIHNlZWRzQ291bnQsXG4gICAgICAgIH07XG4gICAgfSkuZmlsdGVyKEJvb2xlYW4pOyAvLyDQo9Cx0LjRgNCw0LXQvCBudWxsINC30L3QsNGH0LXQvdC40Y9cbn1cblxuLy8g0J7QsdC90L7QstC70LXQvdC40LUg0YHRh9C10YLRh9C40LrQsCDRgNC10LfRg9C70YzRgtCw0YLQvtCyXG5mdW5jdGlvbiB1cGRhdGVDb3VudGVyKHZpc2libGUsIHRvdGFsKSB7XG4gICAgY29uc3QgeyBjb3VudGVyVGV4dCB9ID0gZ2V0RmlsdGVyQ29udHJvbHMoKTtcbiAgICBpZiAoIWNvdW50ZXJUZXh0KSByZXR1cm47XG5cbiAgICBjb3VudGVyVGV4dC50ZXh0Q29udGVudCA9IGDQn9C+0LrQsNC30LDQvdC+ICR7dmlzaWJsZX0g0LjQtyAke3RvdGFsfSDRgNCw0LfQtNCw0YdgO1xufVxuXG4vLyDQntGB0L3QvtCy0L3QsNGPINGE0YPQvdC60YbQuNGPINGE0LjQu9GM0YLRgNCw0YbQuNC4XG5mdW5jdGlvbiBhcHBseUZpbHRlcnMoKSB7XG4gICAgY29uc3Qge1xuICAgICAgICBtaW5TaXplSW5wdXQsIG1heFNpemVJbnB1dCwgbmFtZUZpbHRlcklucHV0LCBwZXJtYW5lbnRGaWx0ZXJJbnB1dCwgbWluU2VlZHNJbnB1dCxcbiAgICB9ID0gZ2V0RmlsdGVyQ29udHJvbHMoKTtcblxuICAgIGNvbnN0IG1pblNpemUgPSBtaW5TaXplSW5wdXQ/LnZhbHVlID8gcGFyc2VGbG9hdChtaW5TaXplSW5wdXQudmFsdWUpIDogMDtcbiAgICBjb25zdCBtYXhTaXplID0gbWF4U2l6ZUlucHV0Py52YWx1ZSA/IHBhcnNlRmxvYXQobWF4U2l6ZUlucHV0LnZhbHVlKSA6IEluZmluaXR5O1xuICAgIGNvbnN0IG5hbWVGaWx0ZXIgPSBuYW1lRmlsdGVySW5wdXQ/LnZhbHVlIHx8ICcnO1xuICAgIGNvbnN0IHBlcm1hbmVudEZpbHRlciA9IHBlcm1hbmVudEZpbHRlcklucHV0Py52YWx1ZSB8fCAnJztcbiAgICBjb25zdCBtaW5TZWVkcyA9IG1pblNlZWRzSW5wdXQ/LnZhbHVlID8gcGFyc2VJbnQobWluU2VlZHNJbnB1dC52YWx1ZSwgMTApIDogMDtcblxuICAgIGlmICghdG9ycmVudFJvd3NDYWNoZSkgcmV0dXJuO1xuXG4gICAgbGV0IHZpc2libGVDb3VudCA9IDA7XG4gICAgY29uc3QgdG90YWxDb3VudCA9IHRvcnJlbnRSb3dzQ2FjaGUubGVuZ3RoO1xuXG4gICAgdG9ycmVudFJvd3NDYWNoZS5mb3JFYWNoKChyb3dEYXRhKSA9PiB7XG4gICAgICAgIC8vINCf0YDQvtCy0LXRgNC60LAg0YDQsNC30LzQtdGA0LAgKNC40YHQv9C+0LvRjNC30YPQtdC8INC/0YDQtdC00L7QsdGA0LDQsdC+0YLQsNC90L3Ri9C5INGA0LDQt9C80LXRgCDQsiDQk9CRKVxuICAgICAgICBjb25zdCBzaXplTWF0Y2hlcyA9IG1hdGNoZXNTaXplRmlsdGVycyhyb3dEYXRhLCBtaW5TaXplLCBtYXhTaXplKTtcblxuICAgICAgICAvLyDQn9GA0L7QstC10YDQutCwINC40LzQtdC90LggKNC40YHQv9C+0LvRjNC30YPQtdC8INC/0YDQtdC00L7QsdGA0LDQsdC+0YLQsNC90L3QvtC1INC90LDQt9Cy0LDQvdC40LUg0LIg0L3QuNC20L3QtdC8INGA0LXQs9C40YHRgtGA0LUpXG4gICAgICAgIGNvbnN0IG5hbWVNYXRjaGVzID0gbWF0Y2hlc05hbWVGaWx0ZXJzKHJvd0RhdGEudGl0bGUsIG5hbWVGaWx0ZXIsIHBlcm1hbmVudEZpbHRlcik7XG5cbiAgICAgICAgLy8g0J/RgNC+0LLQtdGA0LrQsCDQutC+0LvQuNGH0LXRgdGC0LLQsCDRgdC40LTQvtCyXG4gICAgICAgIGNvbnN0IHNlZWRzTWF0Y2hlcyA9IG1hdGNoZXNTZWVkc0ZpbHRlcihyb3dEYXRhLCBtaW5TZWVkcyk7XG5cbiAgICAgICAgaWYgKHNpemVNYXRjaGVzICYmIG5hbWVNYXRjaGVzICYmIHNlZWRzTWF0Y2hlcykge1xuICAgICAgICAgICAgcm93RGF0YS5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgICAgIHZpc2libGVDb3VudCArPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcm93RGF0YS5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCe0LHQvdC+0LLQu9GP0LXQvCDRgdGH0LXRgtGH0LjQulxuICAgIHVwZGF0ZUNvdW50ZXIodmlzaWJsZUNvdW50LCB0b3RhbENvdW50KTtcbn1cblxuLy8g0J/QvtC40YHQuiDRgNCw0LfQvNC10YDQsCDRhNCw0LnQu9CwXG5mdW5jdGlvbiBmaW5kRmlsZVNpemUocm93KSB7XG4gICAgY29uc3Qgc2l6ZUNlbGxzID0gcm93LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkLnMnKTtcbiAgICBpZiAoc2l6ZUNlbGxzLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcnO1xuXG4gICAgLy8g0JjRidC10Lwg0Y/Rh9C10LnQutGDINGBINGA0LDQt9C80LXRgNC+0LwgKNC+0LHRi9GH0L3QviDQv9GA0LXQtNC/0L7RgdC70LXQtNC90Y/RjyDRgdGA0LXQtNC4IC5zKVxuICAgIGNvbnN0IHNpemVDZWxsID0gQXJyYXkuZnJvbShzaXplQ2VsbHMpLmZpbmRMYXN0KChjZWxsKSA9PiAvKNCc0JF80JPQkXxNQnxHQikvaS50ZXN0KGNlbGwudGV4dENvbnRlbnQpKTtcblxuICAgIHJldHVybiBzaXplQ2VsbCA/IHNpemVDZWxsLnRleHRDb250ZW50LnRyaW0oKSA6ICcnO1xufVxuXG4vLyDQn9Cw0YDRgdC40L3QsyDRgNCw0LfQvNC10YDQsCDRhNCw0LnQu9CwXG5mdW5jdGlvbiBwYXJzZUZpbGVTaXplKHNpemVUZXh0KSB7XG4gICAgaWYgKCFzaXplVGV4dCkgcmV0dXJuIDA7XG5cbiAgICBjb25zdCBjbGVhblRleHQgPSBzaXplVGV4dC5yZXBsYWNlKC9cXHMrL2csICcgJykudHJpbSgpO1xuICAgIGNvbnN0IG1hdGNoID0gY2xlYW5UZXh0Lm1hdGNoKC8oW1xcZCwuXSspXFxzKijQnNCRfNCT0JF8TUJ8R0IpL2kpO1xuXG4gICAgaWYgKCFtYXRjaCkgcmV0dXJuIDA7XG5cbiAgICBjb25zdCBzaXplID0gcGFyc2VGbG9hdChtYXRjaFsxXS5yZXBsYWNlKCcsJywgJy4nKSk7XG4gICAgY29uc3QgdW5pdCA9IG1hdGNoWzJdLnRvVXBwZXJDYXNlKCk7XG5cbiAgICBpZiAodW5pdCA9PT0gJ9Cc0JEnIHx8IHVuaXQgPT09ICdNQicpIHtcbiAgICAgICAgcmV0dXJuIHNpemUgLyAxMDI0OyAvLyDQmtC+0L3QstC10YDRgtC40YDRg9C10Lwg0JzQkSDQsiDQk9CRXG4gICAgfVxuXG4gICAgcmV0dXJuIHNpemU7IC8vINCj0LbQtSDQsiDQk9CRXG59XG5cbi8vINCf0LDRgNGB0LjQvdCzINC60L7Qu9C40YfQtdGB0YLQstCwINGB0LjQtNC+0LJcbmZ1bmN0aW9uIHBhcnNlU2VlZHNDb3VudChyb3cpIHtcbiAgICBjb25zdCBzZWVkc0NlbGwgPSByb3cucXVlcnlTZWxlY3RvcigndGQuc2xfcycpO1xuICAgIGlmICghc2VlZHNDZWxsKSByZXR1cm4gMDtcblxuICAgIGNvbnN0IHNlZWRzVGV4dCA9IHNlZWRzQ2VsbC50ZXh0Q29udGVudC50cmltKCk7XG4gICAgY29uc3Qgc2VlZHNDb3VudCA9IHBhcnNlSW50KHNlZWRzVGV4dCwgMTApO1xuXG4gICAgcmV0dXJuIE51bWJlci5pc05hTihzZWVkc0NvdW50KSA/IDAgOiBzZWVkc0NvdW50O1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzU2l6ZUZpbHRlcnMocm93RGF0YSwgbWluU2l6ZSwgbWF4U2l6ZSkge1xuICAgIHJldHVybiByb3dEYXRhLmZpbGVTaXplR0IgPj0gbWluU2l6ZSAmJiAobWF4U2l6ZSA9PT0gMCB8fCByb3dEYXRhLmZpbGVTaXplR0IgPD0gbWF4U2l6ZSk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXNOYW1lRmlsdGVycyh0aXRsZSwgc2VhcmNoRmlsdGVyLCBwZXJtYW5lbnRGaWx0ZXIpIHtcbiAgICBjb25zdCBhbGxGaWx0ZXJzID0gW3NlYXJjaEZpbHRlciwgcGVybWFuZW50RmlsdGVyXVxuICAgICAgICAuZmlsdGVyKChmKSA9PiBmICYmIGYudHJpbSgpKVxuICAgICAgICAuam9pbignLCcpO1xuXG4gICAgcmV0dXJuIGlzTWF0Y2hUZXh0RmlsdGVyKHRpdGxlLCBhbGxGaWx0ZXJzKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlc1NlZWRzRmlsdGVyKHJvd0RhdGEsIG1pblNlZWRzKSB7XG4gICAgcmV0dXJuIHJvd0RhdGEuc2VlZHNDb3VudCA+PSBtaW5TZWVkcztcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==