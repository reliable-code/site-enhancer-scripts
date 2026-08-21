// ==UserScript==
// @name         Mvideo store filter
// @description  Hide stores by filter
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @match        https://www.mvideo.ru/products/*
// @namespace    https://github.com/reliable-code/site-enhancer-scripts
// @version      1.0.78734393
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mvideo.ru
// @author       reliable-code
// @downloadURL  https://raw.githubusercontent.com/reliable-code/site-enhancer-scripts/main/specific/mvideo.user.js
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
/* harmony export */   matchesQuery: () => (/* binding */ matchesQuery)
/* harmony export */ });
/* unused harmony export isMatchTextFilter */
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

/***/ "./src/common/url.js"
/*!***************************!*\
  !*** ./src/common/url.js ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   observeURL: () => (/* binding */ observeURL),
/* harmony export */   pathnameIncludes: () => (/* binding */ pathnameIncludes)
/* harmony export */ });
/* unused harmony exports getURLPathElement, getPathnameElement, getURLPathElementEnding, getPathnameElementEnding, getURLQueryParam, clearQueryParams, pathnameIncludesSome, somePathElementEquals, setQueryParamsAndRedirect, observeURLForReload */
function getURLPathElement(position, defaultValue = "common", logResult = false) {
  const { pathname } = window.location;
  return getPathnameElement(pathname, position, defaultValue, logResult);
}
function getPathnameElement(pathname, position, defaultValue, logResult = false) {
  const pathElements = pathname.split("/");
  position = position < 0 ? pathElements.length + position : position;
  const pathElement = pathElements[position] || defaultValue;
  if (logResult) console.log(`Pathname element: ${pathElement}`);
  return pathElement;
}
function getURLPathElementEnding(position, defaultValue = "common", logResult = false) {
  const pathElement = getURLPathElement(position, "", logResult);
  return getPathElementEnding(pathElement, defaultValue, logResult);
}
function getPathElementEnding(pathElement, defaultValue, logResult) {
  if (!pathElement) return defaultValue;
  const pathElementEnding = pathElement.split("-").at(-1);
  if (logResult) console.log(`Pathname element ending: ${pathElementEnding}`);
  return pathElementEnding;
}
function getPathnameElementEnding(pathname, position, defaultValue = "common", logResult = false) {
  const pathElement = getPathnameElement(pathname, position, "", logResult);
  return getPathElementEnding(pathElement, defaultValue, logResult);
}
function getURLQueryParam(name) {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.get(name);
}
function clearQueryParams(link) {
  return link.split("?")[0];
}
function pathnameIncludes(searchString) {
  return window.location.pathname.includes(searchString);
}
function pathnameIncludesSome(searchStrings) {
  return searchStrings.some((searchString) => pathnameIncludes(searchString));
}
function somePathElementEquals(searchString) {
  const pathElements = window.location.pathname.split("/");
  return pathElements.some((pathElement) => pathElement === searchString);
}
function setQueryParamsAndRedirect(queryParams) {
  try {
    const url = new URL(window.location.href);
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.location.href = url.toString();
  } catch (error) {
    console.error("Failed to redirect:", error);
  }
}
function observeURL(callback, watchQueryParams = []) {
  const lastState = { pathname: window.location.pathname };
  watchQueryParams.forEach((key) => {
    lastState[key] = getURLQueryParam(key);
  });
  function handleURLChange() {
    const currentState = { pathname: window.location.pathname };
    watchQueryParams.forEach((key) => {
      currentState[key] = getURLQueryParam(key);
    });
    if (Object.keys(lastState).some((key) => lastState[key] !== currentState[key])) {
      callback();
    }
  }
  let lastURL = window.location.href;
  setInterval(() => {
    if (window.location.href !== lastURL) {
      lastURL = window.location.href;
      handleURLChange();
    }
  }, 200);
  window.addEventListener("popstate", handleURLChange);
}
function observeURLForReload(watchQueryParams = []) {
  observeURL(() => window.location.reload(), watchQueryParams);
}


/***/ },

/***/ "./src/mvideo/icons.js"
/*!*****************************!*\
  !*** ./src/mvideo/icons.js ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ICONS: () => (/* binding */ ICONS)
/* harmony export */ });
const ICONS = {
  HISTORY: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M13 3a9 9 0 0 1 8.945 8H24l-3.5 3.5L17 11h2.055A7 7 0 1 0 13 20a6.963 6.963 0 0 0 4.95-2.05l1.414 1.414A8.963 8.963 0 0 1 13 22a9 9 0 1 1 0-18Zm1 4v5l4 2-.75 1.848L12 13V7h2Z"/></svg>'
};


/***/ },

/***/ "./src/mvideo/selectors.js"
/*!*********************************!*\
  !*** ./src/mvideo/selectors.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SELECTORS: () => (/* binding */ SELECTORS)
/* harmony export */ });
const SELECTORS = {
  STORE_WRAPPER: ".list-block__wrapper",
  STORE_TITLE: ".list-block__title-text",
  STORE_SUBTITLE: ".list-block__subtitle",
  SHOW_MORE_BTN: "mvid-button-list .button-list__text",
  CONTROL_PANEL: ".availability__control-panel"
};


/***/ },

/***/ "./src/mvideo/storage.js"
/*!*******************************!*\
  !*** ./src/mvideo/storage.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   storeFilterStorage: () => (/* binding */ storeFilterStorage)
/* harmony export */ });
/* unused harmony export STORE_FILTER_KEYS */
/* harmony import */ var _common_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/storage */ "./src/common/storage.js");

const STORE_FILTER_KEYS = {
  NAME: "mvideo_store_filter_name",
  CITY: "mvideo_store_filter_city",
  HISTORY: "mvideo_store_filter_history"
};
const CONFIG = {
  /** Максимальное количество элементов в истории поиска */
  MAX_HISTORY: 10
};
const storeFilterStorage = {
  // === Название магазина ===
  /**
   * Получает сохраненное название магазина
   * @returns {string} Название магазина или пустая строка
   */
  getName: () => _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.get(STORE_FILTER_KEYS.NAME, ""),
  /**
   * Сохраняет название магазина
   * @param {string|null|undefined} value - Название для сохранения
   */
  setName: (value) => {
    const normalizedValue = String(value || "").trim();
    _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.set(STORE_FILTER_KEYS.NAME, normalizedValue);
  },
  /**
   * Удаляет сохраненное название магазина
   */
  clearName: () => _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.remove(STORE_FILTER_KEYS.NAME),
  // === Город ===
  /**
   * Получает сохраненный город
   * @returns {string} Название города или пустая строка
   */
  getCity: () => _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.get(STORE_FILTER_KEYS.CITY, ""),
  /**
   * Сохраняет город
   * @param {string|null|undefined} value - Название города для сохранения
   */
  setCity: (value) => {
    const normalizedValue = String(value || "").trim();
    _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.set(STORE_FILTER_KEYS.CITY, normalizedValue);
  },
  /**
   * Удаляет сохраненный город
   */
  clearCity: () => _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.remove(STORE_FILTER_KEYS.CITY),
  // === История поиска ===
  /**
   * Получает историю поисковых запросов
   * @returns {string[]} Массив поисковых запросов (от новых к старым)
   */
  getHistory: () => _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.get(STORE_FILTER_KEYS.HISTORY, []),
  /**
   * Устанавливает историю поисковых запросов
   * @param {string[]} history - Массив поисковых запросов
   */
  setHistory: (history) => {
    const validHistory = Array.isArray(history) ? history.filter((item) => typeof item === "string" && item.trim()) : [];
    _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.set(STORE_FILTER_KEYS.HISTORY, validHistory);
  },
  /**
   * Добавляет новый термин в историю поиска
   * Если термин уже существует, перемещает его в начало
   * @param {string|null|undefined} term - Поисковый термин для добавления
   */
  addToHistory: (term) => {
    const trimmed = String(term || "").trim();
    if (!trimmed) return;
    const normalized = trimmed.toLowerCase();
    const history = storeFilterStorage.getHistory();
    const filtered = history.filter((item) => String(item || "").toLowerCase() !== normalized);
    filtered.unshift(trimmed);
    const limited = filtered.slice(0, CONFIG.MAX_HISTORY);
    storeFilterStorage.setHistory(limited);
  },
  /**
   * Удаляет конкретный термин из истории поиска
   * @param {string} term - Термин для удаления
   */
  removeFromHistory: (term) => {
    if (!term) return;
    const history = storeFilterStorage.getHistory();
    const filtered = history.filter((item) => item !== term);
    storeFilterStorage.setHistory(filtered);
  },
  /**
   * Полностью очищает историю поиска
   */
  clearHistory: () => _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.remove(STORE_FILTER_KEYS.HISTORY),
  /**
   * Проверяет, пуста ли история поиска
   * @returns {boolean} true, если история пуста
   */
  isHistoryEmpty: () => storeFilterStorage.getHistory().length === 0,
  // === Комбинированные операции ===
  /**
   * Сохраняет оба фильтра одновременно
   * @param {string|null|undefined} searchText - Название магазина
   * @param {string|null|undefined} cityFilter - Город
   */
  saveFilters: (searchText, cityFilter) => {
    storeFilterStorage.setName(searchText);
    storeFilterStorage.setCity(cityFilter);
  },
  /**
   * Загружает все сохраненные фильтры
   * @returns {FilterData} Объект с названием и городом
   */
  loadFilters: () => ({
    name: storeFilterStorage.getName(),
    city: storeFilterStorage.getCity()
  }),
  /**
   * Очищает все фильтры (название и город), но сохраняет историю
   */
  clearAllFilters: () => {
    _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.removeMultiple([
      STORE_FILTER_KEYS.NAME,
      STORE_FILTER_KEYS.CITY
    ]);
  },
  /**
   * Полностью очищает все данные (фильтры и историю)
   */
  clearAllData: () => {
    _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.removeMultiple([
      STORE_FILTER_KEYS.NAME,
      STORE_FILTER_KEYS.CITY,
      STORE_FILTER_KEYS.HISTORY
    ]);
  },
  /**
   * Получает статистику по сохраненным данным
   * @returns {FilterStats} Объект со статистикой
   */
  getStats: () => {
    const name = storeFilterStorage.getName();
    const city = storeFilterStorage.getCity();
    const historyCount = storeFilterStorage.getHistory().length;
    return {
      hasName: Boolean(name),
      hasCity: Boolean(city),
      historyCount,
      isEmpty: !name && !city && historyCount === 0
    };
  }
};


/***/ },

/***/ "./src/mvideo/styles.css"
/*!*******************************!*\
  !*** ./src/mvideo/styles.css ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".mvideo-store-filter{margin-top:12px;width:100%;max-width:760px;position:relative;display:flex;gap:8px}.mvideo-store-filter__input-container{flex:1;position:relative;display:flex}.mvideo-store-filter__input{flex:1;appearance:none;-webkit-appearance:none;box-sizing:border-box;padding:12px 40px 12px 16px;font:400 16px/22px Roboto,Helvetica,Arial,sans-serif;color:#000;background-color:#fff;border:1.1px solid rgb(142,142,147);border-radius:4px;transition:border-color .2s ease;min-width:0}.mvideo-store-filter__input:focus{outline:none;border-color:#007bff}input[type=search]::-webkit-search-decoration,input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-results-button,input[type=search]::-webkit-search-results-decoration{display:none}.mvideo-store-filter__clear{position:absolute;right:8px;top:50%;transform:translateY(-50%);cursor:pointer;border:none;background:none;font-size:18px;color:#999;display:none;width:24px;height:24px;border-radius:50%;align-items:center;justify-content:center}.mvideo-store-filter__clear:hover{color:#333;background:#0000000d}.store-hidden{display:none!important}.mvideo-store-filter__suggestions{position:absolute;z-index:9999;left:0;top:calc(100% + 4px);right:0;max-height:260px;overflow:auto;background:#fff;border:1px solid #E5E5EA;border-radius:8px;box-shadow:0 8px 20px #00000014;display:none;padding:6px 0}.mvideo-store-filter__suggestion{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 12px;cursor:pointer;font:400 14px/20px Roboto,Helvetica,Arial,sans-serif;color:#1c1c1e;user-select:none}.mvideo-store-filter__suggestion:hover{background:#f2f2f7}.mvideo-store-filter__suggestion.is-active{background:#e5f0ff}.mvideo-store-filter__suggestion svg{flex:0 0 16px;opacity:.6}.mvideo-store-filter__empty{padding:10px 12px;color:#8e8e93;font:400 13px/18px Roboto,Helvetica,Arial,sans-serif}.mvideo-store-filter__footer{padding:6px 12px 0;border-top:1px solid #F2F2F7;display:flex;justify-content:flex-end}.mvideo-store-filter__clear-history{border:none;background:none;font:400 12px/16px Roboto,Helvetica,Arial,sans-serif;color:#6b7280;cursor:pointer;padding:6px 8px;border-radius:6px}.mvideo-store-filter__clear-history:hover{background:#f2f2f7;color:#374151}.mvideo-store-filter__delete{border:none;background:none;cursor:pointer;font-size:14px;color:#999;padding:2px 6px;border-radius:4px}.mvideo-store-filter__delete:hover{background:#f2f2f7;color:#333}.mvideo-store-filter__city{min-width:130px;max-width:200px;padding:12px 8px;font:400 14px/20px Roboto,Helvetica,Arial,sans-serif;border:1.1px solid rgb(142,142,147);border-radius:4px;background:#fff;cursor:pointer;flex-shrink:0}\n");

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
/*!*****************************!*\
  !*** ./src/mvideo/index.js ***!
  \*****************************/
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.css */ "./src/mvideo/styles.css");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./icons */ "./src/mvideo/icons.js");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selectors */ "./src/mvideo/selectors.js");
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./storage */ "./src/mvideo/storage.js");
/* harmony import */ var _common_dom_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/dom/utils */ "./src/common/dom/utils.js");
/* harmony import */ var _common_url__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/url */ "./src/common/url.js");
/* harmony import */ var _common_filter_helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/filter/helpers */ "./src/common/filter/helpers.js");
/* harmony import */ var _common_filter_compare__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/filter/compare */ "./src/common/filter/compare.js");








GM_addStyle(_styles_css__WEBPACK_IMPORTED_MODULE_0__["default"]);
let pageObserver = null;
checkShopDirectionsPage();
(0,_common_url__WEBPACK_IMPORTED_MODULE_5__.observeURL)(() => {
  checkShopDirectionsPage();
});
function checkShopDirectionsPage() {
  if ((0,_common_url__WEBPACK_IMPORTED_MODULE_5__.pathnameIncludes)("shopdirections")) {
    initFilter();
    startPageObserver();
  } else {
    cleanupShopDirectionsPageObserver();
  }
}
function cleanupShopDirectionsPageObserver() {
  if (!pageObserver) return;
  pageObserver.disconnect();
  pageObserver = null;
}
function clickShowMoreIfExists() {
  const btn = document.querySelector(_selectors__WEBPACK_IMPORTED_MODULE_2__.SELECTORS.SHOW_MORE_BTN);
  if (btn && btn.textContent.includes("\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0435\u0449\u0435")) {
    btn.click();
  }
}
const getStoreElements = () => [...document.querySelectorAll(_selectors__WEBPACK_IMPORTED_MODULE_2__.SELECTORS.STORE_WRAPPER)];
const getStoreText = (el) => el.querySelector(_selectors__WEBPACK_IMPORTED_MODULE_2__.SELECTORS.STORE_TITLE)?.textContent.trim() || "";
function getStoreCity(el) {
  const address = el.querySelector(_selectors__WEBPACK_IMPORTED_MODULE_2__.SELECTORS.STORE_SUBTITLE)?.textContent?.trim();
  if (!address) return "";
  let cleaned = address.replace(/^\d{5,6},?\s*/, "");
  cleaned = cleaned.replace(/^(г\.|город)\s*/i, "");
  const city = cleaned.split(",")[0].trim();
  if (city && city.length > 1 && /[а-яё]/i.test(city)) {
    return city;
  }
  console.warn("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0440\u0430\u0441\u043F\u0430\u0440\u0441\u0438\u0442\u044C \u0433\u043E\u0440\u043E\u0434 \u0438\u0437 \u0430\u0434\u0440\u0435\u0441\u0430:", address);
  return address;
}
function matchesCity(store, cityFilter) {
  return !cityFilter || getStoreCity(store) === cityFilter;
}
function filterStores(searchText, cityFilter) {
  const requirements = (0,_common_filter_helpers__WEBPACK_IMPORTED_MODULE_6__.parseFilterQuery)(searchText);
  getStoreElements().forEach((store) => {
    const storeName = getStoreText(store);
    const matchesName = (0,_common_filter_compare__WEBPACK_IMPORTED_MODULE_7__.matchesQuery)(storeName, requirements);
    const isVisible = matchesName && matchesCity(store, cityFilter);
    store.classList.toggle("store-hidden", !isVisible);
  });
  _storage__WEBPACK_IMPORTED_MODULE_3__.storeFilterStorage.saveFilters(searchText, cityFilter);
}
function createFilterElement() {
  const { name: savedName, city: savedCity } = _storage__WEBPACK_IMPORTED_MODULE_3__.storeFilterStorage.loadFilters();
  const wrapper = document.createElement("div");
  wrapper.className = "mvideo-store-filter";
  const escapeAttr = (s) => String(s).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[m]);
  const cities = [...new Set(getStoreElements().map(getStoreCity).filter(Boolean))].sort();
  wrapper.innerHTML = `
      <div class="mvideo-store-filter__input-container">
        <input type="search" id="storeFilter" class="mvideo-store-filter__input"
          placeholder="\u0424\u0438\u043B\u044C\u0442\u0440 \u043F\u043E \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044E \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430..."
          value="${escapeAttr(savedName)}" maxlength="300"
          autocomplete="off" role="combobox" aria-expanded="false"
          aria-autocomplete="list" aria-owns="storeFilterSuggestions" aria-haspopup="listbox">
        <button id="clearFilter" class="mvideo-store-filter__clear" aria-label="\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C">&times;</button>
        <div id="storeFilterSuggestions" class="mvideo-store-filter__suggestions" role="listbox"></div>
      </div>
      <select id="cityFilter" class="mvideo-store-filter__city">
        <option value="">\u0412\u0441\u0435 \u0433\u043E\u0440\u043E\u0434\u0430</option>
        ${cities.map((c) => `<option value="${escapeAttr(c)}" ${c === savedCity ? "selected" : ""}>${c}</option>`).join("")}
      </select>
    `;
  return wrapper;
}
function renderSuggestions(container, items, activeIndex) {
  if (!container) return;
  if (!items.length) {
    container.innerHTML = '<div class="mvideo-store-filter__empty">\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0445 \u0437\u0430\u043F\u0440\u043E\u0441\u043E\u0432</div>';
    return;
  }
  const list = items.map((text, i) => `
      <div class="mvideo-store-filter__suggestion ${i === activeIndex ? "is-active" : ""}" role="option" data-value="${encodeURIComponent(text)}">
        <span style="display:flex; align-items:center; gap:6px">${_icons__WEBPACK_IMPORTED_MODULE_1__.ICONS.HISTORY}<span>${text}</span></span>
        <button type="button" class="mvideo-store-filter__delete" title="\u0423\u0434\u0430\u043B\u0438\u0442\u044C">&times;</button>
      </div>
    `).join("");
  const footer = `
      <div class="mvideo-store-filter__footer">
        <button type="button" class="mvideo-store-filter__clear-history" id="clearHistoryBtn">\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0432\u0441\u0451</button>
      </div>
    `;
  container.innerHTML = list + footer;
}
function initFilter() {
  const panel = document.querySelector(_selectors__WEBPACK_IMPORTED_MODULE_2__.SELECTORS.CONTROL_PANEL);
  if (!panel || document.getElementById("storeFilter")) return false;
  const filterElement = createFilterElement();
  panel.parentNode.insertBefore(filterElement, panel.nextSibling);
  const input = filterElement.querySelector("#storeFilter");
  const clearBtn = filterElement.querySelector("#clearFilter");
  const sugg = filterElement.querySelector("#storeFilterSuggestions");
  const citySelect = filterElement.querySelector("#cityFilter");
  let activeIndex = -1;
  let currentList = [];
  function updateSuggestionList() {
    currentList = _storage__WEBPACK_IMPORTED_MODULE_3__.storeFilterStorage.getHistory();
    activeIndex = -1;
    renderSuggestions(sugg, currentList, activeIndex);
  }
  function showSuggestionsIfAny() {
    updateSuggestionList();
    if (currentList.length) {
      sugg.style.display = "block";
      input.setAttribute("aria-expanded", "true");
    } else {
      sugg.style.display = "none";
      input.setAttribute("aria-expanded", "false");
    }
  }
  function applySuggestionByIndex(idx) {
    if (idx < 0 || idx >= currentList.length) return;
    const val = currentList[idx];
    input.value = val;
    filterStores(val, citySelect.value);
    _storage__WEBPACK_IMPORTED_MODULE_3__.storeFilterStorage.addToHistory(val);
    clearBtn.style.display = val ? "flex" : "none";
    sugg.style.display = "none";
    input.setAttribute("aria-expanded", "false");
    input.focus();
  }
  function saveHistory(value) {
    const trimmedValue = value.trim();
    if (trimmedValue) _storage__WEBPACK_IMPORTED_MODULE_3__.storeFilterStorage.addToHistory(trimmedValue);
  }
  if (input.value) {
    filterStores(input.value, citySelect.value);
    clearBtn.style.display = "flex";
  } else if (citySelect.value) {
    filterStores("", citySelect.value);
  }
  input.addEventListener(
    "input",
    (0,_common_dom_utils__WEBPACK_IMPORTED_MODULE_4__.debounce)((e) => {
      filterStores(e.target.value, citySelect.value);
      clearBtn.style.display = e.target.value ? "flex" : "none";
      showSuggestionsIfAny();
    }, 200)
  );
  input.addEventListener("focus", showSuggestionsIfAny);
  input.addEventListener("click", showSuggestionsIfAny);
  input.addEventListener("keydown", (e) => {
    if (sugg.style.display === "block") {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, currentList.length - 1);
        renderSuggestions(sugg, currentList, activeIndex);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, -1);
        renderSuggestions(sugg, currentList, activeIndex);
        return;
      }
      if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        applySuggestionByIndex(activeIndex);
        return;
      }
      if (e.key === "Escape") {
        sugg.style.display = "none";
        input.setAttribute("aria-expanded", "false");
        return;
      }
    }
    if (e.key === "Enter") {
      saveHistory(input.value);
    }
  });
  input.addEventListener("blur", () => {
    saveHistory(input.value);
    setTimeout(() => {
      sugg.style.display = "none";
      input.setAttribute("aria-expanded", "false");
    }, 120);
  });
  clearBtn.addEventListener("click", () => {
    input.value = "";
    filterStores("", citySelect.value);
    clearBtn.style.display = "none";
    input.focus();
    showSuggestionsIfAny();
  });
  sugg.addEventListener("mousedown", (e) => {
    const clearBtnEl = e.target.closest("#clearHistoryBtn");
    if (clearBtnEl) {
      _storage__WEBPACK_IMPORTED_MODULE_3__.storeFilterStorage.clearHistory();
      updateSuggestionList();
      if (!currentList.length) {
        sugg.style.display = "none";
        input.setAttribute("aria-expanded", "false");
      }
      e.preventDefault();
      return;
    }
    const delBtn = e.target.closest(".mvideo-store-filter__delete");
    if (delBtn) {
      const itemEl = delBtn.closest(".mvideo-store-filter__suggestion");
      const val2 = decodeURIComponent(itemEl.getAttribute("data-value") || "");
      _storage__WEBPACK_IMPORTED_MODULE_3__.storeFilterStorage.removeFromHistory(val2);
      updateSuggestionList();
      e.preventDefault();
      return;
    }
    const item = e.target.closest(".mvideo-store-filter__suggestion");
    if (!item) return;
    const val = decodeURIComponent(item.getAttribute("data-value") || "");
    input.value = val;
    filterStores(val, citySelect.value);
    _storage__WEBPACK_IMPORTED_MODULE_3__.storeFilterStorage.addToHistory(val);
    clearBtn.style.display = val ? "flex" : "none";
    sugg.style.display = "none";
    input.setAttribute("aria-expanded", "false");
    e.preventDefault();
  });
  citySelect.addEventListener("change", () => {
    filterStores(input.value, citySelect.value);
  });
  return true;
}
function startPageObserver() {
  if (pageObserver) return;
  const debouncedFilter = (0,_common_dom_utils__WEBPACK_IMPORTED_MODULE_4__.debounce)((currentFilter, cityFilter) => {
    filterStores(currentFilter, cityFilter);
  }, 100);
  pageObserver = new MutationObserver((muts) => {
    const input = document.getElementById("storeFilter");
    const citySelect = document.getElementById("cityFilter");
    const currentFilter = input?.value || "";
    const cityFilter = citySelect?.value || "";
    muts.some((mut) => Array.from(mut.addedNodes).some((node) => {
      if (node.nodeType !== 1) return false;
      clickShowMoreIfExists();
      if (!input && document.querySelector(_selectors__WEBPACK_IMPORTED_MODULE_2__.SELECTORS.CONTROL_PANEL)) {
        if (initFilter()) return true;
      }
      if (node.matches?.(_selectors__WEBPACK_IMPORTED_MODULE_2__.SELECTORS.STORE_WRAPPER) || node.querySelector?.(_selectors__WEBPACK_IMPORTED_MODULE_2__.SELECTORS.STORE_TITLE)) {
        if (currentFilter || cityFilter) {
          debouncedFilter(currentFilter, cityFilter);
        }
        return true;
      }
      return false;
    }));
  });
  pageObserver.observe(document.body, { childList: true, subtree: true });
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFBVSxFQUFFLEtBQUssQ0FBQyxTQUFTO0FBQ3pELFVBQUksS0FBSyxhQUFhLEVBQUcsUUFBTztBQUVoQyw0QkFBc0I7QUFFdEIsVUFBSSxDQUFDLFNBQVMsU0FBUyxjQUFjLGlEQUFTLENBQUMsYUFBYSxHQUFHO0FBQzNELFlBQUksV0FBVyxFQUFHLFFBQU87QUFBQSxNQUM3QjtBQUVBLFVBQUksS0FBSyxVQUFVLGlEQUFTLENBQUMsYUFBYSxLQUN0QyxLQUFLLGdCQUFnQixpREFBUyxDQUFDLFdBQVcsR0FDNUM7QUFDRSxZQUFJLGlCQUFpQixZQUFZO0FBQzdCLDBCQUFnQixlQUFlLFVBQVU7QUFBQSxRQUM3QztBQUNBLGVBQU87QUFBQSxNQUNYO0FBRUEsYUFBTztBQUFBLElBQ1gsQ0FBQyxDQUFDO0FBQUEsRUFDTixDQUFDO0FBRUQsZUFBYSxRQUFRLFNBQVMsTUFBTSxFQUFFLFdBQVcsTUFBTSxTQUFTLEtBQUssQ0FBQztBQUMxRSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb21tb24vZG9tL2xvZ2dpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9kb20vdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9maWx0ZXIvY29tcGFyZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL2ZpbHRlci9oZWxwZXJzLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vc3RvcmFnZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL3VybC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbXZpZGVvL2ljb25zLmpzIiwid2VicGFjazovLy8uL3NyYy9tdmlkZW8vc2VsZWN0b3JzLmpzIiwid2VicGFjazovLy8uL3NyYy9tdmlkZW8vc3RvcmFnZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbXZpZGVvL3N0eWxlcy5jc3MiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vLy4vc3JjL212aWRlby9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBJU19ERUJVRyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnO1xuXG5mdW5jdGlvbiBsb2dJZkRlYnVnKC4uLmFyZ3MpIHtcbiAgICBpZiAoIUlTX0RFQlVHKSByZXR1cm47XG4gICAgY29uc29sZS5sb2coLi4uYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dFbGVtZW50U2VhcmNoKHNlbGVjdG9yLCBwYXJlbnROb2RlLCByZXN1bHQpIHtcbiAgICBjb25zdCBmb3VuZCA9IHJlc3VsdCBpbnN0YW5jZW9mIE5vZGVMaXN0ID8gcmVzdWx0Lmxlbmd0aCA+IDAgOiBCb29sZWFuKHJlc3VsdCk7XG5cbiAgICBsb2dJZkRlYnVnKFxuICAgICAgICBgJHtmb3VuZCA/ICfinIUgRm91bmQgZWxlbWVudCcgOiAn4p2MIE5vdCBmb3VuZCBlbGVtZW50J31gLFxuICAgICAgICAnXFxuIOKUnOKUgCBTZWxlY3RvcjonLFxuICAgICAgICBgXCIke3NlbGVjdG9yfVwiYCxcbiAgICAgICAgJ1xcbiDilJzilIAgUGFyZW50OicsXG4gICAgICAgIHBhcmVudE5vZGUsXG4gICAgICAgICdcXG4g4pSU4pSAIFJlc3VsdDonLFxuICAgICAgICByZXN1bHQsXG4gICAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ0VsZW1lbnRXYWl0KHNlbGVjdG9yLCBwYXJlbnROb2RlKSB7XG4gICAgbG9nSWZEZWJ1ZyhcbiAgICAgICAgJ+KPsyBXYWl0aW5nIGZvciBlbGVtZW50JyxcbiAgICAgICAgJ1xcbiDilJzilIAgU2VsZWN0b3I6JyxcbiAgICAgICAgYFwiJHtzZWxlY3Rvcn1cImAsXG4gICAgICAgICdcXG4g4pSU4pSAIFBhcmVudDonLFxuICAgICAgICBwYXJlbnROb2RlLFxuICAgICk7XG59XG4iLCJpbXBvcnQgeyBsb2dFbGVtZW50U2VhcmNoLCBsb2dFbGVtZW50V2FpdCB9IGZyb20gJy4vbG9nZ2luZyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB3YWl0Rm9yRWxlbWVudChwYXJlbnROb2RlLCBzZWxlY3RvciwgdGltZW91dCA9IG51bGwsIGxvZ09uRGVidWcgPSBmYWxzZSkge1xuICAgIGNvbnN0IGV4aXN0aW5nRWxlbWVudCA9IHBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgaWYgKGV4aXN0aW5nRWxlbWVudCkge1xuICAgICAgICBpZiAobG9nT25EZWJ1ZykgbG9nRWxlbWVudFNlYXJjaChzZWxlY3RvciwgcGFyZW50Tm9kZSwgZXhpc3RpbmdFbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShleGlzdGluZ0VsZW1lbnQpO1xuICAgIH1cblxuICAgIGlmIChsb2dPbkRlYnVnKSBsb2dFbGVtZW50V2FpdChzZWxlY3RvciwgcGFyZW50Tm9kZSk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihtdXRhdGlvbkNhbGxiYWNrKTtcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShwYXJlbnROb2RlLCB7XG4gICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgdGltZW91dElkO1xuICAgICAgICBpZiAodGltZW91dCkge1xuICAgICAgICAgICAgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIGlmIChsb2dPbkRlYnVnKSBsb2dFbGVtZW50U2VhcmNoKHNlbGVjdG9yLCBwYXJlbnROb2RlLCBudWxsKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBtdXRhdGlvbkNhbGxiYWNrKCkge1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IHBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQpIHJldHVybjtcblxuICAgICAgICAgICAgaWYgKHRpbWVvdXRJZCkgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICBpZiAobG9nT25EZWJ1ZykgbG9nRWxlbWVudFNlYXJjaChzZWxlY3RvciwgcGFyZW50Tm9kZSwgZWxlbWVudCk7XG4gICAgICAgICAgICByZXNvbHZlKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3YWl0VW50aWxFbGVtZW50R29uZShwYXJlbnROb2RlLCBzZWxlY3Rvcikge1xuICAgIGNvbnN0IGV4aXN0aW5nRWxlbWVudCA9IHBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgaWYgKCFleGlzdGluZ0VsZW1lbnQpIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKG11dGF0aW9uQ2FsbGJhY2spO1xuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKHBhcmVudE5vZGUsIHtcbiAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIG11dGF0aW9uQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICBpZiAocGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdhaXRVbnRpbEVsZW1lbnRTdGFiaWxpemVkKGVsZW1lbnQsIHRpbWVvdXQgPSA0MDApIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgbGV0IHRpbWVvdXRJZDtcblxuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICAgICAgc2NoZWR1bGVDb21wbGV0aW9uKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIHNjaGVkdWxlQ29tcGxldGlvbigpIHtcbiAgICAgICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9LCB0aW1lb3V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjaGVkdWxlQ29tcGxldGlvbigpO1xuXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCwge1xuICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0ID0gMjUwKSB7XG4gICAgbGV0IHRpbWVvdXRJZDtcbiAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4gZnVuYy5hcHBseSh0aGlzLCBhcmdzKSwgd2FpdCk7XG4gICAgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1bldoZW5WaXNpYmxlKGNhbGxiYWNrKSB7XG4gICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ3Zpc2libGUnKSB7XG4gICAgICAgIGF3YWl0IGNhbGxiYWNrKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICd2aXNpYmxlJykge1xuICAgICAgICAgICAgICAgIGF3YWl0IGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHsgb25jZTogdHJ1ZSB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5PbmNlT25JbnRlcnNlY3Rpb24oZWxlbWVudCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcigoZW50cmllcykgPT4ge1xuICAgICAgICBlbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWVudHJ5LmlzSW50ZXJzZWN0aW5nKSByZXR1cm47XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnNlY3Rpb25PYnNlcnZlcihlbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBlbGVtZW50LmludGVyc2VjdGlvbk9ic2VydmVyID0gb2JzZXJ2ZXI7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFySW50ZXJzZWN0aW9uT2JzZXJ2ZXIoZWxlbWVudCkge1xuICAgIGlmICghZWxlbWVudC5pbnRlcnNlY3Rpb25PYnNlcnZlcikgcmV0dXJuO1xuXG4gICAgZWxlbWVudC5pbnRlcnNlY3Rpb25PYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgZWxlbWVudC5pbnRlcnNlY3Rpb25PYnNlcnZlciA9IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhck9ic2VydmVyKG9ic2VydmVyKSB7XG4gICAgaWYgKCFvYnNlcnZlcikgcmV0dXJuO1xuICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICBvYnNlcnZlciA9IG51bGw7XG59XG4iLCJpbXBvcnQgeyBwYXJzZUZpbHRlclF1ZXJ5IH0gZnJvbSAnLi9oZWxwZXJzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzTWF0Y2hUZXh0RmlsdGVyKHBhcmFtZXRlclZhbHVlLCBmaWx0ZXJWYWx1ZSkge1xuICAgIGlmICghZmlsdGVyVmFsdWUpIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHJlcXVpcmVtZW50cyA9IHBhcnNlRmlsdGVyUXVlcnkoZmlsdGVyVmFsdWUpO1xuICAgIHJldHVybiBtYXRjaGVzUXVlcnkocGFyYW1ldGVyVmFsdWUsIHJlcXVpcmVtZW50cyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXRjaGVzUXVlcnkodGV4dCwgcmVxdWlyZW1lbnRzKSB7XG4gICAgaWYgKCFyZXF1aXJlbWVudHMgfHwgIXJlcXVpcmVtZW50cy5sZW5ndGgpIHJldHVybiB0cnVlO1xuXG4gICAgY29uc3Qgbm9ybWFsaXplZFRleHQgPSAodGV4dCB8fCAnJykudG9Mb3dlckNhc2UoKTtcblxuICAgIHJldHVybiByZXF1aXJlbWVudHMuZXZlcnkoKGdyb3VwKSA9PiBjaGVja0dyb3VwTWF0Y2gobm9ybWFsaXplZFRleHQsIGdyb3VwKSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrR3JvdXBNYXRjaCh0ZXh0LCBncm91cENvbmRpdGlvbnMpIHtcbiAgICByZXR1cm4gZ3JvdXBDb25kaXRpb25zLnNvbWUoKHsgdGVybSwgaXNOZWdhdGl2ZSB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGluY2x1ZGVzID0gdGV4dC5pbmNsdWRlcyh0ZXJtKTtcbiAgICAgICAgcmV0dXJuIGlzTmVnYXRpdmUgPyAhaW5jbHVkZXMgOiBpbmNsdWRlcztcbiAgICB9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBwYXJzZUZpbHRlclF1ZXJ5KHF1ZXJ5U3RyaW5nKSB7XG4gICAgaWYgKCFxdWVyeVN0cmluZykgcmV0dXJuIFtdO1xuXG4gICAgcmV0dXJuIHF1ZXJ5U3RyaW5nLnRvTG93ZXJDYXNlKClcbiAgICAgICAgLnNwbGl0KCcsJylcbiAgICAgICAgLm1hcChwYXJzZUdyb3VwKVxuICAgICAgICAuZmlsdGVyKEJvb2xlYW4pO1xufVxuXG5mdW5jdGlvbiBwYXJzZUdyb3VwKGdyb3VwU3RyaW5nKSB7XG4gICAgY29uc3QgdG9rZW5zID0gZ3JvdXBTdHJpbmcuc3BsaXQoJy8nKVxuICAgICAgICAubWFwKChzKSA9PiBzLnRyaW0oKSlcbiAgICAgICAgLmZpbHRlcihCb29sZWFuKTtcblxuICAgIGlmICh0b2tlbnMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGNvbmRpdGlvbnMgPSB0b2tlbnNcbiAgICAgICAgLm1hcChjcmVhdGVDb25kaXRpb24pXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICByZXR1cm4gY29uZGl0aW9ucy5sZW5ndGggPiAwID8gY29uZGl0aW9ucyA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbmRpdGlvbihyYXdUb2tlbikge1xuICAgIGNvbnN0IGlzTmVnYXRpdmUgPSByYXdUb2tlbi5zdGFydHNXaXRoKCchJyk7XG4gICAgY29uc3QgdGVybSA9IGlzTmVnYXRpdmUgPyByYXdUb2tlbi5zbGljZSgxKS50cmltKCkgOiByYXdUb2tlbjtcblxuICAgIGlmICghdGVybSkgcmV0dXJuIG51bGw7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0ZXJtLFxuICAgICAgICBpc05lZ2F0aXZlLFxuICAgIH07XG59XG5cbiIsImV4cG9ydCBjb25zdCBzdG9yYWdlID0ge1xuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQtdC90LjQtSDQtNCw0L3QvdGL0YUg0LjQtyBHTSBzdG9yYWdlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtINC60LvRjtGHXG4gICAgICogQHBhcmFtIHsqfSBkZWZhdWx0VmFsdWUgLSDQt9C90LDRh9C10L3QuNC1INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXG4gICAgICogQHJldHVybnMgeyp9INC30L3QsNGH0LXQvdC40LUg0LjQu9C4IGRlZmF1bHRWYWx1ZVxuICAgICAqL1xuICAgIGdldDogKGtleSwgZGVmYXVsdFZhbHVlID0gbnVsbCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIEdNX2dldFZhbHVlKGtleSwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgU3RvcmFnZSBnZXQgZXJyb3IgZm9yIGtleSBcIiR7a2V5fVwiOmAsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0KHQvtGF0YDQsNC90LXQvdC40LUg0LTQsNC90L3Ri9GFINCyIEdNIHN0b3JhZ2VcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0g0LrQu9GO0YdcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIC0g0LfQvdCw0YfQtdC90LjQtSAo0LvRjtCx0L7QuSDRgtC40L8pXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59INGD0YHQv9C10YjQvdC+0YHRgtGMINC+0L/QtdGA0LDRhtC40LhcbiAgICAgKi9cbiAgICBzZXQ6IChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBHTV9zZXRWYWx1ZShrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBTdG9yYWdlIHNldCBlcnJvciBmb3Iga2V5IFwiJHtrZXl9XCI6YCwgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCe0LHQvdC+0LLQu9C10L3QuNC1INGB0YPRidC10YHRgtCy0YPRjtGJ0LjRhSDQtNCw0L3QvdGL0YUg0YfQtdGA0LXQtyDRhNGD0L3QutGG0LjRjlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSDQutC70Y7Rh1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHVwZGF0ZUZuIC0g0YTRg9C90LrRhtC40Y8g0L7QsdC90L7QstC70LXQvdC40Y8gKNC/0L7Qu9GD0YfQsNC10YIg0YLQtdC60YPRidC10LUg0LfQvdCw0YfQtdC90LjQtSwg0LLQvtC30LLRgNCw0YnQsNC10YIg0L3QvtCy0L7QtSlcbiAgICAgKiBAcGFyYW0geyp9IGRlZmF1bHRWYWx1ZSAtINC30L3QsNGH0LXQvdC40LUg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0LXRgdC70Lgg0LrQu9GO0Ycg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRglxuICAgICAqIEByZXR1cm5zIHsqfSDQvdC+0LLQvtC1INC30L3QsNGH0LXQvdC40LVcbiAgICAgKi9cbiAgICB1cGRhdGU6IChrZXksIHVwZGF0ZUZuLCBkZWZhdWx0VmFsdWUgPSBudWxsKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50VmFsdWUgPSBzdG9yYWdlLmdldChrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IHVwZGF0ZUZuKGN1cnJlbnRWYWx1ZSk7XG4gICAgICAgICAgICBzdG9yYWdlLnNldChrZXksIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBuZXdWYWx1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgU3RvcmFnZSB1cGRhdGUgZXJyb3IgZm9yIGtleSBcIiR7a2V5fVwiOmAsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBzdG9yYWdlLmdldChrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0KPQtNCw0LvQtdC90LjQtSDQtNCw0L3QvdGL0YUg0LjQtyBHTSBzdG9yYWdlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtINC60LvRjtGHXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59INGD0YHQv9C10YjQvdC+0YHRgtGMINC+0L/QtdGA0LDRhtC40LhcbiAgICAgKi9cbiAgICByZW1vdmU6IChrZXkpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIEdNX2RlbGV0ZVZhbHVlKGtleSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgU3RvcmFnZSByZW1vdmUgZXJyb3IgZm9yIGtleSBcIiR7a2V5fVwiOmAsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQn9GA0L7QstC10YDQutCwINGB0YPRidC10YHRgtCy0L7QstCw0L3QuNGPINC60LvRjtGH0LBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0g0LrQu9GO0YdcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBoYXM6IChrZXkpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yYWdlLmtleXMoKS5pbmNsdWRlcyhrZXkpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBTdG9yYWdlIGhhcyBlcnJvciBmb3Iga2V5IFwiJHtrZXl9XCI6YCwgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQtdC90LjQtSDQstGB0LXRhSDQutC70Y7Rh9C10LlcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nW119INC80LDRgdGB0LjQsiDQutC70Y7Rh9C10LlcbiAgICAgKi9cbiAgICBrZXlzOiAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gR01fbGlzdFZhbHVlcygpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIGtleXMgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCe0YfQuNGB0YLQutCwINC00LDQvdC90YvRhSDRgdC60YDQuNC/0YLQsFxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IGtleXNUb1JlbW92ZSAtINC80LDRgdGB0LjQsiDQutC70Y7Rh9C10Lkg0LTQu9GPINGD0LTQsNC70LXQvdC40Y9cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g0YPRgdC/0LXRiNC90L7RgdGC0Ywg0L7Qv9C10YDQsNGG0LjQuFxuICAgICAqL1xuICAgIGNsZWFyOiAoa2V5c1RvUmVtb3ZlID0gbnVsbCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgYWxsS2V5cyA9IGtleXNUb1JlbW92ZSB8fCBzdG9yYWdlLmtleXMoKTtcbiAgICAgICAgICAgIGFsbEtleXMuZm9yRWFjaCgoa2V5KSA9PiBHTV9kZWxldGVWYWx1ZShrZXkpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIGNsZWFyIGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQnNCw0YHRgdC+0LLQvtC1INC/0L7Qu9GD0YfQtdC90LjQtSDQtNCw0L3QvdGL0YVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBrZXlzTGlzdCAtINC80LDRgdGB0LjQsiDQutC70Y7Rh9C10LlcbiAgICAgKiBAcGFyYW0geyp9IGRlZmF1bHRWYWx1ZSAtINC30L3QsNGH0LXQvdC40LUg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0LTQu9GPINC+0YLRgdGD0YLRgdGC0LLRg9GO0YnQuNGFINC60LvRjtGH0LXQuVxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9INC+0LHRitC10LrRgiDRgSDQv9Cw0YDQsNC80Lgg0LrQu9GO0Yct0LfQvdCw0YfQtdC90LjQtVxuICAgICAqL1xuICAgIGdldE11bHRpcGxlOiAoa2V5c0xpc3QsIGRlZmF1bHRWYWx1ZSA9IG51bGwpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgICAgIGtleXNMaXN0LmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBzdG9yYWdlLmdldChrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQnNCw0YHRgdC+0LLQvtC1INGB0L7RhdGA0LDQvdC10L3QuNC1INC00LDQvdC90YvRhVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0g0L7QsdGK0LXQutGCINGBINC/0LDRgNCw0LzQuCDQutC70Y7Rhy3Qt9C90LDRh9C10L3QuNC1XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59INGD0YHQv9C10YjQvdC+0YHRgtGMINCy0YHQtdGFINC+0L/QtdGA0LDRhtC40LlcbiAgICAgKi9cbiAgICBzZXRNdWx0aXBsZTogKGRhdGEpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKGRhdGEpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgICAgIEdNX3NldFZhbHVlKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSBzZXRNdWx0aXBsZSBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0KPQtNCw0LvQtdC90LjQtSDQvdC10YHQutC+0LvRjNC60LjRhSDQutC70Y7Rh9C10LlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBrZXlzVG9SZW1vdmUgLSDQvNCw0YHRgdC40LIg0LrQu9GO0YfQtdC5INC00LvRjyDRg9C00LDQu9C10L3QuNGPICjQvtCx0Y/Qt9Cw0YLQtdC70YzQvdGL0Lkg0L/QsNGA0LDQvNC10YLRgClcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g0YPRgdC/0LXRiNC90L7RgdGC0Ywg0L7Qv9C10YDQsNGG0LjQuFxuICAgICAqL1xuICAgIHJlbW92ZU11bHRpcGxlOiAoa2V5c1RvUmVtb3ZlKSA9PiB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShrZXlzVG9SZW1vdmUpIHx8IGtleXNUb1JlbW92ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSByZW1vdmVNdWx0aXBsZToga2V5c1RvUmVtb3ZlIG11c3QgYmUgYSBub24tZW1wdHkgYXJyYXknKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBrZXlzVG9SZW1vdmUuZm9yRWFjaCgoa2V5KSA9PiBHTV9kZWxldGVWYWx1ZShrZXkpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIHJlbW92ZU11bHRpcGxlIGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LXQvdC40LUg0LrQvtC70LjRh9C10YHRgtCy0LAg0YHQvtGF0YDQsNC90LXQvdC90YvRhSDQutC70Y7Rh9C10LlcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSDQutC+0LvQuNGH0LXRgdGC0LLQviDQutC70Y7Rh9C10LlcbiAgICAgKi9cbiAgICBjb3VudDogKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uua2V5cygpLmxlbmd0aDtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSBjb3VudCBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LXQvdC40LUg0LLRgdC10YUg0LTQsNC90L3Ri9GFINCyINCy0LjQtNC1INC+0LHRitC10LrRgtCwXG4gICAgICogQHJldHVybnMge09iamVjdH0g0L7QsdGK0LXQutGCINGB0L4g0LLRgdC10LzQuCDRgdC+0YXRgNCw0L3QtdC90L3Ri9C80Lgg0LTQsNC90L3Ri9C80LhcbiAgICAgKi9cbiAgICBnZXRBbGw6ICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGFsbEtleXMgPSBzdG9yYWdlLmtleXMoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgICAgICAgICAgYWxsS2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IEdNX2dldFZhbHVlKGtleSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgZ2V0QWxsIGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQntCf0JDQodCd0J46INCe0YfQuNGB0YLQutCwINCy0YHQtdGFINC00LDQvdC90YvRhSDRgdC60YDQuNC/0YLQsFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZmlybUNsZWFyIC0g0L7QsdGP0LfQsNGC0LXQu9GM0L3Ri9C5INGE0LvQsNCzINC/0L7QtNGC0LLQtdGA0LbQtNC10L3QuNGPICjQtNC+0LvQttC10L0g0LHRi9GC0YwgdHJ1ZSlcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g0YPRgdC/0LXRiNC90L7RgdGC0Ywg0L7Qv9C10YDQsNGG0LjQuFxuICAgICAqL1xuICAgIGNsZWFyQWxsOiAoY29uZmlybUNsZWFyID0gZmFsc2UpID0+IHtcbiAgICAgICAgaWYgKGNvbmZpcm1DbGVhciAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIGNsZWFyQWxsOiBjb25maXJtQ2xlYXIgbXVzdCBiZSBleHBsaWNpdGx5IHNldCB0byB0cnVlJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgYWxsS2V5cyA9IHN0b3JhZ2Uua2V5cygpO1xuICAgICAgICAgICAgYWxsS2V5cy5mb3JFYWNoKChrZXkpID0+IEdNX2RlbGV0ZVZhbHVlKGtleSkpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgY2xlYXJBbGwgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCf0YDQvtCy0LXRgNC60LAg0L/Rg9GB0YLQvtGC0Ysg0YXRgNCw0L3QuNC70LjRidCwXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUg0LXRgdC70Lgg0YXRgNCw0L3QuNC70LjRidC1INC/0YPRgdGC0L7QtVxuICAgICAqL1xuICAgIGlzRW1wdHk6ICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yYWdlLmtleXMoKS5sZW5ndGggPT09IDA7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgaXNFbXB0eSBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG59O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldFVSTFBhdGhFbGVtZW50KHBvc2l0aW9uLCBkZWZhdWx0VmFsdWUgPSAnY29tbW9uJywgbG9nUmVzdWx0ID0gZmFsc2UpIHtcbiAgICBjb25zdCB7IHBhdGhuYW1lIH0gPSB3aW5kb3cubG9jYXRpb247XG5cbiAgICByZXR1cm4gZ2V0UGF0aG5hbWVFbGVtZW50KHBhdGhuYW1lLCBwb3NpdGlvbiwgZGVmYXVsdFZhbHVlLCBsb2dSZXN1bHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGF0aG5hbWVFbGVtZW50KHBhdGhuYW1lLCBwb3NpdGlvbiwgZGVmYXVsdFZhbHVlLCBsb2dSZXN1bHQgPSBmYWxzZSkge1xuICAgIGNvbnN0IHBhdGhFbGVtZW50cyA9IHBhdGhuYW1lLnNwbGl0KCcvJyk7XG5cbiAgICBwb3NpdGlvbiA9IHBvc2l0aW9uIDwgMCA/IHBhdGhFbGVtZW50cy5sZW5ndGggKyBwb3NpdGlvbiA6IHBvc2l0aW9uO1xuICAgIGNvbnN0IHBhdGhFbGVtZW50ID0gcGF0aEVsZW1lbnRzW3Bvc2l0aW9uXSB8fCBkZWZhdWx0VmFsdWU7XG5cbiAgICBpZiAobG9nUmVzdWx0KSBjb25zb2xlLmxvZyhgUGF0aG5hbWUgZWxlbWVudDogJHtwYXRoRWxlbWVudH1gKTtcblxuICAgIHJldHVybiBwYXRoRWxlbWVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFVSTFBhdGhFbGVtZW50RW5kaW5nKHBvc2l0aW9uLCBkZWZhdWx0VmFsdWUgPSAnY29tbW9uJywgbG9nUmVzdWx0ID0gZmFsc2UpIHtcbiAgICBjb25zdCBwYXRoRWxlbWVudCA9IGdldFVSTFBhdGhFbGVtZW50KHBvc2l0aW9uLCAnJywgbG9nUmVzdWx0KTtcblxuICAgIHJldHVybiBnZXRQYXRoRWxlbWVudEVuZGluZyhwYXRoRWxlbWVudCwgZGVmYXVsdFZhbHVlLCBsb2dSZXN1bHQpO1xufVxuXG5mdW5jdGlvbiBnZXRQYXRoRWxlbWVudEVuZGluZyhwYXRoRWxlbWVudCwgZGVmYXVsdFZhbHVlLCBsb2dSZXN1bHQpIHtcbiAgICBpZiAoIXBhdGhFbGVtZW50KSByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG4gICAgY29uc3QgcGF0aEVsZW1lbnRFbmRpbmcgPSBwYXRoRWxlbWVudC5zcGxpdCgnLScpXG4gICAgICAgIC5hdCgtMSk7XG5cbiAgICBpZiAobG9nUmVzdWx0KSBjb25zb2xlLmxvZyhgUGF0aG5hbWUgZWxlbWVudCBlbmRpbmc6ICR7cGF0aEVsZW1lbnRFbmRpbmd9YCk7XG5cbiAgICByZXR1cm4gcGF0aEVsZW1lbnRFbmRpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXRobmFtZUVsZW1lbnRFbmRpbmcocGF0aG5hbWUsIHBvc2l0aW9uLCBkZWZhdWx0VmFsdWUgPSAnY29tbW9uJywgbG9nUmVzdWx0ID0gZmFsc2UpIHtcbiAgICBjb25zdCBwYXRoRWxlbWVudCA9IGdldFBhdGhuYW1lRWxlbWVudChwYXRobmFtZSwgcG9zaXRpb24sICcnLCBsb2dSZXN1bHQpO1xuXG4gICAgcmV0dXJuIGdldFBhdGhFbGVtZW50RW5kaW5nKHBhdGhFbGVtZW50LCBkZWZhdWx0VmFsdWUsIGxvZ1Jlc3VsdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVUkxRdWVyeVBhcmFtKG5hbWUpIHtcbiAgICBjb25zdCBxdWVyeVBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG4gICAgcmV0dXJuIHF1ZXJ5UGFyYW1zLmdldChuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyUXVlcnlQYXJhbXMobGluaykge1xuICAgIHJldHVybiBsaW5rLnNwbGl0KCc/JylbMF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXRobmFtZUluY2x1ZGVzKHNlYXJjaFN0cmluZykge1xuICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoc2VhcmNoU3RyaW5nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGhuYW1lSW5jbHVkZXNTb21lKHNlYXJjaFN0cmluZ3MpIHtcbiAgICByZXR1cm4gc2VhcmNoU3RyaW5ncy5zb21lKChzZWFyY2hTdHJpbmcpID0+IHBhdGhuYW1lSW5jbHVkZXMoc2VhcmNoU3RyaW5nKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzb21lUGF0aEVsZW1lbnRFcXVhbHMoc2VhcmNoU3RyaW5nKSB7XG4gICAgY29uc3QgcGF0aEVsZW1lbnRzID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJyk7XG5cbiAgICByZXR1cm4gcGF0aEVsZW1lbnRzLnNvbWUoKHBhdGhFbGVtZW50KSA9PiBwYXRoRWxlbWVudCA9PT0gc2VhcmNoU3RyaW5nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFF1ZXJ5UGFyYW1zQW5kUmVkaXJlY3QocXVlcnlQYXJhbXMpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICAgICAgT2JqZWN0LmVudHJpZXMocXVlcnlQYXJhbXMpXG4gICAgICAgICAgICAuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgICAgICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmwudG9TdHJpbmcoKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gcmVkaXJlY3Q6JywgZXJyb3IpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9ic2VydmVVUkwoY2FsbGJhY2ssIHdhdGNoUXVlcnlQYXJhbXMgPSBbXSkge1xuICAgIGNvbnN0IGxhc3RTdGF0ZSA9IHsgcGF0aG5hbWU6IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSB9O1xuICAgIHdhdGNoUXVlcnlQYXJhbXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIGxhc3RTdGF0ZVtrZXldID0gZ2V0VVJMUXVlcnlQYXJhbShrZXkpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gaGFuZGxlVVJMQ2hhbmdlKCkge1xuICAgICAgICBjb25zdCBjdXJyZW50U3RhdGUgPSB7IHBhdGhuYW1lOiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgfTtcbiAgICAgICAgd2F0Y2hRdWVyeVBhcmFtcy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgIGN1cnJlbnRTdGF0ZVtrZXldID0gZ2V0VVJMUXVlcnlQYXJhbShrZXkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMobGFzdFN0YXRlKVxuICAgICAgICAgICAgLnNvbWUoKGtleSkgPT4gbGFzdFN0YXRlW2tleV0gIT09IGN1cnJlbnRTdGF0ZVtrZXldKSkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCBsYXN0VVJMID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYgIT09IGxhc3RVUkwpIHtcbiAgICAgICAgICAgIGxhc3RVUkwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgICAgIGhhbmRsZVVSTENoYW5nZSgpO1xuICAgICAgICB9XG4gICAgfSwgMjAwKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGhhbmRsZVVSTENoYW5nZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvYnNlcnZlVVJMRm9yUmVsb2FkKHdhdGNoUXVlcnlQYXJhbXMgPSBbXSkge1xuICAgIG9ic2VydmVVUkwoKCkgPT4gd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpLCB3YXRjaFF1ZXJ5UGFyYW1zKTtcbn1cbiIsImV4cG9ydCBjb25zdCBJQ09OUyA9IHtcbiAgICBISVNUT1JZOiAnPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCI+PHBhdGggZmlsbD1cImN1cnJlbnRDb2xvclwiIGQ9XCJNMTMgM2E5IDkgMCAwIDEgOC45NDUgOEgyNGwtMy41IDMuNUwxNyAxMWgyLjA1NUE3IDcgMCAxIDAgMTMgMjBhNi45NjMgNi45NjMgMCAwIDAgNC45NS0yLjA1bDEuNDE0IDEuNDE0QTguOTYzIDguOTYzIDAgMCAxIDEzIDIyYTkgOSAwIDEgMSAwLTE4Wm0xIDR2NWw0IDItLjc1IDEuODQ4TDEyIDEzVjdoMlpcIi8+PC9zdmc+Jyxcbn07XG4iLCJleHBvcnQgY29uc3QgU0VMRUNUT1JTID0ge1xuICAgIFNUT1JFX1dSQVBQRVI6ICcubGlzdC1ibG9ja19fd3JhcHBlcicsXG4gICAgU1RPUkVfVElUTEU6ICcubGlzdC1ibG9ja19fdGl0bGUtdGV4dCcsXG4gICAgU1RPUkVfU1VCVElUTEU6ICcubGlzdC1ibG9ja19fc3VidGl0bGUnLFxuICAgIFNIT1dfTU9SRV9CVE46ICdtdmlkLWJ1dHRvbi1saXN0IC5idXR0b24tbGlzdF9fdGV4dCcsXG4gICAgQ09OVFJPTF9QQU5FTDogJy5hdmFpbGFiaWxpdHlfX2NvbnRyb2wtcGFuZWwnLFxufTtcbiIsImltcG9ydCB7IHN0b3JhZ2UgfSBmcm9tICcuLi9jb21tb24vc3RvcmFnZSc7XG5cbi8qKlxuICog0JrQu9GO0YfQuCDQtNC70Y8g0YXRgNCw0L3QtdC90LjRjyDQtNCw0L3QvdGL0YUg0YTQuNC70YzRgtGA0L7QsiDQsiBsb2NhbFN0b3JhZ2VcbiAqIEByZWFkb25seVxuICovXG5leHBvcnQgY29uc3QgU1RPUkVfRklMVEVSX0tFWVMgPSB7XG4gICAgTkFNRTogJ212aWRlb19zdG9yZV9maWx0ZXJfbmFtZScsXG4gICAgQ0lUWTogJ212aWRlb19zdG9yZV9maWx0ZXJfY2l0eScsXG4gICAgSElTVE9SWTogJ212aWRlb19zdG9yZV9maWx0ZXJfaGlzdG9yeScsXG59O1xuXG4vKipcbiAqINCa0L7QvdGE0LjQs9GD0YDQsNGG0LjRjyDQvNC+0LTRg9C70Y9cbiAqIEByZWFkb25seVxuICovXG5jb25zdCBDT05GSUcgPSB7XG4gICAgLyoqINCc0LDQutGB0LjQvNCw0LvRjNC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDRjdC70LXQvNC10L3RgtC+0LIg0LIg0LjRgdGC0L7RgNC40Lgg0L/QvtC40YHQutCwICovXG4gICAgTUFYX0hJU1RPUlk6IDEwLFxufTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBGaWx0ZXJEYXRhXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZSAtINCd0LDQt9Cy0LDQvdC40LUg0LzQsNCz0LDQt9C40L3QsFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNpdHkgLSDQk9C+0YDQvtC0XG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBGaWx0ZXJTdGF0c1xuICogQHByb3BlcnR5IHtib29sZWFufSBoYXNOYW1lIC0g0JXRgdGC0Ywg0LvQuCDRgdC+0YXRgNCw0L3QtdC90L3QvtC1INC90LDQt9Cy0LDQvdC40LVcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaGFzQ2l0eSAtINCV0YHRgtGMINC70Lgg0YHQvtGF0YDQsNC90LXQvdC90YvQuSDQs9C+0YDQvtC0XG4gKiBAcHJvcGVydHkge251bWJlcn0gaGlzdG9yeUNvdW50IC0g0JrQvtC70LjRh9C10YHRgtCy0L4g0Y3Qu9C10LzQtdC90YLQvtCyINCyINC40YHRgtC+0YDQuNC4XG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzRW1wdHkgLSDQn9GD0YHRgtC+INC70Lgg0YXRgNCw0L3QuNC70LjRidC1ICjQvdC10YIg0LTQsNC90L3Ri9GFINCy0L7QvtCx0YnQtSlcbiAqL1xuXG4vKipcbiAqINCe0YHQvdC+0LLQvdC+0Lkg0L7QsdGK0LXQutGCINC00LvRjyDRgNCw0LHQvtGC0Ysg0YEg0YXRgNCw0L3QuNC70LjRidC10Lwg0YTQuNC70YzRgtGA0L7QsiDQvNCw0LPQsNC30LjQvdC+0LJcbiAqL1xuZXhwb3J0IGNvbnN0IHN0b3JlRmlsdGVyU3RvcmFnZSA9IHtcbiAgICAvLyA9PT0g0J3QsNC30LLQsNC90LjQtSDQvNCw0LPQsNC30LjQvdCwID09PVxuXG4gICAgLyoqXG4gICAgICog0J/QvtC70YPRh9Cw0LXRgiDRgdC+0YXRgNCw0L3QtdC90L3QvtC1INC90LDQt9Cy0LDQvdC40LUg0LzQsNCz0LDQt9C40L3QsFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9INCd0LDQt9Cy0LDQvdC40LUg0LzQsNCz0LDQt9C40L3QsCDQuNC70Lgg0L/Rg9GB0YLQsNGPINGB0YLRgNC+0LrQsFxuICAgICAqL1xuICAgIGdldE5hbWU6ICgpID0+IHN0b3JhZ2UuZ2V0KFNUT1JFX0ZJTFRFUl9LRVlTLk5BTUUsICcnKSxcblxuICAgIC8qKlxuICAgICAqINCh0L7RhdGA0LDQvdGP0LXRgiDQvdCw0LfQstCw0L3QuNC1INC80LDQs9Cw0LfQuNC90LBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xudWxsfHVuZGVmaW5lZH0gdmFsdWUgLSDQndCw0LfQstCw0L3QuNC1INC00LvRjyDRgdC+0YXRgNCw0L3QtdC90LjRj1xuICAgICAqL1xuICAgIHNldE5hbWU6ICh2YWx1ZSkgPT4ge1xuICAgICAgICBjb25zdCBub3JtYWxpemVkVmFsdWUgPSBTdHJpbmcodmFsdWUgfHwgJycpLnRyaW0oKTtcbiAgICAgICAgc3RvcmFnZS5zZXQoU1RPUkVfRklMVEVSX0tFWVMuTkFNRSwgbm9ybWFsaXplZFZhbHVlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0KPQtNCw0LvRj9C10YIg0YHQvtGF0YDQsNC90LXQvdC90L7QtSDQvdCw0LfQstCw0L3QuNC1INC80LDQs9Cw0LfQuNC90LBcbiAgICAgKi9cbiAgICBjbGVhck5hbWU6ICgpID0+IHN0b3JhZ2UucmVtb3ZlKFNUT1JFX0ZJTFRFUl9LRVlTLk5BTUUpLFxuXG4gICAgLy8gPT09INCT0L7RgNC+0LQgPT09XG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LDQtdGCINGB0L7RhdGA0LDQvdC10L3QvdGL0Lkg0LPQvtGA0L7QtFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9INCd0LDQt9Cy0LDQvdC40LUg0LPQvtGA0L7QtNCwINC40LvQuCDQv9GD0YHRgtCw0Y8g0YHRgtGA0L7QutCwXG4gICAgICovXG4gICAgZ2V0Q2l0eTogKCkgPT4gc3RvcmFnZS5nZXQoU1RPUkVfRklMVEVSX0tFWVMuQ0lUWSwgJycpLFxuXG4gICAgLyoqXG4gICAgICog0KHQvtGF0YDQsNC90Y/QtdGCINCz0L7RgNC+0LRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xudWxsfHVuZGVmaW5lZH0gdmFsdWUgLSDQndCw0LfQstCw0L3QuNC1INCz0L7RgNC+0LTQsCDQtNC70Y8g0YHQvtGF0YDQsNC90LXQvdC40Y9cbiAgICAgKi9cbiAgICBzZXRDaXR5OiAodmFsdWUpID0+IHtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlID0gU3RyaW5nKHZhbHVlIHx8ICcnKS50cmltKCk7XG4gICAgICAgIHN0b3JhZ2Uuc2V0KFNUT1JFX0ZJTFRFUl9LRVlTLkNJVFksIG5vcm1hbGl6ZWRWYWx1ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCj0LTQsNC70Y/QtdGCINGB0L7RhdGA0LDQvdC10L3QvdGL0Lkg0LPQvtGA0L7QtFxuICAgICAqL1xuICAgIGNsZWFyQ2l0eTogKCkgPT4gc3RvcmFnZS5yZW1vdmUoU1RPUkVfRklMVEVSX0tFWVMuQ0lUWSksXG5cbiAgICAvLyA9PT0g0JjRgdGC0L7RgNC40Y8g0L/QvtC40YHQutCwID09PVxuXG4gICAgLyoqXG4gICAgICog0J/QvtC70YPRh9Cw0LXRgiDQuNGB0YLQvtGA0LjRjiDQv9C+0LjRgdC60L7QstGL0YUg0LfQsNC/0YDQvtGB0L7QslxuICAgICAqIEByZXR1cm5zIHtzdHJpbmdbXX0g0JzQsNGB0YHQuNCyINC/0L7QuNGB0LrQvtCy0YvRhSDQt9Cw0L/RgNC+0YHQvtCyICjQvtGCINC90L7QstGL0YUg0Log0YHRgtCw0YDRi9C8KVxuICAgICAqL1xuICAgIGdldEhpc3Rvcnk6ICgpID0+IHN0b3JhZ2UuZ2V0KFNUT1JFX0ZJTFRFUl9LRVlTLkhJU1RPUlksIFtdKSxcblxuICAgIC8qKlxuICAgICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC40YHRgtC+0YDQuNGOINC/0L7QuNGB0LrQvtCy0YvRhSDQt9Cw0L/RgNC+0YHQvtCyXG4gICAgICogQHBhcmFtIHtzdHJpbmdbXX0gaGlzdG9yeSAtINCc0LDRgdGB0LjQsiDQv9C+0LjRgdC60L7QstGL0YUg0LfQsNC/0YDQvtGB0L7QslxuICAgICAqL1xuICAgIHNldEhpc3Rvcnk6IChoaXN0b3J5KSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbGlkSGlzdG9yeSA9IEFycmF5LmlzQXJyYXkoaGlzdG9yeSlcbiAgICAgICAgICAgID8gaGlzdG9yeS5maWx0ZXIoKGl0ZW0pID0+IHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyAmJiBpdGVtLnRyaW0oKSlcbiAgICAgICAgICAgIDogW107XG4gICAgICAgIHN0b3JhZ2Uuc2V0KFNUT1JFX0ZJTFRFUl9LRVlTLkhJU1RPUlksIHZhbGlkSGlzdG9yeSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCU0L7QsdCw0LLQu9GP0LXRgiDQvdC+0LLRi9C5INGC0LXRgNC80LjQvSDQsiDQuNGB0YLQvtGA0LjRjiDQv9C+0LjRgdC60LBcbiAgICAgKiDQldGB0LvQuCDRgtC10YDQvNC40L0g0YPQttC1INGB0YPRidC10YHRgtCy0YPQtdGCLCDQv9C10YDQtdC80LXRidCw0LXRgiDQtdCz0L4g0LIg0L3QsNGH0LDQu9C+XG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVsbHx1bmRlZmluZWR9IHRlcm0gLSDQn9C+0LjRgdC60L7QstGL0Lkg0YLQtdGA0LzQuNC9INC00LvRjyDQtNC+0LHQsNCy0LvQtdC90LjRj1xuICAgICAqL1xuICAgIGFkZFRvSGlzdG9yeTogKHRlcm0pID0+IHtcbiAgICAgICAgY29uc3QgdHJpbW1lZCA9IFN0cmluZyh0ZXJtIHx8ICcnKS50cmltKCk7XG4gICAgICAgIGlmICghdHJpbW1lZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSB0cmltbWVkLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGhpc3RvcnkgPSBzdG9yZUZpbHRlclN0b3JhZ2UuZ2V0SGlzdG9yeSgpO1xuXG4gICAgICAgIC8vINCj0LTQsNC70Y/QtdC8INGB0YPRidC10YHRgtCy0YPRjtGJ0LjQuSDRjdC70LXQvNC10L3RgiAo0LXRgdC70Lgg0LXRgdGC0YwpINC4INC00L7QsdCw0LLQu9GP0LXQvCDQsiDQvdCw0YfQsNC70L5cbiAgICAgICAgY29uc3QgZmlsdGVyZWQgPSBoaXN0b3J5LmZpbHRlcigoaXRlbSkgPT4gU3RyaW5nKGl0ZW0gfHwgJycpLnRvTG93ZXJDYXNlKCkgIT09IG5vcm1hbGl6ZWQpO1xuXG4gICAgICAgIGZpbHRlcmVkLnVuc2hpZnQodHJpbW1lZCk7XG5cbiAgICAgICAgLy8g0J7Qs9GA0LDQvdC40YfQuNCy0LDQtdC8INGA0LDQt9C80LXRgCDQuNGB0YLQvtGA0LjQuFxuICAgICAgICBjb25zdCBsaW1pdGVkID0gZmlsdGVyZWQuc2xpY2UoMCwgQ09ORklHLk1BWF9ISVNUT1JZKTtcblxuICAgICAgICBzdG9yZUZpbHRlclN0b3JhZ2Uuc2V0SGlzdG9yeShsaW1pdGVkKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0KPQtNCw0LvRj9C10YIg0LrQvtC90LrRgNC10YLQvdGL0Lkg0YLQtdGA0LzQuNC9INC40Lcg0LjRgdGC0L7RgNC40Lgg0L/QvtC40YHQutCwXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRlcm0gLSDQotC10YDQvNC40L0g0LTQu9GPINGD0LTQsNC70LXQvdC40Y9cbiAgICAgKi9cbiAgICByZW1vdmVGcm9tSGlzdG9yeTogKHRlcm0pID0+IHtcbiAgICAgICAgaWYgKCF0ZXJtKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgaGlzdG9yeSA9IHN0b3JlRmlsdGVyU3RvcmFnZS5nZXRIaXN0b3J5KCk7XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkID0gaGlzdG9yeS5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0gIT09IHRlcm0pO1xuICAgICAgICBzdG9yZUZpbHRlclN0b3JhZ2Uuc2V0SGlzdG9yeShmaWx0ZXJlZCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCf0L7Qu9C90L7RgdGC0YzRjiDQvtGH0LjRidCw0LXRgiDQuNGB0YLQvtGA0LjRjiDQv9C+0LjRgdC60LBcbiAgICAgKi9cbiAgICBjbGVhckhpc3Rvcnk6ICgpID0+IHN0b3JhZ2UucmVtb3ZlKFNUT1JFX0ZJTFRFUl9LRVlTLkhJU1RPUlkpLFxuXG4gICAgLyoqXG4gICAgICog0J/RgNC+0LLQtdGA0Y/QtdGCLCDQv9GD0YHRgtCwINC70Lgg0LjRgdGC0L7RgNC40Y8g0L/QvtC40YHQutCwXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUsINC10YHQu9C4INC40YHRgtC+0YDQuNGPINC/0YPRgdGC0LBcbiAgICAgKi9cbiAgICBpc0hpc3RvcnlFbXB0eTogKCkgPT4gc3RvcmVGaWx0ZXJTdG9yYWdlLmdldEhpc3RvcnkoKS5sZW5ndGggPT09IDAsXG5cbiAgICAvLyA9PT0g0JrQvtC80LHQuNC90LjRgNC+0LLQsNC90L3Ri9C1INC+0L/QtdGA0LDRhtC40LggPT09XG5cbiAgICAvKipcbiAgICAgKiDQodC+0YXRgNCw0L3Rj9C10YIg0L7QsdCwINGE0LjQu9GM0YLRgNCwINC+0LTQvdC+0LLRgNC10LzQtdC90L3QvlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bGx8dW5kZWZpbmVkfSBzZWFyY2hUZXh0IC0g0J3QsNC30LLQsNC90LjQtSDQvNCw0LPQsNC30LjQvdCwXG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVsbHx1bmRlZmluZWR9IGNpdHlGaWx0ZXIgLSDQk9C+0YDQvtC0XG4gICAgICovXG4gICAgc2F2ZUZpbHRlcnM6IChzZWFyY2hUZXh0LCBjaXR5RmlsdGVyKSA9PiB7XG4gICAgICAgIHN0b3JlRmlsdGVyU3RvcmFnZS5zZXROYW1lKHNlYXJjaFRleHQpO1xuICAgICAgICBzdG9yZUZpbHRlclN0b3JhZ2Uuc2V0Q2l0eShjaXR5RmlsdGVyKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0JfQsNCz0YDRg9C20LDQtdGCINCy0YHQtSDRgdC+0YXRgNCw0L3QtdC90L3Ri9C1INGE0LjQu9GM0YLRgNGLXG4gICAgICogQHJldHVybnMge0ZpbHRlckRhdGF9INCe0LHRitC10LrRgiDRgSDQvdCw0LfQstCw0L3QuNC10Lwg0Lgg0LPQvtGA0L7QtNC+0LxcbiAgICAgKi9cbiAgICBsb2FkRmlsdGVyczogKCkgPT4gKHtcbiAgICAgICAgbmFtZTogc3RvcmVGaWx0ZXJTdG9yYWdlLmdldE5hbWUoKSxcbiAgICAgICAgY2l0eTogc3RvcmVGaWx0ZXJTdG9yYWdlLmdldENpdHkoKSxcbiAgICB9KSxcblxuICAgIC8qKlxuICAgICAqINCe0YfQuNGJ0LDQtdGCINCy0YHQtSDRhNC40LvRjNGC0YDRiyAo0L3QsNC30LLQsNC90LjQtSDQuCDQs9C+0YDQvtC0KSwg0L3QviDRgdC+0YXRgNCw0L3Rj9C10YIg0LjRgdGC0L7RgNC40Y5cbiAgICAgKi9cbiAgICBjbGVhckFsbEZpbHRlcnM6ICgpID0+IHtcbiAgICAgICAgc3RvcmFnZS5yZW1vdmVNdWx0aXBsZShbXG4gICAgICAgICAgICBTVE9SRV9GSUxURVJfS0VZUy5OQU1FLFxuICAgICAgICAgICAgU1RPUkVfRklMVEVSX0tFWVMuQ0lUWSxcbiAgICAgICAgXSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCf0L7Qu9C90L7RgdGC0YzRjiDQvtGH0LjRidCw0LXRgiDQstGB0LUg0LTQsNC90L3Ri9C1ICjRhNC40LvRjNGC0YDRiyDQuCDQuNGB0YLQvtGA0LjRjilcbiAgICAgKi9cbiAgICBjbGVhckFsbERhdGE6ICgpID0+IHtcbiAgICAgICAgc3RvcmFnZS5yZW1vdmVNdWx0aXBsZShbXG4gICAgICAgICAgICBTVE9SRV9GSUxURVJfS0VZUy5OQU1FLFxuICAgICAgICAgICAgU1RPUkVfRklMVEVSX0tFWVMuQ0lUWSxcbiAgICAgICAgICAgIFNUT1JFX0ZJTFRFUl9LRVlTLkhJU1RPUlksXG4gICAgICAgIF0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LDQtdGCINGB0YLQsNGC0LjRgdGC0LjQutGDINC/0L4g0YHQvtGF0YDQsNC90LXQvdC90YvQvCDQtNCw0L3QvdGL0LxcbiAgICAgKiBAcmV0dXJucyB7RmlsdGVyU3RhdHN9INCe0LHRitC10LrRgiDRgdC+INGB0YLQsNGC0LjRgdGC0LjQutC+0LlcbiAgICAgKi9cbiAgICBnZXRTdGF0czogKCkgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gc3RvcmVGaWx0ZXJTdG9yYWdlLmdldE5hbWUoKTtcbiAgICAgICAgY29uc3QgY2l0eSA9IHN0b3JlRmlsdGVyU3RvcmFnZS5nZXRDaXR5KCk7XG4gICAgICAgIGNvbnN0IGhpc3RvcnlDb3VudCA9IHN0b3JlRmlsdGVyU3RvcmFnZS5nZXRIaXN0b3J5KCkubGVuZ3RoO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoYXNOYW1lOiBCb29sZWFuKG5hbWUpLFxuICAgICAgICAgICAgaGFzQ2l0eTogQm9vbGVhbihjaXR5KSxcbiAgICAgICAgICAgIGhpc3RvcnlDb3VudCxcbiAgICAgICAgICAgIGlzRW1wdHk6ICFuYW1lICYmICFjaXR5ICYmIGhpc3RvcnlDb3VudCA9PT0gMCxcbiAgICAgICAgfTtcbiAgICB9LFxufTtcbiIsImV4cG9ydCBkZWZhdWx0IFwiLm12aWRlby1zdG9yZS1maWx0ZXJ7bWFyZ2luLXRvcDoxMnB4O3dpZHRoOjEwMCU7bWF4LXdpZHRoOjc2MHB4O3Bvc2l0aW9uOnJlbGF0aXZlO2Rpc3BsYXk6ZmxleDtnYXA6OHB4fS5tdmlkZW8tc3RvcmUtZmlsdGVyX19pbnB1dC1jb250YWluZXJ7ZmxleDoxO3Bvc2l0aW9uOnJlbGF0aXZlO2Rpc3BsYXk6ZmxleH0ubXZpZGVvLXN0b3JlLWZpbHRlcl9faW5wdXR7ZmxleDoxO2FwcGVhcmFuY2U6bm9uZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZTtib3gtc2l6aW5nOmJvcmRlci1ib3g7cGFkZGluZzoxMnB4IDQwcHggMTJweCAxNnB4O2ZvbnQ6NDAwIDE2cHgvMjJweCBSb2JvdG8sSGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWY7Y29sb3I6IzAwMDtiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7Ym9yZGVyOjEuMXB4IHNvbGlkIHJnYigxNDIsMTQyLDE0Nyk7Ym9yZGVyLXJhZGl1czo0cHg7dHJhbnNpdGlvbjpib3JkZXItY29sb3IgLjJzIGVhc2U7bWluLXdpZHRoOjB9Lm12aWRlby1zdG9yZS1maWx0ZXJfX2lucHV0OmZvY3Vze291dGxpbmU6bm9uZTtib3JkZXItY29sb3I6IzAwN2JmZn1pbnB1dFt0eXBlPXNlYXJjaF06Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24saW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1jYW5jZWwtYnV0dG9uLGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtcmVzdWx0cy1idXR0b24saW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1yZXN1bHRzLWRlY29yYXRpb257ZGlzcGxheTpub25lfS5tdmlkZW8tc3RvcmUtZmlsdGVyX19jbGVhcntwb3NpdGlvbjphYnNvbHV0ZTtyaWdodDo4cHg7dG9wOjUwJTt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtNTAlKTtjdXJzb3I6cG9pbnRlcjtib3JkZXI6bm9uZTtiYWNrZ3JvdW5kOm5vbmU7Zm9udC1zaXplOjE4cHg7Y29sb3I6Izk5OTtkaXNwbGF5Om5vbmU7d2lkdGg6MjRweDtoZWlnaHQ6MjRweDtib3JkZXItcmFkaXVzOjUwJTthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcn0ubXZpZGVvLXN0b3JlLWZpbHRlcl9fY2xlYXI6aG92ZXJ7Y29sb3I6IzMzMztiYWNrZ3JvdW5kOiMwMDAwMDAwZH0uc3RvcmUtaGlkZGVue2Rpc3BsYXk6bm9uZSFpbXBvcnRhbnR9Lm12aWRlby1zdG9yZS1maWx0ZXJfX3N1Z2dlc3Rpb25ze3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6OTk5OTtsZWZ0OjA7dG9wOmNhbGMoMTAwJSArIDRweCk7cmlnaHQ6MDttYXgtaGVpZ2h0OjI2MHB4O292ZXJmbG93OmF1dG87YmFja2dyb3VuZDojZmZmO2JvcmRlcjoxcHggc29saWQgI0U1RTVFQTtib3JkZXItcmFkaXVzOjhweDtib3gtc2hhZG93OjAgOHB4IDIwcHggIzAwMDAwMDE0O2Rpc3BsYXk6bm9uZTtwYWRkaW5nOjZweCAwfS5tdmlkZW8tc3RvcmUtZmlsdGVyX19zdWdnZXN0aW9ue2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47Z2FwOjhweDtwYWRkaW5nOjhweCAxMnB4O2N1cnNvcjpwb2ludGVyO2ZvbnQ6NDAwIDE0cHgvMjBweCBSb2JvdG8sSGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWY7Y29sb3I6IzFjMWMxZTt1c2VyLXNlbGVjdDpub25lfS5tdmlkZW8tc3RvcmUtZmlsdGVyX19zdWdnZXN0aW9uOmhvdmVye2JhY2tncm91bmQ6I2YyZjJmN30ubXZpZGVvLXN0b3JlLWZpbHRlcl9fc3VnZ2VzdGlvbi5pcy1hY3RpdmV7YmFja2dyb3VuZDojZTVmMGZmfS5tdmlkZW8tc3RvcmUtZmlsdGVyX19zdWdnZXN0aW9uIHN2Z3tmbGV4OjAgMCAxNnB4O29wYWNpdHk6LjZ9Lm12aWRlby1zdG9yZS1maWx0ZXJfX2VtcHR5e3BhZGRpbmc6MTBweCAxMnB4O2NvbG9yOiM4ZThlOTM7Zm9udDo0MDAgMTNweC8xOHB4IFJvYm90byxIZWx2ZXRpY2EsQXJpYWwsc2Fucy1zZXJpZn0ubXZpZGVvLXN0b3JlLWZpbHRlcl9fZm9vdGVye3BhZGRpbmc6NnB4IDEycHggMDtib3JkZXItdG9wOjFweCBzb2xpZCAjRjJGMkY3O2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6ZmxleC1lbmR9Lm12aWRlby1zdG9yZS1maWx0ZXJfX2NsZWFyLWhpc3Rvcnl7Ym9yZGVyOm5vbmU7YmFja2dyb3VuZDpub25lO2ZvbnQ6NDAwIDEycHgvMTZweCBSb2JvdG8sSGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWY7Y29sb3I6IzZiNzI4MDtjdXJzb3I6cG9pbnRlcjtwYWRkaW5nOjZweCA4cHg7Ym9yZGVyLXJhZGl1czo2cHh9Lm12aWRlby1zdG9yZS1maWx0ZXJfX2NsZWFyLWhpc3Rvcnk6aG92ZXJ7YmFja2dyb3VuZDojZjJmMmY3O2NvbG9yOiMzNzQxNTF9Lm12aWRlby1zdG9yZS1maWx0ZXJfX2RlbGV0ZXtib3JkZXI6bm9uZTtiYWNrZ3JvdW5kOm5vbmU7Y3Vyc29yOnBvaW50ZXI7Zm9udC1zaXplOjE0cHg7Y29sb3I6Izk5OTtwYWRkaW5nOjJweCA2cHg7Ym9yZGVyLXJhZGl1czo0cHh9Lm12aWRlby1zdG9yZS1maWx0ZXJfX2RlbGV0ZTpob3ZlcntiYWNrZ3JvdW5kOiNmMmYyZjc7Y29sb3I6IzMzM30ubXZpZGVvLXN0b3JlLWZpbHRlcl9fY2l0eXttaW4td2lkdGg6MTMwcHg7bWF4LXdpZHRoOjIwMHB4O3BhZGRpbmc6MTJweCA4cHg7Zm9udDo0MDAgMTRweC8yMHB4IFJvYm90byxIZWx2ZXRpY2EsQXJpYWwsc2Fucy1zZXJpZjtib3JkZXI6MS4xcHggc29saWQgcmdiKDE0MiwxNDIsMTQ3KTtib3JkZXItcmFkaXVzOjRweDtiYWNrZ3JvdW5kOiNmZmY7Y3Vyc29yOnBvaW50ZXI7ZmxleC1zaHJpbms6MH1cXG5cIjsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG5jb25zdCBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGNvbnN0IGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHRjb25zdCBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0Y29uc3QgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIvdmFsdWUgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGlmKEFycmF5LmlzQXJyYXkoZGVmaW5pdGlvbikpIHtcblx0XHR2YXIgaSA9IDA7XG5cdFx0d2hpbGUoaSA8IGRlZmluaXRpb24ubGVuZ3RoKSB7XG5cdFx0XHR2YXIga2V5ID0gZGVmaW5pdGlvbltpKytdO1xuXHRcdFx0dmFyIGJpbmRpbmcgPSBkZWZpbml0aW9uW2krK107XG5cdFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdFx0aWYoYmluZGluZyA9PT0gMCkge1xuXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IGRlZmluaXRpb25baSsrXSB9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogYmluZGluZyB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmKGJpbmRpbmcgPT09IDApIHsgaSsrOyB9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiaW1wb3J0IHN0eWxlcyBmcm9tICcuL3N0eWxlcy5jc3MnO1xuaW1wb3J0IHsgSUNPTlMgfSBmcm9tICcuL2ljb25zJztcbmltcG9ydCB7IFNFTEVDVE9SUyB9IGZyb20gJy4vc2VsZWN0b3JzJztcbmltcG9ydCB7IHN0b3JlRmlsdGVyU3RvcmFnZSB9IGZyb20gJy4vc3RvcmFnZSc7XG5pbXBvcnQgeyBkZWJvdW5jZSB9IGZyb20gJy4uL2NvbW1vbi9kb20vdXRpbHMnO1xuaW1wb3J0IHsgb2JzZXJ2ZVVSTCwgcGF0aG5hbWVJbmNsdWRlcyB9IGZyb20gJy4uL2NvbW1vbi91cmwnO1xuaW1wb3J0IHsgcGFyc2VGaWx0ZXJRdWVyeSB9IGZyb20gJy4uL2NvbW1vbi9maWx0ZXIvaGVscGVycyc7XG5pbXBvcnQgeyBtYXRjaGVzUXVlcnkgfSBmcm9tICcuLi9jb21tb24vZmlsdGVyL2NvbXBhcmUnO1xuXG5HTV9hZGRTdHlsZShzdHlsZXMpO1xuXG5sZXQgcGFnZU9ic2VydmVyID0gbnVsbDtcblxuY2hlY2tTaG9wRGlyZWN0aW9uc1BhZ2UoKTtcblxub2JzZXJ2ZVVSTCgoKSA9PiB7XG4gICAgY2hlY2tTaG9wRGlyZWN0aW9uc1BhZ2UoKTtcbn0pO1xuXG5mdW5jdGlvbiBjaGVja1Nob3BEaXJlY3Rpb25zUGFnZSgpIHtcbiAgICBpZiAocGF0aG5hbWVJbmNsdWRlcygnc2hvcGRpcmVjdGlvbnMnKSkge1xuICAgICAgICBpbml0RmlsdGVyKCk7XG4gICAgICAgIHN0YXJ0UGFnZU9ic2VydmVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2xlYW51cFNob3BEaXJlY3Rpb25zUGFnZU9ic2VydmVyKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjbGVhbnVwU2hvcERpcmVjdGlvbnNQYWdlT2JzZXJ2ZXIoKSB7XG4gICAgaWYgKCFwYWdlT2JzZXJ2ZXIpIHJldHVybjtcblxuICAgIHBhZ2VPYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgcGFnZU9ic2VydmVyID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gY2xpY2tTaG93TW9yZUlmRXhpc3RzKCkge1xuICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JTLlNIT1dfTU9SRV9CVE4pO1xuICAgIGlmIChidG4gJiYgYnRuLnRleHRDb250ZW50LmluY2x1ZGVzKCfQn9C+0LrQsNC30LDRgtGMINC10YnQtScpKSB7XG4gICAgICAgIGJ0bi5jbGljaygpO1xuICAgIH1cbn1cblxuLyoqINCt0LvQtdC80LXQvdGC0Ysg0LzQsNCz0LDQt9C40L3QvtCyICovXG5jb25zdCBnZXRTdG9yZUVsZW1lbnRzID0gKCkgPT4gWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1JTLlNUT1JFX1dSQVBQRVIpXTtcbmNvbnN0IGdldFN0b3JlVGV4dCA9IChlbCkgPT4gZWwucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuU1RPUkVfVElUTEUpPy50ZXh0Q29udGVudC50cmltKCkgfHwgJyc7XG5cbi8qKiDQn9Cw0YDRgdC40L3QsyDQs9C+0YDQvtC00LAgKi9cbmZ1bmN0aW9uIGdldFN0b3JlQ2l0eShlbCkge1xuICAgIGNvbnN0IGFkZHJlc3MgPSBlbC5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5TVE9SRV9TVUJUSVRMRSk/LnRleHRDb250ZW50Py50cmltKCk7XG5cbiAgICBpZiAoIWFkZHJlc3MpIHJldHVybiAnJztcblxuICAgIC8vINCj0LHQuNGA0LDQtdC8INC/0L7Rh9GC0L7QstGL0Lkg0LjQvdC00LXQutGBINCyINC90LDRh9Cw0LvQtSAoNS02INGG0LjRhNGAKVxuICAgIGxldCBjbGVhbmVkID0gYWRkcmVzcy5yZXBsYWNlKC9eXFxkezUsNn0sP1xccyovLCAnJyk7XG5cbiAgICAvLyDQo9Cx0LjRgNCw0LXQvCDQv9GA0LXRhNC40LrRgdGLINCz0L7RgNC+0LTQsFxuICAgIGNsZWFuZWQgPSBjbGVhbmVkLnJlcGxhY2UoL14o0LNcXC580LPQvtGA0L7QtClcXHMqL2ksICcnKTtcblxuICAgIC8vINCT0L7RgNC+0LQg0LjQtNC10YIg0LTQviDQv9C10YDQstC+0Lkg0LfQsNC/0Y/RgtC+0LlcbiAgICBjb25zdCBjaXR5ID0gY2xlYW5lZC5zcGxpdCgnLCcpWzBdLnRyaW0oKTtcblxuICAgIC8vINCV0YHQu9C4INC/0L7Qu9GD0YfQuNC70Lgg0YfRgtC+LdGC0L4g0YDQsNC30YPQvNC90L7QtSAtINCy0L7Qt9Cy0YDQsNGJ0LDQtdC8LCDQuNC90LDRh9C1INCy0LXRgdGMINCw0LTRgNC10YEg0LTQu9GPINC+0YLQu9Cw0LTQutC4XG4gICAgaWYgKGNpdHkgJiYgY2l0eS5sZW5ndGggPiAxICYmIC9b0LAt0Y/RkV0vaS50ZXN0KGNpdHkpKSB7XG4gICAgICAgIHJldHVybiBjaXR5O1xuICAgIH1cblxuICAgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdC8INC40YHRhdC+0LTQvdGL0Lkg0LDQtNGA0LXRgSDQtNC70Y8g0LDQvdCw0LvQuNC30LAg0L/RgNC+0LHQu9C10LzQvdGL0YUg0YHQu9GD0YfQsNC10LJcbiAgICBjb25zb2xlLndhcm4oJ9Cd0LUg0YPQtNCw0LvQvtGB0Ywg0YDQsNGB0L/QsNGA0YHQuNGC0Ywg0LPQvtGA0L7QtCDQuNC3INCw0LTRgNC10YHQsDonLCBhZGRyZXNzKTtcbiAgICByZXR1cm4gYWRkcmVzcztcbn1cblxuLyoqINCf0YDQvtCy0LXRgNC60LAg0YHQvtC+0YLQstC10YLRgdGC0LLQuNGPINCz0L7RgNC+0LTRgyAqL1xuZnVuY3Rpb24gbWF0Y2hlc0NpdHkoc3RvcmUsIGNpdHlGaWx0ZXIpIHtcbiAgICByZXR1cm4gIWNpdHlGaWx0ZXIgfHwgZ2V0U3RvcmVDaXR5KHN0b3JlKSA9PT0gY2l0eUZpbHRlcjtcbn1cblxuLyoqINCk0LjQu9GM0YLRgNCw0YbQuNGPICovXG5mdW5jdGlvbiBmaWx0ZXJTdG9yZXMoc2VhcmNoVGV4dCwgY2l0eUZpbHRlcikge1xuICAgIGNvbnN0IHJlcXVpcmVtZW50cyA9IHBhcnNlRmlsdGVyUXVlcnkoc2VhcmNoVGV4dCk7XG5cbiAgICBnZXRTdG9yZUVsZW1lbnRzKCkuZm9yRWFjaCgoc3RvcmUpID0+IHtcbiAgICAgICAgY29uc3Qgc3RvcmVOYW1lID0gZ2V0U3RvcmVUZXh0KHN0b3JlKTtcbiAgICAgICAgY29uc3QgbWF0Y2hlc05hbWUgPSBtYXRjaGVzUXVlcnkoc3RvcmVOYW1lLCByZXF1aXJlbWVudHMpO1xuICAgICAgICBjb25zdCBpc1Zpc2libGUgPSBtYXRjaGVzTmFtZSAmJiBtYXRjaGVzQ2l0eShzdG9yZSwgY2l0eUZpbHRlcik7XG4gICAgICAgIHN0b3JlLmNsYXNzTGlzdC50b2dnbGUoJ3N0b3JlLWhpZGRlbicsICFpc1Zpc2libGUpO1xuICAgIH0pO1xuXG4gICAgc3RvcmVGaWx0ZXJTdG9yYWdlLnNhdmVGaWx0ZXJzKHNlYXJjaFRleHQsIGNpdHlGaWx0ZXIpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVGaWx0ZXJFbGVtZW50KCkge1xuICAgIGNvbnN0IHsgbmFtZTogc2F2ZWROYW1lLCBjaXR5OiBzYXZlZENpdHkgfSA9IHN0b3JlRmlsdGVyU3RvcmFnZS5sb2FkRmlsdGVycygpO1xuXG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHdyYXBwZXIuY2xhc3NOYW1lID0gJ212aWRlby1zdG9yZS1maWx0ZXInO1xuXG4gICAgY29uc3QgZXNjYXBlQXR0ciA9IChzKSA9PiBTdHJpbmcocykucmVwbGFjZSgvWyY8PlwiJ10vZywgKG0pID0+ICh7XG4gICAgICAgICcmJzogJyZhbXA7JyxcbiAgICAgICAgJzwnOiAnJmx0OycsXG4gICAgICAgICc+JzogJyZndDsnLFxuICAgICAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICAgICAgXCInXCI6ICcmIzM5OycsXG4gICAgfVttXSkpO1xuXG4gICAgY29uc3QgY2l0aWVzID0gWy4uLm5ldyBTZXQoZ2V0U3RvcmVFbGVtZW50cygpLm1hcChnZXRTdG9yZUNpdHkpLmZpbHRlcihCb29sZWFuKSldLnNvcnQoKTtcblxuICAgIHdyYXBwZXIuaW5uZXJIVE1MID0gYFxuICAgICAgPGRpdiBjbGFzcz1cIm12aWRlby1zdG9yZS1maWx0ZXJfX2lucHV0LWNvbnRhaW5lclwiPlxuICAgICAgICA8aW5wdXQgdHlwZT1cInNlYXJjaFwiIGlkPVwic3RvcmVGaWx0ZXJcIiBjbGFzcz1cIm12aWRlby1zdG9yZS1maWx0ZXJfX2lucHV0XCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cItCk0LjQu9GM0YLRgCDQv9C+INC90LDQt9Cy0LDQvdC40Y4g0LzQsNCz0LDQt9C40L3QsC4uLlwiXG4gICAgICAgICAgdmFsdWU9XCIke2VzY2FwZUF0dHIoc2F2ZWROYW1lKX1cIiBtYXhsZW5ndGg9XCIzMDBcIlxuICAgICAgICAgIGF1dG9jb21wbGV0ZT1cIm9mZlwiIHJvbGU9XCJjb21ib2JveFwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiXG4gICAgICAgICAgYXJpYS1hdXRvY29tcGxldGU9XCJsaXN0XCIgYXJpYS1vd25zPVwic3RvcmVGaWx0ZXJTdWdnZXN0aW9uc1wiIGFyaWEtaGFzcG9wdXA9XCJsaXN0Ym94XCI+XG4gICAgICAgIDxidXR0b24gaWQ9XCJjbGVhckZpbHRlclwiIGNsYXNzPVwibXZpZGVvLXN0b3JlLWZpbHRlcl9fY2xlYXJcIiBhcmlhLWxhYmVsPVwi0J7Rh9C40YHRgtC40YLRjFwiPiZ0aW1lczs8L2J1dHRvbj5cbiAgICAgICAgPGRpdiBpZD1cInN0b3JlRmlsdGVyU3VnZ2VzdGlvbnNcIiBjbGFzcz1cIm12aWRlby1zdG9yZS1maWx0ZXJfX3N1Z2dlc3Rpb25zXCIgcm9sZT1cImxpc3Rib3hcIj48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPHNlbGVjdCBpZD1cImNpdHlGaWx0ZXJcIiBjbGFzcz1cIm12aWRlby1zdG9yZS1maWx0ZXJfX2NpdHlcIj5cbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPtCS0YHQtSDQs9C+0YDQvtC00LA8L29wdGlvbj5cbiAgICAgICAgJHtjaXRpZXMubWFwKChjKSA9PiBgPG9wdGlvbiB2YWx1ZT1cIiR7ZXNjYXBlQXR0cihjKX1cIiAke2MgPT09IHNhdmVkQ2l0eSA/ICdzZWxlY3RlZCcgOiAnJ30+JHtjfTwvb3B0aW9uPmApLmpvaW4oJycpfVxuICAgICAgPC9zZWxlY3Q+XG4gICAgYDtcbiAgICByZXR1cm4gd3JhcHBlcjtcbn1cblxuZnVuY3Rpb24gcmVuZGVyU3VnZ2VzdGlvbnMoY29udGFpbmVyLCBpdGVtcywgYWN0aXZlSW5kZXgpIHtcbiAgICBpZiAoIWNvbnRhaW5lcikgcmV0dXJuO1xuICAgIGlmICghaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cIm12aWRlby1zdG9yZS1maWx0ZXJfX2VtcHR5XCI+0J/QvtC60LAg0L3QtdGCINGB0L7RhdGA0LDQvdGR0L3QvdGL0YUg0LfQsNC/0YDQvtGB0L7QsjwvZGl2Pic7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbGlzdCA9IGl0ZW1zLm1hcCgodGV4dCwgaSkgPT4gYFxuICAgICAgPGRpdiBjbGFzcz1cIm12aWRlby1zdG9yZS1maWx0ZXJfX3N1Z2dlc3Rpb24gJHtpID09PSBhY3RpdmVJbmRleCA/ICdpcy1hY3RpdmUnIDogJyd9XCIgcm9sZT1cIm9wdGlvblwiIGRhdGEtdmFsdWU9XCIke2VuY29kZVVSSUNvbXBvbmVudCh0ZXh0KX1cIj5cbiAgICAgICAgPHNwYW4gc3R5bGU9XCJkaXNwbGF5OmZsZXg7IGFsaWduLWl0ZW1zOmNlbnRlcjsgZ2FwOjZweFwiPiR7SUNPTlMuSElTVE9SWX08c3Bhbj4ke3RleHR9PC9zcGFuPjwvc3Bhbj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJtdmlkZW8tc3RvcmUtZmlsdGVyX19kZWxldGVcIiB0aXRsZT1cItCj0LTQsNC70LjRgtGMXCI+JnRpbWVzOzwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgYCkuam9pbignJyk7XG4gICAgY29uc3QgZm9vdGVyID0gYFxuICAgICAgPGRpdiBjbGFzcz1cIm12aWRlby1zdG9yZS1maWx0ZXJfX2Zvb3RlclwiPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm12aWRlby1zdG9yZS1maWx0ZXJfX2NsZWFyLWhpc3RvcnlcIiBpZD1cImNsZWFySGlzdG9yeUJ0blwiPtCe0YfQuNGB0YLQuNGC0Ywg0LLRgdGRPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBsaXN0ICsgZm9vdGVyO1xufVxuXG4vKiog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YTQuNC70YzRgtGA0LAgKi9cbmZ1bmN0aW9uIGluaXRGaWx0ZXIoKSB7XG4gICAgY29uc3QgcGFuZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5DT05UUk9MX1BBTkVMKTtcbiAgICBpZiAoIXBhbmVsIHx8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdG9yZUZpbHRlcicpKSByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBmaWx0ZXJFbGVtZW50ID0gY3JlYXRlRmlsdGVyRWxlbWVudCgpO1xuICAgIHBhbmVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGZpbHRlckVsZW1lbnQsIHBhbmVsLm5leHRTaWJsaW5nKTtcblxuICAgIGNvbnN0IGlucHV0ID0gZmlsdGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcjc3RvcmVGaWx0ZXInKTtcbiAgICBjb25zdCBjbGVhckJ0biA9IGZpbHRlckVsZW1lbnQucXVlcnlTZWxlY3RvcignI2NsZWFyRmlsdGVyJyk7XG4gICAgY29uc3Qgc3VnZyA9IGZpbHRlckVsZW1lbnQucXVlcnlTZWxlY3RvcignI3N0b3JlRmlsdGVyU3VnZ2VzdGlvbnMnKTtcbiAgICBjb25zdCBjaXR5U2VsZWN0ID0gZmlsdGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcjY2l0eUZpbHRlcicpO1xuXG4gICAgbGV0IGFjdGl2ZUluZGV4ID0gLTE7XG4gICAgbGV0IGN1cnJlbnRMaXN0ID0gW107XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVTdWdnZXN0aW9uTGlzdCgpIHtcbiAgICAgICAgY3VycmVudExpc3QgPSBzdG9yZUZpbHRlclN0b3JhZ2UuZ2V0SGlzdG9yeSgpO1xuICAgICAgICBhY3RpdmVJbmRleCA9IC0xO1xuICAgICAgICByZW5kZXJTdWdnZXN0aW9ucyhzdWdnLCBjdXJyZW50TGlzdCwgYWN0aXZlSW5kZXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNob3dTdWdnZXN0aW9uc0lmQW55KCkge1xuICAgICAgICB1cGRhdGVTdWdnZXN0aW9uTGlzdCgpO1xuICAgICAgICBpZiAoY3VycmVudExpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICBzdWdnLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1Z2cuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwbHlTdWdnZXN0aW9uQnlJbmRleChpZHgpIHtcbiAgICAgICAgaWYgKGlkeCA8IDAgfHwgaWR4ID49IGN1cnJlbnRMaXN0Lmxlbmd0aCkgcmV0dXJuO1xuICAgICAgICBjb25zdCB2YWwgPSBjdXJyZW50TGlzdFtpZHhdO1xuICAgICAgICBpbnB1dC52YWx1ZSA9IHZhbDtcbiAgICAgICAgZmlsdGVyU3RvcmVzKHZhbCwgY2l0eVNlbGVjdC52YWx1ZSk7XG4gICAgICAgIHN0b3JlRmlsdGVyU3RvcmFnZS5hZGRUb0hpc3RvcnkodmFsKTtcbiAgICAgICAgY2xlYXJCdG4uc3R5bGUuZGlzcGxheSA9IHZhbCA/ICdmbGV4JyA6ICdub25lJztcbiAgICAgICAgc3VnZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgaW5wdXQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzYXZlSGlzdG9yeSh2YWx1ZSkge1xuICAgICAgICBjb25zdCB0cmltbWVkVmFsdWUgPSB2YWx1ZS50cmltKCk7XG4gICAgICAgIGlmICh0cmltbWVkVmFsdWUpIHN0b3JlRmlsdGVyU3RvcmFnZS5hZGRUb0hpc3RvcnkodHJpbW1lZFZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoaW5wdXQudmFsdWUpIHtcbiAgICAgICAgZmlsdGVyU3RvcmVzKGlucHV0LnZhbHVlLCBjaXR5U2VsZWN0LnZhbHVlKTtcbiAgICAgICAgY2xlYXJCdG4uc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICB9IGVsc2UgaWYgKGNpdHlTZWxlY3QudmFsdWUpIHtcbiAgICAgICAgZmlsdGVyU3RvcmVzKCcnLCBjaXR5U2VsZWN0LnZhbHVlKTtcbiAgICB9XG5cbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAnaW5wdXQnLFxuICAgICAgICBkZWJvdW5jZSgoZSkgPT4ge1xuICAgICAgICAgICAgZmlsdGVyU3RvcmVzKGUudGFyZ2V0LnZhbHVlLCBjaXR5U2VsZWN0LnZhbHVlKTtcbiAgICAgICAgICAgIGNsZWFyQnRuLnN0eWxlLmRpc3BsYXkgPSBlLnRhcmdldC52YWx1ZSA/ICdmbGV4JyA6ICdub25lJztcbiAgICAgICAgICAgIHNob3dTdWdnZXN0aW9uc0lmQW55KCk7XG4gICAgICAgIH0sIDIwMCksXG4gICAgKTtcblxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgc2hvd1N1Z2dlc3Rpb25zSWZBbnkpO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2hvd1N1Z2dlc3Rpb25zSWZBbnkpO1xuXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgICAgIGlmIChzdWdnLnN0eWxlLmRpc3BsYXkgPT09ICdibG9jaycpIHtcbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJ0Fycm93RG93bicpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYWN0aXZlSW5kZXggPSBNYXRoLm1pbihhY3RpdmVJbmRleCArIDEsIGN1cnJlbnRMaXN0Lmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgIHJlbmRlclN1Z2dlc3Rpb25zKHN1Z2csIGN1cnJlbnRMaXN0LCBhY3RpdmVJbmRleCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnQXJyb3dVcCcpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYWN0aXZlSW5kZXggPSBNYXRoLm1heChhY3RpdmVJbmRleCAtIDEsIC0xKTtcbiAgICAgICAgICAgICAgICByZW5kZXJTdWdnZXN0aW9ucyhzdWdnLCBjdXJyZW50TGlzdCwgYWN0aXZlSW5kZXgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiBhY3RpdmVJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGFwcGx5U3VnZ2VzdGlvbkJ5SW5kZXgoYWN0aXZlSW5kZXgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgICAgICAgICAgICBzdWdnLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgc2F2ZUhpc3RvcnkoaW5wdXQudmFsdWUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKCkgPT4ge1xuICAgICAgICBzYXZlSGlzdG9yeShpbnB1dC52YWx1ZSk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgc3VnZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgIH0sIDEyMCk7XG4gICAgfSk7XG5cbiAgICBjbGVhckJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgaW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgZmlsdGVyU3RvcmVzKCcnLCBjaXR5U2VsZWN0LnZhbHVlKTtcbiAgICAgICAgY2xlYXJCdG4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgaW5wdXQuZm9jdXMoKTtcbiAgICAgICAgc2hvd1N1Z2dlc3Rpb25zSWZBbnkoKTtcbiAgICB9KTtcblxuICAgIHN1Z2cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGUpID0+IHtcbiAgICAgICAgY29uc3QgY2xlYXJCdG5FbCA9IGUudGFyZ2V0LmNsb3Nlc3QoJyNjbGVhckhpc3RvcnlCdG4nKTtcbiAgICAgICAgaWYgKGNsZWFyQnRuRWwpIHtcbiAgICAgICAgICAgIHN0b3JlRmlsdGVyU3RvcmFnZS5jbGVhckhpc3RvcnkoKTtcbiAgICAgICAgICAgIHVwZGF0ZVN1Z2dlc3Rpb25MaXN0KCk7XG4gICAgICAgICAgICBpZiAoIWN1cnJlbnRMaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHN1Z2cuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkZWxCdG4gPSBlLnRhcmdldC5jbG9zZXN0KCcubXZpZGVvLXN0b3JlLWZpbHRlcl9fZGVsZXRlJyk7XG4gICAgICAgIGlmIChkZWxCdG4pIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1FbCA9IGRlbEJ0bi5jbG9zZXN0KCcubXZpZGVvLXN0b3JlLWZpbHRlcl9fc3VnZ2VzdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgdmFsID0gZGVjb2RlVVJJQ29tcG9uZW50KGl0ZW1FbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsdWUnKSB8fCAnJyk7XG4gICAgICAgICAgICBzdG9yZUZpbHRlclN0b3JhZ2UucmVtb3ZlRnJvbUhpc3RvcnkodmFsKTtcbiAgICAgICAgICAgIHVwZGF0ZVN1Z2dlc3Rpb25MaXN0KCk7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaXRlbSA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5tdmlkZW8tc3RvcmUtZmlsdGVyX19zdWdnZXN0aW9uJyk7XG4gICAgICAgIGlmICghaXRlbSkgcmV0dXJuO1xuICAgICAgICBjb25zdCB2YWwgPSBkZWNvZGVVUklDb21wb25lbnQoaXRlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsdWUnKSB8fCAnJyk7XG4gICAgICAgIGlucHV0LnZhbHVlID0gdmFsO1xuICAgICAgICBmaWx0ZXJTdG9yZXModmFsLCBjaXR5U2VsZWN0LnZhbHVlKTtcbiAgICAgICAgc3RvcmVGaWx0ZXJTdG9yYWdlLmFkZFRvSGlzdG9yeSh2YWwpO1xuICAgICAgICBjbGVhckJ0bi5zdHlsZS5kaXNwbGF5ID0gdmFsID8gJ2ZsZXgnIDogJ25vbmUnO1xuICAgICAgICBzdWdnLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSk7XG5cbiAgICBjaXR5U2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgZmlsdGVyU3RvcmVzKGlucHV0LnZhbHVlLCBjaXR5U2VsZWN0LnZhbHVlKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0cnVlO1xufVxuXG4vKiog0J7QsdGJ0LjQuSBNdXRhdGlvbk9ic2VydmVyICovXG5mdW5jdGlvbiBzdGFydFBhZ2VPYnNlcnZlcigpIHtcbiAgICBpZiAocGFnZU9ic2VydmVyKSByZXR1cm47XG5cbiAgICBjb25zdCBkZWJvdW5jZWRGaWx0ZXIgPSBkZWJvdW5jZSgoY3VycmVudEZpbHRlciwgY2l0eUZpbHRlcikgPT4ge1xuICAgICAgICBmaWx0ZXJTdG9yZXMoY3VycmVudEZpbHRlciwgY2l0eUZpbHRlcik7XG4gICAgfSwgMTAwKTtcblxuICAgIHBhZ2VPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRzKSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0b3JlRmlsdGVyJyk7XG4gICAgICAgIGNvbnN0IGNpdHlTZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0eUZpbHRlcicpO1xuICAgICAgICBjb25zdCBjdXJyZW50RmlsdGVyID0gaW5wdXQ/LnZhbHVlIHx8ICcnO1xuICAgICAgICBjb25zdCBjaXR5RmlsdGVyID0gY2l0eVNlbGVjdD8udmFsdWUgfHwgJyc7XG5cbiAgICAgICAgbXV0cy5zb21lKChtdXQpID0+IEFycmF5LmZyb20obXV0LmFkZGVkTm9kZXMpLnNvbWUoKG5vZGUpID0+IHtcbiAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlICE9PSAxKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIGNsaWNrU2hvd01vcmVJZkV4aXN0cygpO1xuXG4gICAgICAgICAgICBpZiAoIWlucHV0ICYmIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JTLkNPTlRST0xfUEFORUwpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluaXRGaWx0ZXIoKSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChub2RlLm1hdGNoZXM/LihTRUxFQ1RPUlMuU1RPUkVfV1JBUFBFUikgfHxcbiAgICAgICAgICAgICAgICBub2RlLnF1ZXJ5U2VsZWN0b3I/LihTRUxFQ1RPUlMuU1RPUkVfVElUTEUpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudEZpbHRlciB8fCBjaXR5RmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYm91bmNlZEZpbHRlcihjdXJyZW50RmlsdGVyLCBjaXR5RmlsdGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgcGFnZU9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG59XG4iXSwibmFtZXMiOlsidmFsIl0sInNvdXJjZVJvb3QiOiIifQ==