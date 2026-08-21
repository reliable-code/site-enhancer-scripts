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
// @version      1.0.78734394
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keenetic.io
// @author       reliable-code
// @downloadURL  https://raw.githubusercontent.com/reliable-code/site-enhancer-scripts/main/specific/keenetic.user.js
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

/***/ "./src/common/hash/fnv1a.js"
/*!**********************************!*\
  !*** ./src/common/hash/fnv1a.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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


/***/ },

/***/ "./src/common/hash/helpers.js"
/*!************************************!*\
  !*** ./src/common/hash/helpers.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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


/***/ },

/***/ "./src/keenetic/index.js"
/*!*******************************!*\
  !*** ./src/keenetic/index.js ***!
  \*******************************/
(module, __unused_webpack___webpack_exports__, __webpack_require__) {

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

/***/ },

/***/ "./src/keenetic/storage.js"
/*!*********************************!*\
  !*** ./src/keenetic/storage.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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


/***/ },

/***/ "./src/keenetic/styles.css"
/*!*********************************!*\
  !*** ./src/keenetic/styles.css ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("#device-filter-input{width:275px;border:none;padding:11px;margin:-10px 0 6px;background-color:transparent;color:#c2c2c2}\n");

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
/******/ 	let __webpack_exports__ = __webpack_require__("./src/keenetic/index.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUk7V0FDSjtXQUNBO1dBQ0EsSUFBSTtXQUNKOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxDQUFDO1dBQ0Q7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUU7V0FDRjtXQUNBLHNHQUFzRztXQUN0RztXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBLEU7Ozs7O1dDdkVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLDJDQUEyQywwQ0FBMEM7V0FDckYsTUFBTTtXQUNOLDJDQUEyQyxnQ0FBZ0M7V0FDM0U7V0FDQSxLQUFLLHlCQUF5QjtXQUM5QjtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsMENBQTBDLHdDQUF3QztXQUNsRjtXQUNBO1dBQ0E7V0FDQSxFOzs7OztXQ3RCQSx3Rjs7Ozs7VUVBQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb21tb24vZG9tL2xvZ2dpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9kb20vdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9maWx0ZXIvY29tcGFyZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL2ZpbHRlci9oZWxwZXJzLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vaGFzaC9mbnYxYS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL2hhc2gvaGVscGVycy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL3N0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi91cmwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tlZW5ldGljL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9rZWVuZXRpYy9zdG9yYWdlLmpzIiwid2VicGFjazovLy8uL3NyYy9rZWVuZXRpYy9zdHlsZXMuY3NzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2FzeW5jIG1vZHVsZSIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBJU19ERUJVRyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnO1xuXG5mdW5jdGlvbiBsb2dJZkRlYnVnKC4uLmFyZ3MpIHtcbiAgICBpZiAoIUlTX0RFQlVHKSByZXR1cm47XG4gICAgY29uc29sZS5sb2coLi4uYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dFbGVtZW50U2VhcmNoKHNlbGVjdG9yLCBwYXJlbnROb2RlLCByZXN1bHQpIHtcbiAgICBjb25zdCBmb3VuZCA9IHJlc3VsdCBpbnN0YW5jZW9mIE5vZGVMaXN0ID8gcmVzdWx0Lmxlbmd0aCA+IDAgOiBCb29sZWFuKHJlc3VsdCk7XG5cbiAgICBsb2dJZkRlYnVnKFxuICAgICAgICBgJHtmb3VuZCA/ICfinIUgRm91bmQgZWxlbWVudCcgOiAn4p2MIE5vdCBmb3VuZCBlbGVtZW50J31gLFxuICAgICAgICAnXFxuIOKUnOKUgCBTZWxlY3RvcjonLFxuICAgICAgICBgXCIke3NlbGVjdG9yfVwiYCxcbiAgICAgICAgJ1xcbiDilJzilIAgUGFyZW50OicsXG4gICAgICAgIHBhcmVudE5vZGUsXG4gICAgICAgICdcXG4g4pSU4pSAIFJlc3VsdDonLFxuICAgICAgICByZXN1bHQsXG4gICAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ0VsZW1lbnRXYWl0KHNlbGVjdG9yLCBwYXJlbnROb2RlKSB7XG4gICAgbG9nSWZEZWJ1ZyhcbiAgICAgICAgJ+KPsyBXYWl0aW5nIGZvciBlbGVtZW50JyxcbiAgICAgICAgJ1xcbiDilJzilIAgU2VsZWN0b3I6JyxcbiAgICAgICAgYFwiJHtzZWxlY3Rvcn1cImAsXG4gICAgICAgICdcXG4g4pSU4pSAIFBhcmVudDonLFxuICAgICAgICBwYXJlbnROb2RlLFxuICAgICk7XG59XG4iLCJpbXBvcnQgeyBsb2dFbGVtZW50U2VhcmNoLCBsb2dFbGVtZW50V2FpdCB9IGZyb20gJy4vbG9nZ2luZyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB3YWl0Rm9yRWxlbWVudChwYXJlbnROb2RlLCBzZWxlY3RvciwgdGltZW91dCA9IG51bGwsIGxvZ09uRGVidWcgPSBmYWxzZSkge1xuICAgIGNvbnN0IGV4aXN0aW5nRWxlbWVudCA9IHBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgaWYgKGV4aXN0aW5nRWxlbWVudCkge1xuICAgICAgICBpZiAobG9nT25EZWJ1ZykgbG9nRWxlbWVudFNlYXJjaChzZWxlY3RvciwgcGFyZW50Tm9kZSwgZXhpc3RpbmdFbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShleGlzdGluZ0VsZW1lbnQpO1xuICAgIH1cblxuICAgIGlmIChsb2dPbkRlYnVnKSBsb2dFbGVtZW50V2FpdChzZWxlY3RvciwgcGFyZW50Tm9kZSk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihtdXRhdGlvbkNhbGxiYWNrKTtcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShwYXJlbnROb2RlLCB7XG4gICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgdGltZW91dElkO1xuICAgICAgICBpZiAodGltZW91dCkge1xuICAgICAgICAgICAgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIGlmIChsb2dPbkRlYnVnKSBsb2dFbGVtZW50U2VhcmNoKHNlbGVjdG9yLCBwYXJlbnROb2RlLCBudWxsKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBtdXRhdGlvbkNhbGxiYWNrKCkge1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IHBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQpIHJldHVybjtcblxuICAgICAgICAgICAgaWYgKHRpbWVvdXRJZCkgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICBpZiAobG9nT25EZWJ1ZykgbG9nRWxlbWVudFNlYXJjaChzZWxlY3RvciwgcGFyZW50Tm9kZSwgZWxlbWVudCk7XG4gICAgICAgICAgICByZXNvbHZlKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3YWl0VW50aWxFbGVtZW50R29uZShwYXJlbnROb2RlLCBzZWxlY3Rvcikge1xuICAgIGNvbnN0IGV4aXN0aW5nRWxlbWVudCA9IHBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgaWYgKCFleGlzdGluZ0VsZW1lbnQpIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKG11dGF0aW9uQ2FsbGJhY2spO1xuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKHBhcmVudE5vZGUsIHtcbiAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIG11dGF0aW9uQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICBpZiAocGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdhaXRVbnRpbEVsZW1lbnRTdGFiaWxpemVkKGVsZW1lbnQsIHRpbWVvdXQgPSA0MDApIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgbGV0IHRpbWVvdXRJZDtcblxuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICAgICAgc2NoZWR1bGVDb21wbGV0aW9uKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIHNjaGVkdWxlQ29tcGxldGlvbigpIHtcbiAgICAgICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9LCB0aW1lb3V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjaGVkdWxlQ29tcGxldGlvbigpO1xuXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCwge1xuICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0ID0gMjUwKSB7XG4gICAgbGV0IHRpbWVvdXRJZDtcbiAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4gZnVuYy5hcHBseSh0aGlzLCBhcmdzKSwgd2FpdCk7XG4gICAgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1bldoZW5WaXNpYmxlKGNhbGxiYWNrKSB7XG4gICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ3Zpc2libGUnKSB7XG4gICAgICAgIGF3YWl0IGNhbGxiYWNrKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICd2aXNpYmxlJykge1xuICAgICAgICAgICAgICAgIGF3YWl0IGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHsgb25jZTogdHJ1ZSB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5PbmNlT25JbnRlcnNlY3Rpb24oZWxlbWVudCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcigoZW50cmllcykgPT4ge1xuICAgICAgICBlbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWVudHJ5LmlzSW50ZXJzZWN0aW5nKSByZXR1cm47XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnNlY3Rpb25PYnNlcnZlcihlbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBlbGVtZW50LmludGVyc2VjdGlvbk9ic2VydmVyID0gb2JzZXJ2ZXI7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFySW50ZXJzZWN0aW9uT2JzZXJ2ZXIoZWxlbWVudCkge1xuICAgIGlmICghZWxlbWVudC5pbnRlcnNlY3Rpb25PYnNlcnZlcikgcmV0dXJuO1xuXG4gICAgZWxlbWVudC5pbnRlcnNlY3Rpb25PYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgZWxlbWVudC5pbnRlcnNlY3Rpb25PYnNlcnZlciA9IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhck9ic2VydmVyKG9ic2VydmVyKSB7XG4gICAgaWYgKCFvYnNlcnZlcikgcmV0dXJuO1xuICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICBvYnNlcnZlciA9IG51bGw7XG59XG4iLCJpbXBvcnQgeyBwYXJzZUZpbHRlclF1ZXJ5IH0gZnJvbSAnLi9oZWxwZXJzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzTWF0Y2hUZXh0RmlsdGVyKHBhcmFtZXRlclZhbHVlLCBmaWx0ZXJWYWx1ZSkge1xuICAgIGlmICghZmlsdGVyVmFsdWUpIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHJlcXVpcmVtZW50cyA9IHBhcnNlRmlsdGVyUXVlcnkoZmlsdGVyVmFsdWUpO1xuICAgIHJldHVybiBtYXRjaGVzUXVlcnkocGFyYW1ldGVyVmFsdWUsIHJlcXVpcmVtZW50cyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXRjaGVzUXVlcnkodGV4dCwgcmVxdWlyZW1lbnRzKSB7XG4gICAgaWYgKCFyZXF1aXJlbWVudHMgfHwgIXJlcXVpcmVtZW50cy5sZW5ndGgpIHJldHVybiB0cnVlO1xuXG4gICAgY29uc3Qgbm9ybWFsaXplZFRleHQgPSAodGV4dCB8fCAnJykudG9Mb3dlckNhc2UoKTtcblxuICAgIHJldHVybiByZXF1aXJlbWVudHMuZXZlcnkoKGdyb3VwKSA9PiBjaGVja0dyb3VwTWF0Y2gobm9ybWFsaXplZFRleHQsIGdyb3VwKSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrR3JvdXBNYXRjaCh0ZXh0LCBncm91cENvbmRpdGlvbnMpIHtcbiAgICByZXR1cm4gZ3JvdXBDb25kaXRpb25zLnNvbWUoKHsgdGVybSwgaXNOZWdhdGl2ZSB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGluY2x1ZGVzID0gdGV4dC5pbmNsdWRlcyh0ZXJtKTtcbiAgICAgICAgcmV0dXJuIGlzTmVnYXRpdmUgPyAhaW5jbHVkZXMgOiBpbmNsdWRlcztcbiAgICB9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBwYXJzZUZpbHRlclF1ZXJ5KHF1ZXJ5U3RyaW5nKSB7XG4gICAgaWYgKCFxdWVyeVN0cmluZykgcmV0dXJuIFtdO1xuXG4gICAgcmV0dXJuIHF1ZXJ5U3RyaW5nLnRvTG93ZXJDYXNlKClcbiAgICAgICAgLnNwbGl0KCcsJylcbiAgICAgICAgLm1hcChwYXJzZUdyb3VwKVxuICAgICAgICAuZmlsdGVyKEJvb2xlYW4pO1xufVxuXG5mdW5jdGlvbiBwYXJzZUdyb3VwKGdyb3VwU3RyaW5nKSB7XG4gICAgY29uc3QgdG9rZW5zID0gZ3JvdXBTdHJpbmcuc3BsaXQoJy8nKVxuICAgICAgICAubWFwKChzKSA9PiBzLnRyaW0oKSlcbiAgICAgICAgLmZpbHRlcihCb29sZWFuKTtcblxuICAgIGlmICh0b2tlbnMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGNvbmRpdGlvbnMgPSB0b2tlbnNcbiAgICAgICAgLm1hcChjcmVhdGVDb25kaXRpb24pXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICByZXR1cm4gY29uZGl0aW9ucy5sZW5ndGggPiAwID8gY29uZGl0aW9ucyA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbmRpdGlvbihyYXdUb2tlbikge1xuICAgIGNvbnN0IGlzTmVnYXRpdmUgPSByYXdUb2tlbi5zdGFydHNXaXRoKCchJyk7XG4gICAgY29uc3QgdGVybSA9IGlzTmVnYXRpdmUgPyByYXdUb2tlbi5zbGljZSgxKS50cmltKCkgOiByYXdUb2tlbjtcblxuICAgIGlmICghdGVybSkgcmV0dXJuIG51bGw7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0ZXJtLFxuICAgICAgICBpc05lZ2F0aXZlLFxuICAgIH07XG59XG5cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLWJpdHdpc2UgKi9cblxuLy8gRk5WLTFhIGhhc2ggZnVuY3Rpb24gKDMyLWJpdCB2ZXJzaW9uKVxuZXhwb3J0IGZ1bmN0aW9uIGZudjFhSGFzaDMyKGlucHV0KSB7XG4gICAgY29uc3QgRk5WX09GRlNFVF9CQVNJUyA9IDIxNjYxMzYyNjE7IC8vIEluaXRpYWwgRk5WLTFhIGhhc2ggdmFsdWUgKDMyLWJpdClcbiAgICBjb25zdCBGTlZfUFJJTUUgPSAxNjc3NzYxOTsgLy8gVGhlIHByaW1lIG11bHRpcGxpZXIgZm9yIHRoZSBoYXNoIGZ1bmN0aW9uXG5cbiAgICBsZXQgaGFzaCA9IEZOVl9PRkZTRVRfQkFTSVM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IGNoYXJDb2RlID0gaW5wdXQuY2hhckNvZGVBdChpKTsgLy8gR2V0IHRoZSBjaGFyYWN0ZXIgY29kZVxuICAgICAgICBoYXNoIF49IGNoYXJDb2RlOyAvLyBYT1IgdGhlIGhhc2ggd2l0aCB0aGUgY2hhcmFjdGVyIGNvZGVcbiAgICAgICAgaGFzaCA9IE1hdGguaW11bChoYXNoLCBGTlZfUFJJTUUpOyAvLyBNdWx0aXBseSBieSB0aGUgRk5WIHByaW1lXG4gICAgfVxuXG4gICAgLy8gQ29uc3RyYWluIGhhc2ggdG8gMzIgYml0c1xuICAgIHJldHVybiAoaGFzaCA+Pj4gMCk7XG59XG4iLCJpbXBvcnQgeyBmbnYxYUhhc2gzMiB9IGZyb20gJy4vZm52MWEnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SGFzaCh2YWx1ZSkge1xuICAgIC8vIENvbnZlcnQgdG8gaGV4LCBhbmQgZW5zdXJlIGl0IGhhcyA4IGNoYXJhY3RlcnNcbiAgICByZXR1cm4gZm52MWFIYXNoMzIodmFsdWUpXG4gICAgICAgIC50b1N0cmluZygxNilcbiAgICAgICAgLnBhZFN0YXJ0KDgsICcwJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIYXNoT3JEZWZhdWx0KHZhbHVlLCBkZWZhdWx0VmFsdWUgPSAnY29tbW9uJykge1xuICAgIHJldHVybiB2YWx1ZSA/IGdldEhhc2godmFsdWUpIDogZGVmYXVsdFZhbHVlO1xufVxuIiwiZXhwb3J0IGNvbnN0IHN0b3JhZ2UgPSB7XG4gICAgLyoqXG4gICAgICog0J/QvtC70YPRh9C10L3QuNC1INC00LDQvdC90YvRhSDQuNC3IEdNIHN0b3JhZ2VcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0g0LrQu9GO0YdcbiAgICAgKiBAcGFyYW0geyp9IGRlZmF1bHRWYWx1ZSAtINC30L3QsNGH0LXQvdC40LUg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cbiAgICAgKiBAcmV0dXJucyB7Kn0g0LfQvdCw0YfQtdC90LjQtSDQuNC70LggZGVmYXVsdFZhbHVlXG4gICAgICovXG4gICAgZ2V0OiAoa2V5LCBkZWZhdWx0VmFsdWUgPSBudWxsKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gR01fZ2V0VmFsdWUoa2V5LCBkZWZhdWx0VmFsdWUpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBTdG9yYWdlIGdldCBlcnJvciBmb3Iga2V5IFwiJHtrZXl9XCI6YCwgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQodC+0YXRgNCw0L3QtdC90LjQtSDQtNCw0L3QvdGL0YUg0LIgR00gc3RvcmFnZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSDQutC70Y7Rh1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgLSDQt9C90LDRh9C10L3QuNC1ICjQu9GO0LHQvtC5INGC0LjQvylcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g0YPRgdC/0LXRiNC90L7RgdGC0Ywg0L7Qv9C10YDQsNGG0LjQuFxuICAgICAqL1xuICAgIHNldDogKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIEdNX3NldFZhbHVlKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFN0b3JhZ2Ugc2V0IGVycm9yIGZvciBrZXkgXCIke2tleX1cIjpgLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0J7QsdC90L7QstC70LXQvdC40LUg0YHRg9GJ0LXRgdGC0LLRg9GO0YnQuNGFINC00LDQvdC90YvRhSDRh9C10YDQtdC3INGE0YPQvdC60YbQuNGOXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtINC60LvRjtGHXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gdXBkYXRlRm4gLSDRhNGD0L3QutGG0LjRjyDQvtCx0L3QvtCy0LvQtdC90LjRjyAo0L/QvtC70YPRh9Cw0LXRgiDRgtC10LrRg9GJ0LXQtSDQt9C90LDRh9C10L3QuNC1LCDQstC+0LfQstGA0LDRidCw0LXRgiDQvdC+0LLQvtC1KVxuICAgICAqIEBwYXJhbSB7Kn0gZGVmYXVsdFZhbHVlIC0g0LfQvdCw0YfQtdC90LjQtSDQv9C+INGD0LzQvtC70YfQsNC90LjRjiDQtdGB0LvQuCDQutC70Y7RhyDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCXG4gICAgICogQHJldHVybnMgeyp9INC90L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtVxuICAgICAqL1xuICAgIHVwZGF0ZTogKGtleSwgdXBkYXRlRm4sIGRlZmF1bHRWYWx1ZSA9IG51bGwpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHN0b3JhZ2UuZ2V0KGtleSwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gdXBkYXRlRm4oY3VycmVudFZhbHVlKTtcbiAgICAgICAgICAgIHN0b3JhZ2Uuc2V0KGtleSwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIG5ld1ZhbHVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBTdG9yYWdlIHVwZGF0ZSBlcnJvciBmb3Iga2V5IFwiJHtrZXl9XCI6YCwgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2UuZ2V0KGtleSwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQo9C00LDQu9C10L3QuNC1INC00LDQvdC90YvRhSDQuNC3IEdNIHN0b3JhZ2VcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0g0LrQu9GO0YdcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g0YPRgdC/0LXRiNC90L7RgdGC0Ywg0L7Qv9C10YDQsNGG0LjQuFxuICAgICAqL1xuICAgIHJlbW92ZTogKGtleSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgR01fZGVsZXRlVmFsdWUoa2V5KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBTdG9yYWdlIHJlbW92ZSBlcnJvciBmb3Iga2V5IFwiJHtrZXl9XCI6YCwgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCf0YDQvtCy0LXRgNC60LAg0YHRg9GJ0LXRgdGC0LLQvtCy0LDQvdC40Y8g0LrQu9GO0YfQsFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSDQutC70Y7Rh1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGhhczogKGtleSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uua2V5cygpLmluY2x1ZGVzKGtleSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFN0b3JhZ2UgaGFzIGVycm9yIGZvciBrZXkgXCIke2tleX1cIjpgLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0J/QvtC70YPRh9C10L3QuNC1INCy0YHQtdGFINC60LvRjtGH0LXQuVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmdbXX0g0LzQsNGB0YHQuNCyINC60LvRjtGH0LXQuVxuICAgICAqL1xuICAgIGtleXM6ICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBHTV9saXN0VmFsdWVzKCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2Uga2V5cyBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0J7Rh9C40YHRgtC60LAg0LTQsNC90L3Ri9GFINGB0LrRgNC40L/RgtCwXG4gICAgICogQHBhcmFtIHtzdHJpbmdbXX0ga2V5c1RvUmVtb3ZlIC0g0LzQsNGB0YHQuNCyINC60LvRjtGH0LXQuSDQtNC70Y8g0YPQtNCw0LvQtdC90LjRj1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSDRg9GB0L/QtdGI0L3QvtGB0YLRjCDQvtC/0LXRgNCw0YbQuNC4XG4gICAgICovXG4gICAgY2xlYXI6IChrZXlzVG9SZW1vdmUgPSBudWxsKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBhbGxLZXlzID0ga2V5c1RvUmVtb3ZlIHx8IHN0b3JhZ2Uua2V5cygpO1xuICAgICAgICAgICAgYWxsS2V5cy5mb3JFYWNoKChrZXkpID0+IEdNX2RlbGV0ZVZhbHVlKGtleSkpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgY2xlYXIgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCc0LDRgdGB0L7QstC+0LUg0L/QvtC70YPRh9C10L3QuNC1INC00LDQvdC90YvRhVxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IGtleXNMaXN0IC0g0LzQsNGB0YHQuNCyINC60LvRjtGH0LXQuVxuICAgICAqIEBwYXJhbSB7Kn0gZGVmYXVsdFZhbHVlIC0g0LfQvdCw0YfQtdC90LjQtSDQv9C+INGD0LzQvtC70YfQsNC90LjRjiDQtNC70Y8g0L7RgtGB0YPRgtGB0YLQstGD0Y7RidC40YUg0LrQu9GO0YfQtdC5XG4gICAgICogQHJldHVybnMge09iamVjdH0g0L7QsdGK0LXQutGCINGBINC/0LDRgNCw0LzQuCDQutC70Y7Rhy3Qt9C90LDRh9C10L3QuNC1XG4gICAgICovXG4gICAgZ2V0TXVsdGlwbGU6IChrZXlzTGlzdCwgZGVmYXVsdFZhbHVlID0gbnVsbCkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAgICAga2V5c0xpc3QuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IHN0b3JhZ2UuZ2V0KGtleSwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCc0LDRgdGB0L7QstC+0LUg0YHQvtGF0YDQsNC90LXQvdC40LUg0LTQsNC90L3Ri9GFXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSDQvtCx0YrQtdC60YIg0YEg0L/QsNGA0LDQvNC4INC60LvRjtGHLdC30L3QsNGH0LXQvdC40LVcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g0YPRgdC/0LXRiNC90L7RgdGC0Ywg0LLRgdC10YUg0L7Qv9C10YDQsNGG0LjQuVxuICAgICAqL1xuICAgIHNldE11bHRpcGxlOiAoZGF0YSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMoZGF0YSkuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgICAgICAgR01fc2V0VmFsdWUoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIHNldE11bHRpcGxlIGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQo9C00LDQu9C10L3QuNC1INC90LXRgdC60L7Qu9GM0LrQuNGFINC60LvRjtGH0LXQuVxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IGtleXNUb1JlbW92ZSAtINC80LDRgdGB0LjQsiDQutC70Y7Rh9C10Lkg0LTQu9GPINGD0LTQsNC70LXQvdC40Y8gKNC+0LHRj9C30LDRgtC10LvRjNC90YvQuSDQv9Cw0YDQsNC80LXRgtGAKVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSDRg9GB0L/QtdGI0L3QvtGB0YLRjCDQvtC/0LXRgNCw0YbQuNC4XG4gICAgICovXG4gICAgcmVtb3ZlTXVsdGlwbGU6IChrZXlzVG9SZW1vdmUpID0+IHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGtleXNUb1JlbW92ZSkgfHwga2V5c1RvUmVtb3ZlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIHJlbW92ZU11bHRpcGxlOiBrZXlzVG9SZW1vdmUgbXVzdCBiZSBhIG5vbi1lbXB0eSBhcnJheScpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGtleXNUb1JlbW92ZS5mb3JFYWNoKChrZXkpID0+IEdNX2RlbGV0ZVZhbHVlKGtleSkpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgcmVtb3ZlTXVsdGlwbGUgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQtdC90LjQtSDQutC+0LvQuNGH0LXRgdGC0LLQsCDRgdC+0YXRgNCw0L3QtdC90L3Ri9GFINC60LvRjtGH0LXQuVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9INC60L7Qu9C40YfQtdGB0YLQstC+INC60LvRjtGH0LXQuVxuICAgICAqL1xuICAgIGNvdW50OiAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmFnZS5rZXlzKCkubGVuZ3RoO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIGNvdW50IGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQtdC90LjQtSDQstGB0LXRhSDQtNCw0L3QvdGL0YUg0LIg0LLQuNC00LUg0L7QsdGK0LXQutGC0LBcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSDQvtCx0YrQtdC60YIg0YHQviDQstGB0LXQvNC4INGB0L7RhdGA0LDQvdC10L3QvdGL0LzQuCDQtNCw0L3QvdGL0LzQuFxuICAgICAqL1xuICAgIGdldEFsbDogKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgYWxsS2V5cyA9IHN0b3JhZ2Uua2V5cygpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgICAgICAgICBhbGxLZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gR01fZ2V0VmFsdWUoa2V5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSBnZXRBbGwgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCe0J/QkNCh0J3Qnjog0J7Rh9C40YHRgtC60LAg0LLRgdC10YUg0LTQsNC90L3Ri9GFINGB0LrRgNC40L/RgtCwXG4gICAgICogQHBhcmFtIHtib29sZWFufSBjb25maXJtQ2xlYXIgLSDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdGL0Lkg0YTQu9Cw0LMg0L/QvtC00YLQstC10YDQttC00LXQvdC40Y8gKNC00L7Qu9C20LXQvSDQsdGL0YLRjCB0cnVlKVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSDRg9GB0L/QtdGI0L3QvtGB0YLRjCDQvtC/0LXRgNCw0YbQuNC4XG4gICAgICovXG4gICAgY2xlYXJBbGw6IChjb25maXJtQ2xlYXIgPSBmYWxzZSkgPT4ge1xuICAgICAgICBpZiAoY29uZmlybUNsZWFyICE9PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgY2xlYXJBbGw6IGNvbmZpcm1DbGVhciBtdXN0IGJlIGV4cGxpY2l0bHkgc2V0IHRvIHRydWUnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBhbGxLZXlzID0gc3RvcmFnZS5rZXlzKCk7XG4gICAgICAgICAgICBhbGxLZXlzLmZvckVhY2goKGtleSkgPT4gR01fZGVsZXRlVmFsdWUoa2V5KSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSBjbGVhckFsbCBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0J/RgNC+0LLQtdGA0LrQsCDQv9GD0YHRgtC+0YLRiyDRhdGA0LDQvdC40LvQuNGJ0LBcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSDQtdGB0LvQuCDRhdGA0LDQvdC40LvQuNGJ0LUg0L/Rg9GB0YLQvtC1XG4gICAgICovXG4gICAgaXNFbXB0eTogKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uua2V5cygpLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSBpc0VtcHR5IGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcbn07XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0VVJMUGF0aEVsZW1lbnQocG9zaXRpb24sIGRlZmF1bHRWYWx1ZSA9ICdjb21tb24nLCBsb2dSZXN1bHQgPSBmYWxzZSkge1xuICAgIGNvbnN0IHsgcGF0aG5hbWUgfSA9IHdpbmRvdy5sb2NhdGlvbjtcblxuICAgIHJldHVybiBnZXRQYXRobmFtZUVsZW1lbnQocGF0aG5hbWUsIHBvc2l0aW9uLCBkZWZhdWx0VmFsdWUsIGxvZ1Jlc3VsdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXRobmFtZUVsZW1lbnQocGF0aG5hbWUsIHBvc2l0aW9uLCBkZWZhdWx0VmFsdWUsIGxvZ1Jlc3VsdCA9IGZhbHNlKSB7XG4gICAgY29uc3QgcGF0aEVsZW1lbnRzID0gcGF0aG5hbWUuc3BsaXQoJy8nKTtcblxuICAgIHBvc2l0aW9uID0gcG9zaXRpb24gPCAwID8gcGF0aEVsZW1lbnRzLmxlbmd0aCArIHBvc2l0aW9uIDogcG9zaXRpb247XG4gICAgY29uc3QgcGF0aEVsZW1lbnQgPSBwYXRoRWxlbWVudHNbcG9zaXRpb25dIHx8IGRlZmF1bHRWYWx1ZTtcblxuICAgIGlmIChsb2dSZXN1bHQpIGNvbnNvbGUubG9nKGBQYXRobmFtZSBlbGVtZW50OiAke3BhdGhFbGVtZW50fWApO1xuXG4gICAgcmV0dXJuIHBhdGhFbGVtZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VVJMUGF0aEVsZW1lbnRFbmRpbmcocG9zaXRpb24sIGRlZmF1bHRWYWx1ZSA9ICdjb21tb24nLCBsb2dSZXN1bHQgPSBmYWxzZSkge1xuICAgIGNvbnN0IHBhdGhFbGVtZW50ID0gZ2V0VVJMUGF0aEVsZW1lbnQocG9zaXRpb24sICcnLCBsb2dSZXN1bHQpO1xuXG4gICAgcmV0dXJuIGdldFBhdGhFbGVtZW50RW5kaW5nKHBhdGhFbGVtZW50LCBkZWZhdWx0VmFsdWUsIGxvZ1Jlc3VsdCk7XG59XG5cbmZ1bmN0aW9uIGdldFBhdGhFbGVtZW50RW5kaW5nKHBhdGhFbGVtZW50LCBkZWZhdWx0VmFsdWUsIGxvZ1Jlc3VsdCkge1xuICAgIGlmICghcGF0aEVsZW1lbnQpIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cbiAgICBjb25zdCBwYXRoRWxlbWVudEVuZGluZyA9IHBhdGhFbGVtZW50LnNwbGl0KCctJylcbiAgICAgICAgLmF0KC0xKTtcblxuICAgIGlmIChsb2dSZXN1bHQpIGNvbnNvbGUubG9nKGBQYXRobmFtZSBlbGVtZW50IGVuZGluZzogJHtwYXRoRWxlbWVudEVuZGluZ31gKTtcblxuICAgIHJldHVybiBwYXRoRWxlbWVudEVuZGluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhdGhuYW1lRWxlbWVudEVuZGluZyhwYXRobmFtZSwgcG9zaXRpb24sIGRlZmF1bHRWYWx1ZSA9ICdjb21tb24nLCBsb2dSZXN1bHQgPSBmYWxzZSkge1xuICAgIGNvbnN0IHBhdGhFbGVtZW50ID0gZ2V0UGF0aG5hbWVFbGVtZW50KHBhdGhuYW1lLCBwb3NpdGlvbiwgJycsIGxvZ1Jlc3VsdCk7XG5cbiAgICByZXR1cm4gZ2V0UGF0aEVsZW1lbnRFbmRpbmcocGF0aEVsZW1lbnQsIGRlZmF1bHRWYWx1ZSwgbG9nUmVzdWx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFVSTFF1ZXJ5UGFyYW0obmFtZSkge1xuICAgIGNvbnN0IHF1ZXJ5UGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgICByZXR1cm4gcXVlcnlQYXJhbXMuZ2V0KG5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJRdWVyeVBhcmFtcyhsaW5rKSB7XG4gICAgcmV0dXJuIGxpbmsuc3BsaXQoJz8nKVswXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGhuYW1lSW5jbHVkZXMoc2VhcmNoU3RyaW5nKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcyhzZWFyY2hTdHJpbmcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGF0aG5hbWVJbmNsdWRlc1NvbWUoc2VhcmNoU3RyaW5ncykge1xuICAgIHJldHVybiBzZWFyY2hTdHJpbmdzLnNvbWUoKHNlYXJjaFN0cmluZykgPT4gcGF0aG5hbWVJbmNsdWRlcyhzZWFyY2hTdHJpbmcpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNvbWVQYXRoRWxlbWVudEVxdWFscyhzZWFyY2hTdHJpbmcpIHtcbiAgICBjb25zdCBwYXRoRWxlbWVudHMgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoJy8nKTtcblxuICAgIHJldHVybiBwYXRoRWxlbWVudHMuc29tZSgocGF0aEVsZW1lbnQpID0+IHBhdGhFbGVtZW50ID09PSBzZWFyY2hTdHJpbmcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0UXVlcnlQYXJhbXNBbmRSZWRpcmVjdChxdWVyeVBhcmFtcykge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgICAgICBPYmplY3QuZW50cmllcyhxdWVyeVBhcmFtcylcbiAgICAgICAgICAgIC5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICAgICAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybC50b1N0cmluZygpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byByZWRpcmVjdDonLCBlcnJvcik7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gb2JzZXJ2ZVVSTChjYWxsYmFjaywgd2F0Y2hRdWVyeVBhcmFtcyA9IFtdKSB7XG4gICAgY29uc3QgbGFzdFN0YXRlID0geyBwYXRobmFtZTogd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lIH07XG4gICAgd2F0Y2hRdWVyeVBhcmFtcy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgbGFzdFN0YXRlW2tleV0gPSBnZXRVUkxRdWVyeVBhcmFtKGtleSk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVVUkxDaGFuZ2UoKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTdGF0ZSA9IHsgcGF0aG5hbWU6IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSB9O1xuICAgICAgICB3YXRjaFF1ZXJ5UGFyYW1zLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgY3VycmVudFN0YXRlW2tleV0gPSBnZXRVUkxRdWVyeVBhcmFtKGtleSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhsYXN0U3RhdGUpXG4gICAgICAgICAgICAuc29tZSgoa2V5KSA9PiBsYXN0U3RhdGVba2V5XSAhPT0gY3VycmVudFN0YXRlW2tleV0pKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGxhc3RVUkwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZiAhPT0gbGFzdFVSTCkge1xuICAgICAgICAgICAgbGFzdFVSTCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICAgICAgaGFuZGxlVVJMQ2hhbmdlKCk7XG4gICAgICAgIH1cbiAgICB9LCAyMDApO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgaGFuZGxlVVJMQ2hhbmdlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9ic2VydmVVUkxGb3JSZWxvYWQod2F0Y2hRdWVyeVBhcmFtcyA9IFtdKSB7XG4gICAgb2JzZXJ2ZVVSTCgoKSA9PiB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCksIHdhdGNoUXVlcnlQYXJhbXMpO1xufVxuIiwiaW1wb3J0IHN0eWxlcyBmcm9tICcuL3N0eWxlcy5jc3MnO1xuaW1wb3J0IHsgd2FpdEZvckVsZW1lbnQgfSBmcm9tICcuLi9jb21tb24vZG9tL3V0aWxzJztcbmltcG9ydCB7IG9ic2VydmVVUkwsIHNvbWVQYXRoRWxlbWVudEVxdWFscyB9IGZyb20gJy4uL2NvbW1vbi91cmwnO1xuaW1wb3J0IHsgYXV0aFN0b3JhZ2UsIHNldHRpbmdzU3RvcmFnZSB9IGZyb20gJy4vc3RvcmFnZSc7XG5pbXBvcnQgeyBtYXRjaGVzUXVlcnkgfSBmcm9tICcuLi9jb21tb24vZmlsdGVyL2NvbXBhcmUnO1xuaW1wb3J0IHsgcGFyc2VGaWx0ZXJRdWVyeSB9IGZyb20gJy4uL2NvbW1vbi9maWx0ZXIvaGVscGVycyc7XG5cbkdNX2FkZFN0eWxlKHN0eWxlcyk7XG5cbkdNX3JlZ2lzdGVyTWVudUNvbW1hbmQoJ9Cd0LDRgdGC0YDQvtC40YLRjCDQsNCy0YLQvtCy0YXQvtC0JywgKCkgPT4ge1xuICAgIGNvbnN0IGxvZ2luID0gcHJvbXB0KCfQktCy0LXQtNC40YLQtSDQu9C+0LPQuNC9OicpO1xuICAgIGlmIChsb2dpbiA9PT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgaWYgKGxvZ2luID09PSAnJykge1xuICAgICAgICBpZiAoY29uZmlybSgn0KPQtNCw0LvQuNGC0Ywg0LTQsNC90L3Ri9C1INC00LvRjyDQsNCy0YLQvtCy0YXQvtC00LA/JykpIHtcbiAgICAgICAgICAgIGF1dGhTdG9yYWdlLmNsZWFyQ3JlZGVudGlhbHMoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGFzc3dvcmQgPSBwcm9tcHQoJ9CS0LLQtdC00LjRgtC1INC/0LDRgNC+0LvRjDonKTtcbiAgICBpZiAocGFzc3dvcmQgPT09IG51bGwpIHJldHVybjtcblxuICAgIGlmIChwYXNzd29yZCA9PT0gJycpIHtcbiAgICAgICAgaWYgKGNvbmZpcm0oJ9Cj0LTQsNC70LjRgtGMINC00LDQvdC90YvQtSDQtNC70Y8g0LDQstGC0L7QstGF0L7QtNCwPycpKSB7XG4gICAgICAgICAgICBhdXRoU3RvcmFnZS5jbGVhckNyZWRlbnRpYWxzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGF1dGhTdG9yYWdlLnNldENyZWRlbnRpYWxzKGxvZ2luLCBwYXNzd29yZCk7XG59KTtcblxuR01fcmVnaXN0ZXJNZW51Q29tbWFuZCgn0J3QsNGB0YLRgNC+0LjRgtGMINC40LzRjyDQvNC+0LTQtdC70LgnLCAoKSA9PiB7XG4gICAgY29uc3QgY3VycmVudE5hbWUgPSBzZXR0aW5nc1N0b3JhZ2UuZ2V0TW9kZWxOYW1lKCkgfHwgJyc7XG5cbiAgICBjb25zdCBuYW1lID0gcHJvbXB0KCfQktCy0LXQtNC40YLQtSDQuNC80Y8g0YDQvtGD0YLQtdGA0LA6JywgY3VycmVudE5hbWUpO1xuICAgIGlmIChuYW1lID09PSBudWxsKSByZXR1cm47XG5cbiAgICBpZiAobmFtZS50cmltKCkgPT09ICcnKSB7XG4gICAgICAgIGlmIChjb25maXJtKCfQodCx0YDQvtGB0LjRgtGMINC40LzRjyDQvNC+0LTQtdC70Lgg0L3QsCDRgdGC0LDQvdC00LDRgNGC0L3QvtC1PycpKSB7XG4gICAgICAgICAgICBzZXR0aW5nc1N0b3JhZ2UuY2xlYXJNb2RlbE5hbWUoKTtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2V0dGluZ3NTdG9yYWdlLnNldE1vZGVsTmFtZShuYW1lKTtcbiAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG59KTtcblxuY29uc3QgQ09OU1RBTlRTID0ge1xuICAgIERFVklDRV9GSUxURVJfSU5QVVRfSUQ6ICdkZXZpY2UtZmlsdGVyLWlucHV0Jyxcbn07XG5cbmF3YWl0IGluaXRNb2RzKCk7XG5vYnNlcnZlVVJMKGluaXRNb2RzKTtcblxuYXN5bmMgZnVuY3Rpb24gaW5pdE1vZHMoKSB7XG4gICAgaWYgKHNvbWVQYXRoRWxlbWVudEVxdWFscygnbG9naW4nKSkge1xuICAgICAgICBhd2FpdCBsb2dpblBhZ2VDb2RlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhd2FpdCB1cGRhdGVIZWFkZXJUZXh0KCk7XG4gICAgYXdhaXQgZXhwYW5kTWVudSgpO1xuXG4gICAgaWYgKHNvbWVQYXRoRWxlbWVudEVxdWFscygnZGV2aWNlc0xpc3QnKSkge1xuICAgICAgICBhd2FpdCBhZGRGaWx0ZXJGaWVsZCgpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gbG9naW5QYWdlQ29kZSgpIHtcbiAgICBjb25zdCBsb2dpbkZvcm0gPSBhd2FpdCB3YWl0Rm9yRWxlbWVudChkb2N1bWVudCwgJ25kdy1mb3JtLmxvZ2luLWZvcm1fX2Zvcm0nKTtcbiAgICBhd2FpdCBhdXRvRmlsbEFuZExvZ2luKGxvZ2luRm9ybSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGF1dG9GaWxsQW5kTG9naW4obG9naW5Gb3JtKSB7XG4gICAgaWYgKCFhdXRoU3RvcmFnZS5oYXNDcmVkZW50aWFscygpKSByZXR1cm47XG5cbiAgICBjb25zdCB7IGxvZ2luLCBwYXNzd29yZCB9ID0gYXV0aFN0b3JhZ2UuZ2V0Q3JlZGVudGlhbHMoKTtcblxuICAgIGNvbnN0IGxvZ2luSW5wdXQgPSBhd2FpdCB3YWl0Rm9yRWxlbWVudChsb2dpbkZvcm0sICdpbnB1dFtuYW1lPVwibG9naW5fa2V5XCJdJyk7XG4gICAgY29uc3QgcGFzc3dvcmRJbnB1dCA9IGF3YWl0IHdhaXRGb3JFbGVtZW50KGxvZ2luRm9ybSwgJ2lucHV0W25hbWU9XCJwYXNzd29yZF9rZXlcIl0nKTtcbiAgICBjb25zdCBsb2dpbkJ1dHRvbiA9IGF3YWl0IHdhaXRGb3JFbGVtZW50KGxvZ2luRm9ybSwgJ2J1dHRvbi5uZHctYnV0dG9uLS1wcmltYXJ5Jyk7XG4gICAgaWYgKCFsb2dpbklucHV0IHx8ICFwYXNzd29yZElucHV0IHx8ICFsb2dpbkJ1dHRvbikgcmV0dXJuO1xuXG4gICAgbG9naW5JbnB1dC52YWx1ZSA9IGxvZ2luO1xuICAgIGxvZ2luSW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgICBsb2dpbklucHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuXG4gICAgcGFzc3dvcmRJbnB1dC52YWx1ZSA9IHBhc3N3b3JkO1xuICAgIHBhc3N3b3JkSW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgICBwYXNzd29yZElucHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuXG4gICAgbG9naW5CdXR0b24uY2xpY2soKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlSGVhZGVyVGV4dCgpIHtcbiAgICBjb25zdCBtb2RlbE5hbWUgPSBzZXR0aW5nc1N0b3JhZ2UuZ2V0TW9kZWxOYW1lKCk7XG4gICAgaWYgKCFtb2RlbE5hbWUpIHJldHVybjtcblxuICAgIGNvbnN0IGhlYWRlck1vZGVsID0gYXdhaXQgd2FpdEZvckVsZW1lbnQoZG9jdW1lbnQsICcuaGVhZGVyX19tb2RlbCcpO1xuICAgIGhlYWRlck1vZGVsLnRleHRDb250ZW50ID0gbW9kZWxOYW1lO1xufVxuXG5hc3luYyBmdW5jdGlvbiBleHBhbmRNZW51KCkge1xuICAgIGNvbnN0IHRvZ2dsZUJ1dHRvbiA9IGF3YWl0IHdhaXRGb3JFbGVtZW50KGRvY3VtZW50LCAnLm1lbnUtdG9nZ2xlX19jb250YWluZXInKTtcbiAgICBjb25zdCB0b2dnbGVCdXR0b25XcmFwID0gdG9nZ2xlQnV0dG9uLmNsb3Nlc3QoJy5tZW51LXRvZ2dsZScpO1xuICAgIGlmICh0b2dnbGVCdXR0b25XcmFwICYmICF0b2dnbGVCdXR0b25XcmFwLmNsYXNzTGlzdC5jb250YWlucygnbWVudS10b2dnbGUtLWV4cGFuZGVkJykpIHtcbiAgICAgICAgdG9nZ2xlQnV0dG9uLmNsaWNrKCk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBhZGRGaWx0ZXJGaWVsZCgpIHtcbiAgICBsZXQgZmlsdGVySW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuREVWSUNFX0ZJTFRFUl9JTlBVVF9JRCk7XG4gICAgaWYgKGZpbHRlcklucHV0KSByZXR1cm47XG5cbiAgICBjb25zdCByZWdpc3RlcmVkRGV2aWNlc0hlYWRlciA9IGF3YWl0IHdhaXRGb3JFbGVtZW50KFxuICAgICAgICBkb2N1bWVudCwgJ1tsYWJlbD1cImRldmljZXMtbGlzdC5vZmZsaW5lLWRldmljZS1yZWdpc3RyYXRpb24ucmVnaXN0ZXItYnRuXCJdJyxcbiAgICApO1xuXG4gICAgZmlsdGVySW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIGZpbHRlcklucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgZmlsdGVySW5wdXQuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsICfQpNC40LvRjNGC0YAg0L/QviDQuNC80LXQvdC4INGD0YHRgtGA0L7QudGB0YLQstCwJyk7XG4gICAgZmlsdGVySW5wdXQuc2V0QXR0cmlidXRlKCdpZCcsIENPTlNUQU5UUy5ERVZJQ0VfRklMVEVSX0lOUFVUX0lEKTtcblxuICAgIHJlZ2lzdGVyZWREZXZpY2VzSGVhZGVyLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKFxuICAgICAgICBmaWx0ZXJJbnB1dCwgcmVnaXN0ZXJlZERldmljZXNIZWFkZXIubmV4dFNpYmxpbmcsXG4gICAgKTtcblxuICAgIGZpbHRlcklucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xuICAgICAgICBjb25zdCBmaWx0ZXJWYWx1ZSA9IGZpbHRlcklucHV0LnZhbHVlO1xuICAgICAgICBjb25zdCByZXF1aXJlbWVudHMgPSBwYXJzZUZpbHRlclF1ZXJ5KGZpbHRlclZhbHVlKTsgLy8g0J/QsNGA0YHQuNC8INC+0LTQuNC9INGA0LDQt1xuXG4gICAgICAgIGNvbnN0IGRldmljZXNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVnaXN0ZXJlZC1kZXZpY2VzJyk7XG4gICAgICAgIGlmICghZGV2aWNlc0NvbnRhaW5lcikgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHJvd3MgPSBkZXZpY2VzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ3Rib2R5IHRyJyk7XG4gICAgICAgIHJvd3MuZm9yRWFjaCgocm93KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkZXZpY2VOYW1lID0gcm93LnF1ZXJ5U2VsZWN0b3IoJy5jZWxsX19ob3N0LW5hbWUnKTtcbiAgICAgICAgICAgIGlmIChkZXZpY2VOYW1lKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGV2aWNlTmFtZVRleHQgPSBkZXZpY2VOYW1lLnRleHRDb250ZW50O1xuICAgICAgICAgICAgICAgIHJvdy5zdHlsZS5kaXNwbGF5ID0gbWF0Y2hlc1F1ZXJ5KGRldmljZU5hbWVUZXh0LCByZXF1aXJlbWVudHMpID8gJycgOiAnbm9uZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgc3RvcmFnZSB9IGZyb20gJy4uL2NvbW1vbi9zdG9yYWdlJztcbmltcG9ydCB7IGdldEhhc2ggfSBmcm9tICcuLi9jb21tb24vaGFzaC9oZWxwZXJzJztcblxuLyoqXG4gKiDQk9C10L3QtdGA0LjRgNGD0LXQvCDRg9C90LjQutCw0LvRjNC90YvQuSDQutC70Y7RhyDQtNC70Y8g0YLQtdC60YPRidC10LPQviDQtNC+0LzQtdC90LAuXG4gKi9cbmNvbnN0IEFVVEhfS0VZID0gYGF1dGhfY3JlZHNfJHtnZXRIYXNoKHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSl9YDtcbmNvbnN0IFNFVFRJTkdTX0tFWSA9IGBzZXR0aW5nc18ke2dldEhhc2god2luZG93LmxvY2F0aW9uLmhvc3RuYW1lKX1gO1xuXG4vKipcbiAqINCk0YPQvdC60YbQuNGPINC00LvRjyDRgdC+0YXRgNCw0L3QtdC90LjRjyDQvdCw0YHRgtGA0L7QtdC6LlxuICog0JXRgdC70Lgg0L7QsdGK0LXQutGCINC00LDQvdC90YvRhSDQv9GD0YHRgtC+0LksINGD0LTQsNC70Y/QtdGCINC60LvRjtGHINC40Lcg0YXRgNCw0L3QuNC70LjRidCwINGG0LXQu9C40LrQvtC8LlxuICog0JjQvdCw0YfQtSDRgdC+0YXRgNCw0L3Rj9C10YIg0L7QsdC90L7QstC70LXQvdC90YvQuSDQvtCx0YrQtdC60YIuXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICovXG5jb25zdCBzYXZlU2V0dGluZ3MgPSAoZGF0YSkgPT4ge1xuICAgIGlmIChPYmplY3Qua2V5cyhkYXRhKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgc3RvcmFnZS5yZW1vdmUoU0VUVElOR1NfS0VZKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzdG9yYWdlLnNldChTRVRUSU5HU19LRVksIGRhdGEpO1xuICAgIH1cbn07XG5cbi8qKlxuICog0J7QsdGK0LXQutGCINC00LvRjyDRgNCw0LHQvtGC0Ysg0YEg0LTQsNC90L3Ri9C80Lgg0LDQstGC0L7RgNC40LfQsNGG0LjQuC5cbiAqINCl0YDQsNC90LjRgiB7IGxvZ2luLCBwYXNzd29yZCB9INCyINC+0LTQvdC+0LwgSlNPTi3QvtCx0YrQtdC60YLQtS5cbiAqL1xuZXhwb3J0IGNvbnN0IGF1dGhTdG9yYWdlID0ge1xuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQsNC10YIg0L/QvtC70L3Ri9C1INC00LDQvdC90YvQtSDQsNCy0YLQvtGA0LjQt9Cw0YbQuNC4XG4gICAgICogQHJldHVybnMge3tsb2dpbjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nfX1cbiAgICAgKi9cbiAgICBnZXRDcmVkZW50aWFsczogKCkgPT4ge1xuICAgICAgICBjb25zdCBkYXRhID0gc3RvcmFnZS5nZXQoQVVUSF9LRVksIHt9KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxvZ2luOiBkYXRhLmxvZ2luIHx8ICcnLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IGRhdGEucGFzc3dvcmQgfHwgJycsXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCh0L7RhdGA0LDQvdGP0LXRgiDQtNCw0L3QvdGL0LUg0LDQstGC0L7RgNC40LfQsNGG0LjQuCDQsNGC0L7QvNCw0YDQvdC+XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxvZ2luXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhc3N3b3JkXG4gICAgICovXG4gICAgc2V0Q3JlZGVudGlhbHM6IChsb2dpbiwgcGFzc3dvcmQpID0+IHtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZERhdGEgPSB7XG4gICAgICAgICAgICBsb2dpbjogU3RyaW5nKGxvZ2luIHx8ICcnKS50cmltKCksXG4gICAgICAgICAgICBwYXNzd29yZDogU3RyaW5nKHBhc3N3b3JkIHx8ICcnKS50cmltKCksXG4gICAgICAgIH07XG4gICAgICAgIHN0b3JhZ2Uuc2V0KEFVVEhfS0VZLCBub3JtYWxpemVkRGF0YSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCf0YDQvtCy0LXRgNGP0LXRgiwg0LXRgdGC0Ywg0LvQuCDQv9C+0LvQvdGL0LUg0LTQsNC90L3Ri9C1INC00LvRjyDQsNCy0YLQvtGA0LjQt9Cw0YbQuNC4XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaGFzQ3JlZGVudGlhbHM6ICgpID0+IHtcbiAgICAgICAgY29uc3QgeyBsb2dpbiwgcGFzc3dvcmQgfSA9IGF1dGhTdG9yYWdlLmdldENyZWRlbnRpYWxzKCk7XG4gICAgICAgIHJldHVybiBCb29sZWFuKGxvZ2luICYmIHBhc3N3b3JkKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0KPQtNCw0LvRj9C10YIg0LLRgdC1INC00LDQvdC90YvQtSDQsNCy0YLQvtGA0LjQt9Cw0YbQuNC4INC00LvRjyDRgtC10LrRg9GJ0LXQs9C+INC00L7QvNC10L3QsFxuICAgICAqL1xuICAgIGNsZWFyQ3JlZGVudGlhbHM6ICgpID0+IHtcbiAgICAgICAgc3RvcmFnZS5yZW1vdmUoQVVUSF9LRVkpO1xuICAgIH0sXG59O1xuXG4vKipcbiAqINCe0LHRitC10LrRgiDQtNC70Y8g0YDQsNCx0L7RgtGLINGBINC90LDRgdGC0YDQvtC50LrQsNC80Lgg0LjQvdGC0LXRgNGE0LXQudGB0LAuXG4gKi9cbmV4cG9ydCBjb25zdCBzZXR0aW5nc1N0b3JhZ2UgPSB7XG4gICAgLyoqXG4gICAgICog0J/QvtC70YPRh9Cw0LXRgiDQutCw0YHRgtC+0LzQvdC+0LUg0LjQvNGPINC80L7QtNC10LvQuFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd8dW5kZWZpbmVkfVxuICAgICAqL1xuICAgIGdldE1vZGVsTmFtZTogKCkgPT4ge1xuICAgICAgICBjb25zdCBkYXRhID0gc3RvcmFnZS5nZXQoU0VUVElOR1NfS0VZLCB7fSk7XG4gICAgICAgIHJldHVybiBkYXRhLm1vZGVsTmFtZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0KHQvtGF0YDQsNC90Y/QtdGCINC60LDRgdGC0L7QvNC90L7QtSDQuNC80Y8g0LzQvtC00LXQu9C4XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKi9cbiAgICBzZXRNb2RlbE5hbWU6IChuYW1lKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBzdG9yYWdlLmdldChTRVRUSU5HU19LRVksIHt9KTtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZE5hbWUgPSBTdHJpbmcobmFtZSB8fCAnJykudHJpbSgpO1xuXG4gICAgICAgIGlmIChub3JtYWxpemVkTmFtZSkge1xuICAgICAgICAgICAgZGF0YS5tb2RlbE5hbWUgPSBub3JtYWxpemVkTmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBkYXRhLm1vZGVsTmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmVTZXR0aW5ncyhkYXRhKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0KHQsdGA0LDRgdGL0LLQsNC10YIg0LjQvNGPINC80L7QtNC10LvQuFxuICAgICAqL1xuICAgIGNsZWFyTW9kZWxOYW1lOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBzdG9yYWdlLmdldChTRVRUSU5HU19LRVksIHt9KTtcbiAgICAgICAgZGVsZXRlIGRhdGEubW9kZWxOYW1lO1xuICAgICAgICBzYXZlU2V0dGluZ3MoZGF0YSk7XG4gICAgfSxcbn07XG4iLCJleHBvcnQgZGVmYXVsdCBcIiNkZXZpY2UtZmlsdGVyLWlucHV0e3dpZHRoOjI3NXB4O2JvcmRlcjpub25lO3BhZGRpbmc6MTFweDttYXJnaW46LTEwcHggMCA2cHg7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudDtjb2xvcjojYzJjMmMyfVxcblwiOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbmNvbnN0IF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0Y29uc3QgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdGNvbnN0IG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHRjb25zdCBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiY29uc3Qgd2VicGFja1F1ZXVlcyA9IFN5bWJvbChcIndlYnBhY2sgcXVldWVzXCIpO1xuY29uc3Qgd2VicGFja0V4cG9ydHMgPSBTeW1ib2woXCJ3ZWJwYWNrIGV4cG9ydHNcIik7XG5jb25zdCB3ZWJwYWNrRXJyb3IgPSBTeW1ib2woXCJ3ZWJwYWNrIGVycm9yXCIpO1xuXG5jb25zdCByZXNvbHZlUXVldWUgPSAocXVldWUpID0+IHtcblx0aWYocXVldWU/LmQgPCAxKSB7XG5cdFx0cXVldWUuZCA9IDE7XG5cdFx0cXVldWUuZm9yRWFjaCgoZm4pID0+IChmbi5yLS0pKTtcblx0XHRxdWV1ZS5mb3JFYWNoKChmbikgPT4gKGZuLnItLSA/IGZuLnIrKyA6IGZuKCkpKTtcblx0fVxufVxuY29uc3Qgd3JhcERlcHMgPSAoZGVwcykgPT4gKGRlcHMubWFwKChkZXApID0+IHtcblx0aWYoZGVwICE9PSBudWxsICYmIHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpIHtcblxuXHRcdGlmKGRlcFt3ZWJwYWNrUXVldWVzXSkgcmV0dXJuIGRlcDtcblx0XHRpZihkZXAudGhlbikge1xuXHRcdFx0Y29uc3QgcXVldWUgPSBbXTtcblx0XHRcdHF1ZXVlLmQgPSAwO1xuXHRcdFx0ZGVwLnRoZW4oKHIpID0+IHtcblx0XHRcdFx0b2JqW3dlYnBhY2tFeHBvcnRzXSA9IHI7XG5cdFx0XHRcdHJlc29sdmVRdWV1ZShxdWV1ZSk7XG5cdFx0XHR9LCAoZSkgPT4ge1xuXHRcdFx0XHRvYmpbd2VicGFja0Vycm9yXSA9IGU7XG5cdFx0XHRcdHJlc29sdmVRdWV1ZShxdWV1ZSk7XG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IG9iaiA9IHt9O1xuXG5cdFx0XHRvYmpbd2VicGFja1F1ZXVlc10gPSAoZm4pID0+IChmbihxdWV1ZSkpO1xuXHRcdFx0cmV0dXJuIG9iajtcblx0XHR9XG5cdH1cblx0Y29uc3QgcmV0ID0ge307XG5cdHJldFt3ZWJwYWNrUXVldWVzXSA9IHggPT4ge307XG5cdHJldFt3ZWJwYWNrRXhwb3J0c10gPSBkZXA7XG5cdHJldHVybiByZXQ7XG59KSk7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLmEgPSAobW9kdWxlLCBib2R5LCBoYXNBd2FpdCkgPT4ge1xuXHRsZXQgcXVldWU7XG5cdGhhc0F3YWl0ICYmICgocXVldWUgPSBbXSkuZCA9IC0xKTtcblx0Y29uc3QgZGVwUXVldWVzID0gbmV3IFNldCgpO1xuXHRjb25zdCBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHM7XG5cdGxldCBjdXJyZW50RGVwcztcblx0bGV0IG91dGVyUmVzb2x2ZTtcblx0bGV0IHJlamVjdDtcblx0Y29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWopID0+IHtcblx0XHRyZWplY3QgPSByZWo7XG5cdFx0b3V0ZXJSZXNvbHZlID0gcmVzb2x2ZTtcblx0fSk7XG5cdHByb21pc2Vbd2VicGFja0V4cG9ydHNdID0gZXhwb3J0cztcblx0cHJvbWlzZVt3ZWJwYWNrUXVldWVzXSA9IChmbikgPT4gKHF1ZXVlICYmIGZuKHF1ZXVlKSwgZGVwUXVldWVzLmZvckVhY2goZm4pLCBwcm9taXNlW1wiY2F0Y2hcIl0oeCA9PiB7fSkpO1xuXHRtb2R1bGUuZXhwb3J0cyA9IHByb21pc2U7XG5cdGNvbnN0IGhhbmRsZSA9IChkZXBzKSA9PiB7XG5cdFx0Y3VycmVudERlcHMgPSB3cmFwRGVwcyhkZXBzKTtcblx0XHRsZXQgZm47XG5cdFx0Y29uc3QgZ2V0UmVzdWx0ID0gKCkgPT4gKGN1cnJlbnREZXBzLm1hcCgoZCkgPT4ge1xuXG5cdFx0XHRpZihkW3dlYnBhY2tFcnJvcl0pIHRocm93IGRbd2VicGFja0Vycm9yXTtcblx0XHRcdHJldHVybiBkW3dlYnBhY2tFeHBvcnRzXTtcblx0XHR9KSlcblx0XHRjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdGZuID0gKCkgPT4gKHJlc29sdmUoZ2V0UmVzdWx0KSk7XG5cdFx0XHRmbi5yID0gMDtcblx0XHRcdGNvbnN0IGZuUXVldWUgPSAocSkgPT4gKHEgIT09IHF1ZXVlICYmICFkZXBRdWV1ZXMuaGFzKHEpICYmIChkZXBRdWV1ZXMuYWRkKHEpLCBxICYmICFxLmQgJiYgKGZuLnIrKywgcS5wdXNoKGZuKSkpKTtcblx0XHRcdGN1cnJlbnREZXBzLmZvckVhY2goKGRlcCkgPT4gKGRlcFt3ZWJwYWNrUXVldWVzXShmblF1ZXVlKSkpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBmbi5yID8gcHJvbWlzZSA6IGdldFJlc3VsdCgpO1xuXHR9XG5cdGNvbnN0IGRvbmUgPSAoZXJyKSA9PiAoKGVyciA/IHJlamVjdChwcm9taXNlW3dlYnBhY2tFcnJvcl0gPSBlcnIpIDogb3V0ZXJSZXNvbHZlKGV4cG9ydHMpKSwgcmVzb2x2ZVF1ZXVlKHF1ZXVlKSlcblxuXHRib2R5KGhhbmRsZSwgZG9uZSk7XG5cdHF1ZXVlPy5kIDwgMCAmJiAocXVldWUuZCA9IDApO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyL3ZhbHVlIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRpZihBcnJheS5pc0FycmF5KGRlZmluaXRpb24pKSB7XG5cdFx0dmFyIGkgPSAwO1xuXHRcdHdoaWxlKGkgPCBkZWZpbml0aW9uLmxlbmd0aCkge1xuXHRcdFx0dmFyIGtleSA9IGRlZmluaXRpb25baSsrXTtcblx0XHRcdHZhciBiaW5kaW5nID0gZGVmaW5pdGlvbltpKytdO1xuXHRcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRcdGlmKGJpbmRpbmcgPT09IDApIHtcblx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiBkZWZpbml0aW9uW2krK10gfSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGJpbmRpbmcgfSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZihiaW5kaW5nID09PSAwKSB7IGkrKzsgfVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnbW9kdWxlJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG5sZXQgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9rZWVuZXRpYy9pbmRleC5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==