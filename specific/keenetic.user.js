// ==UserScript==
// @name         Keenetic enhancer
// @description  UI tweaks and device filtering
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @match        https://*.keenetic.io/*
// @match        https://*.netcraze.io/*
// @namespace    https://github.com/reliable-code/site-enhancer-scripts
// @version      1.0.78714669
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keenetic.io
// @author       reliable-code
// @downloadURL  https://raw.githubusercontent.com/reliable-code/site-enhancer-scripts/main/specific/keenetic.user.js
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


/***/ }),

/***/ "./src/common/filter/compare.js":
/*!**************************************!*\
  !*** ./src/common/filter/compare.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ "./src/common/hash/fnv1a.js":
/*!**********************************!*\
  !*** ./src/common/hash/fnv1a.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fnv1aHash32: () => (/* binding */ fnv1aHash32)
/* harmony export */ });
function fnv1aHash32(input) {
  const FNV_OFFSET_BASIS = 2166136261;
  const FNV_PRIME = 16777619;
  let hash = FNV_OFFSET_BASIS;
  for (let i = 0; i < input.length; i += 1) {
    const charCode = input.charCodeAt(i);
    hash ^= charCode;
    hash = Math.imul(hash, FNV_PRIME);
  }
  return hash >>> 0;
}


/***/ }),

/***/ "./src/common/hash/helpers.js":
/*!************************************!*\
  !*** ./src/common/hash/helpers.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getHash: () => (/* binding */ getHash)
/* harmony export */ });
/* unused harmony export getHashOrDefault */
/* harmony import */ var _fnv1a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fnv1a */ "./src/common/hash/fnv1a.js");

function getHash(value) {
  return (0,_fnv1a__WEBPACK_IMPORTED_MODULE_0__.fnv1aHash32)(value).toString(16).padStart(8, "0");
}
function getHashOrDefault(value, defaultValue = "common") {
  return value ? getHash(value) : defaultValue;
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

/***/ "./src/common/url.js":
/*!***************************!*\
  !*** ./src/common/url.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   observeURL: () => (/* binding */ observeURL),
/* harmony export */   somePathElementEquals: () => (/* binding */ somePathElementEquals)
/* harmony export */ });
/* unused harmony exports getURLPathElement, getPathnameElement, getURLPathElementEnding, getPathnameElementEnding, getURLQueryParam, clearQueryParams, pathnameIncludes, pathnameIncludesSome, setQueryParamsAndRedirect, observeURLForReload */
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


/***/ }),

/***/ "./src/keenetic/index.js":
/*!*******************************!*\
  !*** ./src/keenetic/index.js ***!
  \*******************************/
/***/ ((module, __unused_webpack___webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.css */ "./src/keenetic/styles.css");
/* harmony import */ var _common_dom_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/dom/utils */ "./src/common/dom/utils.js");
/* harmony import */ var _common_url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/url */ "./src/common/url.js");
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./storage */ "./src/keenetic/storage.js");
/* harmony import */ var _common_filter_compare__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/filter/compare */ "./src/common/filter/compare.js");
/* harmony import */ var _common_filter_helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/filter/helpers */ "./src/common/filter/helpers.js");






GM_addStyle(_styles_css__WEBPACK_IMPORTED_MODULE_0__["default"]);
GM_registerMenuCommand("\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u0430\u0432\u0442\u043E\u0432\u0445\u043E\u0434", () => {
  const login = prompt("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043B\u043E\u0433\u0438\u043D:");
  if (login === null) return;
  if (login === "") {
    if (confirm("\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u0434\u043B\u044F \u0430\u0432\u0442\u043E\u0432\u0445\u043E\u0434\u0430?")) {
      _storage__WEBPACK_IMPORTED_MODULE_3__.authStorage.clearCredentials();
    }
    return;
  }
  const password = prompt("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C:");
  if (password === null) return;
  if (password === "") {
    if (confirm("\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u0434\u043B\u044F \u0430\u0432\u0442\u043E\u0432\u0445\u043E\u0434\u0430?")) {
      _storage__WEBPACK_IMPORTED_MODULE_3__.authStorage.clearCredentials();
    }
    return;
  }
  _storage__WEBPACK_IMPORTED_MODULE_3__.authStorage.setCredentials(login, password);
});
GM_registerMenuCommand("\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u0438\u043C\u044F \u043C\u043E\u0434\u0435\u043B\u0438", () => {
  const currentName = _storage__WEBPACK_IMPORTED_MODULE_3__.settingsStorage.getModelName() || "";
  const name = prompt("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043C\u044F \u0440\u043E\u0443\u0442\u0435\u0440\u0430:", currentName);
  if (name === null) return;
  if (name.trim() === "") {
    if (confirm("\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0438\u043C\u044F \u043C\u043E\u0434\u0435\u043B\u0438 \u043D\u0430 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u043E\u0435?")) {
      _storage__WEBPACK_IMPORTED_MODULE_3__.settingsStorage.clearModelName();
      window.location.reload();
    }
    return;
  }
  _storage__WEBPACK_IMPORTED_MODULE_3__.settingsStorage.setModelName(name);
  window.location.reload();
});
const CONSTANTS = {
  DEVICE_FILTER_INPUT_ID: "device-filter-input"
};
await initMods();
(0,_common_url__WEBPACK_IMPORTED_MODULE_2__.observeURL)(initMods);
async function initMods() {
  if ((0,_common_url__WEBPACK_IMPORTED_MODULE_2__.somePathElementEquals)("login")) {
    await loginPageCode();
    return;
  }
  await updateHeaderText();
  await expandMenu();
  if ((0,_common_url__WEBPACK_IMPORTED_MODULE_2__.somePathElementEquals)("devicesList")) {
    await addFilterField();
  }
}
async function loginPageCode() {
  const loginForm = await (0,_common_dom_utils__WEBPACK_IMPORTED_MODULE_1__.waitForElement)(document, "ndw-form.login-form__form");
  await autoFillAndLogin(loginForm);
}
async function autoFillAndLogin(loginForm) {
  if (!_storage__WEBPACK_IMPORTED_MODULE_3__.authStorage.hasCredentials()) return;
  const { login, password } = _storage__WEBPACK_IMPORTED_MODULE_3__.authStorage.getCredentials();
  const loginInput = await (0,_common_dom_utils__WEBPACK_IMPORTED_MODULE_1__.waitForElement)(loginForm, 'input[name="login_key"]');
  const passwordInput = await (0,_common_dom_utils__WEBPACK_IMPORTED_MODULE_1__.waitForElement)(loginForm, 'input[name="password_key"]');
  const loginButton = await (0,_common_dom_utils__WEBPACK_IMPORTED_MODULE_1__.waitForElement)(loginForm, "button.ndw-button--primary");
  if (!loginInput || !passwordInput || !loginButton) return;
  loginInput.value = login;
  loginInput.dispatchEvent(new Event("input", { bubbles: true }));
  loginInput.dispatchEvent(new Event("change", { bubbles: true }));
  passwordInput.value = password;
  passwordInput.dispatchEvent(new Event("input", { bubbles: true }));
  passwordInput.dispatchEvent(new Event("change", { bubbles: true }));
  loginButton.click();
}
async function updateHeaderText() {
  const modelName = _storage__WEBPACK_IMPORTED_MODULE_3__.settingsStorage.getModelName();
  if (!modelName) return;
  const headerModel = await (0,_common_dom_utils__WEBPACK_IMPORTED_MODULE_1__.waitForElement)(document, ".header__model");
  headerModel.textContent = modelName;
}
async function expandMenu() {
  const toggleButton = await (0,_common_dom_utils__WEBPACK_IMPORTED_MODULE_1__.waitForElement)(document, ".menu-toggle__container");
  const toggleButtonWrap = toggleButton.closest(".menu-toggle");
  if (toggleButtonWrap && !toggleButtonWrap.classList.contains("menu-toggle--expanded")) {
    toggleButton.click();
  }
}
async function addFilterField() {
  let filterInput = document.getElementById(CONSTANTS.DEVICE_FILTER_INPUT_ID);
  if (filterInput) return;
  const registeredDevicesHeader = await (0,_common_dom_utils__WEBPACK_IMPORTED_MODULE_1__.waitForElement)(
    document,
    '[label="devices-list.offline-device-registration.register-btn"]'
  );
  filterInput = document.createElement("input");
  filterInput.setAttribute("type", "text");
  filterInput.setAttribute("placeholder", "\u0424\u0438\u043B\u044C\u0442\u0440 \u043F\u043E \u0438\u043C\u0435\u043D\u0438 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430");
  filterInput.setAttribute("id", CONSTANTS.DEVICE_FILTER_INPUT_ID);
  registeredDevicesHeader.parentNode.insertBefore(
    filterInput,
    registeredDevicesHeader.nextSibling
  );
  filterInput.addEventListener("input", () => {
    const filterValue = filterInput.value;
    const requirements = (0,_common_filter_helpers__WEBPACK_IMPORTED_MODULE_5__.parseFilterQuery)(filterValue);
    const devicesContainer = document.querySelector(".registered-devices");
    if (!devicesContainer) return;
    const rows = devicesContainer.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      const deviceName = row.querySelector(".cell__host-name");
      if (deviceName) {
        const deviceNameText = deviceName.textContent;
        row.style.display = (0,_common_filter_compare__WEBPACK_IMPORTED_MODULE_4__.matchesQuery)(deviceNameText, requirements) ? "" : "none";
      }
    });
  });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "./src/keenetic/storage.js":
/*!*********************************!*\
  !*** ./src/keenetic/storage.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   authStorage: () => (/* binding */ authStorage),
/* harmony export */   settingsStorage: () => (/* binding */ settingsStorage)
/* harmony export */ });
/* harmony import */ var _common_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/storage */ "./src/common/storage.js");
/* harmony import */ var _common_hash_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/hash/helpers */ "./src/common/hash/helpers.js");


const AUTH_KEY = `auth_creds_${(0,_common_hash_helpers__WEBPACK_IMPORTED_MODULE_1__.getHash)(window.location.hostname)}`;
const SETTINGS_KEY = `settings_${(0,_common_hash_helpers__WEBPACK_IMPORTED_MODULE_1__.getHash)(window.location.hostname)}`;
const saveSettings = (data) => {
  if (Object.keys(data).length === 0) {
    _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.remove(SETTINGS_KEY);
  } else {
    _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.set(SETTINGS_KEY, data);
  }
};
const authStorage = {
  /**
   * Получает полные данные авторизации
   * @returns {{login: string, password: string}}
   */
  getCredentials: () => {
    const data = _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.get(AUTH_KEY, {});
    return {
      login: data.login || "",
      password: data.password || ""
    };
  },
  /**
   * Сохраняет данные авторизации атомарно
   * @param {string} login
   * @param {string} password
   */
  setCredentials: (login, password) => {
    const normalizedData = {
      login: String(login || "").trim(),
      password: String(password || "").trim()
    };
    _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.set(AUTH_KEY, normalizedData);
  },
  /**
   * Проверяет, есть ли полные данные для авторизации
   * @returns {boolean}
   */
  hasCredentials: () => {
    const { login, password } = authStorage.getCredentials();
    return Boolean(login && password);
  },
  /**
   * Удаляет все данные авторизации для текущего домена
   */
  clearCredentials: () => {
    _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.remove(AUTH_KEY);
  }
};
const settingsStorage = {
  /**
   * Получает кастомное имя модели
   * @returns {string|undefined}
   */
  getModelName: () => {
    const data = _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.get(SETTINGS_KEY, {});
    return data.modelName;
  },
  /**
   * Сохраняет кастомное имя модели
   * @param {string} name
   */
  setModelName: (name) => {
    const data = _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.get(SETTINGS_KEY, {});
    const normalizedName = String(name || "").trim();
    if (normalizedName) {
      data.modelName = normalizedName;
    } else {
      delete data.modelName;
    }
    saveSettings(data);
  },
  /**
   * Сбрасывает имя модели
   */
  clearModelName: () => {
    const data = _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.get(SETTINGS_KEY, {});
    delete data.modelName;
    saveSettings(data);
  }
};


/***/ }),

/***/ "./src/keenetic/styles.css":
/*!*********************************!*\
  !*** ./src/keenetic/styles.css ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("#device-filter-input{width:275px;border:none;padding:11px;margin:-10px 0 6px;background-color:transparent;color:#c2c2c2}\n");

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
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var hasSymbol = typeof Symbol === "function";
/******/ 		var webpackQueues = hasSymbol ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = hasSymbol ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = hasSymbol ? Symbol("webpack error") : "__webpack_error__";
/******/ 		
/******/ 		
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 		
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 		
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			var handle = (deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 		
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}
/******/ 			var done = (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue))
/******/ 			body(handle, done);
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/keenetic/index.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VlbmV0aWMudXNlci5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLE1BQU0sV0FBVyxhQUFvQixLQUFLO0FBRTFDLFNBQVMsY0FBYyxNQUFNO0FBQ3pCLE1BQUksQ0FBQyxTQUFVO0FBQ2YsVUFBUSxJQUFJLEdBQUcsSUFBSTtBQUN2QjtBQUVPLFNBQVMsaUJBQWlCLFVBQVUsWUFBWSxRQUFRO0FBQzNELFFBQU0sUUFBUSxrQkFBa0IsV0FBVyxPQUFPLFNBQVMsSUFBSSxRQUFRLE1BQU07QUFFN0U7QUFBQSxJQUNJLEdBQUcsUUFBUSx5QkFBb0IsMEJBQXFCO0FBQUEsSUFDcEQ7QUFBQSxJQUNBLElBQUksUUFBUTtBQUFBLElBQ1o7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNKO0FBQ0o7QUFFTyxTQUFTLGVBQWUsVUFBVSxZQUFZO0FBQ2pEO0FBQUEsSUFDSTtBQUFBLElBQ0E7QUFBQSxJQUNBLElBQUksUUFBUTtBQUFBLElBQ1o7QUFBQSxJQUNBO0FBQUEsRUFDSjtBQUNKOzs7Ozs7Ozs7Ozs7Ozs7O0FDN0JpRDtBQUUxQyxTQUFTLGVBQWUsWUFBWSxVQUFVLFVBQVUsTUFBTSxhQUFhLE9BQU87QUFDckYsUUFBTSxrQkFBa0IsV0FBVyxjQUFjLFFBQVE7QUFDekQsTUFBSSxpQkFBaUI7QUFDakIsUUFBSSxXQUFZLDJEQUFnQixDQUFDLFVBQVUsWUFBWSxlQUFlO0FBQ3RFLFdBQU8sUUFBUSxRQUFRLGVBQWU7QUFBQSxFQUMxQztBQUVBLE1BQUksV0FBWSx5REFBYyxDQUFDLFVBQVUsVUFBVTtBQUVuRCxTQUFPLElBQUksUUFBUSxDQUFDLFlBQVk7QUFDNUIsVUFBTSxXQUFXLElBQUksaUJBQWlCLGdCQUFnQjtBQUN0RCxhQUFTLFFBQVEsWUFBWTtBQUFBLE1BQ3pCLFdBQVc7QUFBQSxNQUNYLFNBQVM7QUFBQSxJQUNiLENBQUM7QUFFRCxRQUFJO0FBQ0osUUFBSSxTQUFTO0FBQ1Qsa0JBQVksV0FBVyxNQUFNO0FBQ3pCLGlCQUFTLFdBQVc7QUFDcEIsWUFBSSxXQUFZLDJEQUFnQixDQUFDLFVBQVUsWUFBWSxJQUFJO0FBQzNELGdCQUFRLElBQUk7QUFBQSxNQUNoQixHQUFHLE9BQU87QUFBQSxJQUNkO0FBRUEsYUFBUyxtQkFBbUI7QUFDeEIsWUFBTSxVQUFVLFdBQVcsY0FBYyxRQUFRO0FBQ2pELFVBQUksQ0FBQyxRQUFTO0FBRWQsVUFBSSxVQUFXLGNBQWEsU0FBUztBQUNyQyxlQUFTLFdBQVc7QUFDcEIsVUFBSSxXQUFZLDJEQUFnQixDQUFDLFVBQVUsWUFBWSxPQUFPO0FBQzlELGNBQVEsT0FBTztBQUFBLElBQ25CO0FBQUEsRUFDSixDQUFDO0FBQ0w7QUFFTyxTQUFTLHFCQUFxQixZQUFZLFVBQVU7QUFDdkQsUUFBTSxrQkFBa0IsV0FBVyxjQUFjLFFBQVE7QUFDekQsTUFBSSxDQUFDLGdCQUFpQixRQUFPLFFBQVEsUUFBUTtBQUU3QyxTQUFPLElBQUksUUFBUSxDQUFDLFlBQVk7QUFDNUIsVUFBTSxXQUFXLElBQUksaUJBQWlCLGdCQUFnQjtBQUN0RCxhQUFTLFFBQVEsWUFBWTtBQUFBLE1BQ3pCLFdBQVc7QUFBQSxNQUNYLFNBQVM7QUFBQSxJQUNiLENBQUM7QUFFRCxhQUFTLG1CQUFtQjtBQUN4QixVQUFJLFdBQVcsY0FBYyxRQUFRLEVBQUc7QUFFeEMsZUFBUyxXQUFXO0FBQ3BCLGNBQVE7QUFBQSxJQUNaO0FBQUEsRUFDSixDQUFDO0FBQ0w7QUFFTyxTQUFTLDJCQUEyQixTQUFTLFVBQVUsS0FBSztBQUMvRCxTQUFPLElBQUksUUFBUSxDQUFDLFlBQVk7QUFDNUIsUUFBSTtBQUVKLFVBQU0sV0FBVyxJQUFJLGlCQUFpQixNQUFNO0FBQ3hDLG1CQUFhLFNBQVM7QUFDdEIseUJBQW1CO0FBQUEsSUFDdkIsQ0FBQztBQUVELGFBQVMscUJBQXFCO0FBQzFCLGtCQUFZLFdBQVcsTUFBTTtBQUN6QixpQkFBUyxXQUFXO0FBQ3BCLGdCQUFRO0FBQUEsTUFDWixHQUFHLE9BQU87QUFBQSxJQUNkO0FBRUEsdUJBQW1CO0FBRW5CLGFBQVMsUUFBUSxTQUFTO0FBQUEsTUFDdEIsV0FBVztBQUFBLE1BQ1gsU0FBUztBQUFBLElBQ2IsQ0FBQztBQUFBLEVBQ0wsQ0FBQztBQUNMO0FBRU8sU0FBUyxTQUFTLE1BQU0sT0FBTyxLQUFLO0FBQ3ZDLE1BQUk7QUFDSixTQUFPLFlBQWEsTUFBTTtBQUN0QixpQkFBYSxTQUFTO0FBQ3RCLGdCQUFZLFdBQVcsTUFBTSxLQUFLLE1BQU0sTUFBTSxJQUFJLEdBQUcsSUFBSTtBQUFBLEVBQzdEO0FBQ0o7QUFFTyxlQUFlLGVBQWUsVUFBVTtBQUMzQyxNQUFJLFNBQVMsb0JBQW9CLFdBQVc7QUFDeEMsVUFBTSxTQUFTO0FBQUEsRUFDbkIsT0FBTztBQUNILGFBQVMsaUJBQWlCLG9CQUFvQixZQUFZO0FBQ3RELFVBQUksU0FBUyxvQkFBb0IsV0FBVztBQUN4QyxjQUFNLFNBQVM7QUFBQSxNQUNuQjtBQUFBLElBQ0osR0FBRyxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQUEsRUFDckI7QUFDSjtBQUVPLFNBQVMsc0JBQXNCLFNBQVMsVUFBVTtBQUNyRCxRQUFNLFdBQVcsSUFBSSxxQkFBcUIsQ0FBQyxZQUFZO0FBQ25ELFlBQVEsUUFBUSxDQUFDLFVBQVU7QUFDdkIsVUFBSSxDQUFDLE1BQU0sZUFBZ0I7QUFDM0IsZUFBUztBQUNULGdDQUEwQixPQUFPO0FBQUEsSUFDckMsQ0FBQztBQUFBLEVBQ0wsQ0FBQztBQUVELFVBQVEsdUJBQXVCO0FBQy9CLFdBQVMsUUFBUSxPQUFPO0FBQzVCO0FBRU8sU0FBUywwQkFBMEIsU0FBUztBQUMvQyxNQUFJLENBQUMsUUFBUSxxQkFBc0I7QUFFbkMsVUFBUSxxQkFBcUIsV0FBVztBQUN4QyxVQUFRLHVCQUF1QjtBQUNuQztBQUVPLFNBQVMsY0FBYyxVQUFVO0FBQ3BDLE1BQUksQ0FBQyxTQUFVO0FBQ2YsV0FBUyxXQUFXO0FBQ3BCLGFBQVc7QUFDZjs7Ozs7Ozs7Ozs7Ozs7OztBQ2hJaUM7QUFFMUIsU0FBUyxrQkFBa0IsZ0JBQWdCLGFBQWE7QUFDM0QsTUFBSSxDQUFDLFlBQWEsUUFBTztBQUN6QixRQUFNLGVBQWUsMERBQWdCLENBQUMsV0FBVztBQUNqRCxTQUFPLGFBQWEsZ0JBQWdCLFlBQVk7QUFDcEQ7QUFFTyxTQUFTLGFBQWEsTUFBTSxjQUFjO0FBQzdDLE1BQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLE9BQVEsUUFBTztBQUVsRCxRQUFNLGtCQUFrQixRQUFRLElBQUksWUFBWTtBQUVoRCxTQUFPLGFBQWEsTUFBTSxDQUFDLFVBQVUsZ0JBQWdCLGdCQUFnQixLQUFLLENBQUM7QUFDL0U7QUFFQSxTQUFTLGdCQUFnQixNQUFNLGlCQUFpQjtBQUM1QyxTQUFPLGdCQUFnQixLQUFLLENBQUMsRUFBRSxNQUFNLFdBQVcsTUFBTTtBQUNsRCxVQUFNLFdBQVcsS0FBSyxTQUFTLElBQUk7QUFDbkMsV0FBTyxhQUFhLENBQUMsV0FBVztBQUFBLEVBQ3BDLENBQUM7QUFDTDs7Ozs7Ozs7Ozs7Ozs7QUNyQk8sU0FBUyxpQkFBaUIsYUFBYTtBQUMxQyxNQUFJLENBQUMsWUFBYSxRQUFPLENBQUM7QUFFMUIsU0FBTyxZQUFZLFlBQVksRUFDMUIsTUFBTSxHQUFHLEVBQ1QsSUFBSSxVQUFVLEVBQ2QsT0FBTyxPQUFPO0FBQ3ZCO0FBRUEsU0FBUyxXQUFXLGFBQWE7QUFDN0IsUUFBTSxTQUFTLFlBQVksTUFBTSxHQUFHLEVBQy9CLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQ25CLE9BQU8sT0FBTztBQUVuQixNQUFJLE9BQU8sV0FBVyxFQUFHLFFBQU87QUFFaEMsUUFBTSxhQUFhLE9BQ2QsSUFBSSxlQUFlLEVBQ25CLE9BQU8sT0FBTztBQUVuQixTQUFPLFdBQVcsU0FBUyxJQUFJLGFBQWE7QUFDaEQ7QUFFQSxTQUFTLGdCQUFnQixVQUFVO0FBQy9CLFFBQU0sYUFBYSxTQUFTLFdBQVcsR0FBRztBQUMxQyxRQUFNLE9BQU8sYUFBYSxTQUFTLE1BQU0sQ0FBQyxFQUFFLEtBQUssSUFBSTtBQUVyRCxNQUFJLENBQUMsS0FBTSxRQUFPO0FBRWxCLFNBQU87QUFBQSxJQUNIO0FBQUEsSUFDQTtBQUFBLEVBQ0o7QUFDSjs7Ozs7Ozs7Ozs7Ozs7QUM5Qk8sU0FBUyxZQUFZLE9BQU87QUFDL0IsUUFBTSxtQkFBbUI7QUFDekIsUUFBTSxZQUFZO0FBRWxCLE1BQUksT0FBTztBQUVYLFdBQVMsSUFBSSxHQUFHLElBQUksTUFBTSxRQUFRLEtBQUssR0FBRztBQUN0QyxVQUFNLFdBQVcsTUFBTSxXQUFXLENBQUM7QUFDbkMsWUFBUTtBQUNSLFdBQU8sS0FBSyxLQUFLLE1BQU0sU0FBUztBQUFBLEVBQ3BDO0FBR0EsU0FBUSxTQUFTO0FBQ3JCOzs7Ozs7Ozs7Ozs7Ozs7O0FDakI0QjtBQUVyQixTQUFTLFFBQVEsT0FBTztBQUUzQixTQUFPLG1EQUFXLENBQUMsS0FBSyxFQUNuQixTQUFTLEVBQUUsRUFDWCxTQUFTLEdBQUcsR0FBRztBQUN4QjtBQUVPLFNBQVMsaUJBQWlCLE9BQU8sZUFBZSxVQUFVO0FBQzdELFNBQU8sUUFBUSxRQUFRLEtBQUssSUFBSTtBQUNwQzs7Ozs7Ozs7Ozs7Ozs7QUNYTyxNQUFNLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU9uQixLQUFLLENBQUMsS0FBSyxlQUFlLFNBQVM7QUFDL0IsUUFBSTtBQUNBLGFBQU8sWUFBWSxLQUFLLFlBQVk7QUFBQSxJQUN4QyxTQUFTLE9BQU87QUFDWixjQUFRLEtBQUssOEJBQThCLEdBQUcsTUFBTSxLQUFLO0FBQ3pELGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBUUEsS0FBSyxDQUFDLEtBQUssVUFBVTtBQUNqQixRQUFJO0FBQ0Esa0JBQVksS0FBSyxLQUFLO0FBQ3RCLGFBQU87QUFBQSxJQUNYLFNBQVMsT0FBTztBQUNaLGNBQVEsS0FBSyw4QkFBOEIsR0FBRyxNQUFNLEtBQUs7QUFDekQsYUFBTztBQUFBLElBQ1g7QUFBQSxFQUNKO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVNBLFFBQVEsQ0FBQyxLQUFLLFVBQVUsZUFBZSxTQUFTO0FBQzVDLFFBQUk7QUFDQSxZQUFNLGVBQWUsUUFBUSxJQUFJLEtBQUssWUFBWTtBQUNsRCxZQUFNLFdBQVcsU0FBUyxZQUFZO0FBQ3RDLGNBQVEsSUFBSSxLQUFLLFFBQVE7QUFDekIsYUFBTztBQUFBLElBQ1gsU0FBUyxPQUFPO0FBQ1osY0FBUSxLQUFLLGlDQUFpQyxHQUFHLE1BQU0sS0FBSztBQUM1RCxhQUFPLFFBQVEsSUFBSSxLQUFLLFlBQVk7QUFBQSxJQUN4QztBQUFBLEVBQ0o7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFPQSxRQUFRLENBQUMsUUFBUTtBQUNiLFFBQUk7QUFDQSxxQkFBZSxHQUFHO0FBQ2xCLGFBQU87QUFBQSxJQUNYLFNBQVMsT0FBTztBQUNaLGNBQVEsS0FBSyxpQ0FBaUMsR0FBRyxNQUFNLEtBQUs7QUFDNUQsYUFBTztBQUFBLElBQ1g7QUFBQSxFQUNKO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBT0EsS0FBSyxDQUFDLFFBQVE7QUFDVixRQUFJO0FBQ0EsYUFBTyxRQUFRLEtBQUssRUFBRSxTQUFTLEdBQUc7QUFBQSxJQUN0QyxTQUFTLE9BQU87QUFDWixjQUFRLEtBQUssOEJBQThCLEdBQUcsTUFBTSxLQUFLO0FBQ3pELGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFNQSxNQUFNLE1BQU07QUFDUixRQUFJO0FBQ0EsYUFBTyxjQUFjO0FBQUEsSUFDekIsU0FBUyxPQUFPO0FBQ1osY0FBUSxLQUFLLHVCQUF1QixLQUFLO0FBQ3pDLGFBQU8sQ0FBQztBQUFBLElBQ1o7QUFBQSxFQUNKO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBT0EsT0FBTyxDQUFDLGVBQWUsU0FBUztBQUM1QixRQUFJO0FBQ0EsWUFBTSxVQUFVLGdCQUFnQixRQUFRLEtBQUs7QUFDN0MsY0FBUSxRQUFRLENBQUMsUUFBUSxlQUFlLEdBQUcsQ0FBQztBQUM1QyxhQUFPO0FBQUEsSUFDWCxTQUFTLE9BQU87QUFDWixjQUFRLEtBQUssd0JBQXdCLEtBQUs7QUFDMUMsYUFBTztBQUFBLElBQ1g7QUFBQSxFQUNKO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFRQSxhQUFhLENBQUMsVUFBVSxlQUFlLFNBQVM7QUFDNUMsVUFBTSxTQUFTLENBQUM7QUFDaEIsYUFBUyxRQUFRLENBQUMsUUFBUTtBQUN0QixhQUFPLEdBQUcsSUFBSSxRQUFRLElBQUksS0FBSyxZQUFZO0FBQUEsSUFDL0MsQ0FBQztBQUNELFdBQU87QUFBQSxFQUNYO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBT0EsYUFBYSxDQUFDLFNBQVM7QUFDbkIsUUFBSTtBQUNBLGFBQU8sUUFBUSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsS0FBSyxLQUFLLE1BQU07QUFDM0Msb0JBQVksS0FBSyxLQUFLO0FBQUEsTUFDMUIsQ0FBQztBQUNELGFBQU87QUFBQSxJQUNYLFNBQVMsT0FBTztBQUNaLGNBQVEsS0FBSyw4QkFBOEIsS0FBSztBQUNoRCxhQUFPO0FBQUEsSUFDWDtBQUFBLEVBQ0o7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFPQSxnQkFBZ0IsQ0FBQyxpQkFBaUI7QUFDOUIsUUFBSSxDQUFDLE1BQU0sUUFBUSxZQUFZLEtBQUssYUFBYSxXQUFXLEdBQUc7QUFDM0QsY0FBUSxLQUFLLGdFQUFnRTtBQUM3RSxhQUFPO0FBQUEsSUFDWDtBQUVBLFFBQUk7QUFDQSxtQkFBYSxRQUFRLENBQUMsUUFBUSxlQUFlLEdBQUcsQ0FBQztBQUNqRCxhQUFPO0FBQUEsSUFDWCxTQUFTLE9BQU87QUFDWixjQUFRLEtBQUssaUNBQWlDLEtBQUs7QUFDbkQsYUFBTztBQUFBLElBQ1g7QUFBQSxFQUNKO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU1BLE9BQU8sTUFBTTtBQUNULFFBQUk7QUFDQSxhQUFPLFFBQVEsS0FBSyxFQUFFO0FBQUEsSUFDMUIsU0FBUyxPQUFPO0FBQ1osY0FBUSxLQUFLLHdCQUF3QixLQUFLO0FBQzFDLGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFNQSxRQUFRLE1BQU07QUFDVixRQUFJO0FBQ0EsWUFBTSxVQUFVLFFBQVEsS0FBSztBQUM3QixZQUFNLFNBQVMsQ0FBQztBQUNoQixjQUFRLFFBQVEsQ0FBQyxRQUFRO0FBQ3JCLGVBQU8sR0FBRyxJQUFJLFlBQVksR0FBRztBQUFBLE1BQ2pDLENBQUM7QUFDRCxhQUFPO0FBQUEsSUFDWCxTQUFTLE9BQU87QUFDWixjQUFRLEtBQUsseUJBQXlCLEtBQUs7QUFDM0MsYUFBTyxDQUFDO0FBQUEsSUFDWjtBQUFBLEVBQ0o7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFPQSxVQUFVLENBQUMsZUFBZSxVQUFVO0FBQ2hDLFFBQUksaUJBQWlCLE1BQU07QUFDdkIsY0FBUSxLQUFLLCtEQUErRDtBQUM1RSxhQUFPO0FBQUEsSUFDWDtBQUVBLFFBQUk7QUFDQSxZQUFNLFVBQVUsUUFBUSxLQUFLO0FBQzdCLGNBQVEsUUFBUSxDQUFDLFFBQVEsZUFBZSxHQUFHLENBQUM7QUFDNUMsYUFBTztBQUFBLElBQ1gsU0FBUyxPQUFPO0FBQ1osY0FBUSxLQUFLLDJCQUEyQixLQUFLO0FBQzdDLGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFNQSxTQUFTLE1BQU07QUFDWCxRQUFJO0FBQ0EsYUFBTyxRQUFRLEtBQUssRUFBRSxXQUFXO0FBQUEsSUFDckMsU0FBUyxPQUFPO0FBQ1osY0FBUSxLQUFLLDBCQUEwQixLQUFLO0FBQzVDLGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDSjtBQUNKOzs7Ozs7Ozs7Ozs7Ozs7O0FDaE9PLFNBQVMsa0JBQWtCLFVBQVUsZUFBZSxVQUFVLFlBQVksT0FBTztBQUNwRixRQUFNLEVBQUUsU0FBUyxJQUFJLE9BQU87QUFFNUIsU0FBTyxtQkFBbUIsVUFBVSxVQUFVLGNBQWMsU0FBUztBQUN6RTtBQUVPLFNBQVMsbUJBQW1CLFVBQVUsVUFBVSxjQUFjLFlBQVksT0FBTztBQUNwRixRQUFNLGVBQWUsU0FBUyxNQUFNLEdBQUc7QUFFdkMsYUFBVyxXQUFXLElBQUksYUFBYSxTQUFTLFdBQVc7QUFDM0QsUUFBTSxjQUFjLGFBQWEsUUFBUSxLQUFLO0FBRTlDLE1BQUksVUFBVyxTQUFRLElBQUkscUJBQXFCLFdBQVcsRUFBRTtBQUU3RCxTQUFPO0FBQ1g7QUFFTyxTQUFTLHdCQUF3QixVQUFVLGVBQWUsVUFBVSxZQUFZLE9BQU87QUFDMUYsUUFBTSxjQUFjLGtCQUFrQixVQUFVLElBQUksU0FBUztBQUU3RCxTQUFPLHFCQUFxQixhQUFhLGNBQWMsU0FBUztBQUNwRTtBQUVBLFNBQVMscUJBQXFCLGFBQWEsY0FBYyxXQUFXO0FBQ2hFLE1BQUksQ0FBQyxZQUFhLFFBQU87QUFFekIsUUFBTSxvQkFBb0IsWUFBWSxNQUFNLEdBQUcsRUFDMUMsR0FBRyxFQUFFO0FBRVYsTUFBSSxVQUFXLFNBQVEsSUFBSSw0QkFBNEIsaUJBQWlCLEVBQUU7QUFFMUUsU0FBTztBQUNYO0FBRU8sU0FBUyx5QkFBeUIsVUFBVSxVQUFVLGVBQWUsVUFBVSxZQUFZLE9BQU87QUFDckcsUUFBTSxjQUFjLG1CQUFtQixVQUFVLFVBQVUsSUFBSSxTQUFTO0FBRXhFLFNBQU8scUJBQXFCLGFBQWEsY0FBYyxTQUFTO0FBQ3BFO0FBRU8sU0FBUyxpQkFBaUIsTUFBTTtBQUNuQyxRQUFNLGNBQWMsSUFBSSxnQkFBZ0IsT0FBTyxTQUFTLE1BQU07QUFDOUQsU0FBTyxZQUFZLElBQUksSUFBSTtBQUMvQjtBQUVPLFNBQVMsaUJBQWlCLE1BQU07QUFDbkMsU0FBTyxLQUFLLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDNUI7QUFFTyxTQUFTLGlCQUFpQixjQUFjO0FBQzNDLFNBQU8sT0FBTyxTQUFTLFNBQVMsU0FBUyxZQUFZO0FBQ3pEO0FBRU8sU0FBUyxxQkFBcUIsZUFBZTtBQUNoRCxTQUFPLGNBQWMsS0FBSyxDQUFDLGlCQUFpQixpQkFBaUIsWUFBWSxDQUFDO0FBQzlFO0FBRU8sU0FBUyxzQkFBc0IsY0FBYztBQUNoRCxRQUFNLGVBQWUsT0FBTyxTQUFTLFNBQVMsTUFBTSxHQUFHO0FBRXZELFNBQU8sYUFBYSxLQUFLLENBQUMsZ0JBQWdCLGdCQUFnQixZQUFZO0FBQzFFO0FBRU8sU0FBUywwQkFBMEIsYUFBYTtBQUNuRCxNQUFJO0FBQ0EsVUFBTSxNQUFNLElBQUksSUFBSSxPQUFPLFNBQVMsSUFBSTtBQUN4QyxXQUFPLFFBQVEsV0FBVyxFQUNyQixRQUFRLENBQUMsQ0FBQyxLQUFLLEtBQUssTUFBTTtBQUN2QixVQUFJLGFBQWEsSUFBSSxLQUFLLEtBQUs7QUFBQSxJQUNuQyxDQUFDO0FBQ0wsV0FBTyxTQUFTLE9BQU8sSUFBSSxTQUFTO0FBQUEsRUFDeEMsU0FBUyxPQUFPO0FBQ1osWUFBUSxNQUFNLHVCQUF1QixLQUFLO0FBQUEsRUFDOUM7QUFDSjtBQUVPLFNBQVMsV0FBVyxVQUFVLG1CQUFtQixDQUFDLEdBQUc7QUFDeEQsUUFBTSxZQUFZLEVBQUUsVUFBVSxPQUFPLFNBQVMsU0FBUztBQUN2RCxtQkFBaUIsUUFBUSxDQUFDLFFBQVE7QUFDOUIsY0FBVSxHQUFHLElBQUksaUJBQWlCLEdBQUc7QUFBQSxFQUN6QyxDQUFDO0FBRUQsV0FBUyxrQkFBa0I7QUFDdkIsVUFBTSxlQUFlLEVBQUUsVUFBVSxPQUFPLFNBQVMsU0FBUztBQUMxRCxxQkFBaUIsUUFBUSxDQUFDLFFBQVE7QUFDOUIsbUJBQWEsR0FBRyxJQUFJLGlCQUFpQixHQUFHO0FBQUEsSUFDNUMsQ0FBQztBQUVELFFBQUksT0FBTyxLQUFLLFNBQVMsRUFDcEIsS0FBSyxDQUFDLFFBQVEsVUFBVSxHQUFHLE1BQU0sYUFBYSxHQUFHLENBQUMsR0FBRztBQUN0RCxlQUFTO0FBQUEsSUFDYjtBQUFBLEVBQ0o7QUFFQSxNQUFJLFVBQVUsT0FBTyxTQUFTO0FBQzlCLGNBQVksTUFBTTtBQUNkLFFBQUksT0FBTyxTQUFTLFNBQVMsU0FBUztBQUNsQyxnQkFBVSxPQUFPLFNBQVM7QUFDMUIsc0JBQWdCO0FBQUEsSUFDcEI7QUFBQSxFQUNKLEdBQUcsR0FBRztBQUVOLFNBQU8saUJBQWlCLFlBQVksZUFBZTtBQUN2RDtBQUVPLFNBQVMsb0JBQW9CLG1CQUFtQixDQUFDLEdBQUc7QUFDdkQsYUFBVyxNQUFNLE9BQU8sU0FBUyxPQUFPLEdBQUcsZ0JBQWdCO0FBQy9EOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzR21CO0FBQ1k7QUFDbUI7QUFDTDtBQUNoQjtBQUNJO0FBRWpDLFlBQVksbURBQU07QUFFbEIsdUJBQXVCLDJHQUFzQixNQUFNO0FBQy9DLFFBQU0sUUFBUSxPQUFPLDRFQUFnQjtBQUNyQyxNQUFJLFVBQVUsS0FBTTtBQUVwQixNQUFJLFVBQVUsSUFBSTtBQUNkLFFBQUksUUFBUSw0SkFBK0IsR0FBRztBQUMxQyx1REFBVyxDQUFDLGlCQUFpQjtBQUFBLElBQ2pDO0FBQ0E7QUFBQSxFQUNKO0FBRUEsUUFBTSxXQUFXLE9BQU8sa0ZBQWlCO0FBQ3pDLE1BQUksYUFBYSxLQUFNO0FBRXZCLE1BQUksYUFBYSxJQUFJO0FBQ2pCLFFBQUksUUFBUSw0SkFBK0IsR0FBRztBQUMxQyx1REFBVyxDQUFDLGlCQUFpQjtBQUFBLElBQ2pDO0FBQ0E7QUFBQSxFQUNKO0FBRUEsbURBQVcsQ0FBQyxlQUFlLE9BQU8sUUFBUTtBQUM5QyxDQUFDO0FBRUQsdUJBQXVCLGtIQUF3QixNQUFNO0FBQ2pELFFBQU0sY0FBYyxxREFBZSxDQUFDLGFBQWEsS0FBSztBQUV0RCxRQUFNLE9BQU8sT0FBTyw2R0FBd0IsV0FBVztBQUN2RCxNQUFJLFNBQVMsS0FBTTtBQUVuQixNQUFJLEtBQUssS0FBSyxNQUFNLElBQUk7QUFDcEIsUUFBSSxRQUFRLDJMQUFxQyxHQUFHO0FBQ2hELDJEQUFlLENBQUMsZUFBZTtBQUMvQixhQUFPLFNBQVMsT0FBTztBQUFBLElBQzNCO0FBQ0E7QUFBQSxFQUNKO0FBRUEsdURBQWUsQ0FBQyxhQUFhLElBQUk7QUFDakMsU0FBTyxTQUFTLE9BQU87QUFDM0IsQ0FBQztBQUVELE1BQU0sWUFBWTtBQUFBLEVBQ2Qsd0JBQXdCO0FBQzVCO0FBRUEsTUFBTSxTQUFTO0FBQ2YsdURBQVUsQ0FBQyxRQUFRO0FBRW5CLGVBQWUsV0FBVztBQUN0QixNQUFJLGtFQUFxQixDQUFDLE9BQU8sR0FBRztBQUNoQyxVQUFNLGNBQWM7QUFDcEI7QUFBQSxFQUNKO0FBRUEsUUFBTSxpQkFBaUI7QUFDdkIsUUFBTSxXQUFXO0FBRWpCLE1BQUksa0VBQXFCLENBQUMsYUFBYSxHQUFHO0FBQ3RDLFVBQU0sZUFBZTtBQUFBLEVBQ3pCO0FBQ0o7QUFFQSxlQUFlLGdCQUFnQjtBQUMzQixRQUFNLFlBQVksTUFBTSxpRUFBYyxDQUFDLFVBQVUsMkJBQTJCO0FBQzVFLFFBQU0saUJBQWlCLFNBQVM7QUFDcEM7QUFFQSxlQUFlLGlCQUFpQixXQUFXO0FBQ3ZDLE1BQUksQ0FBQyxpREFBVyxDQUFDLGVBQWUsRUFBRztBQUVuQyxRQUFNLEVBQUUsT0FBTyxTQUFTLElBQUksaURBQVcsQ0FBQyxlQUFlO0FBRXZELFFBQU0sYUFBYSxNQUFNLGlFQUFjLENBQUMsV0FBVyx5QkFBeUI7QUFDNUUsUUFBTSxnQkFBZ0IsTUFBTSxpRUFBYyxDQUFDLFdBQVcsNEJBQTRCO0FBQ2xGLFFBQU0sY0FBYyxNQUFNLGlFQUFjLENBQUMsV0FBVyw0QkFBNEI7QUFDaEYsTUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFhO0FBRW5ELGFBQVcsUUFBUTtBQUNuQixhQUFXLGNBQWMsSUFBSSxNQUFNLFNBQVMsRUFBRSxTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQzlELGFBQVcsY0FBYyxJQUFJLE1BQU0sVUFBVSxFQUFFLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFFL0QsZ0JBQWMsUUFBUTtBQUN0QixnQkFBYyxjQUFjLElBQUksTUFBTSxTQUFTLEVBQUUsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUNqRSxnQkFBYyxjQUFjLElBQUksTUFBTSxVQUFVLEVBQUUsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUVsRSxjQUFZLE1BQU07QUFDdEI7QUFFQSxlQUFlLG1CQUFtQjtBQUM5QixRQUFNLFlBQVkscURBQWUsQ0FBQyxhQUFhO0FBQy9DLE1BQUksQ0FBQyxVQUFXO0FBRWhCLFFBQU0sY0FBYyxNQUFNLGlFQUFjLENBQUMsVUFBVSxnQkFBZ0I7QUFDbkUsY0FBWSxjQUFjO0FBQzlCO0FBRUEsZUFBZSxhQUFhO0FBQ3hCLFFBQU0sZUFBZSxNQUFNLGlFQUFjLENBQUMsVUFBVSx5QkFBeUI7QUFDN0UsUUFBTSxtQkFBbUIsYUFBYSxRQUFRLGNBQWM7QUFDNUQsTUFBSSxvQkFBb0IsQ0FBQyxpQkFBaUIsVUFBVSxTQUFTLHVCQUF1QixHQUFHO0FBQ25GLGlCQUFhLE1BQU07QUFBQSxFQUN2QjtBQUNKO0FBRUEsZUFBZSxpQkFBaUI7QUFDNUIsTUFBSSxjQUFjLFNBQVMsZUFBZSxVQUFVLHNCQUFzQjtBQUMxRSxNQUFJLFlBQWE7QUFFakIsUUFBTSwwQkFBMEIsTUFBTSxpRUFBYztBQUFkLElBQ2xDO0FBQUEsSUFBVTtBQUFBLEVBQ2Q7QUFFQSxnQkFBYyxTQUFTLGNBQWMsT0FBTztBQUM1QyxjQUFZLGFBQWEsUUFBUSxNQUFNO0FBQ3ZDLGNBQVksYUFBYSxlQUFlLCtJQUE0QjtBQUNwRSxjQUFZLGFBQWEsTUFBTSxVQUFVLHNCQUFzQjtBQUUvRCwwQkFBd0IsV0FBVztBQUFBLElBQy9CO0FBQUEsSUFBYSx3QkFBd0I7QUFBQSxFQUN6QztBQUVBLGNBQVksaUJBQWlCLFNBQVMsTUFBTTtBQUN4QyxVQUFNLGNBQWMsWUFBWTtBQUNoQyxVQUFNLGVBQWUsd0VBQWdCLENBQUMsV0FBVztBQUVqRCxVQUFNLG1CQUFtQixTQUFTLGNBQWMscUJBQXFCO0FBQ3JFLFFBQUksQ0FBQyxpQkFBa0I7QUFFdkIsVUFBTSxPQUFPLGlCQUFpQixpQkFBaUIsVUFBVTtBQUN6RCxTQUFLLFFBQVEsQ0FBQyxRQUFRO0FBQ2xCLFlBQU0sYUFBYSxJQUFJLGNBQWMsa0JBQWtCO0FBQ3ZELFVBQUksWUFBWTtBQUNaLGNBQU0saUJBQWlCLFdBQVc7QUFDbEMsWUFBSSxNQUFNLFVBQVUsb0VBQVksQ0FBQyxnQkFBZ0IsWUFBWSxJQUFJLEtBQUs7QUFBQSxNQUMxRTtBQUFBLElBQ0osQ0FBQztBQUFBLEVBQ0wsQ0FBQztBQUNMOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkp3QjtBQUNBO0FBS3hCLE1BQU0sV0FBVyxjQUFjLDZEQUFPLENBQUMsT0FBTyxTQUFTLFFBQVEsQ0FBQztBQUNoRSxNQUFNLGVBQWUsWUFBWSw2REFBTyxDQUFDLE9BQU8sU0FBUyxRQUFRLENBQUM7QUFRbEUsTUFBTSxlQUFlLENBQUMsU0FBUztBQUMzQixNQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUUsV0FBVyxHQUFHO0FBQ2hDLHdEQUFPLENBQUMsT0FBTyxZQUFZO0FBQUEsRUFDL0IsT0FBTztBQUNILHdEQUFPLENBQUMsSUFBSSxjQUFjLElBQUk7QUFBQSxFQUNsQztBQUNKO0FBTU8sTUFBTSxjQUFjO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUt2QixnQkFBZ0IsTUFBTTtBQUNsQixVQUFNLE9BQU8sb0RBQU8sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDO0FBQ3JDLFdBQU87QUFBQSxNQUNILE9BQU8sS0FBSyxTQUFTO0FBQUEsTUFDckIsVUFBVSxLQUFLLFlBQVk7QUFBQSxJQUMvQjtBQUFBLEVBQ0o7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFPQSxnQkFBZ0IsQ0FBQyxPQUFPLGFBQWE7QUFDakMsVUFBTSxpQkFBaUI7QUFBQSxNQUNuQixPQUFPLE9BQU8sU0FBUyxFQUFFLEVBQUUsS0FBSztBQUFBLE1BQ2hDLFVBQVUsT0FBTyxZQUFZLEVBQUUsRUFBRSxLQUFLO0FBQUEsSUFDMUM7QUFDQSx3REFBTyxDQUFDLElBQUksVUFBVSxjQUFjO0FBQUEsRUFDeEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTUEsZ0JBQWdCLE1BQU07QUFDbEIsVUFBTSxFQUFFLE9BQU8sU0FBUyxJQUFJLFlBQVksZUFBZTtBQUN2RCxXQUFPLFFBQVEsU0FBUyxRQUFRO0FBQUEsRUFDcEM7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLGtCQUFrQixNQUFNO0FBQ3BCLHdEQUFPLENBQUMsT0FBTyxRQUFRO0FBQUEsRUFDM0I7QUFDSjtBQUtPLE1BQU0sa0JBQWtCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUszQixjQUFjLE1BQU07QUFDaEIsVUFBTSxPQUFPLG9EQUFPLENBQUMsSUFBSSxjQUFjLENBQUMsQ0FBQztBQUN6QyxXQUFPLEtBQUs7QUFBQSxFQUNoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFNQSxjQUFjLENBQUMsU0FBUztBQUNwQixVQUFNLE9BQU8sb0RBQU8sQ0FBQyxJQUFJLGNBQWMsQ0FBQyxDQUFDO0FBQ3pDLFVBQU0saUJBQWlCLE9BQU8sUUFBUSxFQUFFLEVBQUUsS0FBSztBQUUvQyxRQUFJLGdCQUFnQjtBQUNoQixXQUFLLFlBQVk7QUFBQSxJQUNyQixPQUFPO0FBQ0gsYUFBTyxLQUFLO0FBQUEsSUFDaEI7QUFFQSxpQkFBYSxJQUFJO0FBQUEsRUFDckI7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLGdCQUFnQixNQUFNO0FBQ2xCLFVBQU0sT0FBTyxvREFBTyxDQUFDLElBQUksY0FBYyxDQUFDLENBQUM7QUFDekMsV0FBTyxLQUFLO0FBQ1osaUJBQWEsSUFBSTtBQUFBLEVBQ3JCO0FBQ0o7Ozs7Ozs7Ozs7Ozs7O0FDNUdBLGlFQUFlLHNCQUFzQixZQUFZLFlBQVksYUFBYSxtQkFBbUIsNkJBQTZCLGNBQWMsR0FBRyxFOzs7Ozs7VUNBM0k7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7OztXQUdBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLElBQUk7V0FDSjtXQUNBO1dBQ0EsSUFBSTtXQUNKOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxDQUFDO1dBQ0Q7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUU7V0FDRjtXQUNBLHNHQUFzRztXQUN0RztXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRTs7Ozs7V0N4RUE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztVRUFBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9kb20vbG9nZ2luZy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL2RvbS91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL2ZpbHRlci9jb21wYXJlLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vZmlsdGVyL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9oYXNoL2ZudjFhLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vaGFzaC9oZWxwZXJzLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vc3RvcmFnZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL3VybC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMva2VlbmV0aWMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tlZW5ldGljL3N0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tlZW5ldGljL3N0eWxlcy5jc3MiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvYXN5bmMgbW9kdWxlIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IElTX0RFQlVHID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCc7XG5cbmZ1bmN0aW9uIGxvZ0lmRGVidWcoLi4uYXJncykge1xuICAgIGlmICghSVNfREVCVUcpIHJldHVybjtcbiAgICBjb25zb2xlLmxvZyguLi5hcmdzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ0VsZW1lbnRTZWFyY2goc2VsZWN0b3IsIHBhcmVudE5vZGUsIHJlc3VsdCkge1xuICAgIGNvbnN0IGZvdW5kID0gcmVzdWx0IGluc3RhbmNlb2YgTm9kZUxpc3QgPyByZXN1bHQubGVuZ3RoID4gMCA6IEJvb2xlYW4ocmVzdWx0KTtcblxuICAgIGxvZ0lmRGVidWcoXG4gICAgICAgIGAke2ZvdW5kID8gJ+KchSBGb3VuZCBlbGVtZW50JyA6ICfinYwgTm90IGZvdW5kIGVsZW1lbnQnfWAsXG4gICAgICAgICdcXG4g4pSc4pSAIFNlbGVjdG9yOicsXG4gICAgICAgIGBcIiR7c2VsZWN0b3J9XCJgLFxuICAgICAgICAnXFxuIOKUnOKUgCBQYXJlbnQ6JyxcbiAgICAgICAgcGFyZW50Tm9kZSxcbiAgICAgICAgJ1xcbiDilJTilIAgUmVzdWx0OicsXG4gICAgICAgIHJlc3VsdCxcbiAgICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9nRWxlbWVudFdhaXQoc2VsZWN0b3IsIHBhcmVudE5vZGUpIHtcbiAgICBsb2dJZkRlYnVnKFxuICAgICAgICAn4o+zIFdhaXRpbmcgZm9yIGVsZW1lbnQnLFxuICAgICAgICAnXFxuIOKUnOKUgCBTZWxlY3RvcjonLFxuICAgICAgICBgXCIke3NlbGVjdG9yfVwiYCxcbiAgICAgICAgJ1xcbiDilJTilIAgUGFyZW50OicsXG4gICAgICAgIHBhcmVudE5vZGUsXG4gICAgKTtcbn1cbiIsImltcG9ydCB7IGxvZ0VsZW1lbnRTZWFyY2gsIGxvZ0VsZW1lbnRXYWl0IH0gZnJvbSAnLi9sb2dnaW5nJztcblxuZXhwb3J0IGZ1bmN0aW9uIHdhaXRGb3JFbGVtZW50KHBhcmVudE5vZGUsIHNlbGVjdG9yLCB0aW1lb3V0ID0gbnVsbCwgbG9nT25EZWJ1ZyA9IGZhbHNlKSB7XG4gICAgY29uc3QgZXhpc3RpbmdFbGVtZW50ID0gcGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICBpZiAoZXhpc3RpbmdFbGVtZW50KSB7XG4gICAgICAgIGlmIChsb2dPbkRlYnVnKSBsb2dFbGVtZW50U2VhcmNoKHNlbGVjdG9yLCBwYXJlbnROb2RlLCBleGlzdGluZ0VsZW1lbnQpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGV4aXN0aW5nRWxlbWVudCk7XG4gICAgfVxuXG4gICAgaWYgKGxvZ09uRGVidWcpIGxvZ0VsZW1lbnRXYWl0KHNlbGVjdG9yLCBwYXJlbnROb2RlKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKG11dGF0aW9uQ2FsbGJhY2spO1xuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKHBhcmVudE5vZGUsIHtcbiAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCB0aW1lb3V0SWQ7XG4gICAgICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICAgICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGxvZ09uRGVidWcpIGxvZ0VsZW1lbnRTZWFyY2goc2VsZWN0b3IsIHBhcmVudE5vZGUsIG51bGwpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgICAgICB9LCB0aW1lb3V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG11dGF0aW9uQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gcGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmICghZWxlbWVudCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBpZiAodGltZW91dElkKSBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIGlmIChsb2dPbkRlYnVnKSBsb2dFbGVtZW50U2VhcmNoKHNlbGVjdG9yLCBwYXJlbnROb2RlLCBlbGVtZW50KTtcbiAgICAgICAgICAgIHJlc29sdmUoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdhaXRVbnRpbEVsZW1lbnRHb25lKHBhcmVudE5vZGUsIHNlbGVjdG9yKSB7XG4gICAgY29uc3QgZXhpc3RpbmdFbGVtZW50ID0gcGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICBpZiAoIWV4aXN0aW5nRWxlbWVudCkgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIobXV0YXRpb25DYWxsYmFjayk7XG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUocGFyZW50Tm9kZSwge1xuICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZnVuY3Rpb24gbXV0YXRpb25DYWxsYmFjaygpIHtcbiAgICAgICAgICAgIGlmIChwYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpKSByZXR1cm47XG5cbiAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2FpdFVudGlsRWxlbWVudFN0YWJpbGl6ZWQoZWxlbWVudCwgdGltZW91dCA9IDQwMCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBsZXQgdGltZW91dElkO1xuXG4gICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgICAgICBzY2hlZHVsZUNvbXBsZXRpb24oKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZnVuY3Rpb24gc2NoZWR1bGVDb21wbGV0aW9uKCkge1xuICAgICAgICAgICAgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2NoZWR1bGVDb21wbGV0aW9uKCk7XG5cbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50LCB7XG4gICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQgPSAyNTApIHtcbiAgICBsZXQgdGltZW91dElkO1xuICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpLCB3YWl0KTtcbiAgICB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcnVuV2hlblZpc2libGUoY2FsbGJhY2spIHtcbiAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAndmlzaWJsZScpIHtcbiAgICAgICAgYXdhaXQgY2FsbGJhY2soKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ3Zpc2libGUnKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgeyBvbmNlOiB0cnVlIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJ1bk9uY2VPbkludGVyc2VjdGlvbihlbGVtZW50LCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKChlbnRyaWVzKSA9PiB7XG4gICAgICAgIGVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgICAgICAgIGlmICghZW50cnkuaXNJbnRlcnNlY3RpbmcpIHJldHVybjtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICBjbGVhckludGVyc2VjdGlvbk9ic2VydmVyKGVsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGVsZW1lbnQuaW50ZXJzZWN0aW9uT2JzZXJ2ZXIgPSBvYnNlcnZlcjtcbiAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJJbnRlcnNlY3Rpb25PYnNlcnZlcihlbGVtZW50KSB7XG4gICAgaWYgKCFlbGVtZW50LmludGVyc2VjdGlvbk9ic2VydmVyKSByZXR1cm47XG5cbiAgICBlbGVtZW50LmludGVyc2VjdGlvbk9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICBlbGVtZW50LmludGVyc2VjdGlvbk9ic2VydmVyID0gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyT2JzZXJ2ZXIob2JzZXJ2ZXIpIHtcbiAgICBpZiAoIW9ic2VydmVyKSByZXR1cm47XG4gICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgIG9ic2VydmVyID0gbnVsbDtcbn1cbiIsImltcG9ydCB7IHBhcnNlRmlsdGVyUXVlcnkgfSBmcm9tICcuL2hlbHBlcnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNNYXRjaFRleHRGaWx0ZXIocGFyYW1ldGVyVmFsdWUsIGZpbHRlclZhbHVlKSB7XG4gICAgaWYgKCFmaWx0ZXJWYWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgY29uc3QgcmVxdWlyZW1lbnRzID0gcGFyc2VGaWx0ZXJRdWVyeShmaWx0ZXJWYWx1ZSk7XG4gICAgcmV0dXJuIG1hdGNoZXNRdWVyeShwYXJhbWV0ZXJWYWx1ZSwgcmVxdWlyZW1lbnRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hdGNoZXNRdWVyeSh0ZXh0LCByZXF1aXJlbWVudHMpIHtcbiAgICBpZiAoIXJlcXVpcmVtZW50cyB8fCAhcmVxdWlyZW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRydWU7XG5cbiAgICBjb25zdCBub3JtYWxpemVkVGV4dCA9ICh0ZXh0IHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgcmV0dXJuIHJlcXVpcmVtZW50cy5ldmVyeSgoZ3JvdXApID0+IGNoZWNrR3JvdXBNYXRjaChub3JtYWxpemVkVGV4dCwgZ3JvdXApKTtcbn1cblxuZnVuY3Rpb24gY2hlY2tHcm91cE1hdGNoKHRleHQsIGdyb3VwQ29uZGl0aW9ucykge1xuICAgIHJldHVybiBncm91cENvbmRpdGlvbnMuc29tZSgoeyB0ZXJtLCBpc05lZ2F0aXZlIH0pID0+IHtcbiAgICAgICAgY29uc3QgaW5jbHVkZXMgPSB0ZXh0LmluY2x1ZGVzKHRlcm0pO1xuICAgICAgICByZXR1cm4gaXNOZWdhdGl2ZSA/ICFpbmNsdWRlcyA6IGluY2x1ZGVzO1xuICAgIH0pO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRmlsdGVyUXVlcnkocXVlcnlTdHJpbmcpIHtcbiAgICBpZiAoIXF1ZXJ5U3RyaW5nKSByZXR1cm4gW107XG5cbiAgICByZXR1cm4gcXVlcnlTdHJpbmcudG9Mb3dlckNhc2UoKVxuICAgICAgICAuc3BsaXQoJywnKVxuICAgICAgICAubWFwKHBhcnNlR3JvdXApXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG59XG5cbmZ1bmN0aW9uIHBhcnNlR3JvdXAoZ3JvdXBTdHJpbmcpIHtcbiAgICBjb25zdCB0b2tlbnMgPSBncm91cFN0cmluZy5zcGxpdCgnLycpXG4gICAgICAgIC5tYXAoKHMpID0+IHMudHJpbSgpKVxuICAgICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgaWYgKHRva2Vucy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgY29uZGl0aW9ucyA9IHRva2Vuc1xuICAgICAgICAubWFwKGNyZWF0ZUNvbmRpdGlvbilcbiAgICAgICAgLmZpbHRlcihCb29sZWFuKTtcblxuICAgIHJldHVybiBjb25kaXRpb25zLmxlbmd0aCA+IDAgPyBjb25kaXRpb25zIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29uZGl0aW9uKHJhd1Rva2VuKSB7XG4gICAgY29uc3QgaXNOZWdhdGl2ZSA9IHJhd1Rva2VuLnN0YXJ0c1dpdGgoJyEnKTtcbiAgICBjb25zdCB0ZXJtID0gaXNOZWdhdGl2ZSA/IHJhd1Rva2VuLnNsaWNlKDEpLnRyaW0oKSA6IHJhd1Rva2VuO1xuXG4gICAgaWYgKCF0ZXJtKSByZXR1cm4gbnVsbDtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHRlcm0sXG4gICAgICAgIGlzTmVnYXRpdmUsXG4gICAgfTtcbn1cblxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tYml0d2lzZSAqL1xuXG4vLyBGTlYtMWEgaGFzaCBmdW5jdGlvbiAoMzItYml0IHZlcnNpb24pXG5leHBvcnQgZnVuY3Rpb24gZm52MWFIYXNoMzIoaW5wdXQpIHtcbiAgICBjb25zdCBGTlZfT0ZGU0VUX0JBU0lTID0gMjE2NjEzNjI2MTsgLy8gSW5pdGlhbCBGTlYtMWEgaGFzaCB2YWx1ZSAoMzItYml0KVxuICAgIGNvbnN0IEZOVl9QUklNRSA9IDE2Nzc3NjE5OyAvLyBUaGUgcHJpbWUgbXVsdGlwbGllciBmb3IgdGhlIGhhc2ggZnVuY3Rpb25cblxuICAgIGxldCBoYXNoID0gRk5WX09GRlNFVF9CQVNJUztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgY2hhckNvZGUgPSBpbnB1dC5jaGFyQ29kZUF0KGkpOyAvLyBHZXQgdGhlIGNoYXJhY3RlciBjb2RlXG4gICAgICAgIGhhc2ggXj0gY2hhckNvZGU7IC8vIFhPUiB0aGUgaGFzaCB3aXRoIHRoZSBjaGFyYWN0ZXIgY29kZVxuICAgICAgICBoYXNoID0gTWF0aC5pbXVsKGhhc2gsIEZOVl9QUklNRSk7IC8vIE11bHRpcGx5IGJ5IHRoZSBGTlYgcHJpbWVcbiAgICB9XG5cbiAgICAvLyBDb25zdHJhaW4gaGFzaCB0byAzMiBiaXRzXG4gICAgcmV0dXJuIChoYXNoID4+PiAwKTtcbn1cbiIsImltcG9ydCB7IGZudjFhSGFzaDMyIH0gZnJvbSAnLi9mbnYxYSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIYXNoKHZhbHVlKSB7XG4gICAgLy8gQ29udmVydCB0byBoZXgsIGFuZCBlbnN1cmUgaXQgaGFzIDggY2hhcmFjdGVyc1xuICAgIHJldHVybiBmbnYxYUhhc2gzMih2YWx1ZSlcbiAgICAgICAgLnRvU3RyaW5nKDE2KVxuICAgICAgICAucGFkU3RhcnQoOCwgJzAnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEhhc2hPckRlZmF1bHQodmFsdWUsIGRlZmF1bHRWYWx1ZSA9ICdjb21tb24nKSB7XG4gICAgcmV0dXJuIHZhbHVlID8gZ2V0SGFzaCh2YWx1ZSkgOiBkZWZhdWx0VmFsdWU7XG59XG4iLCJleHBvcnQgY29uc3Qgc3RvcmFnZSA9IHtcbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LXQvdC40LUg0LTQsNC90L3Ri9GFINC40LcgR00gc3RvcmFnZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSDQutC70Y7Rh1xuICAgICAqIEBwYXJhbSB7Kn0gZGVmYXVsdFZhbHVlIC0g0LfQvdCw0YfQtdC90LjQtSDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxuICAgICAqIEByZXR1cm5zIHsqfSDQt9C90LDRh9C10L3QuNC1INC40LvQuCBkZWZhdWx0VmFsdWVcbiAgICAgKi9cbiAgICBnZXQ6IChrZXksIGRlZmF1bHRWYWx1ZSA9IG51bGwpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBHTV9nZXRWYWx1ZShrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFN0b3JhZ2UgZ2V0IGVycm9yIGZvciBrZXkgXCIke2tleX1cIjpgLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCh0L7RhdGA0LDQvdC10L3QuNC1INC00LDQvdC90YvRhSDQsiBHTSBzdG9yYWdlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtINC60LvRjtGHXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSAtINC30L3QsNGH0LXQvdC40LUgKNC70Y7QsdC+0Lkg0YLQuNC/KVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSDRg9GB0L/QtdGI0L3QvtGB0YLRjCDQvtC/0LXRgNCw0YbQuNC4XG4gICAgICovXG4gICAgc2V0OiAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgR01fc2V0VmFsdWUoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgU3RvcmFnZSBzZXQgZXJyb3IgZm9yIGtleSBcIiR7a2V5fVwiOmAsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdGD0YnQtdGB0YLQstGD0Y7RidC40YUg0LTQsNC90L3Ri9GFINGH0LXRgNC10Lcg0YTRg9C90LrRhtC40Y5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0g0LrQu9GO0YdcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSB1cGRhdGVGbiAtINGE0YPQvdC60YbQuNGPINC+0LHQvdC+0LLQu9C10L3QuNGPICjQv9C+0LvRg9GH0LDQtdGCINGC0LXQutGD0YnQtdC1INC30L3QsNGH0LXQvdC40LUsINCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINC90L7QstC+0LUpXG4gICAgICogQHBhcmFtIHsqfSBkZWZhdWx0VmFsdWUgLSDQt9C90LDRh9C10L3QuNC1INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC10YHQu9C4INC60LvRjtGHINC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YJcbiAgICAgKiBAcmV0dXJucyB7Kn0g0L3QvtCy0L7QtSDQt9C90LDRh9C10L3QuNC1XG4gICAgICovXG4gICAgdXBkYXRlOiAoa2V5LCB1cGRhdGVGbiwgZGVmYXVsdFZhbHVlID0gbnVsbCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFZhbHVlID0gc3RvcmFnZS5nZXQoa2V5LCBkZWZhdWx0VmFsdWUpO1xuICAgICAgICAgICAgY29uc3QgbmV3VmFsdWUgPSB1cGRhdGVGbihjdXJyZW50VmFsdWUpO1xuICAgICAgICAgICAgc3RvcmFnZS5zZXQoa2V5LCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gbmV3VmFsdWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFN0b3JhZ2UgdXBkYXRlIGVycm9yIGZvciBrZXkgXCIke2tleX1cIjpgLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmFnZS5nZXQoa2V5LCBkZWZhdWx0VmFsdWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCj0LTQsNC70LXQvdC40LUg0LTQsNC90L3Ri9GFINC40LcgR00gc3RvcmFnZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSDQutC70Y7Rh1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSDRg9GB0L/QtdGI0L3QvtGB0YLRjCDQvtC/0LXRgNCw0YbQuNC4XG4gICAgICovXG4gICAgcmVtb3ZlOiAoa2V5KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBHTV9kZWxldGVWYWx1ZShrZXkpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFN0b3JhZ2UgcmVtb3ZlIGVycm9yIGZvciBrZXkgXCIke2tleX1cIjpgLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0J/RgNC+0LLQtdGA0LrQsCDRgdGD0YnQtdGB0YLQstC+0LLQsNC90LjRjyDQutC70Y7Rh9CwXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtINC60LvRjtGHXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaGFzOiAoa2V5KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmFnZS5rZXlzKCkuaW5jbHVkZXMoa2V5KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgU3RvcmFnZSBoYXMgZXJyb3IgZm9yIGtleSBcIiR7a2V5fVwiOmAsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LXQvdC40LUg0LLRgdC10YUg0LrQu9GO0YfQtdC5XG4gICAgICogQHJldHVybnMge3N0cmluZ1tdfSDQvNCw0YHRgdC40LIg0LrQu9GO0YfQtdC5XG4gICAgICovXG4gICAga2V5czogKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIEdNX2xpc3RWYWx1ZXMoKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSBrZXlzIGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQntGH0LjRgdGC0LrQsCDQtNCw0L3QvdGL0YUg0YHQutGA0LjQv9GC0LBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBrZXlzVG9SZW1vdmUgLSDQvNCw0YHRgdC40LIg0LrQu9GO0YfQtdC5INC00LvRjyDRg9C00LDQu9C10L3QuNGPXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59INGD0YHQv9C10YjQvdC+0YHRgtGMINC+0L/QtdGA0LDRhtC40LhcbiAgICAgKi9cbiAgICBjbGVhcjogKGtleXNUb1JlbW92ZSA9IG51bGwpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGFsbEtleXMgPSBrZXlzVG9SZW1vdmUgfHwgc3RvcmFnZS5rZXlzKCk7XG4gICAgICAgICAgICBhbGxLZXlzLmZvckVhY2goKGtleSkgPT4gR01fZGVsZXRlVmFsdWUoa2V5KSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSBjbGVhciBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0JzQsNGB0YHQvtCy0L7QtSDQv9C+0LvRg9GH0LXQvdC40LUg0LTQsNC90L3Ri9GFXG4gICAgICogQHBhcmFtIHtzdHJpbmdbXX0ga2V5c0xpc3QgLSDQvNCw0YHRgdC40LIg0LrQu9GO0YfQtdC5XG4gICAgICogQHBhcmFtIHsqfSBkZWZhdWx0VmFsdWUgLSDQt9C90LDRh9C10L3QuNC1INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC00LvRjyDQvtGC0YHRg9GC0YHRgtCy0YPRjtGJ0LjRhSDQutC70Y7Rh9C10LlcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSDQvtCx0YrQtdC60YIg0YEg0L/QsNGA0LDQvNC4INC60LvRjtGHLdC30L3QsNGH0LXQvdC40LVcbiAgICAgKi9cbiAgICBnZXRNdWx0aXBsZTogKGtleXNMaXN0LCBkZWZhdWx0VmFsdWUgPSBudWxsKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgICAgICBrZXlzTGlzdC5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gc3RvcmFnZS5nZXQoa2V5LCBkZWZhdWx0VmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0JzQsNGB0YHQvtCy0L7QtSDRgdC+0YXRgNCw0L3QtdC90LjQtSDQtNCw0L3QvdGL0YVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtINC+0LHRitC10LrRgiDRgSDQv9Cw0YDQsNC80Lgg0LrQu9GO0Yct0LfQvdCw0YfQtdC90LjQtVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSDRg9GB0L/QtdGI0L3QvtGB0YLRjCDQstGB0LXRhSDQvtC/0LXRgNCw0YbQuNC5XG4gICAgICovXG4gICAgc2V0TXVsdGlwbGU6IChkYXRhKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyhkYXRhKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICAgICAgICBHTV9zZXRWYWx1ZShrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2Ugc2V0TXVsdGlwbGUgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCj0LTQsNC70LXQvdC40LUg0L3QtdGB0LrQvtC70YzQutC40YUg0LrQu9GO0YfQtdC5XG4gICAgICogQHBhcmFtIHtzdHJpbmdbXX0ga2V5c1RvUmVtb3ZlIC0g0LzQsNGB0YHQuNCyINC60LvRjtGH0LXQuSDQtNC70Y8g0YPQtNCw0LvQtdC90LjRjyAo0L7QsdGP0LfQsNGC0LXQu9GM0L3Ri9C5INC/0LDRgNCw0LzQtdGC0YApXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59INGD0YHQv9C10YjQvdC+0YHRgtGMINC+0L/QtdGA0LDRhtC40LhcbiAgICAgKi9cbiAgICByZW1vdmVNdWx0aXBsZTogKGtleXNUb1JlbW92ZSkgPT4ge1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoa2V5c1RvUmVtb3ZlKSB8fCBrZXlzVG9SZW1vdmUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgcmVtb3ZlTXVsdGlwbGU6IGtleXNUb1JlbW92ZSBtdXN0IGJlIGEgbm9uLWVtcHR5IGFycmF5Jyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAga2V5c1RvUmVtb3ZlLmZvckVhY2goKGtleSkgPT4gR01fZGVsZXRlVmFsdWUoa2V5KSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSByZW1vdmVNdWx0aXBsZSBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0J/QvtC70YPRh9C10L3QuNC1INC60L7Qu9C40YfQtdGB0YLQstCwINGB0L7RhdGA0LDQvdC10L3QvdGL0YUg0LrQu9GO0YfQtdC5XG4gICAgICogQHJldHVybnMge251bWJlcn0g0LrQvtC70LjRh9C10YHRgtCy0L4g0LrQu9GO0YfQtdC5XG4gICAgICovXG4gICAgY291bnQ6ICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yYWdlLmtleXMoKS5sZW5ndGg7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgY291bnQgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0J/QvtC70YPRh9C10L3QuNC1INCy0YHQtdGFINC00LDQvdC90YvRhSDQsiDQstC40LTQtSDQvtCx0YrQtdC60YLQsFxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9INC+0LHRitC10LrRgiDRgdC+INCy0YHQtdC80Lgg0YHQvtGF0YDQsNC90LXQvdC90YvQvNC4INC00LDQvdC90YvQvNC4XG4gICAgICovXG4gICAgZ2V0QWxsOiAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBhbGxLZXlzID0gc3RvcmFnZS5rZXlzKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAgICAgICAgIGFsbEtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBHTV9nZXRWYWx1ZShrZXkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIGdldEFsbCBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0J7Qn9CQ0KHQndCeOiDQntGH0LjRgdGC0LrQsCDQstGB0LXRhSDQtNCw0L3QvdGL0YUg0YHQutGA0LjQv9GC0LBcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmZpcm1DbGVhciAtINC+0LHRj9C30LDRgtC10LvRjNC90YvQuSDRhNC70LDQsyDQv9C+0LTRgtCy0LXRgNC20LTQtdC90LjRjyAo0LTQvtC70LbQtdC9INCx0YvRgtGMIHRydWUpXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59INGD0YHQv9C10YjQvdC+0YHRgtGMINC+0L/QtdGA0LDRhtC40LhcbiAgICAgKi9cbiAgICBjbGVhckFsbDogKGNvbmZpcm1DbGVhciA9IGZhbHNlKSA9PiB7XG4gICAgICAgIGlmIChjb25maXJtQ2xlYXIgIT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSBjbGVhckFsbDogY29uZmlybUNsZWFyIG11c3QgYmUgZXhwbGljaXRseSBzZXQgdG8gdHJ1ZScpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGFsbEtleXMgPSBzdG9yYWdlLmtleXMoKTtcbiAgICAgICAgICAgIGFsbEtleXMuZm9yRWFjaCgoa2V5KSA9PiBHTV9kZWxldGVWYWx1ZShrZXkpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIGNsZWFyQWxsIGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQn9GA0L7QstC10YDQutCwINC/0YPRgdGC0L7RgtGLINGF0YDQsNC90LjQu9C40YnQsFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlINC10YHQu9C4INGF0YDQsNC90LjQu9C40YnQtSDQv9GD0YHRgtC+0LVcbiAgICAgKi9cbiAgICBpc0VtcHR5OiAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmFnZS5rZXlzKCkubGVuZ3RoID09PSAwO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIGlzRW1wdHkgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxufTtcbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRVUkxQYXRoRWxlbWVudChwb3NpdGlvbiwgZGVmYXVsdFZhbHVlID0gJ2NvbW1vbicsIGxvZ1Jlc3VsdCA9IGZhbHNlKSB7XG4gICAgY29uc3QgeyBwYXRobmFtZSB9ID0gd2luZG93LmxvY2F0aW9uO1xuXG4gICAgcmV0dXJuIGdldFBhdGhuYW1lRWxlbWVudChwYXRobmFtZSwgcG9zaXRpb24sIGRlZmF1bHRWYWx1ZSwgbG9nUmVzdWx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhdGhuYW1lRWxlbWVudChwYXRobmFtZSwgcG9zaXRpb24sIGRlZmF1bHRWYWx1ZSwgbG9nUmVzdWx0ID0gZmFsc2UpIHtcbiAgICBjb25zdCBwYXRoRWxlbWVudHMgPSBwYXRobmFtZS5zcGxpdCgnLycpO1xuXG4gICAgcG9zaXRpb24gPSBwb3NpdGlvbiA8IDAgPyBwYXRoRWxlbWVudHMubGVuZ3RoICsgcG9zaXRpb24gOiBwb3NpdGlvbjtcbiAgICBjb25zdCBwYXRoRWxlbWVudCA9IHBhdGhFbGVtZW50c1twb3NpdGlvbl0gfHwgZGVmYXVsdFZhbHVlO1xuXG4gICAgaWYgKGxvZ1Jlc3VsdCkgY29uc29sZS5sb2coYFBhdGhuYW1lIGVsZW1lbnQ6ICR7cGF0aEVsZW1lbnR9YCk7XG5cbiAgICByZXR1cm4gcGF0aEVsZW1lbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVUkxQYXRoRWxlbWVudEVuZGluZyhwb3NpdGlvbiwgZGVmYXVsdFZhbHVlID0gJ2NvbW1vbicsIGxvZ1Jlc3VsdCA9IGZhbHNlKSB7XG4gICAgY29uc3QgcGF0aEVsZW1lbnQgPSBnZXRVUkxQYXRoRWxlbWVudChwb3NpdGlvbiwgJycsIGxvZ1Jlc3VsdCk7XG5cbiAgICByZXR1cm4gZ2V0UGF0aEVsZW1lbnRFbmRpbmcocGF0aEVsZW1lbnQsIGRlZmF1bHRWYWx1ZSwgbG9nUmVzdWx0KTtcbn1cblxuZnVuY3Rpb24gZ2V0UGF0aEVsZW1lbnRFbmRpbmcocGF0aEVsZW1lbnQsIGRlZmF1bHRWYWx1ZSwgbG9nUmVzdWx0KSB7XG4gICAgaWYgKCFwYXRoRWxlbWVudCkgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICAgIGNvbnN0IHBhdGhFbGVtZW50RW5kaW5nID0gcGF0aEVsZW1lbnQuc3BsaXQoJy0nKVxuICAgICAgICAuYXQoLTEpO1xuXG4gICAgaWYgKGxvZ1Jlc3VsdCkgY29uc29sZS5sb2coYFBhdGhuYW1lIGVsZW1lbnQgZW5kaW5nOiAke3BhdGhFbGVtZW50RW5kaW5nfWApO1xuXG4gICAgcmV0dXJuIHBhdGhFbGVtZW50RW5kaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGF0aG5hbWVFbGVtZW50RW5kaW5nKHBhdGhuYW1lLCBwb3NpdGlvbiwgZGVmYXVsdFZhbHVlID0gJ2NvbW1vbicsIGxvZ1Jlc3VsdCA9IGZhbHNlKSB7XG4gICAgY29uc3QgcGF0aEVsZW1lbnQgPSBnZXRQYXRobmFtZUVsZW1lbnQocGF0aG5hbWUsIHBvc2l0aW9uLCAnJywgbG9nUmVzdWx0KTtcblxuICAgIHJldHVybiBnZXRQYXRoRWxlbWVudEVuZGluZyhwYXRoRWxlbWVudCwgZGVmYXVsdFZhbHVlLCBsb2dSZXN1bHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VVJMUXVlcnlQYXJhbShuYW1lKSB7XG4gICAgY29uc3QgcXVlcnlQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuICAgIHJldHVybiBxdWVyeVBhcmFtcy5nZXQobmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhclF1ZXJ5UGFyYW1zKGxpbmspIHtcbiAgICByZXR1cm4gbGluay5zcGxpdCgnPycpWzBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGF0aG5hbWVJbmNsdWRlcyhzZWFyY2hTdHJpbmcpIHtcbiAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKHNlYXJjaFN0cmluZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXRobmFtZUluY2x1ZGVzU29tZShzZWFyY2hTdHJpbmdzKSB7XG4gICAgcmV0dXJuIHNlYXJjaFN0cmluZ3Muc29tZSgoc2VhcmNoU3RyaW5nKSA9PiBwYXRobmFtZUluY2x1ZGVzKHNlYXJjaFN0cmluZykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc29tZVBhdGhFbGVtZW50RXF1YWxzKHNlYXJjaFN0cmluZykge1xuICAgIGNvbnN0IHBhdGhFbGVtZW50cyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpO1xuXG4gICAgcmV0dXJuIHBhdGhFbGVtZW50cy5zb21lKChwYXRoRWxlbWVudCkgPT4gcGF0aEVsZW1lbnQgPT09IHNlYXJjaFN0cmluZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRRdWVyeVBhcmFtc0FuZFJlZGlyZWN0KHF1ZXJ5UGFyYW1zKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHF1ZXJ5UGFyYW1zKVxuICAgICAgICAgICAgLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsLnRvU3RyaW5nKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHJlZGlyZWN0OicsIGVycm9yKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvYnNlcnZlVVJMKGNhbGxiYWNrLCB3YXRjaFF1ZXJ5UGFyYW1zID0gW10pIHtcbiAgICBjb25zdCBsYXN0U3RhdGUgPSB7IHBhdGhuYW1lOiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgfTtcbiAgICB3YXRjaFF1ZXJ5UGFyYW1zLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBsYXN0U3RhdGVba2V5XSA9IGdldFVSTFF1ZXJ5UGFyYW0oa2V5KTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGhhbmRsZVVSTENoYW5nZSgpIHtcbiAgICAgICAgY29uc3QgY3VycmVudFN0YXRlID0geyBwYXRobmFtZTogd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lIH07XG4gICAgICAgIHdhdGNoUXVlcnlQYXJhbXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICBjdXJyZW50U3RhdGVba2V5XSA9IGdldFVSTFF1ZXJ5UGFyYW0oa2V5KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGxhc3RTdGF0ZSlcbiAgICAgICAgICAgIC5zb21lKChrZXkpID0+IGxhc3RTdGF0ZVtrZXldICE9PSBjdXJyZW50U3RhdGVba2V5XSkpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgbGFzdFVSTCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmICE9PSBsYXN0VVJMKSB7XG4gICAgICAgICAgICBsYXN0VVJMID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgICAgICAgICBoYW5kbGVVUkxDaGFuZ2UoKTtcbiAgICAgICAgfVxuICAgIH0sIDIwMCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBoYW5kbGVVUkxDaGFuZ2UpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb2JzZXJ2ZVVSTEZvclJlbG9hZCh3YXRjaFF1ZXJ5UGFyYW1zID0gW10pIHtcbiAgICBvYnNlcnZlVVJMKCgpID0+IHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKSwgd2F0Y2hRdWVyeVBhcmFtcyk7XG59XG4iLCJpbXBvcnQgc3R5bGVzIGZyb20gJy4vc3R5bGVzLmNzcyc7XG5pbXBvcnQgeyB3YWl0Rm9yRWxlbWVudCB9IGZyb20gJy4uL2NvbW1vbi9kb20vdXRpbHMnO1xuaW1wb3J0IHsgb2JzZXJ2ZVVSTCwgc29tZVBhdGhFbGVtZW50RXF1YWxzIH0gZnJvbSAnLi4vY29tbW9uL3VybCc7XG5pbXBvcnQgeyBhdXRoU3RvcmFnZSwgc2V0dGluZ3NTdG9yYWdlIH0gZnJvbSAnLi9zdG9yYWdlJztcbmltcG9ydCB7IG1hdGNoZXNRdWVyeSB9IGZyb20gJy4uL2NvbW1vbi9maWx0ZXIvY29tcGFyZSc7XG5pbXBvcnQgeyBwYXJzZUZpbHRlclF1ZXJ5IH0gZnJvbSAnLi4vY29tbW9uL2ZpbHRlci9oZWxwZXJzJztcblxuR01fYWRkU3R5bGUoc3R5bGVzKTtcblxuR01fcmVnaXN0ZXJNZW51Q29tbWFuZCgn0J3QsNGB0YLRgNC+0LjRgtGMINCw0LLRgtC+0LLRhdC+0LQnLCAoKSA9PiB7XG4gICAgY29uc3QgbG9naW4gPSBwcm9tcHQoJ9CS0LLQtdC00LjRgtC1INC70L7Qs9C40L06Jyk7XG4gICAgaWYgKGxvZ2luID09PSBudWxsKSByZXR1cm47XG5cbiAgICBpZiAobG9naW4gPT09ICcnKSB7XG4gICAgICAgIGlmIChjb25maXJtKCfQo9C00LDQu9C40YLRjCDQtNCw0L3QvdGL0LUg0LTQu9GPINCw0LLRgtC+0LLRhdC+0LTQsD8nKSkge1xuICAgICAgICAgICAgYXV0aFN0b3JhZ2UuY2xlYXJDcmVkZW50aWFscygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYXNzd29yZCA9IHByb21wdCgn0JLQstC10LTQuNGC0LUg0L/QsNGA0L7Qu9GMOicpO1xuICAgIGlmIChwYXNzd29yZCA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgaWYgKHBhc3N3b3JkID09PSAnJykge1xuICAgICAgICBpZiAoY29uZmlybSgn0KPQtNCw0LvQuNGC0Ywg0LTQsNC90L3Ri9C1INC00LvRjyDQsNCy0YLQvtCy0YXQvtC00LA/JykpIHtcbiAgICAgICAgICAgIGF1dGhTdG9yYWdlLmNsZWFyQ3JlZGVudGlhbHMoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXV0aFN0b3JhZ2Uuc2V0Q3JlZGVudGlhbHMobG9naW4sIHBhc3N3b3JkKTtcbn0pO1xuXG5HTV9yZWdpc3Rlck1lbnVDb21tYW5kKCfQndCw0YHRgtGA0L7QuNGC0Ywg0LjQvNGPINC80L7QtNC10LvQuCcsICgpID0+IHtcbiAgICBjb25zdCBjdXJyZW50TmFtZSA9IHNldHRpbmdzU3RvcmFnZS5nZXRNb2RlbE5hbWUoKSB8fCAnJztcblxuICAgIGNvbnN0IG5hbWUgPSBwcm9tcHQoJ9CS0LLQtdC00LjRgtC1INC40LzRjyDRgNC+0YPRgtC10YDQsDonLCBjdXJyZW50TmFtZSk7XG4gICAgaWYgKG5hbWUgPT09IG51bGwpIHJldHVybjtcblxuICAgIGlmIChuYW1lLnRyaW0oKSA9PT0gJycpIHtcbiAgICAgICAgaWYgKGNvbmZpcm0oJ9Ch0LHRgNC+0YHQuNGC0Ywg0LjQvNGPINC80L7QtNC10LvQuCDQvdCwINGB0YLQsNC90LTQsNGA0YLQvdC+0LU/JykpIHtcbiAgICAgICAgICAgIHNldHRpbmdzU3RvcmFnZS5jbGVhck1vZGVsTmFtZSgpO1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzZXR0aW5nc1N0b3JhZ2Uuc2V0TW9kZWxOYW1lKG5hbWUpO1xuICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbn0pO1xuXG5jb25zdCBDT05TVEFOVFMgPSB7XG4gICAgREVWSUNFX0ZJTFRFUl9JTlBVVF9JRDogJ2RldmljZS1maWx0ZXItaW5wdXQnLFxufTtcblxuYXdhaXQgaW5pdE1vZHMoKTtcbm9ic2VydmVVUkwoaW5pdE1vZHMpO1xuXG5hc3luYyBmdW5jdGlvbiBpbml0TW9kcygpIHtcbiAgICBpZiAoc29tZVBhdGhFbGVtZW50RXF1YWxzKCdsb2dpbicpKSB7XG4gICAgICAgIGF3YWl0IGxvZ2luUGFnZUNvZGUoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGF3YWl0IHVwZGF0ZUhlYWRlclRleHQoKTtcbiAgICBhd2FpdCBleHBhbmRNZW51KCk7XG5cbiAgICBpZiAoc29tZVBhdGhFbGVtZW50RXF1YWxzKCdkZXZpY2VzTGlzdCcpKSB7XG4gICAgICAgIGF3YWl0IGFkZEZpbHRlckZpZWxkKCk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBsb2dpblBhZ2VDb2RlKCkge1xuICAgIGNvbnN0IGxvZ2luRm9ybSA9IGF3YWl0IHdhaXRGb3JFbGVtZW50KGRvY3VtZW50LCAnbmR3LWZvcm0ubG9naW4tZm9ybV9fZm9ybScpO1xuICAgIGF3YWl0IGF1dG9GaWxsQW5kTG9naW4obG9naW5Gb3JtKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gYXV0b0ZpbGxBbmRMb2dpbihsb2dpbkZvcm0pIHtcbiAgICBpZiAoIWF1dGhTdG9yYWdlLmhhc0NyZWRlbnRpYWxzKCkpIHJldHVybjtcblxuICAgIGNvbnN0IHsgbG9naW4sIHBhc3N3b3JkIH0gPSBhdXRoU3RvcmFnZS5nZXRDcmVkZW50aWFscygpO1xuXG4gICAgY29uc3QgbG9naW5JbnB1dCA9IGF3YWl0IHdhaXRGb3JFbGVtZW50KGxvZ2luRm9ybSwgJ2lucHV0W25hbWU9XCJsb2dpbl9rZXlcIl0nKTtcbiAgICBjb25zdCBwYXNzd29yZElucHV0ID0gYXdhaXQgd2FpdEZvckVsZW1lbnQobG9naW5Gb3JtLCAnaW5wdXRbbmFtZT1cInBhc3N3b3JkX2tleVwiXScpO1xuICAgIGNvbnN0IGxvZ2luQnV0dG9uID0gYXdhaXQgd2FpdEZvckVsZW1lbnQobG9naW5Gb3JtLCAnYnV0dG9uLm5kdy1idXR0b24tLXByaW1hcnknKTtcbiAgICBpZiAoIWxvZ2luSW5wdXQgfHwgIXBhc3N3b3JkSW5wdXQgfHwgIWxvZ2luQnV0dG9uKSByZXR1cm47XG5cbiAgICBsb2dpbklucHV0LnZhbHVlID0gbG9naW47XG4gICAgbG9naW5JbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgIGxvZ2luSW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG5cbiAgICBwYXNzd29yZElucHV0LnZhbHVlID0gcGFzc3dvcmQ7XG4gICAgcGFzc3dvcmRJbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgIHBhc3N3b3JkSW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG5cbiAgICBsb2dpbkJ1dHRvbi5jbGljaygpO1xufVxuXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVIZWFkZXJUZXh0KCkge1xuICAgIGNvbnN0IG1vZGVsTmFtZSA9IHNldHRpbmdzU3RvcmFnZS5nZXRNb2RlbE5hbWUoKTtcbiAgICBpZiAoIW1vZGVsTmFtZSkgcmV0dXJuO1xuXG4gICAgY29uc3QgaGVhZGVyTW9kZWwgPSBhd2FpdCB3YWl0Rm9yRWxlbWVudChkb2N1bWVudCwgJy5oZWFkZXJfX21vZGVsJyk7XG4gICAgaGVhZGVyTW9kZWwudGV4dENvbnRlbnQgPSBtb2RlbE5hbWU7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGV4cGFuZE1lbnUoKSB7XG4gICAgY29uc3QgdG9nZ2xlQnV0dG9uID0gYXdhaXQgd2FpdEZvckVsZW1lbnQoZG9jdW1lbnQsICcubWVudS10b2dnbGVfX2NvbnRhaW5lcicpO1xuICAgIGNvbnN0IHRvZ2dsZUJ1dHRvbldyYXAgPSB0b2dnbGVCdXR0b24uY2xvc2VzdCgnLm1lbnUtdG9nZ2xlJyk7XG4gICAgaWYgKHRvZ2dsZUJ1dHRvbldyYXAgJiYgIXRvZ2dsZUJ1dHRvbldyYXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdtZW51LXRvZ2dsZS0tZXhwYW5kZWQnKSkge1xuICAgICAgICB0b2dnbGVCdXR0b24uY2xpY2soKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGFkZEZpbHRlckZpZWxkKCkge1xuICAgIGxldCBmaWx0ZXJJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5ERVZJQ0VfRklMVEVSX0lOUFVUX0lEKTtcbiAgICBpZiAoZmlsdGVySW5wdXQpIHJldHVybjtcblxuICAgIGNvbnN0IHJlZ2lzdGVyZWREZXZpY2VzSGVhZGVyID0gYXdhaXQgd2FpdEZvckVsZW1lbnQoXG4gICAgICAgIGRvY3VtZW50LCAnW2xhYmVsPVwiZGV2aWNlcy1saXN0Lm9mZmxpbmUtZGV2aWNlLXJlZ2lzdHJhdGlvbi5yZWdpc3Rlci1idG5cIl0nLFxuICAgICk7XG5cbiAgICBmaWx0ZXJJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgZmlsdGVySW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICBmaWx0ZXJJbnB1dC5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgJ9Ck0LjQu9GM0YLRgCDQv9C+INC40LzQtdC90Lgg0YPRgdGC0YDQvtC50YHRgtCy0LAnKTtcbiAgICBmaWx0ZXJJbnB1dC5zZXRBdHRyaWJ1dGUoJ2lkJywgQ09OU1RBTlRTLkRFVklDRV9GSUxURVJfSU5QVVRfSUQpO1xuXG4gICAgcmVnaXN0ZXJlZERldmljZXNIZWFkZXIucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoXG4gICAgICAgIGZpbHRlcklucHV0LCByZWdpc3RlcmVkRGV2aWNlc0hlYWRlci5uZXh0U2libGluZyxcbiAgICApO1xuXG4gICAgZmlsdGVySW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbHRlclZhbHVlID0gZmlsdGVySW5wdXQudmFsdWU7XG4gICAgICAgIGNvbnN0IHJlcXVpcmVtZW50cyA9IHBhcnNlRmlsdGVyUXVlcnkoZmlsdGVyVmFsdWUpOyAvLyDQn9Cw0YDRgdC40Lwg0L7QtNC40L0g0YDQsNC3XG5cbiAgICAgICAgY29uc3QgZGV2aWNlc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZWdpc3RlcmVkLWRldmljZXMnKTtcbiAgICAgICAgaWYgKCFkZXZpY2VzQ29udGFpbmVyKSByZXR1cm47XG5cbiAgICAgICAgY29uc3Qgcm93cyA9IGRldmljZXNDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgndGJvZHkgdHInKTtcbiAgICAgICAgcm93cy5mb3JFYWNoKChyb3cpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRldmljZU5hbWUgPSByb3cucXVlcnlTZWxlY3RvcignLmNlbGxfX2hvc3QtbmFtZScpO1xuICAgICAgICAgICAgaWYgKGRldmljZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZXZpY2VOYW1lVGV4dCA9IGRldmljZU5hbWUudGV4dENvbnRlbnQ7XG4gICAgICAgICAgICAgICAgcm93LnN0eWxlLmRpc3BsYXkgPSBtYXRjaGVzUXVlcnkoZGV2aWNlTmFtZVRleHQsIHJlcXVpcmVtZW50cykgPyAnJyA6ICdub25lJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgeyBzdG9yYWdlIH0gZnJvbSAnLi4vY29tbW9uL3N0b3JhZ2UnO1xuaW1wb3J0IHsgZ2V0SGFzaCB9IGZyb20gJy4uL2NvbW1vbi9oYXNoL2hlbHBlcnMnO1xuXG4vKipcbiAqINCT0LXQvdC10YDQuNGA0YPQtdC8INGD0L3QuNC60LDQu9GM0L3Ri9C5INC60LvRjtGHINC00LvRjyDRgtC10LrRg9GJ0LXQs9C+INC00L7QvNC10L3QsC5cbiAqL1xuY29uc3QgQVVUSF9LRVkgPSBgYXV0aF9jcmVkc18ke2dldEhhc2god2luZG93LmxvY2F0aW9uLmhvc3RuYW1lKX1gO1xuY29uc3QgU0VUVElOR1NfS0VZID0gYHNldHRpbmdzXyR7Z2V0SGFzaCh3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUpfWA7XG5cbi8qKlxuICog0KTRg9C90LrRhtC40Y8g0LTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPINC90LDRgdGC0YDQvtC10LouXG4gKiDQldGB0LvQuCDQvtCx0YrQtdC60YIg0LTQsNC90L3Ri9GFINC/0YPRgdGC0L7QuSwg0YPQtNCw0LvRj9C10YIg0LrQu9GO0Ycg0LjQtyDRhdGA0LDQvdC40LvQuNGJ0LAg0YbQtdC70LjQutC+0LwuXG4gKiDQmNC90LDRh9C1INGB0L7RhdGA0LDQvdGP0LXRgiDQvtCx0L3QvtCy0LvQtdC90L3Ri9C5INC+0LHRitC10LrRgi5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gKi9cbmNvbnN0IHNhdmVTZXR0aW5ncyA9IChkYXRhKSA9PiB7XG4gICAgaWYgKE9iamVjdC5rZXlzKGRhdGEpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBzdG9yYWdlLnJlbW92ZShTRVRUSU5HU19LRVkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHN0b3JhZ2Uuc2V0KFNFVFRJTkdTX0tFWSwgZGF0YSk7XG4gICAgfVxufTtcblxuLyoqXG4gKiDQntCx0YrQtdC60YIg0LTQu9GPINGA0LDQsdC+0YLRiyDRgSDQtNCw0L3QvdGL0LzQuCDQsNCy0YLQvtGA0LjQt9Cw0YbQuNC4LlxuICog0KXRgNCw0L3QuNGCIHsgbG9naW4sIHBhc3N3b3JkIH0g0LIg0L7QtNC90L7QvCBKU09OLdC+0LHRitC10LrRgtC1LlxuICovXG5leHBvcnQgY29uc3QgYXV0aFN0b3JhZ2UgPSB7XG4gICAgLyoqXG4gICAgICog0J/QvtC70YPRh9Cw0LXRgiDQv9C+0LvQvdGL0LUg0LTQsNC90L3Ri9C1INCw0LLRgtC+0YDQuNC30LDRhtC40LhcbiAgICAgKiBAcmV0dXJucyB7e2xvZ2luOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmd9fVxuICAgICAqL1xuICAgIGdldENyZWRlbnRpYWxzOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBzdG9yYWdlLmdldChBVVRIX0tFWSwge30pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbG9naW46IGRhdGEubG9naW4gfHwgJycsXG4gICAgICAgICAgICBwYXNzd29yZDogZGF0YS5wYXNzd29yZCB8fCAnJyxcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0KHQvtGF0YDQsNC90Y/QtdGCINC00LDQvdC90YvQtSDQsNCy0YLQvtGA0LjQt9Cw0YbQuNC4INCw0YLQvtC80LDRgNC90L5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbG9naW5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGFzc3dvcmRcbiAgICAgKi9cbiAgICBzZXRDcmVkZW50aWFsczogKGxvZ2luLCBwYXNzd29yZCkgPT4ge1xuICAgICAgICBjb25zdCBub3JtYWxpemVkRGF0YSA9IHtcbiAgICAgICAgICAgIGxvZ2luOiBTdHJpbmcobG9naW4gfHwgJycpLnRyaW0oKSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBTdHJpbmcocGFzc3dvcmQgfHwgJycpLnRyaW0oKSxcbiAgICAgICAgfTtcbiAgICAgICAgc3RvcmFnZS5zZXQoQVVUSF9LRVksIG5vcm1hbGl6ZWREYXRhKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0J/RgNC+0LLQtdGA0Y/QtdGCLCDQtdGB0YLRjCDQu9C4INC/0L7Qu9C90YvQtSDQtNCw0L3QvdGL0LUg0LTQu9GPINCw0LLRgtC+0YDQuNC30LDRhtC40LhcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBoYXNDcmVkZW50aWFsczogKCkgPT4ge1xuICAgICAgICBjb25zdCB7IGxvZ2luLCBwYXNzd29yZCB9ID0gYXV0aFN0b3JhZ2UuZ2V0Q3JlZGVudGlhbHMoKTtcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4obG9naW4gJiYgcGFzc3dvcmQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQo9C00LDQu9GP0LXRgiDQstGB0LUg0LTQsNC90L3Ri9C1INCw0LLRgtC+0YDQuNC30LDRhtC40Lgg0LTQu9GPINGC0LXQutGD0YnQtdCz0L4g0LTQvtC80LXQvdCwXG4gICAgICovXG4gICAgY2xlYXJDcmVkZW50aWFsczogKCkgPT4ge1xuICAgICAgICBzdG9yYWdlLnJlbW92ZShBVVRIX0tFWSk7XG4gICAgfSxcbn07XG5cbi8qKlxuICog0J7QsdGK0LXQutGCINC00LvRjyDRgNCw0LHQvtGC0Ysg0YEg0L3QsNGB0YLRgNC+0LnQutCw0LzQuCDQuNC90YLQtdGA0YTQtdC50YHQsC5cbiAqL1xuZXhwb3J0IGNvbnN0IHNldHRpbmdzU3RvcmFnZSA9IHtcbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LDQtdGCINC60LDRgdGC0L7QvNC90L7QtSDQuNC80Y8g0LzQvtC00LXQu9C4XG4gICAgICogQHJldHVybnMge3N0cmluZ3x1bmRlZmluZWR9XG4gICAgICovXG4gICAgZ2V0TW9kZWxOYW1lOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBzdG9yYWdlLmdldChTRVRUSU5HU19LRVksIHt9KTtcbiAgICAgICAgcmV0dXJuIGRhdGEubW9kZWxOYW1lO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQodC+0YXRgNCw0L3Rj9C10YIg0LrQsNGB0YLQvtC80L3QvtC1INC40LzRjyDQvNC+0LTQtdC70LhcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgICAqL1xuICAgIHNldE1vZGVsTmFtZTogKG5hbWUpID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHN0b3JhZ2UuZ2V0KFNFVFRJTkdTX0tFWSwge30pO1xuICAgICAgICBjb25zdCBub3JtYWxpemVkTmFtZSA9IFN0cmluZyhuYW1lIHx8ICcnKS50cmltKCk7XG5cbiAgICAgICAgaWYgKG5vcm1hbGl6ZWROYW1lKSB7XG4gICAgICAgICAgICBkYXRhLm1vZGVsTmFtZSA9IG5vcm1hbGl6ZWROYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIGRhdGEubW9kZWxOYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgc2F2ZVNldHRpbmdzKGRhdGEpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQodCx0YDQsNGB0YvQstCw0LXRgiDQuNC80Y8g0LzQvtC00LXQu9C4XG4gICAgICovXG4gICAgY2xlYXJNb2RlbE5hbWU6ICgpID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHN0b3JhZ2UuZ2V0KFNFVFRJTkdTX0tFWSwge30pO1xuICAgICAgICBkZWxldGUgZGF0YS5tb2RlbE5hbWU7XG4gICAgICAgIHNhdmVTZXR0aW5ncyhkYXRhKTtcbiAgICB9LFxufTtcbiIsImV4cG9ydCBkZWZhdWx0IFwiI2RldmljZS1maWx0ZXItaW5wdXR7d2lkdGg6Mjc1cHg7Ym9yZGVyOm5vbmU7cGFkZGluZzoxMXB4O21hcmdpbjotMTBweCAwIDZweDtiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50O2NvbG9yOiNjMmMyYzJ9XFxuXCI7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsInZhciBoYXNTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCI7XG52YXIgd2VicGFja1F1ZXVlcyA9IGhhc1N5bWJvbCA/IFN5bWJvbChcIndlYnBhY2sgcXVldWVzXCIpIDogXCJfX3dlYnBhY2tfcXVldWVzX19cIjtcbnZhciB3ZWJwYWNrRXhwb3J0cyA9IGhhc1N5bWJvbCA/IFN5bWJvbChcIndlYnBhY2sgZXhwb3J0c1wiKSA6IFwiX193ZWJwYWNrX2V4cG9ydHNfX1wiO1xudmFyIHdlYnBhY2tFcnJvciA9IGhhc1N5bWJvbCA/IFN5bWJvbChcIndlYnBhY2sgZXJyb3JcIikgOiBcIl9fd2VicGFja19lcnJvcl9fXCI7XG5cblxudmFyIHJlc29sdmVRdWV1ZSA9IChxdWV1ZSkgPT4ge1xuXHRpZihxdWV1ZSAmJiBxdWV1ZS5kIDwgMSkge1xuXHRcdHF1ZXVlLmQgPSAxO1xuXHRcdHF1ZXVlLmZvckVhY2goKGZuKSA9PiAoZm4uci0tKSk7XG5cdFx0cXVldWUuZm9yRWFjaCgoZm4pID0+IChmbi5yLS0gPyBmbi5yKysgOiBmbigpKSk7XG5cdH1cbn1cbnZhciB3cmFwRGVwcyA9IChkZXBzKSA9PiAoZGVwcy5tYXAoKGRlcCkgPT4ge1xuXHRpZihkZXAgIT09IG51bGwgJiYgdHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIikge1xuXG5cdFx0aWYoZGVwW3dlYnBhY2tRdWV1ZXNdKSByZXR1cm4gZGVwO1xuXHRcdGlmKGRlcC50aGVuKSB7XG5cdFx0XHR2YXIgcXVldWUgPSBbXTtcblx0XHRcdHF1ZXVlLmQgPSAwO1xuXHRcdFx0ZGVwLnRoZW4oKHIpID0+IHtcblx0XHRcdFx0b2JqW3dlYnBhY2tFeHBvcnRzXSA9IHI7XG5cdFx0XHRcdHJlc29sdmVRdWV1ZShxdWV1ZSk7XG5cdFx0XHR9LCAoZSkgPT4ge1xuXHRcdFx0XHRvYmpbd2VicGFja0Vycm9yXSA9IGU7XG5cdFx0XHRcdHJlc29sdmVRdWV1ZShxdWV1ZSk7XG5cdFx0XHR9KTtcblx0XHRcdHZhciBvYmogPSB7fTtcblxuXHRcdFx0b2JqW3dlYnBhY2tRdWV1ZXNdID0gKGZuKSA9PiAoZm4ocXVldWUpKTtcblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fVxuXHR9XG5cdHZhciByZXQgPSB7fTtcblx0cmV0W3dlYnBhY2tRdWV1ZXNdID0geCA9PiB7fTtcblx0cmV0W3dlYnBhY2tFeHBvcnRzXSA9IGRlcDtcblx0cmV0dXJuIHJldDtcbn0pKTtcbl9fd2VicGFja19yZXF1aXJlX18uYSA9IChtb2R1bGUsIGJvZHksIGhhc0F3YWl0KSA9PiB7XG5cdHZhciBxdWV1ZTtcblx0aGFzQXdhaXQgJiYgKChxdWV1ZSA9IFtdKS5kID0gLTEpO1xuXHR2YXIgZGVwUXVldWVzID0gbmV3IFNldCgpO1xuXHR2YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzO1xuXHR2YXIgY3VycmVudERlcHM7XG5cdHZhciBvdXRlclJlc29sdmU7XG5cdHZhciByZWplY3Q7XG5cdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlaikgPT4ge1xuXHRcdHJlamVjdCA9IHJlajtcblx0XHRvdXRlclJlc29sdmUgPSByZXNvbHZlO1xuXHR9KTtcblx0cHJvbWlzZVt3ZWJwYWNrRXhwb3J0c10gPSBleHBvcnRzO1xuXHRwcm9taXNlW3dlYnBhY2tRdWV1ZXNdID0gKGZuKSA9PiAocXVldWUgJiYgZm4ocXVldWUpLCBkZXBRdWV1ZXMuZm9yRWFjaChmbiksIHByb21pc2VbXCJjYXRjaFwiXSh4ID0+IHt9KSk7XG5cdG1vZHVsZS5leHBvcnRzID0gcHJvbWlzZTtcblx0dmFyIGhhbmRsZSA9IChkZXBzKSA9PiB7XG5cdFx0Y3VycmVudERlcHMgPSB3cmFwRGVwcyhkZXBzKTtcblx0XHR2YXIgZm47XG5cdFx0dmFyIGdldFJlc3VsdCA9ICgpID0+IChjdXJyZW50RGVwcy5tYXAoKGQpID0+IHtcblxuXHRcdFx0aWYoZFt3ZWJwYWNrRXJyb3JdKSB0aHJvdyBkW3dlYnBhY2tFcnJvcl07XG5cdFx0XHRyZXR1cm4gZFt3ZWJwYWNrRXhwb3J0c107XG5cdFx0fSkpXG5cdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXHRcdFx0Zm4gPSAoKSA9PiAocmVzb2x2ZShnZXRSZXN1bHQpKTtcblx0XHRcdGZuLnIgPSAwO1xuXHRcdFx0dmFyIGZuUXVldWUgPSAocSkgPT4gKHEgIT09IHF1ZXVlICYmICFkZXBRdWV1ZXMuaGFzKHEpICYmIChkZXBRdWV1ZXMuYWRkKHEpLCBxICYmICFxLmQgJiYgKGZuLnIrKywgcS5wdXNoKGZuKSkpKTtcblx0XHRcdGN1cnJlbnREZXBzLm1hcCgoZGVwKSA9PiAoZGVwW3dlYnBhY2tRdWV1ZXNdKGZuUXVldWUpKSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGZuLnIgPyBwcm9taXNlIDogZ2V0UmVzdWx0KCk7XG5cdH1cblx0dmFyIGRvbmUgPSAoZXJyKSA9PiAoKGVyciA/IHJlamVjdChwcm9taXNlW3dlYnBhY2tFcnJvcl0gPSBlcnIpIDogb3V0ZXJSZXNvbHZlKGV4cG9ydHMpKSwgcmVzb2x2ZVF1ZXVlKHF1ZXVlKSlcblx0Ym9keShoYW5kbGUsIGRvbmUpO1xuXHRxdWV1ZSAmJiBxdWV1ZS5kIDwgMCAmJiAocXVldWUuZCA9IDApO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdtb2R1bGUnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2tlZW5ldGljL2luZGV4LmpzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9