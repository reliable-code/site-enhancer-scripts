// ==UserScript==
// @name         Kinozal extended search filters
// @description  Kinozal extended filters on search page
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @match        https://kinozal.tv/browse.php*
// @namespace    https://github.com/reliable-code/site-enhancer-scripts
// @version      1.0.78714669
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kinozal.tv
// @author       reliable-code
// @downloadURL  https://raw.githubusercontent.com/reliable-code/site-enhancer-scripts/main/specific/kinozal.user.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/common/dom/logging.js":
/*!***********************************!*\
  !*** ./src/common/dom/logging.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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


/***/ }),

/***/ "./src/common/dom/utils.js":
/*!*********************************!*\
  !*** ./src/common/dom/utils.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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


/***/ }),

/***/ "./src/common/filter/compare.js":
/*!**************************************!*\
  !*** ./src/common/filter/compare.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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


/***/ }),

/***/ "./src/common/filter/helpers.js":
/*!**************************************!*\
  !*** ./src/common/filter/helpers.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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


/***/ }),

/***/ "./src/common/storage.js":
/*!*******************************!*\
  !*** ./src/common/storage.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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


/***/ }),

/***/ "./src/kinozal/filters-template.html":
/*!*******************************************!*\
  !*** ./src/kinozal/filters-template.html ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<table class=\"tables1\">\r\n    <tbody>\r\n    <tr>\r\n        <td colspan=\"6\">Дополнительные фильтры</td>\r\n    </tr>\r\n    <tr>\r\n        <td>Название</td>\r\n        <td>Постоянный</td>\r\n        <td>Мин. размер (ГБ)</td>\r\n        <td>Макс. размер (ГБ)</td>\r\n        <td>Мин. сидов</td>\r\n        <td></td>\r\n    </tr>\r\n    <tr>\r\n        <td>\r\n            <input type=\"text\" id=\"filter-name\" class=\"w98p\" placeholder=\"Обычный фильтр\">\r\n        </td>\r\n        <td>\r\n            <input type=\"text\" id=\"filter-permanent\" class=\"w98p\" placeholder=\"Постоянный\">\r\n        </td>\r\n        <td>\r\n            <input type=\"number\" id=\"filter-min-size\" class=\"w98p\" placeholder=\"Мин. (ГБ)\" step=\"1\" min=\"0\">\r\n        </td>\r\n        <td>\r\n            <input type=\"number\" id=\"filter-max-size\" class=\"w98p\" placeholder=\"Макс. (ГБ)\" step=\"1\" min=\"0\">\r\n        </td>\r\n        <td>\r\n            <input type=\"number\" id=\"filter-min-seeds\" class=\"w98p\" placeholder=\"Мин. сидов\" step=\"1\" min=\"0\">\r\n        </td>\r\n        <td class=\"center\">\r\n            <input type=\"button\" id=\"reset-filters\" value=\"Сброс\" class=\"buttonS w98p\">\r\n        </td>\r\n    </tr>\r\n    <tr id=\"custom-counter\">\r\n        <td colspan=\"6\"><span class=\"bulet\"></span><span id=\"counter-text\">Показано 0 из 0 раздач</span></td>\r\n    </tr>\r\n    </tbody>\r\n</table>\r\n");

/***/ }),

/***/ "./src/kinozal/storage.js":
/*!********************************!*\
  !*** ./src/kinozal/storage.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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U0FBUyxtQkFBbUIsU0FBUyxTQUFTLFNBQVM7QUFDbkQsU0FBTyxRQUFRLGNBQWMsWUFBWSxZQUFZLEtBQUssUUFBUSxjQUFjO0FBQ3BGO0FBRUEsU0FBUyxtQkFBbUIsT0FBTyxjQUFjLGlCQUFpQjtBQUM5RCxRQUFNLGFBQWEsQ0FBQyxjQUFjLGVBQWUsRUFDNUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUMzQixLQUFLLEdBQUc7QUFFYixTQUFPLHlFQUFpQixDQUFDLE9BQU8sVUFBVTtBQUM5QztBQUVBLFNBQVMsbUJBQW1CLFNBQVMsVUFBVTtBQUMzQyxTQUFPLFFBQVEsY0FBYztBQUNqQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb21tb24vZG9tL2xvZ2dpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9kb20vdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9maWx0ZXIvY29tcGFyZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL2ZpbHRlci9oZWxwZXJzLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vc3RvcmFnZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMva2lub3phbC9maWx0ZXJzLXRlbXBsYXRlLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tpbm96YWwvc3RvcmFnZS5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vLi9zcmMva2lub3phbC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBJU19ERUJVRyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnO1xuXG5mdW5jdGlvbiBsb2dJZkRlYnVnKC4uLmFyZ3MpIHtcbiAgICBpZiAoIUlTX0RFQlVHKSByZXR1cm47XG4gICAgY29uc29sZS5sb2coLi4uYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dFbGVtZW50U2VhcmNoKHNlbGVjdG9yLCBwYXJlbnROb2RlLCByZXN1bHQpIHtcbiAgICBjb25zdCBmb3VuZCA9IHJlc3VsdCBpbnN0YW5jZW9mIE5vZGVMaXN0ID8gcmVzdWx0Lmxlbmd0aCA+IDAgOiBCb29sZWFuKHJlc3VsdCk7XG5cbiAgICBsb2dJZkRlYnVnKFxuICAgICAgICBgJHtmb3VuZCA/ICfinIUgRm91bmQgZWxlbWVudCcgOiAn4p2MIE5vdCBmb3VuZCBlbGVtZW50J31gLFxuICAgICAgICAnXFxuIOKUnOKUgCBTZWxlY3RvcjonLFxuICAgICAgICBgXCIke3NlbGVjdG9yfVwiYCxcbiAgICAgICAgJ1xcbiDilJzilIAgUGFyZW50OicsXG4gICAgICAgIHBhcmVudE5vZGUsXG4gICAgICAgICdcXG4g4pSU4pSAIFJlc3VsdDonLFxuICAgICAgICByZXN1bHQsXG4gICAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ0VsZW1lbnRXYWl0KHNlbGVjdG9yLCBwYXJlbnROb2RlKSB7XG4gICAgbG9nSWZEZWJ1ZyhcbiAgICAgICAgJ+KPsyBXYWl0aW5nIGZvciBlbGVtZW50JyxcbiAgICAgICAgJ1xcbiDilJzilIAgU2VsZWN0b3I6JyxcbiAgICAgICAgYFwiJHtzZWxlY3Rvcn1cImAsXG4gICAgICAgICdcXG4g4pSU4pSAIFBhcmVudDonLFxuICAgICAgICBwYXJlbnROb2RlLFxuICAgICk7XG59XG4iLCJpbXBvcnQgeyBsb2dFbGVtZW50U2VhcmNoLCBsb2dFbGVtZW50V2FpdCB9IGZyb20gJy4vbG9nZ2luZyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB3YWl0Rm9yRWxlbWVudChwYXJlbnROb2RlLCBzZWxlY3RvciwgdGltZW91dCA9IG51bGwsIGxvZ09uRGVidWcgPSBmYWxzZSkge1xuICAgIGNvbnN0IGV4aXN0aW5nRWxlbWVudCA9IHBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgaWYgKGV4aXN0aW5nRWxlbWVudCkge1xuICAgICAgICBpZiAobG9nT25EZWJ1ZykgbG9nRWxlbWVudFNlYXJjaChzZWxlY3RvciwgcGFyZW50Tm9kZSwgZXhpc3RpbmdFbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShleGlzdGluZ0VsZW1lbnQpO1xuICAgIH1cblxuICAgIGlmIChsb2dPbkRlYnVnKSBsb2dFbGVtZW50V2FpdChzZWxlY3RvciwgcGFyZW50Tm9kZSk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihtdXRhdGlvbkNhbGxiYWNrKTtcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShwYXJlbnROb2RlLCB7XG4gICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgdGltZW91dElkO1xuICAgICAgICBpZiAodGltZW91dCkge1xuICAgICAgICAgICAgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIGlmIChsb2dPbkRlYnVnKSBsb2dFbGVtZW50U2VhcmNoKHNlbGVjdG9yLCBwYXJlbnROb2RlLCBudWxsKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBtdXRhdGlvbkNhbGxiYWNrKCkge1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IHBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQpIHJldHVybjtcblxuICAgICAgICAgICAgaWYgKHRpbWVvdXRJZCkgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICBpZiAobG9nT25EZWJ1ZykgbG9nRWxlbWVudFNlYXJjaChzZWxlY3RvciwgcGFyZW50Tm9kZSwgZWxlbWVudCk7XG4gICAgICAgICAgICByZXNvbHZlKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3YWl0VW50aWxFbGVtZW50R29uZShwYXJlbnROb2RlLCBzZWxlY3Rvcikge1xuICAgIGNvbnN0IGV4aXN0aW5nRWxlbWVudCA9IHBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgaWYgKCFleGlzdGluZ0VsZW1lbnQpIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKG11dGF0aW9uQ2FsbGJhY2spO1xuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKHBhcmVudE5vZGUsIHtcbiAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIG11dGF0aW9uQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICBpZiAocGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdhaXRVbnRpbEVsZW1lbnRTdGFiaWxpemVkKGVsZW1lbnQsIHRpbWVvdXQgPSA0MDApIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgbGV0IHRpbWVvdXRJZDtcblxuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICAgICAgc2NoZWR1bGVDb21wbGV0aW9uKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIHNjaGVkdWxlQ29tcGxldGlvbigpIHtcbiAgICAgICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9LCB0aW1lb3V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjaGVkdWxlQ29tcGxldGlvbigpO1xuXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCwge1xuICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0ID0gMjUwKSB7XG4gICAgbGV0IHRpbWVvdXRJZDtcbiAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4gZnVuYy5hcHBseSh0aGlzLCBhcmdzKSwgd2FpdCk7XG4gICAgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1bldoZW5WaXNpYmxlKGNhbGxiYWNrKSB7XG4gICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ3Zpc2libGUnKSB7XG4gICAgICAgIGF3YWl0IGNhbGxiYWNrKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICd2aXNpYmxlJykge1xuICAgICAgICAgICAgICAgIGF3YWl0IGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHsgb25jZTogdHJ1ZSB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5PbmNlT25JbnRlcnNlY3Rpb24oZWxlbWVudCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcigoZW50cmllcykgPT4ge1xuICAgICAgICBlbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWVudHJ5LmlzSW50ZXJzZWN0aW5nKSByZXR1cm47XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnNlY3Rpb25PYnNlcnZlcihlbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBlbGVtZW50LmludGVyc2VjdGlvbk9ic2VydmVyID0gb2JzZXJ2ZXI7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFySW50ZXJzZWN0aW9uT2JzZXJ2ZXIoZWxlbWVudCkge1xuICAgIGlmICghZWxlbWVudC5pbnRlcnNlY3Rpb25PYnNlcnZlcikgcmV0dXJuO1xuXG4gICAgZWxlbWVudC5pbnRlcnNlY3Rpb25PYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgZWxlbWVudC5pbnRlcnNlY3Rpb25PYnNlcnZlciA9IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhck9ic2VydmVyKG9ic2VydmVyKSB7XG4gICAgaWYgKCFvYnNlcnZlcikgcmV0dXJuO1xuICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICBvYnNlcnZlciA9IG51bGw7XG59XG4iLCJpbXBvcnQgeyBwYXJzZUZpbHRlclF1ZXJ5IH0gZnJvbSAnLi9oZWxwZXJzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzTWF0Y2hUZXh0RmlsdGVyKHBhcmFtZXRlclZhbHVlLCBmaWx0ZXJWYWx1ZSkge1xuICAgIGlmICghZmlsdGVyVmFsdWUpIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHJlcXVpcmVtZW50cyA9IHBhcnNlRmlsdGVyUXVlcnkoZmlsdGVyVmFsdWUpO1xuICAgIHJldHVybiBtYXRjaGVzUXVlcnkocGFyYW1ldGVyVmFsdWUsIHJlcXVpcmVtZW50cyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXRjaGVzUXVlcnkodGV4dCwgcmVxdWlyZW1lbnRzKSB7XG4gICAgaWYgKCFyZXF1aXJlbWVudHMgfHwgIXJlcXVpcmVtZW50cy5sZW5ndGgpIHJldHVybiB0cnVlO1xuXG4gICAgY29uc3Qgbm9ybWFsaXplZFRleHQgPSAodGV4dCB8fCAnJykudG9Mb3dlckNhc2UoKTtcblxuICAgIHJldHVybiByZXF1aXJlbWVudHMuZXZlcnkoKGdyb3VwKSA9PiBjaGVja0dyb3VwTWF0Y2gobm9ybWFsaXplZFRleHQsIGdyb3VwKSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrR3JvdXBNYXRjaCh0ZXh0LCBncm91cENvbmRpdGlvbnMpIHtcbiAgICByZXR1cm4gZ3JvdXBDb25kaXRpb25zLnNvbWUoKHsgdGVybSwgaXNOZWdhdGl2ZSB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGluY2x1ZGVzID0gdGV4dC5pbmNsdWRlcyh0ZXJtKTtcbiAgICAgICAgcmV0dXJuIGlzTmVnYXRpdmUgPyAhaW5jbHVkZXMgOiBpbmNsdWRlcztcbiAgICB9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBwYXJzZUZpbHRlclF1ZXJ5KHF1ZXJ5U3RyaW5nKSB7XG4gICAgaWYgKCFxdWVyeVN0cmluZykgcmV0dXJuIFtdO1xuXG4gICAgcmV0dXJuIHF1ZXJ5U3RyaW5nLnRvTG93ZXJDYXNlKClcbiAgICAgICAgLnNwbGl0KCcsJylcbiAgICAgICAgLm1hcChwYXJzZUdyb3VwKVxuICAgICAgICAuZmlsdGVyKEJvb2xlYW4pO1xufVxuXG5mdW5jdGlvbiBwYXJzZUdyb3VwKGdyb3VwU3RyaW5nKSB7XG4gICAgY29uc3QgdG9rZW5zID0gZ3JvdXBTdHJpbmcuc3BsaXQoJy8nKVxuICAgICAgICAubWFwKChzKSA9PiBzLnRyaW0oKSlcbiAgICAgICAgLmZpbHRlcihCb29sZWFuKTtcblxuICAgIGlmICh0b2tlbnMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGNvbmRpdGlvbnMgPSB0b2tlbnNcbiAgICAgICAgLm1hcChjcmVhdGVDb25kaXRpb24pXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICByZXR1cm4gY29uZGl0aW9ucy5sZW5ndGggPiAwID8gY29uZGl0aW9ucyA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbmRpdGlvbihyYXdUb2tlbikge1xuICAgIGNvbnN0IGlzTmVnYXRpdmUgPSByYXdUb2tlbi5zdGFydHNXaXRoKCchJyk7XG4gICAgY29uc3QgdGVybSA9IGlzTmVnYXRpdmUgPyByYXdUb2tlbi5zbGljZSgxKS50cmltKCkgOiByYXdUb2tlbjtcblxuICAgIGlmICghdGVybSkgcmV0dXJuIG51bGw7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0ZXJtLFxuICAgICAgICBpc05lZ2F0aXZlLFxuICAgIH07XG59XG5cbiIsImV4cG9ydCBjb25zdCBzdG9yYWdlID0ge1xuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQtdC90LjQtSDQtNCw0L3QvdGL0YUg0LjQtyBHTSBzdG9yYWdlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtINC60LvRjtGHXG4gICAgICogQHBhcmFtIHsqfSBkZWZhdWx0VmFsdWUgLSDQt9C90LDRh9C10L3QuNC1INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXG4gICAgICogQHJldHVybnMgeyp9INC30L3QsNGH0LXQvdC40LUg0LjQu9C4IGRlZmF1bHRWYWx1ZVxuICAgICAqL1xuICAgIGdldDogKGtleSwgZGVmYXVsdFZhbHVlID0gbnVsbCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIEdNX2dldFZhbHVlKGtleSwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgU3RvcmFnZSBnZXQgZXJyb3IgZm9yIGtleSBcIiR7a2V5fVwiOmAsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0KHQvtGF0YDQsNC90LXQvdC40LUg0LTQsNC90L3Ri9GFINCyIEdNIHN0b3JhZ2VcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0g0LrQu9GO0YdcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIC0g0LfQvdCw0YfQtdC90LjQtSAo0LvRjtCx0L7QuSDRgtC40L8pXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59INGD0YHQv9C10YjQvdC+0YHRgtGMINC+0L/QtdGA0LDRhtC40LhcbiAgICAgKi9cbiAgICBzZXQ6IChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBHTV9zZXRWYWx1ZShrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBTdG9yYWdlIHNldCBlcnJvciBmb3Iga2V5IFwiJHtrZXl9XCI6YCwgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCe0LHQvdC+0LLQu9C10L3QuNC1INGB0YPRidC10YHRgtCy0YPRjtGJ0LjRhSDQtNCw0L3QvdGL0YUg0YfQtdGA0LXQtyDRhNGD0L3QutGG0LjRjlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSDQutC70Y7Rh1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHVwZGF0ZUZuIC0g0YTRg9C90LrRhtC40Y8g0L7QsdC90L7QstC70LXQvdC40Y8gKNC/0L7Qu9GD0YfQsNC10YIg0YLQtdC60YPRidC10LUg0LfQvdCw0YfQtdC90LjQtSwg0LLQvtC30LLRgNCw0YnQsNC10YIg0L3QvtCy0L7QtSlcbiAgICAgKiBAcGFyYW0geyp9IGRlZmF1bHRWYWx1ZSAtINC30L3QsNGH0LXQvdC40LUg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0LXRgdC70Lgg0LrQu9GO0Ycg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRglxuICAgICAqIEByZXR1cm5zIHsqfSDQvdC+0LLQvtC1INC30L3QsNGH0LXQvdC40LVcbiAgICAgKi9cbiAgICB1cGRhdGU6IChrZXksIHVwZGF0ZUZuLCBkZWZhdWx0VmFsdWUgPSBudWxsKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50VmFsdWUgPSBzdG9yYWdlLmdldChrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IHVwZGF0ZUZuKGN1cnJlbnRWYWx1ZSk7XG4gICAgICAgICAgICBzdG9yYWdlLnNldChrZXksIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBuZXdWYWx1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgU3RvcmFnZSB1cGRhdGUgZXJyb3IgZm9yIGtleSBcIiR7a2V5fVwiOmAsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBzdG9yYWdlLmdldChrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0KPQtNCw0LvQtdC90LjQtSDQtNCw0L3QvdGL0YUg0LjQtyBHTSBzdG9yYWdlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtINC60LvRjtGHXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59INGD0YHQv9C10YjQvdC+0YHRgtGMINC+0L/QtdGA0LDRhtC40LhcbiAgICAgKi9cbiAgICByZW1vdmU6IChrZXkpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIEdNX2RlbGV0ZVZhbHVlKGtleSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgU3RvcmFnZSByZW1vdmUgZXJyb3IgZm9yIGtleSBcIiR7a2V5fVwiOmAsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQn9GA0L7QstC10YDQutCwINGB0YPRidC10YHRgtCy0L7QstCw0L3QuNGPINC60LvRjtGH0LBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0g0LrQu9GO0YdcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBoYXM6IChrZXkpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yYWdlLmtleXMoKS5pbmNsdWRlcyhrZXkpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBTdG9yYWdlIGhhcyBlcnJvciBmb3Iga2V5IFwiJHtrZXl9XCI6YCwgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQtdC90LjQtSDQstGB0LXRhSDQutC70Y7Rh9C10LlcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nW119INC80LDRgdGB0LjQsiDQutC70Y7Rh9C10LlcbiAgICAgKi9cbiAgICBrZXlzOiAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gR01fbGlzdFZhbHVlcygpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIGtleXMgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCe0YfQuNGB0YLQutCwINC00LDQvdC90YvRhSDRgdC60YDQuNC/0YLQsFxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IGtleXNUb1JlbW92ZSAtINC80LDRgdGB0LjQsiDQutC70Y7Rh9C10Lkg0LTQu9GPINGD0LTQsNC70LXQvdC40Y9cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g0YPRgdC/0LXRiNC90L7RgdGC0Ywg0L7Qv9C10YDQsNGG0LjQuFxuICAgICAqL1xuICAgIGNsZWFyOiAoa2V5c1RvUmVtb3ZlID0gbnVsbCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgYWxsS2V5cyA9IGtleXNUb1JlbW92ZSB8fCBzdG9yYWdlLmtleXMoKTtcbiAgICAgICAgICAgIGFsbEtleXMuZm9yRWFjaCgoa2V5KSA9PiBHTV9kZWxldGVWYWx1ZShrZXkpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIGNsZWFyIGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQnNCw0YHRgdC+0LLQvtC1INC/0L7Qu9GD0YfQtdC90LjQtSDQtNCw0L3QvdGL0YVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBrZXlzTGlzdCAtINC80LDRgdGB0LjQsiDQutC70Y7Rh9C10LlcbiAgICAgKiBAcGFyYW0geyp9IGRlZmF1bHRWYWx1ZSAtINC30L3QsNGH0LXQvdC40LUg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0LTQu9GPINC+0YLRgdGD0YLRgdGC0LLRg9GO0YnQuNGFINC60LvRjtGH0LXQuVxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9INC+0LHRitC10LrRgiDRgSDQv9Cw0YDQsNC80Lgg0LrQu9GO0Yct0LfQvdCw0YfQtdC90LjQtVxuICAgICAqL1xuICAgIGdldE11bHRpcGxlOiAoa2V5c0xpc3QsIGRlZmF1bHRWYWx1ZSA9IG51bGwpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgICAgIGtleXNMaXN0LmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBzdG9yYWdlLmdldChrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQnNCw0YHRgdC+0LLQvtC1INGB0L7RhdGA0LDQvdC10L3QuNC1INC00LDQvdC90YvRhVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0g0L7QsdGK0LXQutGCINGBINC/0LDRgNCw0LzQuCDQutC70Y7Rhy3Qt9C90LDRh9C10L3QuNC1XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59INGD0YHQv9C10YjQvdC+0YHRgtGMINCy0YHQtdGFINC+0L/QtdGA0LDRhtC40LlcbiAgICAgKi9cbiAgICBzZXRNdWx0aXBsZTogKGRhdGEpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKGRhdGEpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgICAgIEdNX3NldFZhbHVlKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSBzZXRNdWx0aXBsZSBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0KPQtNCw0LvQtdC90LjQtSDQvdC10YHQutC+0LvRjNC60LjRhSDQutC70Y7Rh9C10LlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBrZXlzVG9SZW1vdmUgLSDQvNCw0YHRgdC40LIg0LrQu9GO0YfQtdC5INC00LvRjyDRg9C00LDQu9C10L3QuNGPICjQvtCx0Y/Qt9Cw0YLQtdC70YzQvdGL0Lkg0L/QsNGA0LDQvNC10YLRgClcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g0YPRgdC/0LXRiNC90L7RgdGC0Ywg0L7Qv9C10YDQsNGG0LjQuFxuICAgICAqL1xuICAgIHJlbW92ZU11bHRpcGxlOiAoa2V5c1RvUmVtb3ZlKSA9PiB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShrZXlzVG9SZW1vdmUpIHx8IGtleXNUb1JlbW92ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSByZW1vdmVNdWx0aXBsZToga2V5c1RvUmVtb3ZlIG11c3QgYmUgYSBub24tZW1wdHkgYXJyYXknKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBrZXlzVG9SZW1vdmUuZm9yRWFjaCgoa2V5KSA9PiBHTV9kZWxldGVWYWx1ZShrZXkpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIHJlbW92ZU11bHRpcGxlIGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LXQvdC40LUg0LrQvtC70LjRh9C10YHRgtCy0LAg0YHQvtGF0YDQsNC90LXQvdC90YvRhSDQutC70Y7Rh9C10LlcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSDQutC+0LvQuNGH0LXRgdGC0LLQviDQutC70Y7Rh9C10LlcbiAgICAgKi9cbiAgICBjb3VudDogKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uua2V5cygpLmxlbmd0aDtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSBjb3VudCBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LXQvdC40LUg0LLRgdC10YUg0LTQsNC90L3Ri9GFINCyINCy0LjQtNC1INC+0LHRitC10LrRgtCwXG4gICAgICogQHJldHVybnMge09iamVjdH0g0L7QsdGK0LXQutGCINGB0L4g0LLRgdC10LzQuCDRgdC+0YXRgNCw0L3QtdC90L3Ri9C80Lgg0LTQsNC90L3Ri9C80LhcbiAgICAgKi9cbiAgICBnZXRBbGw6ICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGFsbEtleXMgPSBzdG9yYWdlLmtleXMoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgICAgICAgICAgYWxsS2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IEdNX2dldFZhbHVlKGtleSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgZ2V0QWxsIGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQntCf0JDQodCd0J46INCe0YfQuNGB0YLQutCwINCy0YHQtdGFINC00LDQvdC90YvRhSDRgdC60YDQuNC/0YLQsFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZmlybUNsZWFyIC0g0L7QsdGP0LfQsNGC0LXQu9GM0L3Ri9C5INGE0LvQsNCzINC/0L7QtNGC0LLQtdGA0LbQtNC10L3QuNGPICjQtNC+0LvQttC10L0g0LHRi9GC0YwgdHJ1ZSlcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g0YPRgdC/0LXRiNC90L7RgdGC0Ywg0L7Qv9C10YDQsNGG0LjQuFxuICAgICAqL1xuICAgIGNsZWFyQWxsOiAoY29uZmlybUNsZWFyID0gZmFsc2UpID0+IHtcbiAgICAgICAgaWYgKGNvbmZpcm1DbGVhciAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIGNsZWFyQWxsOiBjb25maXJtQ2xlYXIgbXVzdCBiZSBleHBsaWNpdGx5IHNldCB0byB0cnVlJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgYWxsS2V5cyA9IHN0b3JhZ2Uua2V5cygpO1xuICAgICAgICAgICAgYWxsS2V5cy5mb3JFYWNoKChrZXkpID0+IEdNX2RlbGV0ZVZhbHVlKGtleSkpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgY2xlYXJBbGwgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCf0YDQvtCy0LXRgNC60LAg0L/Rg9GB0YLQvtGC0Ysg0YXRgNCw0L3QuNC70LjRidCwXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUg0LXRgdC70Lgg0YXRgNCw0L3QuNC70LjRidC1INC/0YPRgdGC0L7QtVxuICAgICAqL1xuICAgIGlzRW1wdHk6ICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yYWdlLmtleXMoKS5sZW5ndGggPT09IDA7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgaXNFbXB0eSBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG59O1xuIiwiZXhwb3J0IGRlZmF1bHQgXCI8dGFibGUgY2xhc3M9XFxcInRhYmxlczFcXFwiPlxcclxcbiAgICA8dGJvZHk+XFxyXFxuICAgIDx0cj5cXHJcXG4gICAgICAgIDx0ZCBjb2xzcGFuPVxcXCI2XFxcIj7QlNC+0L/QvtC70L3QuNGC0LXQu9GM0L3Ri9C1INGE0LjQu9GM0YLRgNGLPC90ZD5cXHJcXG4gICAgPC90cj5cXHJcXG4gICAgPHRyPlxcclxcbiAgICAgICAgPHRkPtCd0LDQt9Cy0LDQvdC40LU8L3RkPlxcclxcbiAgICAgICAgPHRkPtCf0L7RgdGC0L7Rj9C90L3Ri9C5PC90ZD5cXHJcXG4gICAgICAgIDx0ZD7QnNC40L0uINGA0LDQt9C80LXRgCAo0JPQkSk8L3RkPlxcclxcbiAgICAgICAgPHRkPtCc0LDQutGBLiDRgNCw0LfQvNC10YAgKNCT0JEpPC90ZD5cXHJcXG4gICAgICAgIDx0ZD7QnNC40L0uINGB0LjQtNC+0LI8L3RkPlxcclxcbiAgICAgICAgPHRkPjwvdGQ+XFxyXFxuICAgIDwvdHI+XFxyXFxuICAgIDx0cj5cXHJcXG4gICAgICAgIDx0ZD5cXHJcXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgaWQ9XFxcImZpbHRlci1uYW1lXFxcIiBjbGFzcz1cXFwidzk4cFxcXCIgcGxhY2Vob2xkZXI9XFxcItCe0LHRi9GH0L3Ri9C5INGE0LjQu9GM0YLRgFxcXCI+XFxyXFxuICAgICAgICA8L3RkPlxcclxcbiAgICAgICAgPHRkPlxcclxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBpZD1cXFwiZmlsdGVyLXBlcm1hbmVudFxcXCIgY2xhc3M9XFxcInc5OHBcXFwiIHBsYWNlaG9sZGVyPVxcXCLQn9C+0YHRgtC+0Y/QvdC90YvQuVxcXCI+XFxyXFxuICAgICAgICA8L3RkPlxcclxcbiAgICAgICAgPHRkPlxcclxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJudW1iZXJcXFwiIGlkPVxcXCJmaWx0ZXItbWluLXNpemVcXFwiIGNsYXNzPVxcXCJ3OThwXFxcIiBwbGFjZWhvbGRlcj1cXFwi0JzQuNC9LiAo0JPQkSlcXFwiIHN0ZXA9XFxcIjFcXFwiIG1pbj1cXFwiMFxcXCI+XFxyXFxuICAgICAgICA8L3RkPlxcclxcbiAgICAgICAgPHRkPlxcclxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJudW1iZXJcXFwiIGlkPVxcXCJmaWx0ZXItbWF4LXNpemVcXFwiIGNsYXNzPVxcXCJ3OThwXFxcIiBwbGFjZWhvbGRlcj1cXFwi0JzQsNC60YEuICjQk9CRKVxcXCIgc3RlcD1cXFwiMVxcXCIgbWluPVxcXCIwXFxcIj5cXHJcXG4gICAgICAgIDwvdGQ+XFxyXFxuICAgICAgICA8dGQ+XFxyXFxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcIm51bWJlclxcXCIgaWQ9XFxcImZpbHRlci1taW4tc2VlZHNcXFwiIGNsYXNzPVxcXCJ3OThwXFxcIiBwbGFjZWhvbGRlcj1cXFwi0JzQuNC9LiDRgdC40LTQvtCyXFxcIiBzdGVwPVxcXCIxXFxcIiBtaW49XFxcIjBcXFwiPlxcclxcbiAgICAgICAgPC90ZD5cXHJcXG4gICAgICAgIDx0ZCBjbGFzcz1cXFwiY2VudGVyXFxcIj5cXHJcXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwiYnV0dG9uXFxcIiBpZD1cXFwicmVzZXQtZmlsdGVyc1xcXCIgdmFsdWU9XFxcItCh0LHRgNC+0YFcXFwiIGNsYXNzPVxcXCJidXR0b25TIHc5OHBcXFwiPlxcclxcbiAgICAgICAgPC90ZD5cXHJcXG4gICAgPC90cj5cXHJcXG4gICAgPHRyIGlkPVxcXCJjdXN0b20tY291bnRlclxcXCI+XFxyXFxuICAgICAgICA8dGQgY29sc3Bhbj1cXFwiNlxcXCI+PHNwYW4gY2xhc3M9XFxcImJ1bGV0XFxcIj48L3NwYW4+PHNwYW4gaWQ9XFxcImNvdW50ZXItdGV4dFxcXCI+0J/QvtC60LDQt9Cw0L3QviAwINC40LcgMCDRgNCw0LfQtNCw0Yc8L3NwYW4+PC90ZD5cXHJcXG4gICAgPC90cj5cXHJcXG4gICAgPC90Ym9keT5cXHJcXG48L3RhYmxlPlxcclxcblwiOyIsImltcG9ydCB7IHN0b3JhZ2UgfSBmcm9tICcuLi9jb21tb24vc3RvcmFnZSc7XG5cbi8qKlxuICog0JrQu9GO0YfQuCDQtNC70Y8g0YXRgNCw0L3QtdC90LjRjyDRhNC40LvRjNGC0YDQvtCyINCyINGF0YDQsNC90LjQu9C40YnQtSBUYW1wZXJtb25rZXlcbiAqIEByZWFkb25seVxuICovXG5leHBvcnQgY29uc3QgRklMVEVSX0tFWVMgPSB7XG4gICAgUEVSTUFORU5UOiAna2lub3phbF9wZXJtYW5lbnRfZmlsdGVyJyxcbiAgICBNSU5fU0VFRFM6ICdraW5vemFsX21pbl9zZWVkc19maWx0ZXInLFxufTtcblxuLyoqXG4gKiDQntCx0YrQtdC60YIg0LTQu9GPINGA0LDQsdC+0YLRiyDRgSDQv9C+0YHRgtC+0Y/QvdC90YvQvNC4INGE0LjQu9GM0YLRgNCw0LzQuCBLaW5vemFsXG4gKi9cbmV4cG9ydCBjb25zdCBmaWx0ZXJTdG9yYWdlID0ge1xuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQsNC10YIg0YHQvtGF0YDQsNC90LXQvdC90YvQuSDQv9C+0YHRgtC+0Y/QvdC90YvQuSDRhNC40LvRjNGC0YBcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSDQn9C+0YHRgtC+0Y/QvdC90YvQuSDRhNC40LvRjNGC0YAg0LjQu9C4INC/0YPRgdGC0LDRjyDRgdGC0YDQvtC60LBcbiAgICAgKi9cbiAgICBnZXRQZXJtYW5lbnQ6ICgpID0+IHN0b3JhZ2UuZ2V0KEZJTFRFUl9LRVlTLlBFUk1BTkVOVCwgJycpLFxuXG4gICAgLyoqXG4gICAgICog0KHQvtGF0YDQsNC90Y/QtdGCINC/0L7RgdGC0L7Rj9C90L3Ri9C5INGE0LjQu9GM0YLRgFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bGx8dW5kZWZpbmVkfSB2YWx1ZSAtINCk0LjQu9GM0YLRgCDQtNC70Y8g0YHQvtGF0YDQsNC90LXQvdC40Y9cbiAgICAgKi9cbiAgICBzZXRQZXJtYW5lbnQ6ICh2YWx1ZSkgPT4ge1xuICAgICAgICBjb25zdCBub3JtYWxpemVkVmFsdWUgPSBTdHJpbmcodmFsdWUgfHwgJycpLnRyaW0oKTtcbiAgICAgICAgc3RvcmFnZS5zZXQoRklMVEVSX0tFWVMuUEVSTUFORU5ULCBub3JtYWxpemVkVmFsdWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQo9C00LDQu9GP0LXRgiDRgdC+0YXRgNCw0L3QtdC90L3Ri9C5INC/0L7RgdGC0L7Rj9C90L3Ri9C5INGE0LjQu9GM0YLRgFxuICAgICAqL1xuICAgIGNsZWFyUGVybWFuZW50OiAoKSA9PiBzdG9yYWdlLnJlbW92ZShGSUxURVJfS0VZUy5QRVJNQU5FTlQpLFxuXG4gICAgLyoqXG4gICAgICog0J/RgNC+0LLQtdGA0Y/QtdGCLCDQtdGB0YLRjCDQu9C4INGB0L7RhdGA0LDQvdC10L3QvdGL0Lkg0YTQuNC70YzRgtGAXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUsINC10YHQu9C4INGE0LjQu9GM0YLRgCDRgdC+0YXRgNCw0L3QtdC9XG4gICAgICovXG4gICAgaGFzUGVybWFuZW50OiAoKSA9PiBCb29sZWFuKGZpbHRlclN0b3JhZ2UuZ2V0UGVybWFuZW50KCkpLFxuXG4gICAgLyoqXG4gICAgICog0J/QvtC70YPRh9Cw0LXRgiDRgdC+0YXRgNCw0L3QtdC90L3QvtC1INC80LjQvdC40LzQsNC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0YHQuNC00L7QslxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9INCc0LjQvdC40LzQsNC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0YHQuNC00L7QsiDQuNC70LggMFxuICAgICAqL1xuICAgIGdldE1pblNlZWRzOiAoKSA9PiBzdG9yYWdlLmdldChGSUxURVJfS0VZUy5NSU5fU0VFRFMsIDApLFxuXG4gICAgLyoqXG4gICAgICog0KHQvtGF0YDQsNC90Y/QtdGCINC80LjQvdC40LzQsNC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0YHQuNC00L7QslxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcnxudWxsfHVuZGVmaW5lZH0gdmFsdWUgLSDQnNC40L3QuNC80LDQu9GM0L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INGB0LjQtNC+0LJcbiAgICAgKi9cbiAgICBzZXRNaW5TZWVkczogKHZhbHVlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRWYWx1ZSA9IHBhcnNlSW50KHZhbHVlLCAxMCkgfHwgMDtcbiAgICAgICAgc3RvcmFnZS5zZXQoRklMVEVSX0tFWVMuTUlOX1NFRURTLCBub3JtYWxpemVkVmFsdWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQo9C00LDQu9GP0LXRgiDRgdC+0YXRgNCw0L3QtdC90L3QvtC1INC80LjQvdC40LzQsNC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0YHQuNC00L7QslxuICAgICAqL1xuICAgIGNsZWFyTWluU2VlZHM6ICgpID0+IHN0b3JhZ2UucmVtb3ZlKEZJTFRFUl9LRVlTLk1JTl9TRUVEUyksXG5cbiAgICAvKipcbiAgICAgKiDQn9GA0L7QstC10YDRj9C10YIsINGD0YHRgtCw0L3QvtCy0LvQtdC9INC70Lgg0YTQuNC70YzRgtGAINC/0L4g0LzQuNC90LjQvNCw0LvRjNC90L7QvNGDINC60L7Qu9C40YfQtdGB0YLQstGDINGB0LjQtNC+0LJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSwg0LXRgdC70Lgg0YTQuNC70YzRgtGAINGD0YHRgtCw0L3QvtCy0LvQtdC9ICjQsdC+0LvRjNGI0LUgMClcbiAgICAgKi9cbiAgICBoYXNNaW5TZWVkczogKCkgPT4gZmlsdGVyU3RvcmFnZS5nZXRNaW5TZWVkcygpID4gMCxcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsImltcG9ydCB7IGRlYm91bmNlIH0gZnJvbSAnLi4vY29tbW9uL2RvbS91dGlscyc7XG5pbXBvcnQgZmlsdGVyc1RlbXBsYXRlIGZyb20gJy4vZmlsdGVycy10ZW1wbGF0ZS5odG1sJztcbmltcG9ydCB7IGZpbHRlclN0b3JhZ2UgfSBmcm9tICcuL3N0b3JhZ2UnO1xuaW1wb3J0IHsgaXNNYXRjaFRleHRGaWx0ZXIgfSBmcm9tICcuLi9jb21tb24vZmlsdGVyL2NvbXBhcmUnO1xuXG4vLyDQmtGN0YjQuNGA0L7QstCw0L3QuNC1INGB0YLQsNGC0LjRh9C90YvRhSDRjdC70LXQvNC10L3RgtC+0LIg0YPQv9GA0LDQstC70LXQvdC40Y9cbmxldCBmaWx0ZXJDb250cm9scyA9IG51bGw7XG5cbi8vINCa0Y3RiCDQv9GA0LXQtNC+0LHRgNCw0LHQvtGC0LDQvdC90YvRhSDQtNCw0L3QvdGL0YUg0YHRgtGA0L7QuiDRgtCw0LHQu9C40YbRi1xubGV0IHRvcnJlbnRSb3dzQ2FjaGUgPSBudWxsO1xuXG4vLyDQltC00LXQvCDQt9Cw0LPRgNGD0LfQutC4IERPTSDQuCDRgdC+0LfQtNCw0LXQvCDRhNC40LvRjNGC0YDRi1xuaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdsb2FkaW5nJykge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBjcmVhdGVBZGRpdGlvbmFsRmlsdGVycyk7XG59IGVsc2Uge1xuICAgIHNldFRpbWVvdXQoY3JlYXRlQWRkaXRpb25hbEZpbHRlcnMsIDEwMCk7XG59XG5cbi8vINCh0L7Qt9C00LDQvdC40LUg0LTQvtC/0L7Qu9C90LjRgtC10LvRjNC90YvRhSDRhNC40LvRjNGC0YDQvtCyXG5mdW5jdGlvbiBjcmVhdGVBZGRpdGlvbmFsRmlsdGVycygpIHtcbiAgICAvLyDQmNGJ0LXQvCBkaXYg0YEg0LrQu9Cw0YHRgdC+0LwgYngxXzAgKNCx0LvQvtC6INGBINC+0YDQuNCz0LjQvdCw0LvRjNC90YvQvNC4INGE0LjQu9GM0YLRgNCw0LzQuClcbiAgICBjb25zdCBvcmlnaW5hbEZpbHRlckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5ieDFfMCcpO1xuICAgIGlmICghb3JpZ2luYWxGaWx0ZXJEaXYpIHJldHVybjtcblxuICAgIC8vINCh0L7Qt9C00LDQtdC8INC+0YLQtNC10LvRjNC90YvQuSDQsdC70L7QuiDQtNC70Y8g0LrQsNGB0YLQvtC80L3Ri9GFINGE0LjQu9GM0YLRgNC+0LJcbiAgICBjb25zdCBjdXN0b21GaWx0ZXJzRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY3VzdG9tRmlsdGVyc0Rpdi5jbGFzc05hbWUgPSAnYngxXzAnO1xuICAgIGN1c3RvbUZpbHRlcnNEaXYuc3R5bGUucGFkZGluZyA9ICczcHggMzhweCAzcHggNXB4JztcbiAgICBjdXN0b21GaWx0ZXJzRGl2LnN0eWxlLm1hcmdpbkJvdHRvbSA9ICc3cHgnO1xuICAgIGN1c3RvbUZpbHRlcnNEaXYuaW5uZXJIVE1MID0gZmlsdGVyc1RlbXBsYXRlO1xuXG4gICAgLy8g0JLRgdGC0LDQstC70Y/QtdC8INCx0LvQvtC6INC/0L7RgdC70LUg0L7RgNC40LPQuNC90LDQu9GM0L3QvtCz0L4g0LHQu9C+0LrQsCDRgSDRhNC40LvRjNGC0YDQsNC80LhcbiAgICBvcmlnaW5hbEZpbHRlckRpdi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShjdXN0b21GaWx0ZXJzRGl2LCBvcmlnaW5hbEZpbHRlckRpdi5uZXh0U2libGluZyk7XG5cbiAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INGN0LvQtdC80LXQvdGC0Ysg0YPQv9GA0LDQstC70LXQvdC40Y8gKNC60Y3RiCDRgdC+0LfQtNCw0LXRgtGB0Y8g0L/RgNC4INC/0LXRgNCy0L7QvCDQstGL0LfQvtCy0LUpXG4gICAgY29uc3Qge1xuICAgICAgICBtaW5TaXplSW5wdXQsXG4gICAgICAgIG1heFNpemVJbnB1dCxcbiAgICAgICAgbmFtZUZpbHRlcklucHV0LFxuICAgICAgICBwZXJtYW5lbnRGaWx0ZXJJbnB1dCxcbiAgICAgICAgbWluU2VlZHNJbnB1dCxcbiAgICAgICAgcmVzZXRCdXR0b24sXG4gICAgfSA9IGdldEZpbHRlckNvbnRyb2xzKCk7XG5cbiAgICAvLyDQl9Cw0LPRgNGD0LbQsNC10Lwg0YHQvtGF0YDQsNC90LXQvdC90YvQtSDQt9C90LDRh9C10L3QuNGPINGE0LjQu9GM0YLRgNC+0LJcbiAgICBpZiAocGVybWFuZW50RmlsdGVySW5wdXQpIHtcbiAgICAgICAgcGVybWFuZW50RmlsdGVySW5wdXQudmFsdWUgPSBmaWx0ZXJTdG9yYWdlLmdldFBlcm1hbmVudCgpO1xuICAgIH1cbiAgICBpZiAobWluU2VlZHNJbnB1dCkge1xuICAgICAgICBjb25zdCBzYXZlZE1pblNlZWRzID0gZmlsdGVyU3RvcmFnZS5nZXRNaW5TZWVkcygpO1xuICAgICAgICBtaW5TZWVkc0lucHV0LnZhbHVlID0gc2F2ZWRNaW5TZWVkcyA+IDAgPyBzYXZlZE1pblNlZWRzIDogJyc7XG4gICAgfVxuXG4gICAgLy8g0KHQvtC30LTQsNC10LwgZGVib3VuY2VkINCy0LXRgNGB0LjRjiDRhNGD0L3QutGG0LjQuCDRhNC40LvRjNGC0YDQsNGG0LjQuFxuICAgIGNvbnN0IGRlYm91bmNlZEZpbHRlciA9IGRlYm91bmNlKGFwcGx5RmlsdGVycywgMjUwKTtcblxuICAgIC8vINCU0L7QsdCw0LLQu9GP0LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC4INGB0L7QsdGL0YLQuNC5XG4gICAgaWYgKG1pblNpemVJbnB1dCkge1xuICAgICAgICBtaW5TaXplSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBkZWJvdW5jZWRGaWx0ZXIpO1xuICAgIH1cbiAgICBpZiAobWF4U2l6ZUlucHV0KSB7XG4gICAgICAgIG1heFNpemVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlYm91bmNlZEZpbHRlcik7XG4gICAgfVxuICAgIGlmIChuYW1lRmlsdGVySW5wdXQpIHtcbiAgICAgICAgbmFtZUZpbHRlcklucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZGVib3VuY2VkRmlsdGVyKTtcbiAgICB9XG4gICAgaWYgKHBlcm1hbmVudEZpbHRlcklucHV0KSB7XG4gICAgICAgIHBlcm1hbmVudEZpbHRlcklucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcbiAgICAgICAgICAgIGZpbHRlclN0b3JhZ2Uuc2V0UGVybWFuZW50KGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgIGRlYm91bmNlZEZpbHRlcigpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG1pblNlZWRzSW5wdXQpIHtcbiAgICAgICAgbWluU2VlZHNJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XG4gICAgICAgICAgICBmaWx0ZXJTdG9yYWdlLnNldE1pblNlZWRzKGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgIGRlYm91bmNlZEZpbHRlcigpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHJlc2V0QnV0dG9uKSB7XG4gICAgICAgIHJlc2V0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVzZXRGaWx0ZXJzKTtcbiAgICB9XG5cbiAgICAvLyDQn9GA0LjQvNC10L3Rj9C10Lwg0YTQuNC70YzRgtGA0Ysg0L/RgNC4INC30LDQs9GA0YPQt9C60LUgKNC10YHQu9C4INC10YHRgtGMINGB0L7RhdGA0LDQvdC10L3QvdGL0LUg0YTQuNC70YzRgtGA0YspXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGluaXRpYWxpemVUb3JyZW50Um93c0NhY2hlKCk7XG4gICAgICAgIGlmICh0b3JyZW50Um93c0NhY2hlICYmIHRvcnJlbnRSb3dzQ2FjaGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdXBkYXRlQ291bnRlcih0b3JyZW50Um93c0NhY2hlLmxlbmd0aCwgdG9ycmVudFJvd3NDYWNoZS5sZW5ndGgpO1xuICAgICAgICAgICAgY29uc3QgaGFzUGVybWFuZW50RmlsdGVyID0gcGVybWFuZW50RmlsdGVySW5wdXQgJiYgcGVybWFuZW50RmlsdGVySW5wdXQudmFsdWU7XG4gICAgICAgICAgICBjb25zdCBoYXNNaW5TZWVkc0ZpbHRlciA9IG1pblNlZWRzSW5wdXQgJiYgbWluU2VlZHNJbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIGlmIChoYXNQZXJtYW5lbnRGaWx0ZXIgfHwgaGFzTWluU2VlZHNGaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICBhcHBseUZpbHRlcnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIDEwMCk7XG59XG5cbmZ1bmN0aW9uIGdldEZpbHRlckNvbnRyb2xzKCkge1xuICAgIGlmIChmaWx0ZXJDb250cm9scykgcmV0dXJuIGZpbHRlckNvbnRyb2xzO1xuXG4gICAgZmlsdGVyQ29udHJvbHMgPSB7XG4gICAgICAgIG1pblNpemVJbnB1dDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbHRlci1taW4tc2l6ZScpLFxuICAgICAgICBtYXhTaXplSW5wdXQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWx0ZXItbWF4LXNpemUnKSxcbiAgICAgICAgbmFtZUZpbHRlcklucHV0OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsdGVyLW5hbWUnKSxcbiAgICAgICAgcGVybWFuZW50RmlsdGVySW5wdXQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWx0ZXItcGVybWFuZW50JyksXG4gICAgICAgIG1pblNlZWRzSW5wdXQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWx0ZXItbWluLXNlZWRzJyksXG4gICAgICAgIHJlc2V0QnV0dG9uOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzZXQtZmlsdGVycycpLFxuICAgICAgICBjb3VudGVyVGV4dDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvdW50ZXItdGV4dCcpLFxuICAgIH07XG5cbiAgICByZXR1cm4gZmlsdGVyQ29udHJvbHM7XG59XG5cbi8vINCk0YPQvdC60YbQuNGPINGB0LHRgNC+0YHQsCDRhNC40LvRjNGC0YDQvtCyXG5mdW5jdGlvbiByZXNldEZpbHRlcnMoKSB7XG4gICAgY29uc3Qge1xuICAgICAgICBtaW5TaXplSW5wdXQsIG1heFNpemVJbnB1dCwgbmFtZUZpbHRlcklucHV0LCBwZXJtYW5lbnRGaWx0ZXJJbnB1dCwgbWluU2VlZHNJbnB1dCxcbiAgICB9ID0gZ2V0RmlsdGVyQ29udHJvbHMoKTtcblxuICAgIC8vINCc0LDRgdGB0LjQsiBpbnB1dHMg0LTQu9GPINC40YLQtdGA0LDRhtC40LhcbiAgICBjb25zdCBpbnB1dHMgPSBbXG4gICAgICAgIG1pblNpemVJbnB1dCwgbWF4U2l6ZUlucHV0LCBuYW1lRmlsdGVySW5wdXQsIHBlcm1hbmVudEZpbHRlcklucHV0LCBtaW5TZWVkc0lucHV0LFxuICAgIF07XG4gICAgaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgICAgIGlmIChpbnB1dCkgaW5wdXQudmFsdWUgPSAnJztcbiAgICB9KTtcblxuICAgIC8vINCh0LHRgNCw0YHRi9Cy0LDQtdC8INGB0L7RhdGA0LDQvdC10L3QvdGL0LUg0YTQuNC70YzRgtGA0YtcbiAgICBmaWx0ZXJTdG9yYWdlLmNsZWFyUGVybWFuZW50KCk7XG4gICAgZmlsdGVyU3RvcmFnZS5jbGVhck1pblNlZWRzKCk7XG5cbiAgICAvLyDQn9C+0LrQsNC30YvQstCw0LXQvCDQstGB0LUg0YHRgtGA0L7QutC4XG4gICAgaWYgKHRvcnJlbnRSb3dzQ2FjaGUpIHtcbiAgICAgICAgdG9ycmVudFJvd3NDYWNoZS5mb3JFYWNoKChyb3dEYXRhKSA9PiB7XG4gICAgICAgICAgICByb3dEYXRhLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyDQntCx0L3QvtCy0LvRj9C10Lwg0YHRh9C10YLRh9C40LpcbiAgICAgICAgdXBkYXRlQ291bnRlcih0b3JyZW50Um93c0NhY2hlLmxlbmd0aCwgdG9ycmVudFJvd3NDYWNoZS5sZW5ndGgpO1xuICAgIH1cbn1cblxuLy8g0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LrRjdGI0LAg0L/RgNC10LTQvtCx0YDQsNCx0L7RgtCw0L3QvdGL0YUg0LTQsNC90L3Ri9GFINGB0YLRgNC+0Log0YLQsNCx0LvQuNGG0YtcbmZ1bmN0aW9uIGluaXRpYWxpemVUb3JyZW50Um93c0NhY2hlKCkge1xuICAgIGlmICh0b3JyZW50Um93c0NhY2hlKSByZXR1cm47IC8vINCa0Y3RiCDRg9C20LUg0YHQvtC30LTQsNC9XG5cbiAgICBjb25zdCB0b3JyZW50VGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudF9wZWVyJyk7XG4gICAgY29uc3QgdG9ycmVudFJvd3MgPSB0b3JyZW50VGFibGU/LnF1ZXJ5U2VsZWN0b3JBbGwoJ3Rib2R5IHRyOm5vdCgubW4pJykgfHwgW107XG5cbiAgICB0b3JyZW50Um93c0NhY2hlID0gQXJyYXkuZnJvbSh0b3JyZW50Um93cykubWFwKChyb3cpID0+IHtcbiAgICAgICAgY29uc3QgdGl0bGVDZWxsID0gcm93LnF1ZXJ5U2VsZWN0b3IoJy5uYW0gYScpO1xuICAgICAgICBpZiAoIXRpdGxlQ2VsbCkgcmV0dXJuIG51bGw7IC8vINCf0YDQvtC/0YPRgdC60LDQtdC8INC90LXQstCw0LvQuNC00L3Ri9C1INGB0YLRgNC+0LrQuFxuXG4gICAgICAgIGNvbnN0IHRpdGxlID0gdGl0bGVDZWxsLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICAgICAgY29uc3Qgc2l6ZVRleHQgPSBmaW5kRmlsZVNpemUocm93KTtcbiAgICAgICAgY29uc3QgZmlsZVNpemVHQiA9IHBhcnNlRmlsZVNpemUoc2l6ZVRleHQpO1xuICAgICAgICBjb25zdCBzZWVkc0NvdW50ID0gcGFyc2VTZWVkc0NvdW50KHJvdyk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVsZW1lbnQ6IHJvdyxcbiAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgZmlsZVNpemVHQixcbiAgICAgICAgICAgIHNlZWRzQ291bnQsXG4gICAgICAgIH07XG4gICAgfSkuZmlsdGVyKEJvb2xlYW4pOyAvLyDQo9Cx0LjRgNCw0LXQvCBudWxsINC30L3QsNGH0LXQvdC40Y9cbn1cblxuLy8g0J7QsdC90L7QstC70LXQvdC40LUg0YHRh9C10YLRh9C40LrQsCDRgNC10LfRg9C70YzRgtCw0YLQvtCyXG5mdW5jdGlvbiB1cGRhdGVDb3VudGVyKHZpc2libGUsIHRvdGFsKSB7XG4gICAgY29uc3QgeyBjb3VudGVyVGV4dCB9ID0gZ2V0RmlsdGVyQ29udHJvbHMoKTtcbiAgICBpZiAoIWNvdW50ZXJUZXh0KSByZXR1cm47XG5cbiAgICBjb3VudGVyVGV4dC50ZXh0Q29udGVudCA9IGDQn9C+0LrQsNC30LDQvdC+ICR7dmlzaWJsZX0g0LjQtyAke3RvdGFsfSDRgNCw0LfQtNCw0YdgO1xufVxuXG4vLyDQntGB0L3QvtCy0L3QsNGPINGE0YPQvdC60YbQuNGPINGE0LjQu9GM0YLRgNCw0YbQuNC4XG5mdW5jdGlvbiBhcHBseUZpbHRlcnMoKSB7XG4gICAgY29uc3Qge1xuICAgICAgICBtaW5TaXplSW5wdXQsIG1heFNpemVJbnB1dCwgbmFtZUZpbHRlcklucHV0LCBwZXJtYW5lbnRGaWx0ZXJJbnB1dCwgbWluU2VlZHNJbnB1dCxcbiAgICB9ID0gZ2V0RmlsdGVyQ29udHJvbHMoKTtcblxuICAgIGNvbnN0IG1pblNpemUgPSBtaW5TaXplSW5wdXQ/LnZhbHVlID8gcGFyc2VGbG9hdChtaW5TaXplSW5wdXQudmFsdWUpIDogMDtcbiAgICBjb25zdCBtYXhTaXplID0gbWF4U2l6ZUlucHV0Py52YWx1ZSA/IHBhcnNlRmxvYXQobWF4U2l6ZUlucHV0LnZhbHVlKSA6IEluZmluaXR5O1xuICAgIGNvbnN0IG5hbWVGaWx0ZXIgPSBuYW1lRmlsdGVySW5wdXQ/LnZhbHVlIHx8ICcnO1xuICAgIGNvbnN0IHBlcm1hbmVudEZpbHRlciA9IHBlcm1hbmVudEZpbHRlcklucHV0Py52YWx1ZSB8fCAnJztcbiAgICBjb25zdCBtaW5TZWVkcyA9IG1pblNlZWRzSW5wdXQ/LnZhbHVlID8gcGFyc2VJbnQobWluU2VlZHNJbnB1dC52YWx1ZSwgMTApIDogMDtcblxuICAgIGlmICghdG9ycmVudFJvd3NDYWNoZSkgcmV0dXJuO1xuXG4gICAgbGV0IHZpc2libGVDb3VudCA9IDA7XG4gICAgY29uc3QgdG90YWxDb3VudCA9IHRvcnJlbnRSb3dzQ2FjaGUubGVuZ3RoO1xuXG4gICAgdG9ycmVudFJvd3NDYWNoZS5mb3JFYWNoKChyb3dEYXRhKSA9PiB7XG4gICAgICAgIC8vINCf0YDQvtCy0LXRgNC60LAg0YDQsNC30LzQtdGA0LAgKNC40YHQv9C+0LvRjNC30YPQtdC8INC/0YDQtdC00L7QsdGA0LDQsdC+0YLQsNC90L3Ri9C5INGA0LDQt9C80LXRgCDQsiDQk9CRKVxuICAgICAgICBjb25zdCBzaXplTWF0Y2hlcyA9IG1hdGNoZXNTaXplRmlsdGVycyhyb3dEYXRhLCBtaW5TaXplLCBtYXhTaXplKTtcblxuICAgICAgICAvLyDQn9GA0L7QstC10YDQutCwINC40LzQtdC90LggKNC40YHQv9C+0LvRjNC30YPQtdC8INC/0YDQtdC00L7QsdGA0LDQsdC+0YLQsNC90L3QvtC1INC90LDQt9Cy0LDQvdC40LUg0LIg0L3QuNC20L3QtdC8INGA0LXQs9C40YHRgtGA0LUpXG4gICAgICAgIGNvbnN0IG5hbWVNYXRjaGVzID0gbWF0Y2hlc05hbWVGaWx0ZXJzKHJvd0RhdGEudGl0bGUsIG5hbWVGaWx0ZXIsIHBlcm1hbmVudEZpbHRlcik7XG5cbiAgICAgICAgLy8g0J/RgNC+0LLQtdGA0LrQsCDQutC+0LvQuNGH0LXRgdGC0LLQsCDRgdC40LTQvtCyXG4gICAgICAgIGNvbnN0IHNlZWRzTWF0Y2hlcyA9IG1hdGNoZXNTZWVkc0ZpbHRlcihyb3dEYXRhLCBtaW5TZWVkcyk7XG5cbiAgICAgICAgaWYgKHNpemVNYXRjaGVzICYmIG5hbWVNYXRjaGVzICYmIHNlZWRzTWF0Y2hlcykge1xuICAgICAgICAgICAgcm93RGF0YS5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgICAgIHZpc2libGVDb3VudCArPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcm93RGF0YS5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCe0LHQvdC+0LLQu9GP0LXQvCDRgdGH0LXRgtGH0LjQulxuICAgIHVwZGF0ZUNvdW50ZXIodmlzaWJsZUNvdW50LCB0b3RhbENvdW50KTtcbn1cblxuLy8g0J/QvtC40YHQuiDRgNCw0LfQvNC10YDQsCDRhNCw0LnQu9CwXG5mdW5jdGlvbiBmaW5kRmlsZVNpemUocm93KSB7XG4gICAgY29uc3Qgc2l6ZUNlbGxzID0gcm93LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkLnMnKTtcbiAgICBpZiAoc2l6ZUNlbGxzLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcnO1xuXG4gICAgLy8g0JjRidC10Lwg0Y/Rh9C10LnQutGDINGBINGA0LDQt9C80LXRgNC+0LwgKNC+0LHRi9GH0L3QviDQv9GA0LXQtNC/0L7RgdC70LXQtNC90Y/RjyDRgdGA0LXQtNC4IC5zKVxuICAgIGNvbnN0IHNpemVDZWxsID0gQXJyYXkuZnJvbShzaXplQ2VsbHMpLmZpbmRMYXN0KChjZWxsKSA9PiAvKNCc0JF80JPQkXxNQnxHQikvaS50ZXN0KGNlbGwudGV4dENvbnRlbnQpKTtcblxuICAgIHJldHVybiBzaXplQ2VsbCA/IHNpemVDZWxsLnRleHRDb250ZW50LnRyaW0oKSA6ICcnO1xufVxuXG4vLyDQn9Cw0YDRgdC40L3QsyDRgNCw0LfQvNC10YDQsCDRhNCw0LnQu9CwXG5mdW5jdGlvbiBwYXJzZUZpbGVTaXplKHNpemVUZXh0KSB7XG4gICAgaWYgKCFzaXplVGV4dCkgcmV0dXJuIDA7XG5cbiAgICBjb25zdCBjbGVhblRleHQgPSBzaXplVGV4dC5yZXBsYWNlKC9cXHMrL2csICcgJykudHJpbSgpO1xuICAgIGNvbnN0IG1hdGNoID0gY2xlYW5UZXh0Lm1hdGNoKC8oW1xcZCwuXSspXFxzKijQnNCRfNCT0JF8TUJ8R0IpL2kpO1xuXG4gICAgaWYgKCFtYXRjaCkgcmV0dXJuIDA7XG5cbiAgICBjb25zdCBzaXplID0gcGFyc2VGbG9hdChtYXRjaFsxXS5yZXBsYWNlKCcsJywgJy4nKSk7XG4gICAgY29uc3QgdW5pdCA9IG1hdGNoWzJdLnRvVXBwZXJDYXNlKCk7XG5cbiAgICBpZiAodW5pdCA9PT0gJ9Cc0JEnIHx8IHVuaXQgPT09ICdNQicpIHtcbiAgICAgICAgcmV0dXJuIHNpemUgLyAxMDI0OyAvLyDQmtC+0L3QstC10YDRgtC40YDRg9C10Lwg0JzQkSDQsiDQk9CRXG4gICAgfVxuXG4gICAgcmV0dXJuIHNpemU7IC8vINCj0LbQtSDQsiDQk9CRXG59XG5cbi8vINCf0LDRgNGB0LjQvdCzINC60L7Qu9C40YfQtdGB0YLQstCwINGB0LjQtNC+0LJcbmZ1bmN0aW9uIHBhcnNlU2VlZHNDb3VudChyb3cpIHtcbiAgICBjb25zdCBzZWVkc0NlbGwgPSByb3cucXVlcnlTZWxlY3RvcigndGQuc2xfcycpO1xuICAgIGlmICghc2VlZHNDZWxsKSByZXR1cm4gMDtcblxuICAgIGNvbnN0IHNlZWRzVGV4dCA9IHNlZWRzQ2VsbC50ZXh0Q29udGVudC50cmltKCk7XG4gICAgY29uc3Qgc2VlZHNDb3VudCA9IHBhcnNlSW50KHNlZWRzVGV4dCwgMTApO1xuXG4gICAgcmV0dXJuIE51bWJlci5pc05hTihzZWVkc0NvdW50KSA/IDAgOiBzZWVkc0NvdW50O1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzU2l6ZUZpbHRlcnMocm93RGF0YSwgbWluU2l6ZSwgbWF4U2l6ZSkge1xuICAgIHJldHVybiByb3dEYXRhLmZpbGVTaXplR0IgPj0gbWluU2l6ZSAmJiAobWF4U2l6ZSA9PT0gMCB8fCByb3dEYXRhLmZpbGVTaXplR0IgPD0gbWF4U2l6ZSk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXNOYW1lRmlsdGVycyh0aXRsZSwgc2VhcmNoRmlsdGVyLCBwZXJtYW5lbnRGaWx0ZXIpIHtcbiAgICBjb25zdCBhbGxGaWx0ZXJzID0gW3NlYXJjaEZpbHRlciwgcGVybWFuZW50RmlsdGVyXVxuICAgICAgICAuZmlsdGVyKChmKSA9PiBmICYmIGYudHJpbSgpKVxuICAgICAgICAuam9pbignLCcpO1xuXG4gICAgcmV0dXJuIGlzTWF0Y2hUZXh0RmlsdGVyKHRpdGxlLCBhbGxGaWx0ZXJzKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlc1NlZWRzRmlsdGVyKHJvd0RhdGEsIG1pblNlZWRzKSB7XG4gICAgcmV0dXJuIHJvd0RhdGEuc2VlZHNDb3VudCA+PSBtaW5TZWVkcztcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==