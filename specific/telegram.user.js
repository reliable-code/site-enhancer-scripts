// ==UserScript==
// @name         Telegram messages filter
// @description  Hide messages by filter
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @match        https://web.telegram.org/k/*
// @namespace    https://github.com/reliable-code/site-enhancer-scripts
// @version      1.0.78714669
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegram.org
// @author       reliable-code
// @downloadURL  https://raw.githubusercontent.com/reliable-code/site-enhancer-scripts/main/specific/telegram.user.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "./src/telegram/filters-template.html":
/*!********************************************!*\
  !*** ./src/telegram/filters-template.html ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<div id=\"tg-filter-chat-title\">\r\n    Чат: (неизвестно)\r\n</div>\r\n<div class=\"tg-filter-controls\">\r\n    <button type=\"button\" id=\"tg-filter-decrease\" class=\"tg-round-btn\">−</button>\r\n    <input type=\"number\" id=\"tg-filter-chat-limit\" min=\"0\"/>\r\n    <button type=\"button\" id=\"tg-filter-increase\" class=\"tg-round-btn\">+</button>\r\n</div>\r\n<div class=\"tg-filter-label\">\r\n    Мин. реакций\r\n</div>\r\n<button type=\"button\" id=\"tg-filter-toggle\" class=\"tg-full-width-btn\"\r\n        style=\"background: #eefbee; border-color: #c3e6cb;\">\r\n    Фильтр: ВКЛ\r\n</button>\r\n<button type=\"button\" id=\"tg-filter-refresh\" class=\"tg-full-width-btn tg-hidden\">\r\n    ↻ Обновить\r\n</button>\r\n");

/***/ }),

/***/ "./src/telegram/storage.js":
/*!*********************************!*\
  !*** ./src/telegram/storage.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   filterStorage: () => (/* binding */ filterStorage)
/* harmony export */ });
/* unused harmony exports FILTER_KEYS, CHAT_SETTING_KEYS */
/* harmony import */ var _common_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/storage */ "./src/common/storage.js");

const FILTER_KEYS = {
  CHATS_SETTINGS: "tg_filter_chats_settings"
};
const CHAT_SETTING_KEYS = {
  MIN_REACTIONS: "minReactions"
};
const CONFIG = {
  /** Значение минимальных реакций по умолчанию */
  DEFAULT_MIN_REACTIONS: 0
};
const filterStorage = {
  // === Работа с настройками всех чатов ===
  /**
   * Получает все сохраненные настройки чатов
   * @returns {ChatsSettings} Объект с настройками для всех чатов
   */
  getChatsSettings: () => _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.get(FILTER_KEYS.CHATS_SETTINGS, {}),
  /**
   * Устанавливает все настройки чатов
   * @param {ChatsSettings|Object} settings - Объект с настройками чатов
   */
  setChatsSettings: (settings) => {
    const validSettings = typeof settings === "object" && settings !== null ? settings : {};
    _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.set(FILTER_KEYS.CHATS_SETTINGS, validSettings);
  },
  // === Работа с настройками конкретного чата ===
  /**
   * Получает настройки конкретного чата
   * @param {string} chatName - Название чата
   * @returns {ChatSettings} Настройки чата
   */
  getChatSettings: (chatName) => {
    if (!chatName || typeof chatName !== "string") {
      return { [CHAT_SETTING_KEYS.MIN_REACTIONS]: CONFIG.DEFAULT_MIN_REACTIONS };
    }
    const allSettings = filterStorage.getChatsSettings();
    return allSettings[chatName] || { [CHAT_SETTING_KEYS.MIN_REACTIONS]: CONFIG.DEFAULT_MIN_REACTIONS };
  },
  /**
   * Устанавливает настройки конкретного чата
   * @param {string} chatName - Название чата
   * @param {ChatSettings|Object} chatSettings - Настройки чата
   */
  setChatSettings: (chatName, chatSettings) => {
    if (!chatName || typeof chatName !== "string") {
      console.warn("Invalid chat name provided");
      return;
    }
    const validChatSettings = typeof chatSettings === "object" && chatSettings !== null ? chatSettings : {};
    const allSettings = filterStorage.getChatsSettings();
    allSettings[chatName] = validChatSettings;
    filterStorage.setChatsSettings(allSettings);
  },
  /**
   * Получает конкретную настройку чата
   * @param {string} chatName - Название чата
   * @param {string} settingKey - Ключ настройки
   * @param {*} defaultValue - Значение по умолчанию
   * @returns {*} Значение настройки
   */
  getChatSetting: (chatName, settingKey, defaultValue = null) => {
    const chatSettings = filterStorage.getChatSettings(chatName);
    return chatSettings[settingKey] ?? defaultValue;
  },
  /**
   * Устанавливает конкретную настройку чата
   * @param {string} chatName - Название чата
   * @param {string} settingKey - Ключ настройки
   * @param {*} value - Значение настройки
   */
  setChatSetting: (chatName, settingKey, value) => {
    const chatSettings = filterStorage.getChatSettings(chatName);
    chatSettings[settingKey] = value;
    filterStorage.setChatSettings(chatName, chatSettings);
  },
  /**
   * Получает минимальное количество реакций для чата
   * @param {string} chatName - Название чата
   * @returns {number} Минимальное количество реакций
   */
  getMinReactions: (chatName) => filterStorage.getChatSetting(
    chatName,
    CHAT_SETTING_KEYS.MIN_REACTIONS,
    CONFIG.DEFAULT_MIN_REACTIONS
  ),
  /**
   * Устанавливает минимальное количество реакций для чата
   * @param {string} chatName - Название чата
   * @param {number|string} value - Минимальное количество реакций
   */
  setMinReactions: (chatName, value) => {
    const numericValue = Math.max(0, parseInt(value, 10) || 0);
    filterStorage.setChatSetting(chatName, CHAT_SETTING_KEYS.MIN_REACTIONS, numericValue);
  },
  /**
   * Удаляет все настройки конкретного чата
   * @param {string} chatName - Название чата
   */
  removeChatSettings: (chatName) => {
    if (!chatName || typeof chatName !== "string") {
      return;
    }
    const allSettings = filterStorage.getChatsSettings();
    delete allSettings[chatName];
    filterStorage.setChatsSettings(allSettings);
  },
  /**
   * Проверяет, есть ли настройки для конкретного чата
   * @param {string} chatName - Название чата
   * @returns {boolean} true, если есть настройки для чата
   */
  hasChatSettings: (chatName) => {
    if (!chatName || typeof chatName !== "string") {
      return false;
    }
    const allSettings = filterStorage.getChatsSettings();
    return chatName in allSettings;
  },
  // === Утилиты ===
  /**
   * Получает список всех чатов с настройками
   * @returns {string[]} Массив названий чатов
   */
  getAllChatNames: () => {
    const allSettings = filterStorage.getChatsSettings();
    return Object.keys(allSettings);
  },
  // === Очистка данных ===
  /**
   * Очищает все настройки фильтров
   */
  clearAllData: () => {
    _common_storage__WEBPACK_IMPORTED_MODULE_0__.storage.remove(FILTER_KEYS.CHATS_SETTINGS);
  }
};


/***/ }),

/***/ "./src/telegram/styles.css":
/*!*********************************!*\
  !*** ./src/telegram/styles.css ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".tg-hidden{display:none}.bubble-collapsed{opacity:.2!important;max-height:40px!important;overflow:hidden!important;transition:opacity .3s ease,max-height .3s ease!important;position:relative!important;cursor:pointer}.bubble-collapsed:after{content:\"\";position:absolute;bottom:0;left:0;right:0;height:10px;background:linear-gradient(transparent,#0000001a);pointer-events:none}.bubble-expanded{opacity:1!important;max-height:none!important;transition:opacity .3s ease,max-height .3s ease!important}.reactions-collapsed{opacity:.2!important;transition:opacity .3s ease!important}.reactions-expanded{opacity:1!important;transition:opacity .3s ease!important}#tg-filter-panel{position:fixed;bottom:15px;right:15px;width:180px;padding:8px;background:#fff;border:1px solid #ccc;border-radius:10px;box-shadow:0 2px 6px #00000040;z-index:9999;font-size:13px;display:none;font-family:sans-serif}#tg-filter-chat-title{font-weight:700;margin-bottom:8px;text-align:center;font-size:14px}.tg-filter-controls{display:flex;align-items:center;justify-content:center;gap:10px}#tg-filter-chat-limit{width:60px;text-align:center;font-size:14px;padding:4px;border-radius:6px;border:1px solid #ccc}.tg-filter-label{margin-top:6px;font-size:11px;text-align:center;color:#666;margin-bottom:8px}#tg-filter-panel .tg-round-btn{width:28px;height:28px;border-radius:50%;border:1px solid #ccc;background:#f8f8f8;font-size:16px;font-weight:700;cursor:pointer;transition:background .2s,transform .1s}#tg-filter-panel .tg-round-btn:hover{background:#e6e6e6}#tg-filter-panel .tg-round-btn:active{transform:scale(.9)}.tg-full-width-btn{width:100%;margin-top:5px;padding:6px;border-radius:6px;border:1px solid #ccc;background:#f8f8f8;font-size:12px;cursor:pointer;transition:background .2s,transform .1s;text-align:center}.tg-full-width-btn:hover{background:#e6e6e6}.tg-full-width-btn:active{transform:scale(.98)}\n");

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
/*!*******************************!*\
  !*** ./src/telegram/index.js ***!
  \*******************************/
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.css */ "./src/telegram/styles.css");
/* harmony import */ var _filters_template_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filters-template.html */ "./src/telegram/filters-template.html");
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./storage */ "./src/telegram/storage.js");



const CONFIG = {
  HOVER_DELAY: 200,
  UNHOVER_DELAY: 0,
  CHECK_INTERVAL: 300
};
let isFilterEnabled = true;
function getCurrentChatName() {
  const h = window.location.hash;
  if (!h) return null;
  let s = h.replace(/^#/, "");
  if (s.startsWith("@")) s = s.slice(1);
  return s.split("/")[0] || null;
}
function countReactions(bubble) {
  let total = 0;
  const wrapper = bubble.closest(".bubble-content-wrapper") || bubble;
  const reactionElements = wrapper.querySelectorAll("reaction-element, .reaction-element");
  reactionElements.forEach((el) => {
    const counterEl = el.querySelector(".reaction-counter");
    if (counterEl) {
      const val = parseInt(counterEl.textContent.trim(), 10);
      total += Number.isNaN(val) ? 1 : val;
      return;
    }
    const avatars = el.querySelectorAll(".stacked-avatars-avatar-container");
    if (avatars.length > 0) {
      total += avatars.length;
      return;
    }
    total += 1;
  });
  return total;
}
function setBubbleState(bubble, reactionsElement, state, totalReactions = null) {
  bubble.classList.remove("bubble-collapsed", "bubble-expanded", "bubble-pinned");
  if (reactionsElement) {
    reactionsElement.classList.remove("reactions-collapsed", "reactions-expanded");
  }
  if (totalReactions !== null) {
    bubble.title = `\u0420\u0435\u0430\u043A\u0446\u0438\u0439: ${totalReactions}`;
  }
  switch (state) {
    case "expanded":
      bubble.classList.add("bubble-expanded");
      if (reactionsElement) reactionsElement.classList.add("reactions-expanded");
      break;
    case "collapsed":
      bubble.classList.add("bubble-collapsed");
      if (reactionsElement) reactionsElement.classList.add("reactions-collapsed");
      break;
    case "pinned":
      bubble.classList.add("bubble-pinned", "bubble-expanded");
      if (reactionsElement) reactionsElement.classList.add("reactions-expanded");
      break;
  }
}
function attachHover(bubble, reactionsElement) {
  if (bubble.dataset.hasHoverHandlers === "1") return;
  let showTimeout;
  let hideTimeout;
  const showBubble = () => {
    clearTimeout(hideTimeout);
    setBubbleState(bubble, reactionsElement, "expanded");
  };
  const hideBubble = () => {
    clearTimeout(showTimeout);
    if (bubble.classList.contains("bubble-pinned")) return;
    setBubbleState(bubble, reactionsElement, "collapsed");
  };
  const onMouseEnter = () => {
    clearTimeout(hideTimeout);
    showTimeout = setTimeout(showBubble, CONFIG.HOVER_DELAY);
  };
  const onMouseLeave = () => {
    clearTimeout(showTimeout);
    hideTimeout = setTimeout(hideBubble, CONFIG.UNHOVER_DELAY);
  };
  bubble.addEventListener("mouseenter", onMouseEnter, { passive: true });
  bubble.addEventListener("mouseleave", onMouseLeave, { passive: true });
  if (reactionsElement) {
    reactionsElement.addEventListener("mouseenter", onMouseEnter, { passive: true });
    reactionsElement.addEventListener("mouseleave", onMouseLeave, { passive: true });
  }
  bubble.addEventListener("click", () => {
    const isPinned = bubble.classList.contains("bubble-pinned");
    if (isPinned) {
      setBubbleState(bubble, reactionsElement, "collapsed");
    } else {
      setBubbleState(bubble, reactionsElement, "pinned");
    }
  });
  bubble.dataset.hasHoverHandlers = "1";
}
function processBubble(bubble, minReactions, force = false) {
  const totalReactions = countReactions(bubble);
  const wrapper = bubble.closest(".bubble-content-wrapper");
  const reactionsElement = wrapper?.querySelector("reactions-element");
  bubble.title = `\u0420\u0435\u0430\u043A\u0446\u0438\u0439: ${totalReactions}`;
  if (bubble.closest(".is-out")) {
    if (!bubble.classList.contains("bubble-expanded")) {
      setBubbleState(bubble, reactionsElement, "expanded", totalReactions);
    }
    return;
  }
  if (bubble.classList.contains("bubble-pinned")) {
    return;
  }
  if (bubble.matches(":hover") || reactionsElement && reactionsElement.matches(":hover")) {
    return;
  }
  if (!isFilterEnabled) {
    if (!bubble.classList.contains("bubble-expanded")) {
      setBubbleState(bubble, reactionsElement, "expanded", totalReactions);
    }
    return;
  }
  const lastKnownCount = parseInt(bubble.dataset.lastCount, 10);
  const shouldBeExpanded = totalReactions >= minReactions;
  const isExpanded = bubble.classList.contains("bubble-expanded");
  if (!force && lastKnownCount === totalReactions) {
    if (shouldBeExpanded === isExpanded) return;
  }
  bubble.dataset.lastCount = totalReactions;
  if (shouldBeExpanded) {
    setBubbleState(bubble, reactionsElement, "expanded", totalReactions);
  } else {
    setBubbleState(bubble, reactionsElement, "collapsed", totalReactions);
    attachHover(bubble, reactionsElement);
  }
}
function refreshAllBubbles(force = false) {
  const chatName = getCurrentChatName();
  if (!chatName) return;
  const minReactions = _storage__WEBPACK_IMPORTED_MODULE_2__.filterStorage.getMinReactions(chatName);
  const bubbles = document.querySelectorAll(".bubble-content");
  bubbles.forEach((bubble) => processBubble(bubble, minReactions, force));
}
let panel;
let input;
let lastChatName = null;
function initUI() {
  if (document.getElementById("tg-filter-panel")) {
    panel = document.getElementById("tg-filter-panel");
    input = panel.querySelector("#tg-filter-chat-limit");
    return;
  }
  panel = document.createElement("div");
  panel.id = "tg-filter-panel";
  panel.innerHTML = _filters_template_html__WEBPACK_IMPORTED_MODULE_1__["default"];
  document.body.appendChild(panel);
  input = panel.querySelector("#tg-filter-chat-limit");
  const btnMinus = panel.querySelector("#tg-filter-decrease");
  const btnPlus = panel.querySelector("#tg-filter-increase");
  const btnRefresh = panel.querySelector("#tg-filter-refresh");
  const btnToggle = panel.querySelector("#tg-filter-toggle");
  btnToggle.addEventListener("click", () => {
    isFilterEnabled = !isFilterEnabled;
    if (isFilterEnabled) {
      btnToggle.textContent = "\u0424\u0438\u043B\u044C\u0442\u0440: \u0412\u041A\u041B";
      btnToggle.style.background = "#eefbee";
      btnToggle.style.borderColor = "#c3e6cb";
      btnToggle.style.color = "#000";
      input.disabled = false;
    } else {
      btnToggle.textContent = "\u0424\u0438\u043B\u044C\u0442\u0440: \u0412\u042B\u041A\u041B";
      btnToggle.style.background = "#f8d7da";
      btnToggle.style.borderColor = "#f5c6cb";
      btnToggle.style.color = "#721c24";
      input.disabled = true;
    }
    refreshAllBubbles(true);
  });
  btnRefresh.addEventListener("click", () => {
    refreshAllBubbles(true);
  });
  function applyValue(val) {
    const chatName = getCurrentChatName();
    if (!chatName) return;
    const safe = Math.max(0, parseInt(val, 10) || 0);
    _storage__WEBPACK_IMPORTED_MODULE_2__.filterStorage.setMinReactions(chatName, safe);
    input.value = safe;
    refreshAllBubbles(true);
  }
  let debounceTimer;
  input.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => applyValue(e.target.value), 300);
  });
  btnMinus.addEventListener("click", () => applyValue((parseInt(input.value, 10) || 0) - 1));
  btnPlus.addEventListener("click", () => applyValue((parseInt(input.value, 10) || 0) + 1));
}
function updatePanel() {
  const chatName = getCurrentChatName();
  if (!chatName) {
    panel.style.display = "none";
    lastChatName = null;
    return;
  }
  panel.style.display = "block";
  input.value = _storage__WEBPACK_IMPORTED_MODULE_2__.filterStorage.getMinReactions(chatName);
  const title = panel.querySelector("#tg-filter-chat-title");
  title.textContent = `\u0427\u0430\u0442: ${chatName}`;
  lastChatName = chatName;
}
function refreshChatView() {
  if (document.hidden) return;
  const chatName = getCurrentChatName();
  if (!chatName) return;
  if (chatName !== lastChatName) updatePanel();
  refreshAllBubbles();
}
function setupSidebarHeaderObserver() {
  const sidebarHeader = document.querySelector("div.sidebar-header.topbar");
  if (!sidebarHeader) {
    console.log("Sidebar header not found, retrying in 1 second...");
    setTimeout(setupSidebarHeaderObserver, 1e3);
    return;
  }
  new MutationObserver(refreshChatView).observe(sidebarHeader, {
    attributes: true,
    attributeFilter: ["class"]
  });
}
GM_addStyle(_styles_css__WEBPACK_IMPORTED_MODULE_0__["default"]);
initUI();
updatePanel();
refreshAllBubbles();
setupSidebarHeaderObserver();
setInterval(refreshChatView, CONFIG.CHECK_INTERVAL);
window.TelegramFilter = {
  refresh: refreshAllBubbles,
  getCurrentChat: getCurrentChatName,
  storage: {
    getChatsSettings: _storage__WEBPACK_IMPORTED_MODULE_2__.filterStorage.getChatsSettings,
    getAllChatNames: _storage__WEBPACK_IMPORTED_MODULE_2__.filterStorage.getAllChatNames,
    removeChatSettings: _storage__WEBPACK_IMPORTED_MODULE_2__.filterStorage.removeChatSettings,
    clearAllData: _storage__WEBPACK_IMPORTED_MODULE_2__.filterStorage.clearAllData
  }
};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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a0I7QUFDdEI7QUFFQSxTQUFTLDZCQUE2QjtBQUNsQyxRQUFNLGdCQUFnQixTQUFTLGNBQWMsMkJBQTJCO0FBQ3hFLE1BQUksQ0FBQyxlQUFlO0FBQ2hCLFlBQVEsSUFBSSxtREFBbUQ7QUFDL0QsZUFBVyw0QkFBNEIsR0FBSTtBQUMzQztBQUFBLEVBQ0o7QUFFQSxNQUFJLGlCQUFpQixlQUFlLEVBQUUsUUFBUSxlQUFlO0FBQUEsSUFDekQsWUFBWTtBQUFBLElBQ1osaUJBQWlCLENBQUMsT0FBTztBQUFBLEVBQzdCLENBQUM7QUFDTDtBQUVBLFlBQVksbURBQU07QUFDbEIsT0FBTztBQUNQLFlBQVk7QUFDWixrQkFBa0I7QUFDbEIsMkJBQTJCO0FBRzNCLFlBQVksaUJBQWlCLE9BQU8sY0FBYztBQUVsRCxPQUFPLGlCQUFpQjtBQUFBLEVBQ3BCLFNBQVM7QUFBQSxFQUNULGdCQUFnQjtBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNMLGtCQUFrQixtREFBYSxDQUFDO0FBQUEsSUFDaEMsaUJBQWlCLG1EQUFhLENBQUM7QUFBQSxJQUMvQixvQkFBb0IsbURBQWEsQ0FBQztBQUFBLElBQ2xDLGNBQWMsbURBQWEsQ0FBQztBQUFBLEVBQ2hDO0FBQ0oiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL3N0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RlbGVncmFtL2ZpbHRlcnMtdGVtcGxhdGUuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvdGVsZWdyYW0vc3RvcmFnZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdGVsZWdyYW0vc3R5bGVzLmNzcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vLi9zcmMvdGVsZWdyYW0vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IHN0b3JhZ2UgPSB7XG4gICAgLyoqXG4gICAgICog0J/QvtC70YPRh9C10L3QuNC1INC00LDQvdC90YvRhSDQuNC3IEdNIHN0b3JhZ2VcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0g0LrQu9GO0YdcbiAgICAgKiBAcGFyYW0geyp9IGRlZmF1bHRWYWx1ZSAtINC30L3QsNGH0LXQvdC40LUg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cbiAgICAgKiBAcmV0dXJucyB7Kn0g0LfQvdCw0YfQtdC90LjQtSDQuNC70LggZGVmYXVsdFZhbHVlXG4gICAgICovXG4gICAgZ2V0OiAoa2V5LCBkZWZhdWx0VmFsdWUgPSBudWxsKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gR01fZ2V0VmFsdWUoa2V5LCBkZWZhdWx0VmFsdWUpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBTdG9yYWdlIGdldCBlcnJvciBmb3Iga2V5IFwiJHtrZXl9XCI6YCwgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQodC+0YXRgNCw0L3QtdC90LjQtSDQtNCw0L3QvdGL0YUg0LIgR00gc3RvcmFnZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSDQutC70Y7Rh1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgLSDQt9C90LDRh9C10L3QuNC1ICjQu9GO0LHQvtC5INGC0LjQvylcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g0YPRgdC/0LXRiNC90L7RgdGC0Ywg0L7Qv9C10YDQsNGG0LjQuFxuICAgICAqL1xuICAgIHNldDogKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIEdNX3NldFZhbHVlKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFN0b3JhZ2Ugc2V0IGVycm9yIGZvciBrZXkgXCIke2tleX1cIjpgLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0J7QsdC90L7QstC70LXQvdC40LUg0YHRg9GJ0LXRgdGC0LLRg9GO0YnQuNGFINC00LDQvdC90YvRhSDRh9C10YDQtdC3INGE0YPQvdC60YbQuNGOXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtINC60LvRjtGHXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gdXBkYXRlRm4gLSDRhNGD0L3QutGG0LjRjyDQvtCx0L3QvtCy0LvQtdC90LjRjyAo0L/QvtC70YPRh9Cw0LXRgiDRgtC10LrRg9GJ0LXQtSDQt9C90LDRh9C10L3QuNC1LCDQstC+0LfQstGA0LDRidCw0LXRgiDQvdC+0LLQvtC1KVxuICAgICAqIEBwYXJhbSB7Kn0gZGVmYXVsdFZhbHVlIC0g0LfQvdCw0YfQtdC90LjQtSDQv9C+INGD0LzQvtC70YfQsNC90LjRjiDQtdGB0LvQuCDQutC70Y7RhyDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCXG4gICAgICogQHJldHVybnMgeyp9INC90L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtVxuICAgICAqL1xuICAgIHVwZGF0ZTogKGtleSwgdXBkYXRlRm4sIGRlZmF1bHRWYWx1ZSA9IG51bGwpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHN0b3JhZ2UuZ2V0KGtleSwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gdXBkYXRlRm4oY3VycmVudFZhbHVlKTtcbiAgICAgICAgICAgIHN0b3JhZ2Uuc2V0KGtleSwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIG5ld1ZhbHVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBTdG9yYWdlIHVwZGF0ZSBlcnJvciBmb3Iga2V5IFwiJHtrZXl9XCI6YCwgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2UuZ2V0KGtleSwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQo9C00LDQu9C10L3QuNC1INC00LDQvdC90YvRhSDQuNC3IEdNIHN0b3JhZ2VcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0g0LrQu9GO0YdcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g0YPRgdC/0LXRiNC90L7RgdGC0Ywg0L7Qv9C10YDQsNGG0LjQuFxuICAgICAqL1xuICAgIHJlbW92ZTogKGtleSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgR01fZGVsZXRlVmFsdWUoa2V5KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBTdG9yYWdlIHJlbW92ZSBlcnJvciBmb3Iga2V5IFwiJHtrZXl9XCI6YCwgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCf0YDQvtCy0LXRgNC60LAg0YHRg9GJ0LXRgdGC0LLQvtCy0LDQvdC40Y8g0LrQu9GO0YfQsFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSDQutC70Y7Rh1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGhhczogKGtleSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uua2V5cygpLmluY2x1ZGVzKGtleSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFN0b3JhZ2UgaGFzIGVycm9yIGZvciBrZXkgXCIke2tleX1cIjpgLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0J/QvtC70YPRh9C10L3QuNC1INCy0YHQtdGFINC60LvRjtGH0LXQuVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmdbXX0g0LzQsNGB0YHQuNCyINC60LvRjtGH0LXQuVxuICAgICAqL1xuICAgIGtleXM6ICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBHTV9saXN0VmFsdWVzKCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2Uga2V5cyBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0J7Rh9C40YHRgtC60LAg0LTQsNC90L3Ri9GFINGB0LrRgNC40L/RgtCwXG4gICAgICogQHBhcmFtIHtzdHJpbmdbXX0ga2V5c1RvUmVtb3ZlIC0g0LzQsNGB0YHQuNCyINC60LvRjtGH0LXQuSDQtNC70Y8g0YPQtNCw0LvQtdC90LjRj1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSDRg9GB0L/QtdGI0L3QvtGB0YLRjCDQvtC/0LXRgNCw0YbQuNC4XG4gICAgICovXG4gICAgY2xlYXI6IChrZXlzVG9SZW1vdmUgPSBudWxsKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBhbGxLZXlzID0ga2V5c1RvUmVtb3ZlIHx8IHN0b3JhZ2Uua2V5cygpO1xuICAgICAgICAgICAgYWxsS2V5cy5mb3JFYWNoKChrZXkpID0+IEdNX2RlbGV0ZVZhbHVlKGtleSkpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgY2xlYXIgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCc0LDRgdGB0L7QstC+0LUg0L/QvtC70YPRh9C10L3QuNC1INC00LDQvdC90YvRhVxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IGtleXNMaXN0IC0g0LzQsNGB0YHQuNCyINC60LvRjtGH0LXQuVxuICAgICAqIEBwYXJhbSB7Kn0gZGVmYXVsdFZhbHVlIC0g0LfQvdCw0YfQtdC90LjQtSDQv9C+INGD0LzQvtC70YfQsNC90LjRjiDQtNC70Y8g0L7RgtGB0YPRgtGB0YLQstGD0Y7RidC40YUg0LrQu9GO0YfQtdC5XG4gICAgICogQHJldHVybnMge09iamVjdH0g0L7QsdGK0LXQutGCINGBINC/0LDRgNCw0LzQuCDQutC70Y7Rhy3Qt9C90LDRh9C10L3QuNC1XG4gICAgICovXG4gICAgZ2V0TXVsdGlwbGU6IChrZXlzTGlzdCwgZGVmYXVsdFZhbHVlID0gbnVsbCkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAgICAga2V5c0xpc3QuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IHN0b3JhZ2UuZ2V0KGtleSwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCc0LDRgdGB0L7QstC+0LUg0YHQvtGF0YDQsNC90LXQvdC40LUg0LTQsNC90L3Ri9GFXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSDQvtCx0YrQtdC60YIg0YEg0L/QsNGA0LDQvNC4INC60LvRjtGHLdC30L3QsNGH0LXQvdC40LVcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g0YPRgdC/0LXRiNC90L7RgdGC0Ywg0LLRgdC10YUg0L7Qv9C10YDQsNGG0LjQuVxuICAgICAqL1xuICAgIHNldE11bHRpcGxlOiAoZGF0YSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMoZGF0YSkuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgICAgICAgR01fc2V0VmFsdWUoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIHNldE11bHRpcGxlIGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQo9C00LDQu9C10L3QuNC1INC90LXRgdC60L7Qu9GM0LrQuNGFINC60LvRjtGH0LXQuVxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IGtleXNUb1JlbW92ZSAtINC80LDRgdGB0LjQsiDQutC70Y7Rh9C10Lkg0LTQu9GPINGD0LTQsNC70LXQvdC40Y8gKNC+0LHRj9C30LDRgtC10LvRjNC90YvQuSDQv9Cw0YDQsNC80LXRgtGAKVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSDRg9GB0L/QtdGI0L3QvtGB0YLRjCDQvtC/0LXRgNCw0YbQuNC4XG4gICAgICovXG4gICAgcmVtb3ZlTXVsdGlwbGU6IChrZXlzVG9SZW1vdmUpID0+IHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGtleXNUb1JlbW92ZSkgfHwga2V5c1RvUmVtb3ZlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIHJlbW92ZU11bHRpcGxlOiBrZXlzVG9SZW1vdmUgbXVzdCBiZSBhIG5vbi1lbXB0eSBhcnJheScpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGtleXNUb1JlbW92ZS5mb3JFYWNoKChrZXkpID0+IEdNX2RlbGV0ZVZhbHVlKGtleSkpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgcmVtb3ZlTXVsdGlwbGUgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQtdC90LjQtSDQutC+0LvQuNGH0LXRgdGC0LLQsCDRgdC+0YXRgNCw0L3QtdC90L3Ri9GFINC60LvRjtGH0LXQuVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9INC60L7Qu9C40YfQtdGB0YLQstC+INC60LvRjtGH0LXQuVxuICAgICAqL1xuICAgIGNvdW50OiAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmFnZS5rZXlzKCkubGVuZ3RoO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIGNvdW50IGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQtdC90LjQtSDQstGB0LXRhSDQtNCw0L3QvdGL0YUg0LIg0LLQuNC00LUg0L7QsdGK0LXQutGC0LBcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSDQvtCx0YrQtdC60YIg0YHQviDQstGB0LXQvNC4INGB0L7RhdGA0LDQvdC10L3QvdGL0LzQuCDQtNCw0L3QvdGL0LzQuFxuICAgICAqL1xuICAgIGdldEFsbDogKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgYWxsS2V5cyA9IHN0b3JhZ2Uua2V5cygpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgICAgICAgICBhbGxLZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gR01fZ2V0VmFsdWUoa2V5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSBnZXRBbGwgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCe0J/QkNCh0J3Qnjog0J7Rh9C40YHRgtC60LAg0LLRgdC10YUg0LTQsNC90L3Ri9GFINGB0LrRgNC40L/RgtCwXG4gICAgICogQHBhcmFtIHtib29sZWFufSBjb25maXJtQ2xlYXIgLSDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdGL0Lkg0YTQu9Cw0LMg0L/QvtC00YLQstC10YDQttC00LXQvdC40Y8gKNC00L7Qu9C20LXQvSDQsdGL0YLRjCB0cnVlKVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSDRg9GB0L/QtdGI0L3QvtGB0YLRjCDQvtC/0LXRgNCw0YbQuNC4XG4gICAgICovXG4gICAgY2xlYXJBbGw6IChjb25maXJtQ2xlYXIgPSBmYWxzZSkgPT4ge1xuICAgICAgICBpZiAoY29uZmlybUNsZWFyICE9PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgY2xlYXJBbGw6IGNvbmZpcm1DbGVhciBtdXN0IGJlIGV4cGxpY2l0bHkgc2V0IHRvIHRydWUnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBhbGxLZXlzID0gc3RvcmFnZS5rZXlzKCk7XG4gICAgICAgICAgICBhbGxLZXlzLmZvckVhY2goKGtleSkgPT4gR01fZGVsZXRlVmFsdWUoa2V5KSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSBjbGVhckFsbCBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0J/RgNC+0LLQtdGA0LrQsCDQv9GD0YHRgtC+0YLRiyDRhdGA0LDQvdC40LvQuNGJ0LBcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSDQtdGB0LvQuCDRhdGA0LDQvdC40LvQuNGJ0LUg0L/Rg9GB0YLQvtC1XG4gICAgICovXG4gICAgaXNFbXB0eTogKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uua2V5cygpLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSBpc0VtcHR5IGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcbn07XG4iLCJleHBvcnQgZGVmYXVsdCBcIjxkaXYgaWQ9XFxcInRnLWZpbHRlci1jaGF0LXRpdGxlXFxcIj5cXHJcXG4gICAg0KfQsNGCOiAo0L3QtdC40LfQstC10YHRgtC90L4pXFxyXFxuPC9kaXY+XFxyXFxuPGRpdiBjbGFzcz1cXFwidGctZmlsdGVyLWNvbnRyb2xzXFxcIj5cXHJcXG4gICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGlkPVxcXCJ0Zy1maWx0ZXItZGVjcmVhc2VcXFwiIGNsYXNzPVxcXCJ0Zy1yb3VuZC1idG5cXFwiPuKIkjwvYnV0dG9uPlxcclxcbiAgICA8aW5wdXQgdHlwZT1cXFwibnVtYmVyXFxcIiBpZD1cXFwidGctZmlsdGVyLWNoYXQtbGltaXRcXFwiIG1pbj1cXFwiMFxcXCIvPlxcclxcbiAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgaWQ9XFxcInRnLWZpbHRlci1pbmNyZWFzZVxcXCIgY2xhc3M9XFxcInRnLXJvdW5kLWJ0blxcXCI+KzwvYnV0dG9uPlxcclxcbjwvZGl2PlxcclxcbjxkaXYgY2xhc3M9XFxcInRnLWZpbHRlci1sYWJlbFxcXCI+XFxyXFxuICAgINCc0LjQvS4g0YDQtdCw0LrRhtC40LlcXHJcXG48L2Rpdj5cXHJcXG48YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgaWQ9XFxcInRnLWZpbHRlci10b2dnbGVcXFwiIGNsYXNzPVxcXCJ0Zy1mdWxsLXdpZHRoLWJ0blxcXCJcXHJcXG4gICAgICAgIHN0eWxlPVxcXCJiYWNrZ3JvdW5kOiAjZWVmYmVlOyBib3JkZXItY29sb3I6ICNjM2U2Y2I7XFxcIj5cXHJcXG4gICAg0KTQuNC70YzRgtGAOiDQktCa0JtcXHJcXG48L2J1dHRvbj5cXHJcXG48YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgaWQ9XFxcInRnLWZpbHRlci1yZWZyZXNoXFxcIiBjbGFzcz1cXFwidGctZnVsbC13aWR0aC1idG4gdGctaGlkZGVuXFxcIj5cXHJcXG4gICAg4oa7INCe0LHQvdC+0LLQuNGC0YxcXHJcXG48L2J1dHRvbj5cXHJcXG5cIjsiLCJpbXBvcnQgeyBzdG9yYWdlIH0gZnJvbSAnLi4vY29tbW9uL3N0b3JhZ2UnO1xuXG4vKipcbiAqINCa0LvRjtGH0Lgg0LTQu9GPINGF0YDQsNC90LXQvdC40Y8g0LTQsNC90L3Ri9GFINGE0LjQu9GM0YLRgNC+0LIg0LIgR00gc3RvcmFnZVxuICogQHJlYWRvbmx5XG4gKi9cbmV4cG9ydCBjb25zdCBGSUxURVJfS0VZUyA9IHtcbiAgICBDSEFUU19TRVRUSU5HUzogJ3RnX2ZpbHRlcl9jaGF0c19zZXR0aW5ncycsXG59O1xuXG4vKipcbiAqINCa0LvRjtGH0Lgg0L3QsNGB0YLRgNC+0LXQuiDRh9Cw0YLQsFxuICogQHJlYWRvbmx5XG4gKi9cbmV4cG9ydCBjb25zdCBDSEFUX1NFVFRJTkdfS0VZUyA9IHtcbiAgICBNSU5fUkVBQ1RJT05TOiAnbWluUmVhY3Rpb25zJyxcbn07XG5cbi8qKlxuICog0JrQvtC90YTQuNCz0YPRgNCw0YbQuNGPINC80L7QtNGD0LvRj1xuICogQHJlYWRvbmx5XG4gKi9cbmNvbnN0IENPTkZJRyA9IHtcbiAgICAvKiog0JfQvdCw0YfQtdC90LjQtSDQvNC40L3QuNC80LDQu9GM0L3Ri9GFINGA0LXQsNC60YbQuNC5INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOICovXG4gICAgREVGQVVMVF9NSU5fUkVBQ1RJT05TOiAwLFxufTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBDaGF0U2V0dGluZ3NcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtaW5SZWFjdGlvbnMgLSDQnNC40L3QuNC80LDQu9GM0L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INGA0LXQsNC60YbQuNC5XG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0LjxzdHJpbmcsIENoYXRTZXR0aW5ncz59IENoYXRzU2V0dGluZ3NcbiAqINCe0LHRitC10LrRgiDQs9C00LUg0LrQu9GO0YfQuCAtINC90LDQt9Cy0LDQvdC40Y8g0YfQsNGC0L7Qsiwg0LfQvdCw0YfQtdC90LjRjyAtINC90LDRgdGC0YDQvtC50LrQuCDRh9Cw0YLQsFxuICovXG5cbi8qKlxuICog0J7RgdC90L7QstC90L7QuSDQvtCx0YrQtdC60YIg0LTQu9GPINGA0LDQsdC+0YLRiyDRgSDRhdGA0LDQvdC40LvQuNGJ0LXQvCDQvdCw0YHRgtGA0L7QtdC6INGH0LDRgtC+0LJcbiAqL1xuZXhwb3J0IGNvbnN0IGZpbHRlclN0b3JhZ2UgPSB7XG4gICAgLy8gPT09INCg0LDQsdC+0YLQsCDRgSDQvdCw0YHRgtGA0L7QudC60LDQvNC4INCy0YHQtdGFINGH0LDRgtC+0LIgPT09XG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LDQtdGCINCy0YHQtSDRgdC+0YXRgNCw0L3QtdC90L3Ri9C1INC90LDRgdGC0YDQvtC50LrQuCDRh9Cw0YLQvtCyXG4gICAgICogQHJldHVybnMge0NoYXRzU2V0dGluZ3N9INCe0LHRitC10LrRgiDRgSDQvdCw0YHRgtGA0L7QudC60LDQvNC4INC00LvRjyDQstGB0LXRhSDRh9Cw0YLQvtCyXG4gICAgICovXG4gICAgZ2V0Q2hhdHNTZXR0aW5nczogKCkgPT4gc3RvcmFnZS5nZXQoRklMVEVSX0tFWVMuQ0hBVFNfU0VUVElOR1MsIHt9KSxcblxuICAgIC8qKlxuICAgICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINCy0YHQtSDQvdCw0YHRgtGA0L7QudC60Lgg0YfQsNGC0L7QslxuICAgICAqIEBwYXJhbSB7Q2hhdHNTZXR0aW5nc3xPYmplY3R9IHNldHRpbmdzIC0g0J7QsdGK0LXQutGCINGBINC90LDRgdGC0YDQvtC50LrQsNC80Lgg0YfQsNGC0L7QslxuICAgICAqL1xuICAgIHNldENoYXRzU2V0dGluZ3M6IChzZXR0aW5ncykgPT4ge1xuICAgICAgICBjb25zdCB2YWxpZFNldHRpbmdzID0gdHlwZW9mIHNldHRpbmdzID09PSAnb2JqZWN0JyAmJiBzZXR0aW5ncyAhPT0gbnVsbCA/IHNldHRpbmdzIDoge307XG4gICAgICAgIHN0b3JhZ2Uuc2V0KEZJTFRFUl9LRVlTLkNIQVRTX1NFVFRJTkdTLCB2YWxpZFNldHRpbmdzKTtcbiAgICB9LFxuXG4gICAgLy8gPT09INCg0LDQsdC+0YLQsCDRgSDQvdCw0YHRgtGA0L7QudC60LDQvNC4INC60L7QvdC60YDQtdGC0L3QvtCz0L4g0YfQsNGC0LAgPT09XG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LDQtdGCINC90LDRgdGC0YDQvtC50LrQuCDQutC+0L3QutGA0LXRgtC90L7Qs9C+INGH0LDRgtCwXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNoYXROYW1lIC0g0J3QsNC30LLQsNC90LjQtSDRh9Cw0YLQsFxuICAgICAqIEByZXR1cm5zIHtDaGF0U2V0dGluZ3N9INCd0LDRgdGC0YDQvtC50LrQuCDRh9Cw0YLQsFxuICAgICAqL1xuICAgIGdldENoYXRTZXR0aW5nczogKGNoYXROYW1lKSA9PiB7XG4gICAgICAgIGlmICghY2hhdE5hbWUgfHwgdHlwZW9mIGNoYXROYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIHsgW0NIQVRfU0VUVElOR19LRVlTLk1JTl9SRUFDVElPTlNdOiBDT05GSUcuREVGQVVMVF9NSU5fUkVBQ1RJT05TIH07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhbGxTZXR0aW5ncyA9IGZpbHRlclN0b3JhZ2UuZ2V0Q2hhdHNTZXR0aW5ncygpO1xuICAgICAgICByZXR1cm4gYWxsU2V0dGluZ3NbY2hhdE5hbWVdIHx8IHsgW0NIQVRfU0VUVElOR19LRVlTLk1JTl9SRUFDVElPTlNdOiBDT05GSUcuREVGQVVMVF9NSU5fUkVBQ1RJT05TIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC90LDRgdGC0YDQvtC50LrQuCDQutC+0L3QutGA0LXRgtC90L7Qs9C+INGH0LDRgtCwXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNoYXROYW1lIC0g0J3QsNC30LLQsNC90LjQtSDRh9Cw0YLQsFxuICAgICAqIEBwYXJhbSB7Q2hhdFNldHRpbmdzfE9iamVjdH0gY2hhdFNldHRpbmdzIC0g0J3QsNGB0YLRgNC+0LnQutC4INGH0LDRgtCwXG4gICAgICovXG4gICAgc2V0Q2hhdFNldHRpbmdzOiAoY2hhdE5hbWUsIGNoYXRTZXR0aW5ncykgPT4ge1xuICAgICAgICBpZiAoIWNoYXROYW1lIHx8IHR5cGVvZiBjaGF0TmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignSW52YWxpZCBjaGF0IG5hbWUgcHJvdmlkZWQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHZhbGlkQ2hhdFNldHRpbmdzID0gdHlwZW9mIGNoYXRTZXR0aW5ncyA9PT0gJ29iamVjdCcgJiYgY2hhdFNldHRpbmdzICE9PSBudWxsID8gY2hhdFNldHRpbmdzIDoge307XG4gICAgICAgIGNvbnN0IGFsbFNldHRpbmdzID0gZmlsdGVyU3RvcmFnZS5nZXRDaGF0c1NldHRpbmdzKCk7XG4gICAgICAgIGFsbFNldHRpbmdzW2NoYXROYW1lXSA9IHZhbGlkQ2hhdFNldHRpbmdzO1xuXG4gICAgICAgIGZpbHRlclN0b3JhZ2Uuc2V0Q2hhdHNTZXR0aW5ncyhhbGxTZXR0aW5ncyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQsNC10YIg0LrQvtC90LrRgNC10YLQvdGD0Y4g0L3QsNGB0YLRgNC+0LnQutGDINGH0LDRgtCwXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNoYXROYW1lIC0g0J3QsNC30LLQsNC90LjQtSDRh9Cw0YLQsFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzZXR0aW5nS2V5IC0g0JrQu9GO0Ycg0L3QsNGB0YLRgNC+0LnQutC4XG4gICAgICogQHBhcmFtIHsqfSBkZWZhdWx0VmFsdWUgLSDQl9C90LDRh9C10L3QuNC1INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXG4gICAgICogQHJldHVybnMgeyp9INCX0L3QsNGH0LXQvdC40LUg0L3QsNGB0YLRgNC+0LnQutC4XG4gICAgICovXG4gICAgZ2V0Q2hhdFNldHRpbmc6IChjaGF0TmFtZSwgc2V0dGluZ0tleSwgZGVmYXVsdFZhbHVlID0gbnVsbCkgPT4ge1xuICAgICAgICBjb25zdCBjaGF0U2V0dGluZ3MgPSBmaWx0ZXJTdG9yYWdlLmdldENoYXRTZXR0aW5ncyhjaGF0TmFtZSk7XG4gICAgICAgIHJldHVybiBjaGF0U2V0dGluZ3Nbc2V0dGluZ0tleV0gPz8gZGVmYXVsdFZhbHVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQutC+0L3QutGA0LXRgtC90YPRjiDQvdCw0YHRgtGA0L7QudC60YMg0YfQsNGC0LBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2hhdE5hbWUgLSDQndCw0LfQstCw0L3QuNC1INGH0LDRgtCwXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNldHRpbmdLZXkgLSDQmtC70Y7RhyDQvdCw0YHRgtGA0L7QudC60LhcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIC0g0JfQvdCw0YfQtdC90LjQtSDQvdCw0YHRgtGA0L7QudC60LhcbiAgICAgKi9cbiAgICBzZXRDaGF0U2V0dGluZzogKGNoYXROYW1lLCBzZXR0aW5nS2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICBjb25zdCBjaGF0U2V0dGluZ3MgPSBmaWx0ZXJTdG9yYWdlLmdldENoYXRTZXR0aW5ncyhjaGF0TmFtZSk7XG4gICAgICAgIGNoYXRTZXR0aW5nc1tzZXR0aW5nS2V5XSA9IHZhbHVlO1xuICAgICAgICBmaWx0ZXJTdG9yYWdlLnNldENoYXRTZXR0aW5ncyhjaGF0TmFtZSwgY2hhdFNldHRpbmdzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0J/QvtC70YPRh9Cw0LXRgiDQvNC40L3QuNC80LDQu9GM0L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INGA0LXQsNC60YbQuNC5INC00LvRjyDRh9Cw0YLQsFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjaGF0TmFtZSAtINCd0LDQt9Cy0LDQvdC40LUg0YfQsNGC0LBcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSDQnNC40L3QuNC80LDQu9GM0L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INGA0LXQsNC60YbQuNC5XG4gICAgICovXG4gICAgZ2V0TWluUmVhY3Rpb25zOiAoY2hhdE5hbWUpID0+IGZpbHRlclN0b3JhZ2UuZ2V0Q2hhdFNldHRpbmcoXG4gICAgICAgIGNoYXROYW1lLFxuICAgICAgICBDSEFUX1NFVFRJTkdfS0VZUy5NSU5fUkVBQ1RJT05TLFxuICAgICAgICBDT05GSUcuREVGQVVMVF9NSU5fUkVBQ1RJT05TLFxuICAgICksXG5cbiAgICAvKipcbiAgICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQvNC40L3QuNC80LDQu9GM0L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INGA0LXQsNC60YbQuNC5INC00LvRjyDRh9Cw0YLQsFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjaGF0TmFtZSAtINCd0LDQt9Cy0LDQvdC40LUg0YfQsNGC0LBcbiAgICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd9IHZhbHVlIC0g0JzQuNC90LjQvNCw0LvRjNC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDRgNC10LDQutGG0LjQuVxuICAgICAqL1xuICAgIHNldE1pblJlYWN0aW9uczogKGNoYXROYW1lLCB2YWx1ZSkgPT4ge1xuICAgICAgICBjb25zdCBudW1lcmljVmFsdWUgPSBNYXRoLm1heCgwLCBwYXJzZUludCh2YWx1ZSwgMTApIHx8IDApO1xuICAgICAgICBmaWx0ZXJTdG9yYWdlLnNldENoYXRTZXR0aW5nKGNoYXROYW1lLCBDSEFUX1NFVFRJTkdfS0VZUy5NSU5fUkVBQ1RJT05TLCBudW1lcmljVmFsdWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQo9C00LDQu9GP0LXRgiDQstGB0LUg0L3QsNGB0YLRgNC+0LnQutC4INC60L7QvdC60YDQtdGC0L3QvtCz0L4g0YfQsNGC0LBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2hhdE5hbWUgLSDQndCw0LfQstCw0L3QuNC1INGH0LDRgtCwXG4gICAgICovXG4gICAgcmVtb3ZlQ2hhdFNldHRpbmdzOiAoY2hhdE5hbWUpID0+IHtcbiAgICAgICAgaWYgKCFjaGF0TmFtZSB8fCB0eXBlb2YgY2hhdE5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhbGxTZXR0aW5ncyA9IGZpbHRlclN0b3JhZ2UuZ2V0Q2hhdHNTZXR0aW5ncygpO1xuICAgICAgICBkZWxldGUgYWxsU2V0dGluZ3NbY2hhdE5hbWVdO1xuICAgICAgICBmaWx0ZXJTdG9yYWdlLnNldENoYXRzU2V0dGluZ3MoYWxsU2V0dGluZ3MpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQn9GA0L7QstC10YDRj9C10YIsINC10YHRgtGMINC70Lgg0L3QsNGB0YLRgNC+0LnQutC4INC00LvRjyDQutC+0L3QutGA0LXRgtC90L7Qs9C+INGH0LDRgtCwXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNoYXROYW1lIC0g0J3QsNC30LLQsNC90LjQtSDRh9Cw0YLQsFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlLCDQtdGB0LvQuCDQtdGB0YLRjCDQvdCw0YHRgtGA0L7QudC60Lgg0LTQu9GPINGH0LDRgtCwXG4gICAgICovXG4gICAgaGFzQ2hhdFNldHRpbmdzOiAoY2hhdE5hbWUpID0+IHtcbiAgICAgICAgaWYgKCFjaGF0TmFtZSB8fCB0eXBlb2YgY2hhdE5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhbGxTZXR0aW5ncyA9IGZpbHRlclN0b3JhZ2UuZ2V0Q2hhdHNTZXR0aW5ncygpO1xuICAgICAgICByZXR1cm4gY2hhdE5hbWUgaW4gYWxsU2V0dGluZ3M7XG4gICAgfSxcblxuICAgIC8vID09PSDQo9GC0LjQu9C40YLRiyA9PT1cblxuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQsNC10YIg0YHQv9C40YHQvtC6INCy0YHQtdGFINGH0LDRgtC+0LIg0YEg0L3QsNGB0YLRgNC+0LnQutCw0LzQuFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmdbXX0g0JzQsNGB0YHQuNCyINC90LDQt9Cy0LDQvdC40Lkg0YfQsNGC0L7QslxuICAgICAqL1xuICAgIGdldEFsbENoYXROYW1lczogKCkgPT4ge1xuICAgICAgICBjb25zdCBhbGxTZXR0aW5ncyA9IGZpbHRlclN0b3JhZ2UuZ2V0Q2hhdHNTZXR0aW5ncygpO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoYWxsU2V0dGluZ3MpO1xuICAgIH0sXG5cbiAgICAvLyA9PT0g0J7Rh9C40YHRgtC60LAg0LTQsNC90L3Ri9GFID09PVxuXG4gICAgLyoqXG4gICAgICog0J7Rh9C40YnQsNC10YIg0LLRgdC1INC90LDRgdGC0YDQvtC50LrQuCDRhNC40LvRjNGC0YDQvtCyXG4gICAgICovXG4gICAgY2xlYXJBbGxEYXRhOiAoKSA9PiB7XG4gICAgICAgIHN0b3JhZ2UucmVtb3ZlKEZJTFRFUl9LRVlTLkNIQVRTX1NFVFRJTkdTKTtcbiAgICB9LFxufTtcbiIsImV4cG9ydCBkZWZhdWx0IFwiLnRnLWhpZGRlbntkaXNwbGF5Om5vbmV9LmJ1YmJsZS1jb2xsYXBzZWR7b3BhY2l0eTouMiFpbXBvcnRhbnQ7bWF4LWhlaWdodDo0MHB4IWltcG9ydGFudDtvdmVyZmxvdzpoaWRkZW4haW1wb3J0YW50O3RyYW5zaXRpb246b3BhY2l0eSAuM3MgZWFzZSxtYXgtaGVpZ2h0IC4zcyBlYXNlIWltcG9ydGFudDtwb3NpdGlvbjpyZWxhdGl2ZSFpbXBvcnRhbnQ7Y3Vyc29yOnBvaW50ZXJ9LmJ1YmJsZS1jb2xsYXBzZWQ6YWZ0ZXJ7Y29udGVudDpcXFwiXFxcIjtwb3NpdGlvbjphYnNvbHV0ZTtib3R0b206MDtsZWZ0OjA7cmlnaHQ6MDtoZWlnaHQ6MTBweDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCh0cmFuc3BhcmVudCwjMDAwMDAwMWEpO3BvaW50ZXItZXZlbnRzOm5vbmV9LmJ1YmJsZS1leHBhbmRlZHtvcGFjaXR5OjEhaW1wb3J0YW50O21heC1oZWlnaHQ6bm9uZSFpbXBvcnRhbnQ7dHJhbnNpdGlvbjpvcGFjaXR5IC4zcyBlYXNlLG1heC1oZWlnaHQgLjNzIGVhc2UhaW1wb3J0YW50fS5yZWFjdGlvbnMtY29sbGFwc2Vke29wYWNpdHk6LjIhaW1wb3J0YW50O3RyYW5zaXRpb246b3BhY2l0eSAuM3MgZWFzZSFpbXBvcnRhbnR9LnJlYWN0aW9ucy1leHBhbmRlZHtvcGFjaXR5OjEhaW1wb3J0YW50O3RyYW5zaXRpb246b3BhY2l0eSAuM3MgZWFzZSFpbXBvcnRhbnR9I3RnLWZpbHRlci1wYW5lbHtwb3NpdGlvbjpmaXhlZDtib3R0b206MTVweDtyaWdodDoxNXB4O3dpZHRoOjE4MHB4O3BhZGRpbmc6OHB4O2JhY2tncm91bmQ6I2ZmZjtib3JkZXI6MXB4IHNvbGlkICNjY2M7Ym9yZGVyLXJhZGl1czoxMHB4O2JveC1zaGFkb3c6MCAycHggNnB4ICMwMDAwMDA0MDt6LWluZGV4Ojk5OTk7Zm9udC1zaXplOjEzcHg7ZGlzcGxheTpub25lO2ZvbnQtZmFtaWx5OnNhbnMtc2VyaWZ9I3RnLWZpbHRlci1jaGF0LXRpdGxle2ZvbnQtd2VpZ2h0OjcwMDttYXJnaW4tYm90dG9tOjhweDt0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MTRweH0udGctZmlsdGVyLWNvbnRyb2xze2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtnYXA6MTBweH0jdGctZmlsdGVyLWNoYXQtbGltaXR7d2lkdGg6NjBweDt0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MTRweDtwYWRkaW5nOjRweDtib3JkZXItcmFkaXVzOjZweDtib3JkZXI6MXB4IHNvbGlkICNjY2N9LnRnLWZpbHRlci1sYWJlbHttYXJnaW4tdG9wOjZweDtmb250LXNpemU6MTFweDt0ZXh0LWFsaWduOmNlbnRlcjtjb2xvcjojNjY2O21hcmdpbi1ib3R0b206OHB4fSN0Zy1maWx0ZXItcGFuZWwgLnRnLXJvdW5kLWJ0bnt3aWR0aDoyOHB4O2hlaWdodDoyOHB4O2JvcmRlci1yYWRpdXM6NTAlO2JvcmRlcjoxcHggc29saWQgI2NjYztiYWNrZ3JvdW5kOiNmOGY4Zjg7Zm9udC1zaXplOjE2cHg7Zm9udC13ZWlnaHQ6NzAwO2N1cnNvcjpwb2ludGVyO3RyYW5zaXRpb246YmFja2dyb3VuZCAuMnMsdHJhbnNmb3JtIC4xc30jdGctZmlsdGVyLXBhbmVsIC50Zy1yb3VuZC1idG46aG92ZXJ7YmFja2dyb3VuZDojZTZlNmU2fSN0Zy1maWx0ZXItcGFuZWwgLnRnLXJvdW5kLWJ0bjphY3RpdmV7dHJhbnNmb3JtOnNjYWxlKC45KX0udGctZnVsbC13aWR0aC1idG57d2lkdGg6MTAwJTttYXJnaW4tdG9wOjVweDtwYWRkaW5nOjZweDtib3JkZXItcmFkaXVzOjZweDtib3JkZXI6MXB4IHNvbGlkICNjY2M7YmFja2dyb3VuZDojZjhmOGY4O2ZvbnQtc2l6ZToxMnB4O2N1cnNvcjpwb2ludGVyO3RyYW5zaXRpb246YmFja2dyb3VuZCAuMnMsdHJhbnNmb3JtIC4xczt0ZXh0LWFsaWduOmNlbnRlcn0udGctZnVsbC13aWR0aC1idG46aG92ZXJ7YmFja2dyb3VuZDojZTZlNmU2fS50Zy1mdWxsLXdpZHRoLWJ0bjphY3RpdmV7dHJhbnNmb3JtOnNjYWxlKC45OCl9XFxuXCI7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCJpbXBvcnQgc3R5bGVzIGZyb20gJy4vc3R5bGVzLmNzcyc7XG5pbXBvcnQgZmlsdGVyc1RlbXBsYXRlIGZyb20gJy4vZmlsdGVycy10ZW1wbGF0ZS5odG1sJztcbmltcG9ydCB7IGZpbHRlclN0b3JhZ2UgfSBmcm9tICcuL3N0b3JhZ2UnO1xuXG5jb25zdCBDT05GSUcgPSB7XG4gICAgSE9WRVJfREVMQVk6IDIwMCxcbiAgICBVTkhPVkVSX0RFTEFZOiAwLFxuICAgIENIRUNLX0lOVEVSVkFMOiAzMDAsXG59O1xuXG5sZXQgaXNGaWx0ZXJFbmFibGVkID0gdHJ1ZTtcblxuZnVuY3Rpb24gZ2V0Q3VycmVudENoYXROYW1lKCkge1xuICAgIGNvbnN0IGggPSB3aW5kb3cubG9jYXRpb24uaGFzaDtcbiAgICBpZiAoIWgpIHJldHVybiBudWxsO1xuICAgIGxldCBzID0gaC5yZXBsYWNlKC9eIy8sICcnKTtcbiAgICBpZiAocy5zdGFydHNXaXRoKCdAJykpIHMgPSBzLnNsaWNlKDEpO1xuICAgIHJldHVybiBzLnNwbGl0KCcvJylbMF0gfHwgbnVsbDtcbn1cblxuZnVuY3Rpb24gY291bnRSZWFjdGlvbnMoYnViYmxlKSB7XG4gICAgbGV0IHRvdGFsID0gMDtcbiAgICBjb25zdCB3cmFwcGVyID0gYnViYmxlLmNsb3Nlc3QoJy5idWJibGUtY29udGVudC13cmFwcGVyJykgfHwgYnViYmxlO1xuICAgIGNvbnN0IHJlYWN0aW9uRWxlbWVudHMgPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ3JlYWN0aW9uLWVsZW1lbnQsIC5yZWFjdGlvbi1lbGVtZW50Jyk7XG5cbiAgICByZWFjdGlvbkVsZW1lbnRzLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvdW50ZXJFbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoJy5yZWFjdGlvbi1jb3VudGVyJyk7XG4gICAgICAgIGlmIChjb3VudGVyRWwpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IHBhcnNlSW50KGNvdW50ZXJFbC50ZXh0Q29udGVudC50cmltKCksIDEwKTtcbiAgICAgICAgICAgIHRvdGFsICs9IE51bWJlci5pc05hTih2YWwpID8gMSA6IHZhbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGF2YXRhcnMgPSBlbC5xdWVyeVNlbGVjdG9yQWxsKCcuc3RhY2tlZC1hdmF0YXJzLWF2YXRhci1jb250YWluZXInKTtcbiAgICAgICAgaWYgKGF2YXRhcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdG90YWwgKz0gYXZhdGFycy5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0b3RhbCArPSAxO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRvdGFsO1xufVxuXG5mdW5jdGlvbiBzZXRCdWJibGVTdGF0ZShidWJibGUsIHJlYWN0aW9uc0VsZW1lbnQsIHN0YXRlLCB0b3RhbFJlYWN0aW9ucyA9IG51bGwpIHtcbiAgICBidWJibGUuY2xhc3NMaXN0LnJlbW92ZSgnYnViYmxlLWNvbGxhcHNlZCcsICdidWJibGUtZXhwYW5kZWQnLCAnYnViYmxlLXBpbm5lZCcpO1xuICAgIGlmIChyZWFjdGlvbnNFbGVtZW50KSB7XG4gICAgICAgIHJlYWN0aW9uc0VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgncmVhY3Rpb25zLWNvbGxhcHNlZCcsICdyZWFjdGlvbnMtZXhwYW5kZWQnKTtcbiAgICB9XG5cbiAgICBpZiAodG90YWxSZWFjdGlvbnMgIT09IG51bGwpIHtcbiAgICAgICAgYnViYmxlLnRpdGxlID0gYNCg0LXQsNC60YbQuNC5OiAke3RvdGFsUmVhY3Rpb25zfWA7XG4gICAgfVxuXG4gICAgc3dpdGNoIChzdGF0ZSkge1xuICAgIGNhc2UgJ2V4cGFuZGVkJzpcbiAgICAgICAgYnViYmxlLmNsYXNzTGlzdC5hZGQoJ2J1YmJsZS1leHBhbmRlZCcpO1xuICAgICAgICBpZiAocmVhY3Rpb25zRWxlbWVudCkgcmVhY3Rpb25zRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdyZWFjdGlvbnMtZXhwYW5kZWQnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgY2FzZSAnY29sbGFwc2VkJzpcbiAgICAgICAgYnViYmxlLmNsYXNzTGlzdC5hZGQoJ2J1YmJsZS1jb2xsYXBzZWQnKTtcbiAgICAgICAgaWYgKHJlYWN0aW9uc0VsZW1lbnQpIHJlYWN0aW9uc0VsZW1lbnQuY2xhc3NMaXN0LmFkZCgncmVhY3Rpb25zLWNvbGxhcHNlZCcpO1xuICAgICAgICBicmVhaztcbiAgICBjYXNlICdwaW5uZWQnOlxuICAgICAgICBidWJibGUuY2xhc3NMaXN0LmFkZCgnYnViYmxlLXBpbm5lZCcsICdidWJibGUtZXhwYW5kZWQnKTtcbiAgICAgICAgaWYgKHJlYWN0aW9uc0VsZW1lbnQpIHJlYWN0aW9uc0VsZW1lbnQuY2xhc3NMaXN0LmFkZCgncmVhY3Rpb25zLWV4cGFuZGVkJyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYXR0YWNoSG92ZXIoYnViYmxlLCByZWFjdGlvbnNFbGVtZW50KSB7XG4gICAgaWYgKGJ1YmJsZS5kYXRhc2V0Lmhhc0hvdmVySGFuZGxlcnMgPT09ICcxJykgcmV0dXJuO1xuICAgIGxldCBzaG93VGltZW91dDtcbiAgICBsZXQgaGlkZVRpbWVvdXQ7XG5cbiAgICBjb25zdCBzaG93QnViYmxlID0gKCkgPT4ge1xuICAgICAgICBjbGVhclRpbWVvdXQoaGlkZVRpbWVvdXQpO1xuICAgICAgICBzZXRCdWJibGVTdGF0ZShidWJibGUsIHJlYWN0aW9uc0VsZW1lbnQsICdleHBhbmRlZCcpO1xuICAgIH07XG5cbiAgICBjb25zdCBoaWRlQnViYmxlID0gKCkgPT4ge1xuICAgICAgICBjbGVhclRpbWVvdXQoc2hvd1RpbWVvdXQpO1xuICAgICAgICBpZiAoYnViYmxlLmNsYXNzTGlzdC5jb250YWlucygnYnViYmxlLXBpbm5lZCcpKSByZXR1cm47XG4gICAgICAgIHNldEJ1YmJsZVN0YXRlKGJ1YmJsZSwgcmVhY3Rpb25zRWxlbWVudCwgJ2NvbGxhcHNlZCcpO1xuICAgIH07XG5cbiAgICBjb25zdCBvbk1vdXNlRW50ZXIgPSAoKSA9PiB7XG4gICAgICAgIGNsZWFyVGltZW91dChoaWRlVGltZW91dCk7XG4gICAgICAgIHNob3dUaW1lb3V0ID0gc2V0VGltZW91dChzaG93QnViYmxlLCBDT05GSUcuSE9WRVJfREVMQVkpO1xuICAgIH07XG5cbiAgICBjb25zdCBvbk1vdXNlTGVhdmUgPSAoKSA9PiB7XG4gICAgICAgIGNsZWFyVGltZW91dChzaG93VGltZW91dCk7XG4gICAgICAgIGhpZGVUaW1lb3V0ID0gc2V0VGltZW91dChoaWRlQnViYmxlLCBDT05GSUcuVU5IT1ZFUl9ERUxBWSk7XG4gICAgfTtcblxuICAgIGJ1YmJsZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgb25Nb3VzZUVudGVyLCB7IHBhc3NpdmU6IHRydWUgfSk7XG4gICAgYnViYmxlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBvbk1vdXNlTGVhdmUsIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcbiAgICBpZiAocmVhY3Rpb25zRWxlbWVudCkge1xuICAgICAgICByZWFjdGlvbnNFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvbk1vdXNlRW50ZXIsIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcbiAgICAgICAgcmVhY3Rpb25zRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgb25Nb3VzZUxlYXZlLCB7IHBhc3NpdmU6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgYnViYmxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBpc1Bpbm5lZCA9IGJ1YmJsZS5jbGFzc0xpc3QuY29udGFpbnMoJ2J1YmJsZS1waW5uZWQnKTtcbiAgICAgICAgaWYgKGlzUGlubmVkKSB7XG4gICAgICAgICAgICBzZXRCdWJibGVTdGF0ZShidWJibGUsIHJlYWN0aW9uc0VsZW1lbnQsICdjb2xsYXBzZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldEJ1YmJsZVN0YXRlKGJ1YmJsZSwgcmVhY3Rpb25zRWxlbWVudCwgJ3Bpbm5lZCcpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBidWJibGUuZGF0YXNldC5oYXNIb3ZlckhhbmRsZXJzID0gJzEnO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzQnViYmxlKGJ1YmJsZSwgbWluUmVhY3Rpb25zLCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgY29uc3QgdG90YWxSZWFjdGlvbnMgPSBjb3VudFJlYWN0aW9ucyhidWJibGUpO1xuICAgIGNvbnN0IHdyYXBwZXIgPSBidWJibGUuY2xvc2VzdCgnLmJ1YmJsZS1jb250ZW50LXdyYXBwZXInKTtcbiAgICBjb25zdCByZWFjdGlvbnNFbGVtZW50ID0gd3JhcHBlcj8ucXVlcnlTZWxlY3RvcigncmVhY3Rpb25zLWVsZW1lbnQnKTtcblxuICAgIGJ1YmJsZS50aXRsZSA9IGDQoNC10LDQutGG0LjQuTogJHt0b3RhbFJlYWN0aW9uc31gO1xuXG4gICAgaWYgKGJ1YmJsZS5jbG9zZXN0KCcuaXMtb3V0JykpIHtcbiAgICAgICAgaWYgKCFidWJibGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdidWJibGUtZXhwYW5kZWQnKSkge1xuICAgICAgICAgICAgc2V0QnViYmxlU3RhdGUoYnViYmxlLCByZWFjdGlvbnNFbGVtZW50LCAnZXhwYW5kZWQnLCB0b3RhbFJlYWN0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChidWJibGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdidWJibGUtcGlubmVkJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChidWJibGUubWF0Y2hlcygnOmhvdmVyJykgfHwgKHJlYWN0aW9uc0VsZW1lbnQgJiYgcmVhY3Rpb25zRWxlbWVudC5tYXRjaGVzKCc6aG92ZXInKSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghaXNGaWx0ZXJFbmFibGVkKSB7XG4gICAgICAgIGlmICghYnViYmxlLmNsYXNzTGlzdC5jb250YWlucygnYnViYmxlLWV4cGFuZGVkJykpIHtcbiAgICAgICAgICAgIHNldEJ1YmJsZVN0YXRlKGJ1YmJsZSwgcmVhY3Rpb25zRWxlbWVudCwgJ2V4cGFuZGVkJywgdG90YWxSZWFjdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsYXN0S25vd25Db3VudCA9IHBhcnNlSW50KGJ1YmJsZS5kYXRhc2V0Lmxhc3RDb3VudCwgMTApO1xuICAgIGNvbnN0IHNob3VsZEJlRXhwYW5kZWQgPSB0b3RhbFJlYWN0aW9ucyA+PSBtaW5SZWFjdGlvbnM7XG4gICAgY29uc3QgaXNFeHBhbmRlZCA9IGJ1YmJsZS5jbGFzc0xpc3QuY29udGFpbnMoJ2J1YmJsZS1leHBhbmRlZCcpO1xuXG4gICAgaWYgKCFmb3JjZSAmJiBsYXN0S25vd25Db3VudCA9PT0gdG90YWxSZWFjdGlvbnMpIHtcbiAgICAgICAgaWYgKHNob3VsZEJlRXhwYW5kZWQgPT09IGlzRXhwYW5kZWQpIHJldHVybjtcbiAgICB9XG5cbiAgICBidWJibGUuZGF0YXNldC5sYXN0Q291bnQgPSB0b3RhbFJlYWN0aW9ucztcblxuICAgIGlmIChzaG91bGRCZUV4cGFuZGVkKSB7XG4gICAgICAgIHNldEJ1YmJsZVN0YXRlKGJ1YmJsZSwgcmVhY3Rpb25zRWxlbWVudCwgJ2V4cGFuZGVkJywgdG90YWxSZWFjdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNldEJ1YmJsZVN0YXRlKGJ1YmJsZSwgcmVhY3Rpb25zRWxlbWVudCwgJ2NvbGxhcHNlZCcsIHRvdGFsUmVhY3Rpb25zKTtcbiAgICAgICAgYXR0YWNoSG92ZXIoYnViYmxlLCByZWFjdGlvbnNFbGVtZW50KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlZnJlc2hBbGxCdWJibGVzKGZvcmNlID0gZmFsc2UpIHtcbiAgICBjb25zdCBjaGF0TmFtZSA9IGdldEN1cnJlbnRDaGF0TmFtZSgpO1xuICAgIGlmICghY2hhdE5hbWUpIHJldHVybjtcbiAgICBjb25zdCBtaW5SZWFjdGlvbnMgPSBmaWx0ZXJTdG9yYWdlLmdldE1pblJlYWN0aW9ucyhjaGF0TmFtZSk7XG4gICAgY29uc3QgYnViYmxlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idWJibGUtY29udGVudCcpO1xuICAgIGJ1YmJsZXMuZm9yRWFjaCgoYnViYmxlKSA9PiBwcm9jZXNzQnViYmxlKGJ1YmJsZSwgbWluUmVhY3Rpb25zLCBmb3JjZSkpO1xufVxuXG5sZXQgcGFuZWw7XG5sZXQgaW5wdXQ7XG5sZXQgbGFzdENoYXROYW1lID0gbnVsbDtcblxuZnVuY3Rpb24gaW5pdFVJKCkge1xuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGctZmlsdGVyLXBhbmVsJykpIHtcbiAgICAgICAgcGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGctZmlsdGVyLXBhbmVsJyk7XG4gICAgICAgIGlucHV0ID0gcGFuZWwucXVlcnlTZWxlY3RvcignI3RnLWZpbHRlci1jaGF0LWxpbWl0Jyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcGFuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwYW5lbC5pZCA9ICd0Zy1maWx0ZXItcGFuZWwnO1xuICAgIHBhbmVsLmlubmVySFRNTCA9IGZpbHRlcnNUZW1wbGF0ZTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBhbmVsKTtcbiAgICBpbnB1dCA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoJyN0Zy1maWx0ZXItY2hhdC1saW1pdCcpO1xuXG4gICAgY29uc3QgYnRuTWludXMgPSBwYW5lbC5xdWVyeVNlbGVjdG9yKCcjdGctZmlsdGVyLWRlY3JlYXNlJyk7XG4gICAgY29uc3QgYnRuUGx1cyA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoJyN0Zy1maWx0ZXItaW5jcmVhc2UnKTtcbiAgICBjb25zdCBidG5SZWZyZXNoID0gcGFuZWwucXVlcnlTZWxlY3RvcignI3RnLWZpbHRlci1yZWZyZXNoJyk7XG4gICAgY29uc3QgYnRuVG9nZ2xlID0gcGFuZWwucXVlcnlTZWxlY3RvcignI3RnLWZpbHRlci10b2dnbGUnKTtcblxuICAgIGJ0blRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgaXNGaWx0ZXJFbmFibGVkID0gIWlzRmlsdGVyRW5hYmxlZDtcblxuICAgICAgICBpZiAoaXNGaWx0ZXJFbmFibGVkKSB7XG4gICAgICAgICAgICBidG5Ub2dnbGUudGV4dENvbnRlbnQgPSAn0KTQuNC70YzRgtGAOiDQktCa0JsnO1xuICAgICAgICAgICAgYnRuVG9nZ2xlLnN0eWxlLmJhY2tncm91bmQgPSAnI2VlZmJlZSc7XG4gICAgICAgICAgICBidG5Ub2dnbGUuc3R5bGUuYm9yZGVyQ29sb3IgPSAnI2MzZTZjYic7XG4gICAgICAgICAgICBidG5Ub2dnbGUuc3R5bGUuY29sb3IgPSAnIzAwMCc7XG4gICAgICAgICAgICBpbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnRuVG9nZ2xlLnRleHRDb250ZW50ID0gJ9Ck0LjQu9GM0YLRgDog0JLQq9Ca0JsnO1xuICAgICAgICAgICAgYnRuVG9nZ2xlLnN0eWxlLmJhY2tncm91bmQgPSAnI2Y4ZDdkYSc7XG4gICAgICAgICAgICBidG5Ub2dnbGUuc3R5bGUuYm9yZGVyQ29sb3IgPSAnI2Y1YzZjYic7XG4gICAgICAgICAgICBidG5Ub2dnbGUuc3R5bGUuY29sb3IgPSAnIzcyMWMyNCc7XG4gICAgICAgICAgICBpbnB1dC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmVmcmVzaEFsbEJ1YmJsZXModHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBidG5SZWZyZXNoLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICByZWZyZXNoQWxsQnViYmxlcyh0cnVlKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGFwcGx5VmFsdWUodmFsKSB7XG4gICAgICAgIGNvbnN0IGNoYXROYW1lID0gZ2V0Q3VycmVudENoYXROYW1lKCk7XG4gICAgICAgIGlmICghY2hhdE5hbWUpIHJldHVybjtcbiAgICAgICAgY29uc3Qgc2FmZSA9IE1hdGgubWF4KDAsIHBhcnNlSW50KHZhbCwgMTApIHx8IDApO1xuICAgICAgICBmaWx0ZXJTdG9yYWdlLnNldE1pblJlYWN0aW9ucyhjaGF0TmFtZSwgc2FmZSk7XG4gICAgICAgIGlucHV0LnZhbHVlID0gc2FmZTtcbiAgICAgICAgcmVmcmVzaEFsbEJ1YmJsZXModHJ1ZSk7XG4gICAgfVxuXG4gICAgbGV0IGRlYm91bmNlVGltZXI7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xuICAgICAgICBjbGVhclRpbWVvdXQoZGVib3VuY2VUaW1lcik7XG4gICAgICAgIGRlYm91bmNlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGFwcGx5VmFsdWUoZS50YXJnZXQudmFsdWUpLCAzMDApO1xuICAgIH0pO1xuXG4gICAgYnRuTWludXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBhcHBseVZhbHVlKChwYXJzZUludChpbnB1dC52YWx1ZSwgMTApIHx8IDApIC0gMSkpO1xuICAgIGJ0blBsdXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBhcHBseVZhbHVlKChwYXJzZUludChpbnB1dC52YWx1ZSwgMTApIHx8IDApICsgMSkpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVQYW5lbCgpIHtcbiAgICBjb25zdCBjaGF0TmFtZSA9IGdldEN1cnJlbnRDaGF0TmFtZSgpO1xuICAgIGlmICghY2hhdE5hbWUpIHtcbiAgICAgICAgcGFuZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgbGFzdENoYXROYW1lID0gbnVsbDtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBwYW5lbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBpbnB1dC52YWx1ZSA9IGZpbHRlclN0b3JhZ2UuZ2V0TWluUmVhY3Rpb25zKGNoYXROYW1lKTtcblxuICAgIGNvbnN0IHRpdGxlID0gcGFuZWwucXVlcnlTZWxlY3RvcignI3RnLWZpbHRlci1jaGF0LXRpdGxlJyk7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSBg0KfQsNGCOiAke2NoYXROYW1lfWA7XG4gICAgbGFzdENoYXROYW1lID0gY2hhdE5hbWU7XG59XG5cbi8vIC0tLSDQoNC10LPRg9C70Y/RgNC90LDRjyDQv9GA0L7QstC10YDQutCwINGB0L7RgdGC0L7Rj9C90LjRjyAtLS1cbmZ1bmN0aW9uIHJlZnJlc2hDaGF0VmlldygpIHtcbiAgICBpZiAoZG9jdW1lbnQuaGlkZGVuKSByZXR1cm47XG5cbiAgICBjb25zdCBjaGF0TmFtZSA9IGdldEN1cnJlbnRDaGF0TmFtZSgpO1xuICAgIGlmICghY2hhdE5hbWUpIHJldHVybjtcblxuICAgIGlmIChjaGF0TmFtZSAhPT0gbGFzdENoYXROYW1lKSB1cGRhdGVQYW5lbCgpO1xuICAgIHJlZnJlc2hBbGxCdWJibGVzKCk7XG59XG5cbmZ1bmN0aW9uIHNldHVwU2lkZWJhckhlYWRlck9ic2VydmVyKCkge1xuICAgIGNvbnN0IHNpZGViYXJIZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuc2lkZWJhci1oZWFkZXIudG9wYmFyJyk7XG4gICAgaWYgKCFzaWRlYmFySGVhZGVyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTaWRlYmFyIGhlYWRlciBub3QgZm91bmQsIHJldHJ5aW5nIGluIDEgc2Vjb25kLi4uJyk7XG4gICAgICAgIHNldFRpbWVvdXQoc2V0dXBTaWRlYmFySGVhZGVyT2JzZXJ2ZXIsIDEwMDApO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbmV3IE11dGF0aW9uT2JzZXJ2ZXIocmVmcmVzaENoYXRWaWV3KS5vYnNlcnZlKHNpZGViYXJIZWFkZXIsIHtcbiAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgYXR0cmlidXRlRmlsdGVyOiBbJ2NsYXNzJ10sXG4gICAgfSk7XG59XG5cbkdNX2FkZFN0eWxlKHN0eWxlcyk7XG5pbml0VUkoKTtcbnVwZGF0ZVBhbmVsKCk7XG5yZWZyZXNoQWxsQnViYmxlcygpO1xuc2V0dXBTaWRlYmFySGVhZGVyT2JzZXJ2ZXIoKTtcblxuLy8g0JfQsNC/0YPRgdC60LDQtdC8INGA0LXQs9GD0LvRj9GA0L3Rg9GOINC/0YDQvtCy0LXRgNC60YNcbnNldEludGVydmFsKHJlZnJlc2hDaGF0VmlldywgQ09ORklHLkNIRUNLX0lOVEVSVkFMKTtcblxud2luZG93LlRlbGVncmFtRmlsdGVyID0ge1xuICAgIHJlZnJlc2g6IHJlZnJlc2hBbGxCdWJibGVzLFxuICAgIGdldEN1cnJlbnRDaGF0OiBnZXRDdXJyZW50Q2hhdE5hbWUsXG4gICAgc3RvcmFnZToge1xuICAgICAgICBnZXRDaGF0c1NldHRpbmdzOiBmaWx0ZXJTdG9yYWdlLmdldENoYXRzU2V0dGluZ3MsXG4gICAgICAgIGdldEFsbENoYXROYW1lczogZmlsdGVyU3RvcmFnZS5nZXRBbGxDaGF0TmFtZXMsXG4gICAgICAgIHJlbW92ZUNoYXRTZXR0aW5nczogZmlsdGVyU3RvcmFnZS5yZW1vdmVDaGF0U2V0dGluZ3MsXG4gICAgICAgIGNsZWFyQWxsRGF0YTogZmlsdGVyU3RvcmFnZS5jbGVhckFsbERhdGEsXG4gICAgfSxcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=