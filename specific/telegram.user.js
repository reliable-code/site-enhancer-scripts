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
// @version      1.0.78734393
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegram.org
// @author       reliable-code
// @downloadURL  https://raw.githubusercontent.com/reliable-code/site-enhancer-scripts/main/specific/telegram.user.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "./src/telegram/storage.js"
/*!*********************************!*\
  !*** ./src/telegram/storage.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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


/***/ },

/***/ "./src/telegram/styles.css"
/*!*********************************!*\
  !*** ./src/telegram/styles.css ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".tg-hidden{display:none}.bubble-collapsed{opacity:.2!important;max-height:40px!important;overflow:hidden!important;transition:opacity .3s ease,max-height .3s ease!important;position:relative!important;cursor:pointer}.bubble-collapsed:after{content:\"\";position:absolute;bottom:0;left:0;right:0;height:10px;background:linear-gradient(transparent,#0000001a);pointer-events:none}.bubble-expanded{opacity:1!important;max-height:none!important;transition:opacity .3s ease,max-height .3s ease!important}.reactions-collapsed{opacity:.2!important;transition:opacity .3s ease!important}.reactions-expanded{opacity:1!important;transition:opacity .3s ease!important}#tg-filter-panel{position:fixed;bottom:15px;right:15px;width:180px;padding:8px;background:#fff;border:1px solid #ccc;border-radius:10px;box-shadow:0 2px 6px #00000040;z-index:9999;font-size:13px;display:none;font-family:sans-serif}#tg-filter-chat-title{font-weight:700;margin-bottom:8px;text-align:center;font-size:14px}.tg-filter-controls{display:flex;align-items:center;justify-content:center;gap:10px}#tg-filter-chat-limit{width:60px;text-align:center;font-size:14px;padding:4px;border-radius:6px;border:1px solid #ccc}.tg-filter-label{margin-top:6px;font-size:11px;text-align:center;color:#666;margin-bottom:8px}#tg-filter-panel .tg-round-btn{width:28px;height:28px;border-radius:50%;border:1px solid #ccc;background:#f8f8f8;font-size:16px;font-weight:700;cursor:pointer;transition:background .2s,transform .1s}#tg-filter-panel .tg-round-btn:hover{background:#e6e6e6}#tg-filter-panel .tg-round-btn:active{transform:scale(.9)}.tg-full-width-btn{width:100%;margin-top:5px;padding:6px;border-radius:6px;border:1px solid #ccc;background:#f8f8f8;font-size:12px;cursor:pointer;transition:background .2s,transform .1s;text-align:center}.tg-full-width-btn:hover{background:#e6e6e6}.tg-full-width-btn:active{transform:scale(.98)}\n");

/***/ },

/***/ "./src/telegram/filters-template.html"
/*!********************************************!*\
  !*** ./src/telegram/filters-template.html ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<div id=\"tg-filter-chat-title\">\r\n    Чат: (неизвестно)\r\n</div>\r\n<div class=\"tg-filter-controls\">\r\n    <button type=\"button\" id=\"tg-filter-decrease\" class=\"tg-round-btn\">−</button>\r\n    <input type=\"number\" id=\"tg-filter-chat-limit\" min=\"0\"/>\r\n    <button type=\"button\" id=\"tg-filter-increase\" class=\"tg-round-btn\">+</button>\r\n</div>\r\n<div class=\"tg-filter-label\">\r\n    Мин. реакций\r\n</div>\r\n<button type=\"button\" id=\"tg-filter-toggle\" class=\"tg-full-width-btn\"\r\n        style=\"background: #eefbee; border-color: #c3e6cb;\">\r\n    Фильтр: ВКЛ\r\n</button>\r\n<button type=\"button\" id=\"tg-filter-refresh\" class=\"tg-full-width-btn tg-hidden\">\r\n    ↻ Обновить\r\n</button>\r\n");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q3pELFFBQU0sY0FBYyx1QkFBUSxRQUFRO0FBQ3BDLGlCQUFlO0FBQ25CO0FBR0EsU0FBUyxrQkFBa0I7QUFDdkIsTUFBSSxTQUFTLE9BQVE7QUFFckIsUUFBTSxXQUFXLG1CQUFtQjtBQUNwQyxNQUFJLENBQUMsU0FBVTtBQUVmLE1BQUksYUFBYSxhQUFjLGFBQVk7QUFDM0Msb0JBQWtCO0FBQ3RCO0FBRUEsU0FBUyw2QkFBNkI7QUFDbEMsUUFBTSxnQkFBZ0IsU0FBUyxjQUFjLDJCQUEyQjtBQUN4RSxNQUFJLENBQUMsZUFBZTtBQUNoQixZQUFRLElBQUksbURBQW1EO0FBQy9ELGVBQVcsNEJBQTRCLEdBQUk7QUFDM0M7QUFBQSxFQUNKO0FBRUEsTUFBSSxpQkFBaUIsZUFBZSxFQUFFLFFBQVEsZUFBZTtBQUFBLElBQ3pELFlBQVk7QUFBQSxJQUNaLGlCQUFpQixDQUFDLE9BQU87QUFBQSxFQUM3QixDQUFDO0FBQ0w7QUFFQSxZQUFZLG1EQUFNO0FBQ2xCLE9BQU87QUFDUCxZQUFZO0FBQ1osa0JBQWtCO0FBQ2xCLDJCQUEyQjtBQUczQixZQUFZLGlCQUFpQixPQUFPLGNBQWM7QUFFbEQsT0FBTyxpQkFBaUI7QUFBQSxFQUNwQixTQUFTO0FBQUEsRUFDVCxnQkFBZ0I7QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDTCxrQkFBa0IsbURBQWEsQ0FBQztBQUFBLElBQ2hDLGlCQUFpQixtREFBYSxDQUFDO0FBQUEsSUFDL0Isb0JBQW9CLG1EQUFhLENBQUM7QUFBQSxJQUNsQyxjQUFjLG1EQUFhLENBQUM7QUFBQSxFQUNoQztBQUNKIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9zdG9yYWdlLmpzIiwid2VicGFjazovLy8uL3NyYy90ZWxlZ3JhbS9zdG9yYWdlLmpzIiwid2VicGFjazovLy8uL3NyYy90ZWxlZ3JhbS9zdHlsZXMuY3NzIiwid2VicGFjazovLy8uL3NyYy90ZWxlZ3JhbS9maWx0ZXJzLXRlbXBsYXRlLmh0bWwiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RlbGVncmFtL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBzdG9yYWdlID0ge1xuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQtdC90LjQtSDQtNCw0L3QvdGL0YUg0LjQtyBHTSBzdG9yYWdlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtINC60LvRjtGHXG4gICAgICogQHBhcmFtIHsqfSBkZWZhdWx0VmFsdWUgLSDQt9C90LDRh9C10L3QuNC1INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXG4gICAgICogQHJldHVybnMgeyp9INC30L3QsNGH0LXQvdC40LUg0LjQu9C4IGRlZmF1bHRWYWx1ZVxuICAgICAqL1xuICAgIGdldDogKGtleSwgZGVmYXVsdFZhbHVlID0gbnVsbCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIEdNX2dldFZhbHVlKGtleSwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgU3RvcmFnZSBnZXQgZXJyb3IgZm9yIGtleSBcIiR7a2V5fVwiOmAsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0KHQvtGF0YDQsNC90LXQvdC40LUg0LTQsNC90L3Ri9GFINCyIEdNIHN0b3JhZ2VcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0g0LrQu9GO0YdcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIC0g0LfQvdCw0YfQtdC90LjQtSAo0LvRjtCx0L7QuSDRgtC40L8pXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59INGD0YHQv9C10YjQvdC+0YHRgtGMINC+0L/QtdGA0LDRhtC40LhcbiAgICAgKi9cbiAgICBzZXQ6IChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBHTV9zZXRWYWx1ZShrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBTdG9yYWdlIHNldCBlcnJvciBmb3Iga2V5IFwiJHtrZXl9XCI6YCwgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCe0LHQvdC+0LLQu9C10L3QuNC1INGB0YPRidC10YHRgtCy0YPRjtGJ0LjRhSDQtNCw0L3QvdGL0YUg0YfQtdGA0LXQtyDRhNGD0L3QutGG0LjRjlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSDQutC70Y7Rh1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHVwZGF0ZUZuIC0g0YTRg9C90LrRhtC40Y8g0L7QsdC90L7QstC70LXQvdC40Y8gKNC/0L7Qu9GD0YfQsNC10YIg0YLQtdC60YPRidC10LUg0LfQvdCw0YfQtdC90LjQtSwg0LLQvtC30LLRgNCw0YnQsNC10YIg0L3QvtCy0L7QtSlcbiAgICAgKiBAcGFyYW0geyp9IGRlZmF1bHRWYWx1ZSAtINC30L3QsNGH0LXQvdC40LUg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0LXRgdC70Lgg0LrQu9GO0Ycg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRglxuICAgICAqIEByZXR1cm5zIHsqfSDQvdC+0LLQvtC1INC30L3QsNGH0LXQvdC40LVcbiAgICAgKi9cbiAgICB1cGRhdGU6IChrZXksIHVwZGF0ZUZuLCBkZWZhdWx0VmFsdWUgPSBudWxsKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50VmFsdWUgPSBzdG9yYWdlLmdldChrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IHVwZGF0ZUZuKGN1cnJlbnRWYWx1ZSk7XG4gICAgICAgICAgICBzdG9yYWdlLnNldChrZXksIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBuZXdWYWx1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgU3RvcmFnZSB1cGRhdGUgZXJyb3IgZm9yIGtleSBcIiR7a2V5fVwiOmAsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBzdG9yYWdlLmdldChrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0KPQtNCw0LvQtdC90LjQtSDQtNCw0L3QvdGL0YUg0LjQtyBHTSBzdG9yYWdlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtINC60LvRjtGHXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59INGD0YHQv9C10YjQvdC+0YHRgtGMINC+0L/QtdGA0LDRhtC40LhcbiAgICAgKi9cbiAgICByZW1vdmU6IChrZXkpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIEdNX2RlbGV0ZVZhbHVlKGtleSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgU3RvcmFnZSByZW1vdmUgZXJyb3IgZm9yIGtleSBcIiR7a2V5fVwiOmAsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQn9GA0L7QstC10YDQutCwINGB0YPRidC10YHRgtCy0L7QstCw0L3QuNGPINC60LvRjtGH0LBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0g0LrQu9GO0YdcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBoYXM6IChrZXkpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yYWdlLmtleXMoKS5pbmNsdWRlcyhrZXkpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBTdG9yYWdlIGhhcyBlcnJvciBmb3Iga2V5IFwiJHtrZXl9XCI6YCwgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQtdC90LjQtSDQstGB0LXRhSDQutC70Y7Rh9C10LlcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nW119INC80LDRgdGB0LjQsiDQutC70Y7Rh9C10LlcbiAgICAgKi9cbiAgICBrZXlzOiAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gR01fbGlzdFZhbHVlcygpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIGtleXMgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCe0YfQuNGB0YLQutCwINC00LDQvdC90YvRhSDRgdC60YDQuNC/0YLQsFxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IGtleXNUb1JlbW92ZSAtINC80LDRgdGB0LjQsiDQutC70Y7Rh9C10Lkg0LTQu9GPINGD0LTQsNC70LXQvdC40Y9cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g0YPRgdC/0LXRiNC90L7RgdGC0Ywg0L7Qv9C10YDQsNGG0LjQuFxuICAgICAqL1xuICAgIGNsZWFyOiAoa2V5c1RvUmVtb3ZlID0gbnVsbCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgYWxsS2V5cyA9IGtleXNUb1JlbW92ZSB8fCBzdG9yYWdlLmtleXMoKTtcbiAgICAgICAgICAgIGFsbEtleXMuZm9yRWFjaCgoa2V5KSA9PiBHTV9kZWxldGVWYWx1ZShrZXkpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIGNsZWFyIGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQnNCw0YHRgdC+0LLQvtC1INC/0L7Qu9GD0YfQtdC90LjQtSDQtNCw0L3QvdGL0YVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBrZXlzTGlzdCAtINC80LDRgdGB0LjQsiDQutC70Y7Rh9C10LlcbiAgICAgKiBAcGFyYW0geyp9IGRlZmF1bHRWYWx1ZSAtINC30L3QsNGH0LXQvdC40LUg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0LTQu9GPINC+0YLRgdGD0YLRgdGC0LLRg9GO0YnQuNGFINC60LvRjtGH0LXQuVxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9INC+0LHRitC10LrRgiDRgSDQv9Cw0YDQsNC80Lgg0LrQu9GO0Yct0LfQvdCw0YfQtdC90LjQtVxuICAgICAqL1xuICAgIGdldE11bHRpcGxlOiAoa2V5c0xpc3QsIGRlZmF1bHRWYWx1ZSA9IG51bGwpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgICAgIGtleXNMaXN0LmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBzdG9yYWdlLmdldChrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQnNCw0YHRgdC+0LLQvtC1INGB0L7RhdGA0LDQvdC10L3QuNC1INC00LDQvdC90YvRhVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0g0L7QsdGK0LXQutGCINGBINC/0LDRgNCw0LzQuCDQutC70Y7Rhy3Qt9C90LDRh9C10L3QuNC1XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59INGD0YHQv9C10YjQvdC+0YHRgtGMINCy0YHQtdGFINC+0L/QtdGA0LDRhtC40LlcbiAgICAgKi9cbiAgICBzZXRNdWx0aXBsZTogKGRhdGEpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKGRhdGEpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgICAgIEdNX3NldFZhbHVlKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSBzZXRNdWx0aXBsZSBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0KPQtNCw0LvQtdC90LjQtSDQvdC10YHQutC+0LvRjNC60LjRhSDQutC70Y7Rh9C10LlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBrZXlzVG9SZW1vdmUgLSDQvNCw0YHRgdC40LIg0LrQu9GO0YfQtdC5INC00LvRjyDRg9C00LDQu9C10L3QuNGPICjQvtCx0Y/Qt9Cw0YLQtdC70YzQvdGL0Lkg0L/QsNGA0LDQvNC10YLRgClcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g0YPRgdC/0LXRiNC90L7RgdGC0Ywg0L7Qv9C10YDQsNGG0LjQuFxuICAgICAqL1xuICAgIHJlbW92ZU11bHRpcGxlOiAoa2V5c1RvUmVtb3ZlKSA9PiB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShrZXlzVG9SZW1vdmUpIHx8IGtleXNUb1JlbW92ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSByZW1vdmVNdWx0aXBsZToga2V5c1RvUmVtb3ZlIG11c3QgYmUgYSBub24tZW1wdHkgYXJyYXknKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBrZXlzVG9SZW1vdmUuZm9yRWFjaCgoa2V5KSA9PiBHTV9kZWxldGVWYWx1ZShrZXkpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIHJlbW92ZU11bHRpcGxlIGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LXQvdC40LUg0LrQvtC70LjRh9C10YHRgtCy0LAg0YHQvtGF0YDQsNC90LXQvdC90YvRhSDQutC70Y7Rh9C10LlcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSDQutC+0LvQuNGH0LXRgdGC0LLQviDQutC70Y7Rh9C10LlcbiAgICAgKi9cbiAgICBjb3VudDogKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uua2V5cygpLmxlbmd0aDtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvcmFnZSBjb3VudCBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LXQvdC40LUg0LLRgdC10YUg0LTQsNC90L3Ri9GFINCyINCy0LjQtNC1INC+0LHRitC10LrRgtCwXG4gICAgICogQHJldHVybnMge09iamVjdH0g0L7QsdGK0LXQutGCINGB0L4g0LLRgdC10LzQuCDRgdC+0YXRgNCw0L3QtdC90L3Ri9C80Lgg0LTQsNC90L3Ri9C80LhcbiAgICAgKi9cbiAgICBnZXRBbGw6ICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGFsbEtleXMgPSBzdG9yYWdlLmtleXMoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgICAgICAgICAgYWxsS2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IEdNX2dldFZhbHVlKGtleSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgZ2V0QWxsIGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQntCf0JDQodCd0J46INCe0YfQuNGB0YLQutCwINCy0YHQtdGFINC00LDQvdC90YvRhSDRgdC60YDQuNC/0YLQsFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZmlybUNsZWFyIC0g0L7QsdGP0LfQsNGC0LXQu9GM0L3Ri9C5INGE0LvQsNCzINC/0L7QtNGC0LLQtdGA0LbQtNC10L3QuNGPICjQtNC+0LvQttC10L0g0LHRi9GC0YwgdHJ1ZSlcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g0YPRgdC/0LXRiNC90L7RgdGC0Ywg0L7Qv9C10YDQsNGG0LjQuFxuICAgICAqL1xuICAgIGNsZWFyQWxsOiAoY29uZmlybUNsZWFyID0gZmFsc2UpID0+IHtcbiAgICAgICAgaWYgKGNvbmZpcm1DbGVhciAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdTdG9yYWdlIGNsZWFyQWxsOiBjb25maXJtQ2xlYXIgbXVzdCBiZSBleHBsaWNpdGx5IHNldCB0byB0cnVlJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgYWxsS2V5cyA9IHN0b3JhZ2Uua2V5cygpO1xuICAgICAgICAgICAgYWxsS2V5cy5mb3JFYWNoKChrZXkpID0+IEdNX2RlbGV0ZVZhbHVlKGtleSkpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgY2xlYXJBbGwgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCf0YDQvtCy0LXRgNC60LAg0L/Rg9GB0YLQvtGC0Ysg0YXRgNCw0L3QuNC70LjRidCwXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUg0LXRgdC70Lgg0YXRgNCw0L3QuNC70LjRidC1INC/0YPRgdGC0L7QtVxuICAgICAqL1xuICAgIGlzRW1wdHk6ICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yYWdlLmtleXMoKS5sZW5ndGggPT09IDA7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UgaXNFbXB0eSBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG59O1xuIiwiaW1wb3J0IHsgc3RvcmFnZSB9IGZyb20gJy4uL2NvbW1vbi9zdG9yYWdlJztcblxuLyoqXG4gKiDQmtC70Y7Rh9C4INC00LvRjyDRhdGA0LDQvdC10L3QuNGPINC00LDQvdC90YvRhSDRhNC40LvRjNGC0YDQvtCyINCyIEdNIHN0b3JhZ2VcbiAqIEByZWFkb25seVxuICovXG5leHBvcnQgY29uc3QgRklMVEVSX0tFWVMgPSB7XG4gICAgQ0hBVFNfU0VUVElOR1M6ICd0Z19maWx0ZXJfY2hhdHNfc2V0dGluZ3MnLFxufTtcblxuLyoqXG4gKiDQmtC70Y7Rh9C4INC90LDRgdGC0YDQvtC10Log0YfQsNGC0LBcbiAqIEByZWFkb25seVxuICovXG5leHBvcnQgY29uc3QgQ0hBVF9TRVRUSU5HX0tFWVMgPSB7XG4gICAgTUlOX1JFQUNUSU9OUzogJ21pblJlYWN0aW9ucycsXG59O1xuXG4vKipcbiAqINCa0L7QvdGE0LjQs9GD0YDQsNGG0LjRjyDQvNC+0LTRg9C70Y9cbiAqIEByZWFkb25seVxuICovXG5jb25zdCBDT05GSUcgPSB7XG4gICAgLyoqINCX0L3QsNGH0LXQvdC40LUg0LzQuNC90LjQvNCw0LvRjNC90YvRhSDRgNC10LDQutGG0LjQuSDQv9C+INGD0LzQvtC70YfQsNC90LjRjiAqL1xuICAgIERFRkFVTFRfTUlOX1JFQUNUSU9OUzogMCxcbn07XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gQ2hhdFNldHRpbmdzXG4gKiBAcHJvcGVydHkge251bWJlcn0gbWluUmVhY3Rpb25zIC0g0JzQuNC90LjQvNCw0LvRjNC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDRgNC10LDQutGG0LjQuVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdC48c3RyaW5nLCBDaGF0U2V0dGluZ3M+fSBDaGF0c1NldHRpbmdzXG4gKiDQntCx0YrQtdC60YIg0LPQtNC1INC60LvRjtGH0LggLSDQvdCw0LfQstCw0L3QuNGPINGH0LDRgtC+0LIsINC30L3QsNGH0LXQvdC40Y8gLSDQvdCw0YHRgtGA0L7QudC60Lgg0YfQsNGC0LBcbiAqL1xuXG4vKipcbiAqINCe0YHQvdC+0LLQvdC+0Lkg0L7QsdGK0LXQutGCINC00LvRjyDRgNCw0LHQvtGC0Ysg0YEg0YXRgNCw0L3QuNC70LjRidC10Lwg0L3QsNGB0YLRgNC+0LXQuiDRh9Cw0YLQvtCyXG4gKi9cbmV4cG9ydCBjb25zdCBmaWx0ZXJTdG9yYWdlID0ge1xuICAgIC8vID09PSDQoNCw0LHQvtGC0LAg0YEg0L3QsNGB0YLRgNC+0LnQutCw0LzQuCDQstGB0LXRhSDRh9Cw0YLQvtCyID09PVxuXG4gICAgLyoqXG4gICAgICog0J/QvtC70YPRh9Cw0LXRgiDQstGB0LUg0YHQvtGF0YDQsNC90LXQvdC90YvQtSDQvdCw0YHRgtGA0L7QudC60Lgg0YfQsNGC0L7QslxuICAgICAqIEByZXR1cm5zIHtDaGF0c1NldHRpbmdzfSDQntCx0YrQtdC60YIg0YEg0L3QsNGB0YLRgNC+0LnQutCw0LzQuCDQtNC70Y8g0LLRgdC10YUg0YfQsNGC0L7QslxuICAgICAqL1xuICAgIGdldENoYXRzU2V0dGluZ3M6ICgpID0+IHN0b3JhZ2UuZ2V0KEZJTFRFUl9LRVlTLkNIQVRTX1NFVFRJTkdTLCB7fSksXG5cbiAgICAvKipcbiAgICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQstGB0LUg0L3QsNGB0YLRgNC+0LnQutC4INGH0LDRgtC+0LJcbiAgICAgKiBAcGFyYW0ge0NoYXRzU2V0dGluZ3N8T2JqZWN0fSBzZXR0aW5ncyAtINCe0LHRitC10LrRgiDRgSDQvdCw0YHRgtGA0L7QudC60LDQvNC4INGH0LDRgtC+0LJcbiAgICAgKi9cbiAgICBzZXRDaGF0c1NldHRpbmdzOiAoc2V0dGluZ3MpID0+IHtcbiAgICAgICAgY29uc3QgdmFsaWRTZXR0aW5ncyA9IHR5cGVvZiBzZXR0aW5ncyA9PT0gJ29iamVjdCcgJiYgc2V0dGluZ3MgIT09IG51bGwgPyBzZXR0aW5ncyA6IHt9O1xuICAgICAgICBzdG9yYWdlLnNldChGSUxURVJfS0VZUy5DSEFUU19TRVRUSU5HUywgdmFsaWRTZXR0aW5ncyk7XG4gICAgfSxcblxuICAgIC8vID09PSDQoNCw0LHQvtGC0LAg0YEg0L3QsNGB0YLRgNC+0LnQutCw0LzQuCDQutC+0L3QutGA0LXRgtC90L7Qs9C+INGH0LDRgtCwID09PVxuXG4gICAgLyoqXG4gICAgICog0J/QvtC70YPRh9Cw0LXRgiDQvdCw0YHRgtGA0L7QudC60Lgg0LrQvtC90LrRgNC10YLQvdC+0LPQviDRh9Cw0YLQsFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjaGF0TmFtZSAtINCd0LDQt9Cy0LDQvdC40LUg0YfQsNGC0LBcbiAgICAgKiBAcmV0dXJucyB7Q2hhdFNldHRpbmdzfSDQndCw0YHRgtGA0L7QudC60Lgg0YfQsNGC0LBcbiAgICAgKi9cbiAgICBnZXRDaGF0U2V0dGluZ3M6IChjaGF0TmFtZSkgPT4ge1xuICAgICAgICBpZiAoIWNoYXROYW1lIHx8IHR5cGVvZiBjaGF0TmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiB7IFtDSEFUX1NFVFRJTkdfS0VZUy5NSU5fUkVBQ1RJT05TXTogQ09ORklHLkRFRkFVTFRfTUlOX1JFQUNUSU9OUyB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWxsU2V0dGluZ3MgPSBmaWx0ZXJTdG9yYWdlLmdldENoYXRzU2V0dGluZ3MoKTtcbiAgICAgICAgcmV0dXJuIGFsbFNldHRpbmdzW2NoYXROYW1lXSB8fCB7IFtDSEFUX1NFVFRJTkdfS0VZUy5NSU5fUkVBQ1RJT05TXTogQ09ORklHLkRFRkFVTFRfTUlOX1JFQUNUSU9OUyB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQvdCw0YHRgtGA0L7QudC60Lgg0LrQvtC90LrRgNC10YLQvdC+0LPQviDRh9Cw0YLQsFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjaGF0TmFtZSAtINCd0LDQt9Cy0LDQvdC40LUg0YfQsNGC0LBcbiAgICAgKiBAcGFyYW0ge0NoYXRTZXR0aW5nc3xPYmplY3R9IGNoYXRTZXR0aW5ncyAtINCd0LDRgdGC0YDQvtC50LrQuCDRh9Cw0YLQsFxuICAgICAqL1xuICAgIHNldENoYXRTZXR0aW5nczogKGNoYXROYW1lLCBjaGF0U2V0dGluZ3MpID0+IHtcbiAgICAgICAgaWYgKCFjaGF0TmFtZSB8fCB0eXBlb2YgY2hhdE5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0ludmFsaWQgY2hhdCBuYW1lIHByb3ZpZGVkJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB2YWxpZENoYXRTZXR0aW5ncyA9IHR5cGVvZiBjaGF0U2V0dGluZ3MgPT09ICdvYmplY3QnICYmIGNoYXRTZXR0aW5ncyAhPT0gbnVsbCA/IGNoYXRTZXR0aW5ncyA6IHt9O1xuICAgICAgICBjb25zdCBhbGxTZXR0aW5ncyA9IGZpbHRlclN0b3JhZ2UuZ2V0Q2hhdHNTZXR0aW5ncygpO1xuICAgICAgICBhbGxTZXR0aW5nc1tjaGF0TmFtZV0gPSB2YWxpZENoYXRTZXR0aW5ncztcblxuICAgICAgICBmaWx0ZXJTdG9yYWdlLnNldENoYXRzU2V0dGluZ3MoYWxsU2V0dGluZ3MpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LDQtdGCINC60L7QvdC60YDQtdGC0L3Rg9GOINC90LDRgdGC0YDQvtC50LrRgyDRh9Cw0YLQsFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjaGF0TmFtZSAtINCd0LDQt9Cy0LDQvdC40LUg0YfQsNGC0LBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2V0dGluZ0tleSAtINCa0LvRjtGHINC90LDRgdGC0YDQvtC50LrQuFxuICAgICAqIEBwYXJhbSB7Kn0gZGVmYXVsdFZhbHVlIC0g0JfQvdCw0YfQtdC90LjQtSDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxuICAgICAqIEByZXR1cm5zIHsqfSDQl9C90LDRh9C10L3QuNC1INC90LDRgdGC0YDQvtC50LrQuFxuICAgICAqL1xuICAgIGdldENoYXRTZXR0aW5nOiAoY2hhdE5hbWUsIHNldHRpbmdLZXksIGRlZmF1bHRWYWx1ZSA9IG51bGwpID0+IHtcbiAgICAgICAgY29uc3QgY2hhdFNldHRpbmdzID0gZmlsdGVyU3RvcmFnZS5nZXRDaGF0U2V0dGluZ3MoY2hhdE5hbWUpO1xuICAgICAgICByZXR1cm4gY2hhdFNldHRpbmdzW3NldHRpbmdLZXldID8/IGRlZmF1bHRWYWx1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0LrQvtC90LrRgNC10YLQvdGD0Y4g0L3QsNGB0YLRgNC+0LnQutGDINGH0LDRgtCwXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNoYXROYW1lIC0g0J3QsNC30LLQsNC90LjQtSDRh9Cw0YLQsFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzZXR0aW5nS2V5IC0g0JrQu9GO0Ycg0L3QsNGB0YLRgNC+0LnQutC4XG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSAtINCX0L3QsNGH0LXQvdC40LUg0L3QsNGB0YLRgNC+0LnQutC4XG4gICAgICovXG4gICAgc2V0Q2hhdFNldHRpbmc6IChjaGF0TmFtZSwgc2V0dGluZ0tleSwgdmFsdWUpID0+IHtcbiAgICAgICAgY29uc3QgY2hhdFNldHRpbmdzID0gZmlsdGVyU3RvcmFnZS5nZXRDaGF0U2V0dGluZ3MoY2hhdE5hbWUpO1xuICAgICAgICBjaGF0U2V0dGluZ3Nbc2V0dGluZ0tleV0gPSB2YWx1ZTtcbiAgICAgICAgZmlsdGVyU3RvcmFnZS5zZXRDaGF0U2V0dGluZ3MoY2hhdE5hbWUsIGNoYXRTZXR0aW5ncyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQsNC10YIg0LzQuNC90LjQvNCw0LvRjNC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDRgNC10LDQutGG0LjQuSDQtNC70Y8g0YfQsNGC0LBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2hhdE5hbWUgLSDQndCw0LfQstCw0L3QuNC1INGH0LDRgtCwXG4gICAgICogQHJldHVybnMge251bWJlcn0g0JzQuNC90LjQvNCw0LvRjNC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDRgNC10LDQutGG0LjQuVxuICAgICAqL1xuICAgIGdldE1pblJlYWN0aW9uczogKGNoYXROYW1lKSA9PiBmaWx0ZXJTdG9yYWdlLmdldENoYXRTZXR0aW5nKFxuICAgICAgICBjaGF0TmFtZSxcbiAgICAgICAgQ0hBVF9TRVRUSU5HX0tFWVMuTUlOX1JFQUNUSU9OUyxcbiAgICAgICAgQ09ORklHLkRFRkFVTFRfTUlOX1JFQUNUSU9OUyxcbiAgICApLFxuXG4gICAgLyoqXG4gICAgICog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0LzQuNC90LjQvNCw0LvRjNC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDRgNC10LDQutGG0LjQuSDQtNC70Y8g0YfQsNGC0LBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2hhdE5hbWUgLSDQndCw0LfQstCw0L3QuNC1INGH0LDRgtCwXG4gICAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfSB2YWx1ZSAtINCc0LjQvdC40LzQsNC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0YDQtdCw0LrRhtC40LlcbiAgICAgKi9cbiAgICBzZXRNaW5SZWFjdGlvbnM6IChjaGF0TmFtZSwgdmFsdWUpID0+IHtcbiAgICAgICAgY29uc3QgbnVtZXJpY1ZhbHVlID0gTWF0aC5tYXgoMCwgcGFyc2VJbnQodmFsdWUsIDEwKSB8fCAwKTtcbiAgICAgICAgZmlsdGVyU3RvcmFnZS5zZXRDaGF0U2V0dGluZyhjaGF0TmFtZSwgQ0hBVF9TRVRUSU5HX0tFWVMuTUlOX1JFQUNUSU9OUywgbnVtZXJpY1ZhbHVlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0KPQtNCw0LvRj9C10YIg0LLRgdC1INC90LDRgdGC0YDQvtC50LrQuCDQutC+0L3QutGA0LXRgtC90L7Qs9C+INGH0LDRgtCwXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNoYXROYW1lIC0g0J3QsNC30LLQsNC90LjQtSDRh9Cw0YLQsFxuICAgICAqL1xuICAgIHJlbW92ZUNoYXRTZXR0aW5nczogKGNoYXROYW1lKSA9PiB7XG4gICAgICAgIGlmICghY2hhdE5hbWUgfHwgdHlwZW9mIGNoYXROYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWxsU2V0dGluZ3MgPSBmaWx0ZXJTdG9yYWdlLmdldENoYXRzU2V0dGluZ3MoKTtcbiAgICAgICAgZGVsZXRlIGFsbFNldHRpbmdzW2NoYXROYW1lXTtcbiAgICAgICAgZmlsdGVyU3RvcmFnZS5zZXRDaGF0c1NldHRpbmdzKGFsbFNldHRpbmdzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0J/RgNC+0LLQtdGA0Y/QtdGCLCDQtdGB0YLRjCDQu9C4INC90LDRgdGC0YDQvtC50LrQuCDQtNC70Y8g0LrQvtC90LrRgNC10YLQvdC+0LPQviDRh9Cw0YLQsFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjaGF0TmFtZSAtINCd0LDQt9Cy0LDQvdC40LUg0YfQsNGC0LBcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSwg0LXRgdC70Lgg0LXRgdGC0Ywg0L3QsNGB0YLRgNC+0LnQutC4INC00LvRjyDRh9Cw0YLQsFxuICAgICAqL1xuICAgIGhhc0NoYXRTZXR0aW5nczogKGNoYXROYW1lKSA9PiB7XG4gICAgICAgIGlmICghY2hhdE5hbWUgfHwgdHlwZW9mIGNoYXROYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWxsU2V0dGluZ3MgPSBmaWx0ZXJTdG9yYWdlLmdldENoYXRzU2V0dGluZ3MoKTtcbiAgICAgICAgcmV0dXJuIGNoYXROYW1lIGluIGFsbFNldHRpbmdzO1xuICAgIH0sXG5cbiAgICAvLyA9PT0g0KPRgtC40LvQuNGC0YsgPT09XG5cbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LDQtdGCINGB0L/QuNGB0L7QuiDQstGB0LXRhSDRh9Cw0YLQvtCyINGBINC90LDRgdGC0YDQvtC50LrQsNC80LhcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nW119INCc0LDRgdGB0LjQsiDQvdCw0LfQstCw0L3QuNC5INGH0LDRgtC+0LJcbiAgICAgKi9cbiAgICBnZXRBbGxDaGF0TmFtZXM6ICgpID0+IHtcbiAgICAgICAgY29uc3QgYWxsU2V0dGluZ3MgPSBmaWx0ZXJTdG9yYWdlLmdldENoYXRzU2V0dGluZ3MoKTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGFsbFNldHRpbmdzKTtcbiAgICB9LFxuXG4gICAgLy8gPT09INCe0YfQuNGB0YLQutCwINC00LDQvdC90YvRhSA9PT1cblxuICAgIC8qKlxuICAgICAqINCe0YfQuNGJ0LDQtdGCINCy0YHQtSDQvdCw0YHRgtGA0L7QudC60Lgg0YTQuNC70YzRgtGA0L7QslxuICAgICAqL1xuICAgIGNsZWFyQWxsRGF0YTogKCkgPT4ge1xuICAgICAgICBzdG9yYWdlLnJlbW92ZShGSUxURVJfS0VZUy5DSEFUU19TRVRUSU5HUyk7XG4gICAgfSxcbn07XG4iLCJleHBvcnQgZGVmYXVsdCBcIi50Zy1oaWRkZW57ZGlzcGxheTpub25lfS5idWJibGUtY29sbGFwc2Vke29wYWNpdHk6LjIhaW1wb3J0YW50O21heC1oZWlnaHQ6NDBweCFpbXBvcnRhbnQ7b3ZlcmZsb3c6aGlkZGVuIWltcG9ydGFudDt0cmFuc2l0aW9uOm9wYWNpdHkgLjNzIGVhc2UsbWF4LWhlaWdodCAuM3MgZWFzZSFpbXBvcnRhbnQ7cG9zaXRpb246cmVsYXRpdmUhaW1wb3J0YW50O2N1cnNvcjpwb2ludGVyfS5idWJibGUtY29sbGFwc2VkOmFmdGVye2NvbnRlbnQ6XFxcIlxcXCI7cG9zaXRpb246YWJzb2x1dGU7Ym90dG9tOjA7bGVmdDowO3JpZ2h0OjA7aGVpZ2h0OjEwcHg7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQodHJhbnNwYXJlbnQsIzAwMDAwMDFhKTtwb2ludGVyLWV2ZW50czpub25lfS5idWJibGUtZXhwYW5kZWR7b3BhY2l0eToxIWltcG9ydGFudDttYXgtaGVpZ2h0Om5vbmUhaW1wb3J0YW50O3RyYW5zaXRpb246b3BhY2l0eSAuM3MgZWFzZSxtYXgtaGVpZ2h0IC4zcyBlYXNlIWltcG9ydGFudH0ucmVhY3Rpb25zLWNvbGxhcHNlZHtvcGFjaXR5Oi4yIWltcG9ydGFudDt0cmFuc2l0aW9uOm9wYWNpdHkgLjNzIGVhc2UhaW1wb3J0YW50fS5yZWFjdGlvbnMtZXhwYW5kZWR7b3BhY2l0eToxIWltcG9ydGFudDt0cmFuc2l0aW9uOm9wYWNpdHkgLjNzIGVhc2UhaW1wb3J0YW50fSN0Zy1maWx0ZXItcGFuZWx7cG9zaXRpb246Zml4ZWQ7Ym90dG9tOjE1cHg7cmlnaHQ6MTVweDt3aWR0aDoxODBweDtwYWRkaW5nOjhweDtiYWNrZ3JvdW5kOiNmZmY7Ym9yZGVyOjFweCBzb2xpZCAjY2NjO2JvcmRlci1yYWRpdXM6MTBweDtib3gtc2hhZG93OjAgMnB4IDZweCAjMDAwMDAwNDA7ei1pbmRleDo5OTk5O2ZvbnQtc2l6ZToxM3B4O2Rpc3BsYXk6bm9uZTtmb250LWZhbWlseTpzYW5zLXNlcmlmfSN0Zy1maWx0ZXItY2hhdC10aXRsZXtmb250LXdlaWdodDo3MDA7bWFyZ2luLWJvdHRvbTo4cHg7dGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOjE0cHh9LnRnLWZpbHRlci1jb250cm9sc3tkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7Z2FwOjEwcHh9I3RnLWZpbHRlci1jaGF0LWxpbWl0e3dpZHRoOjYwcHg7dGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOjE0cHg7cGFkZGluZzo0cHg7Ym9yZGVyLXJhZGl1czo2cHg7Ym9yZGVyOjFweCBzb2xpZCAjY2NjfS50Zy1maWx0ZXItbGFiZWx7bWFyZ2luLXRvcDo2cHg7Zm9udC1zaXplOjExcHg7dGV4dC1hbGlnbjpjZW50ZXI7Y29sb3I6IzY2NjttYXJnaW4tYm90dG9tOjhweH0jdGctZmlsdGVyLXBhbmVsIC50Zy1yb3VuZC1idG57d2lkdGg6MjhweDtoZWlnaHQ6MjhweDtib3JkZXItcmFkaXVzOjUwJTtib3JkZXI6MXB4IHNvbGlkICNjY2M7YmFja2dyb3VuZDojZjhmOGY4O2ZvbnQtc2l6ZToxNnB4O2ZvbnQtd2VpZ2h0OjcwMDtjdXJzb3I6cG9pbnRlcjt0cmFuc2l0aW9uOmJhY2tncm91bmQgLjJzLHRyYW5zZm9ybSAuMXN9I3RnLWZpbHRlci1wYW5lbCAudGctcm91bmQtYnRuOmhvdmVye2JhY2tncm91bmQ6I2U2ZTZlNn0jdGctZmlsdGVyLXBhbmVsIC50Zy1yb3VuZC1idG46YWN0aXZle3RyYW5zZm9ybTpzY2FsZSguOSl9LnRnLWZ1bGwtd2lkdGgtYnRue3dpZHRoOjEwMCU7bWFyZ2luLXRvcDo1cHg7cGFkZGluZzo2cHg7Ym9yZGVyLXJhZGl1czo2cHg7Ym9yZGVyOjFweCBzb2xpZCAjY2NjO2JhY2tncm91bmQ6I2Y4ZjhmODtmb250LXNpemU6MTJweDtjdXJzb3I6cG9pbnRlcjt0cmFuc2l0aW9uOmJhY2tncm91bmQgLjJzLHRyYW5zZm9ybSAuMXM7dGV4dC1hbGlnbjpjZW50ZXJ9LnRnLWZ1bGwtd2lkdGgtYnRuOmhvdmVye2JhY2tncm91bmQ6I2U2ZTZlNn0udGctZnVsbC13aWR0aC1idG46YWN0aXZle3RyYW5zZm9ybTpzY2FsZSguOTgpfVxcblwiOyIsImV4cG9ydCBkZWZhdWx0IFwiPGRpdiBpZD1cXFwidGctZmlsdGVyLWNoYXQtdGl0bGVcXFwiPlxcclxcbiAgICDQp9Cw0YI6ICjQvdC10LjQt9Cy0LXRgdGC0L3QvilcXHJcXG48L2Rpdj5cXHJcXG48ZGl2IGNsYXNzPVxcXCJ0Zy1maWx0ZXItY29udHJvbHNcXFwiPlxcclxcbiAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgaWQ9XFxcInRnLWZpbHRlci1kZWNyZWFzZVxcXCIgY2xhc3M9XFxcInRnLXJvdW5kLWJ0blxcXCI+4oiSPC9idXR0b24+XFxyXFxuICAgIDxpbnB1dCB0eXBlPVxcXCJudW1iZXJcXFwiIGlkPVxcXCJ0Zy1maWx0ZXItY2hhdC1saW1pdFxcXCIgbWluPVxcXCIwXFxcIi8+XFxyXFxuICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBpZD1cXFwidGctZmlsdGVyLWluY3JlYXNlXFxcIiBjbGFzcz1cXFwidGctcm91bmQtYnRuXFxcIj4rPC9idXR0b24+XFxyXFxuPC9kaXY+XFxyXFxuPGRpdiBjbGFzcz1cXFwidGctZmlsdGVyLWxhYmVsXFxcIj5cXHJcXG4gICAg0JzQuNC9LiDRgNC10LDQutGG0LjQuVxcclxcbjwvZGl2PlxcclxcbjxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBpZD1cXFwidGctZmlsdGVyLXRvZ2dsZVxcXCIgY2xhc3M9XFxcInRnLWZ1bGwtd2lkdGgtYnRuXFxcIlxcclxcbiAgICAgICAgc3R5bGU9XFxcImJhY2tncm91bmQ6ICNlZWZiZWU7IGJvcmRlci1jb2xvcjogI2MzZTZjYjtcXFwiPlxcclxcbiAgICDQpNC40LvRjNGC0YA6INCS0JrQm1xcclxcbjwvYnV0dG9uPlxcclxcbjxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBpZD1cXFwidGctZmlsdGVyLXJlZnJlc2hcXFwiIGNsYXNzPVxcXCJ0Zy1mdWxsLXdpZHRoLWJ0biB0Zy1oaWRkZW5cXFwiPlxcclxcbiAgICDihrsg0J7QsdC90L7QstC40YLRjFxcclxcbjwvYnV0dG9uPlxcclxcblwiOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbmNvbnN0IF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0Y29uc3QgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdGNvbnN0IG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHRjb25zdCBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlci92YWx1ZSBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0aWYoQXJyYXkuaXNBcnJheShkZWZpbml0aW9uKSkge1xuXHRcdHZhciBpID0gMDtcblx0XHR3aGlsZShpIDwgZGVmaW5pdGlvbi5sZW5ndGgpIHtcblx0XHRcdHZhciBrZXkgPSBkZWZpbml0aW9uW2krK107XG5cdFx0XHR2YXIgYmluZGluZyA9IGRlZmluaXRpb25baSsrXTtcblx0XHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0XHRpZihiaW5kaW5nID09PSAwKSB7XG5cdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogZGVmaW5pdGlvbltpKytdIH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBiaW5kaW5nIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYoYmluZGluZyA9PT0gMCkgeyBpKys7IH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCJpbXBvcnQgc3R5bGVzIGZyb20gJy4vc3R5bGVzLmNzcyc7XG5pbXBvcnQgZmlsdGVyc1RlbXBsYXRlIGZyb20gJy4vZmlsdGVycy10ZW1wbGF0ZS5odG1sJztcbmltcG9ydCB7IGZpbHRlclN0b3JhZ2UgfSBmcm9tICcuL3N0b3JhZ2UnO1xuXG5jb25zdCBDT05GSUcgPSB7XG4gICAgSE9WRVJfREVMQVk6IDIwMCxcbiAgICBVTkhPVkVSX0RFTEFZOiAwLFxuICAgIENIRUNLX0lOVEVSVkFMOiAzMDAsXG59O1xuXG5sZXQgaXNGaWx0ZXJFbmFibGVkID0gdHJ1ZTtcblxuZnVuY3Rpb24gZ2V0Q3VycmVudENoYXROYW1lKCkge1xuICAgIGNvbnN0IGggPSB3aW5kb3cubG9jYXRpb24uaGFzaDtcbiAgICBpZiAoIWgpIHJldHVybiBudWxsO1xuICAgIGxldCBzID0gaC5yZXBsYWNlKC9eIy8sICcnKTtcbiAgICBpZiAocy5zdGFydHNXaXRoKCdAJykpIHMgPSBzLnNsaWNlKDEpO1xuICAgIHJldHVybiBzLnNwbGl0KCcvJylbMF0gfHwgbnVsbDtcbn1cblxuZnVuY3Rpb24gY291bnRSZWFjdGlvbnMoYnViYmxlKSB7XG4gICAgbGV0IHRvdGFsID0gMDtcbiAgICBjb25zdCB3cmFwcGVyID0gYnViYmxlLmNsb3Nlc3QoJy5idWJibGUtY29udGVudC13cmFwcGVyJykgfHwgYnViYmxlO1xuICAgIGNvbnN0IHJlYWN0aW9uRWxlbWVudHMgPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ3JlYWN0aW9uLWVsZW1lbnQsIC5yZWFjdGlvbi1lbGVtZW50Jyk7XG5cbiAgICByZWFjdGlvbkVsZW1lbnRzLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvdW50ZXJFbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoJy5yZWFjdGlvbi1jb3VudGVyJyk7XG4gICAgICAgIGlmIChjb3VudGVyRWwpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IHBhcnNlSW50KGNvdW50ZXJFbC50ZXh0Q29udGVudC50cmltKCksIDEwKTtcbiAgICAgICAgICAgIHRvdGFsICs9IE51bWJlci5pc05hTih2YWwpID8gMSA6IHZhbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGF2YXRhcnMgPSBlbC5xdWVyeVNlbGVjdG9yQWxsKCcuc3RhY2tlZC1hdmF0YXJzLWF2YXRhci1jb250YWluZXInKTtcbiAgICAgICAgaWYgKGF2YXRhcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdG90YWwgKz0gYXZhdGFycy5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0b3RhbCArPSAxO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRvdGFsO1xufVxuXG5mdW5jdGlvbiBzZXRCdWJibGVTdGF0ZShidWJibGUsIHJlYWN0aW9uc0VsZW1lbnQsIHN0YXRlLCB0b3RhbFJlYWN0aW9ucyA9IG51bGwpIHtcbiAgICBidWJibGUuY2xhc3NMaXN0LnJlbW92ZSgnYnViYmxlLWNvbGxhcHNlZCcsICdidWJibGUtZXhwYW5kZWQnLCAnYnViYmxlLXBpbm5lZCcpO1xuICAgIGlmIChyZWFjdGlvbnNFbGVtZW50KSB7XG4gICAgICAgIHJlYWN0aW9uc0VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgncmVhY3Rpb25zLWNvbGxhcHNlZCcsICdyZWFjdGlvbnMtZXhwYW5kZWQnKTtcbiAgICB9XG5cbiAgICBpZiAodG90YWxSZWFjdGlvbnMgIT09IG51bGwpIHtcbiAgICAgICAgYnViYmxlLnRpdGxlID0gYNCg0LXQsNC60YbQuNC5OiAke3RvdGFsUmVhY3Rpb25zfWA7XG4gICAgfVxuXG4gICAgc3dpdGNoIChzdGF0ZSkge1xuICAgIGNhc2UgJ2V4cGFuZGVkJzpcbiAgICAgICAgYnViYmxlLmNsYXNzTGlzdC5hZGQoJ2J1YmJsZS1leHBhbmRlZCcpO1xuICAgICAgICBpZiAocmVhY3Rpb25zRWxlbWVudCkgcmVhY3Rpb25zRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdyZWFjdGlvbnMtZXhwYW5kZWQnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgY2FzZSAnY29sbGFwc2VkJzpcbiAgICAgICAgYnViYmxlLmNsYXNzTGlzdC5hZGQoJ2J1YmJsZS1jb2xsYXBzZWQnKTtcbiAgICAgICAgaWYgKHJlYWN0aW9uc0VsZW1lbnQpIHJlYWN0aW9uc0VsZW1lbnQuY2xhc3NMaXN0LmFkZCgncmVhY3Rpb25zLWNvbGxhcHNlZCcpO1xuICAgICAgICBicmVhaztcbiAgICBjYXNlICdwaW5uZWQnOlxuICAgICAgICBidWJibGUuY2xhc3NMaXN0LmFkZCgnYnViYmxlLXBpbm5lZCcsICdidWJibGUtZXhwYW5kZWQnKTtcbiAgICAgICAgaWYgKHJlYWN0aW9uc0VsZW1lbnQpIHJlYWN0aW9uc0VsZW1lbnQuY2xhc3NMaXN0LmFkZCgncmVhY3Rpb25zLWV4cGFuZGVkJyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYXR0YWNoSG92ZXIoYnViYmxlLCByZWFjdGlvbnNFbGVtZW50KSB7XG4gICAgaWYgKGJ1YmJsZS5kYXRhc2V0Lmhhc0hvdmVySGFuZGxlcnMgPT09ICcxJykgcmV0dXJuO1xuICAgIGxldCBzaG93VGltZW91dDtcbiAgICBsZXQgaGlkZVRpbWVvdXQ7XG5cbiAgICBjb25zdCBzaG93QnViYmxlID0gKCkgPT4ge1xuICAgICAgICBjbGVhclRpbWVvdXQoaGlkZVRpbWVvdXQpO1xuICAgICAgICBzZXRCdWJibGVTdGF0ZShidWJibGUsIHJlYWN0aW9uc0VsZW1lbnQsICdleHBhbmRlZCcpO1xuICAgIH07XG5cbiAgICBjb25zdCBoaWRlQnViYmxlID0gKCkgPT4ge1xuICAgICAgICBjbGVhclRpbWVvdXQoc2hvd1RpbWVvdXQpO1xuICAgICAgICBpZiAoYnViYmxlLmNsYXNzTGlzdC5jb250YWlucygnYnViYmxlLXBpbm5lZCcpKSByZXR1cm47XG4gICAgICAgIHNldEJ1YmJsZVN0YXRlKGJ1YmJsZSwgcmVhY3Rpb25zRWxlbWVudCwgJ2NvbGxhcHNlZCcpO1xuICAgIH07XG5cbiAgICBjb25zdCBvbk1vdXNlRW50ZXIgPSAoKSA9PiB7XG4gICAgICAgIGNsZWFyVGltZW91dChoaWRlVGltZW91dCk7XG4gICAgICAgIHNob3dUaW1lb3V0ID0gc2V0VGltZW91dChzaG93QnViYmxlLCBDT05GSUcuSE9WRVJfREVMQVkpO1xuICAgIH07XG5cbiAgICBjb25zdCBvbk1vdXNlTGVhdmUgPSAoKSA9PiB7XG4gICAgICAgIGNsZWFyVGltZW91dChzaG93VGltZW91dCk7XG4gICAgICAgIGhpZGVUaW1lb3V0ID0gc2V0VGltZW91dChoaWRlQnViYmxlLCBDT05GSUcuVU5IT1ZFUl9ERUxBWSk7XG4gICAgfTtcblxuICAgIGJ1YmJsZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgb25Nb3VzZUVudGVyLCB7IHBhc3NpdmU6IHRydWUgfSk7XG4gICAgYnViYmxlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBvbk1vdXNlTGVhdmUsIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcbiAgICBpZiAocmVhY3Rpb25zRWxlbWVudCkge1xuICAgICAgICByZWFjdGlvbnNFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvbk1vdXNlRW50ZXIsIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcbiAgICAgICAgcmVhY3Rpb25zRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgb25Nb3VzZUxlYXZlLCB7IHBhc3NpdmU6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgYnViYmxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBpc1Bpbm5lZCA9IGJ1YmJsZS5jbGFzc0xpc3QuY29udGFpbnMoJ2J1YmJsZS1waW5uZWQnKTtcbiAgICAgICAgaWYgKGlzUGlubmVkKSB7XG4gICAgICAgICAgICBzZXRCdWJibGVTdGF0ZShidWJibGUsIHJlYWN0aW9uc0VsZW1lbnQsICdjb2xsYXBzZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldEJ1YmJsZVN0YXRlKGJ1YmJsZSwgcmVhY3Rpb25zRWxlbWVudCwgJ3Bpbm5lZCcpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBidWJibGUuZGF0YXNldC5oYXNIb3ZlckhhbmRsZXJzID0gJzEnO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzQnViYmxlKGJ1YmJsZSwgbWluUmVhY3Rpb25zLCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgY29uc3QgdG90YWxSZWFjdGlvbnMgPSBjb3VudFJlYWN0aW9ucyhidWJibGUpO1xuICAgIGNvbnN0IHdyYXBwZXIgPSBidWJibGUuY2xvc2VzdCgnLmJ1YmJsZS1jb250ZW50LXdyYXBwZXInKTtcbiAgICBjb25zdCByZWFjdGlvbnNFbGVtZW50ID0gd3JhcHBlcj8ucXVlcnlTZWxlY3RvcigncmVhY3Rpb25zLWVsZW1lbnQnKTtcblxuICAgIGJ1YmJsZS50aXRsZSA9IGDQoNC10LDQutGG0LjQuTogJHt0b3RhbFJlYWN0aW9uc31gO1xuXG4gICAgaWYgKGJ1YmJsZS5jbG9zZXN0KCcuaXMtb3V0JykpIHtcbiAgICAgICAgaWYgKCFidWJibGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdidWJibGUtZXhwYW5kZWQnKSkge1xuICAgICAgICAgICAgc2V0QnViYmxlU3RhdGUoYnViYmxlLCByZWFjdGlvbnNFbGVtZW50LCAnZXhwYW5kZWQnLCB0b3RhbFJlYWN0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChidWJibGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdidWJibGUtcGlubmVkJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChidWJibGUubWF0Y2hlcygnOmhvdmVyJykgfHwgKHJlYWN0aW9uc0VsZW1lbnQgJiYgcmVhY3Rpb25zRWxlbWVudC5tYXRjaGVzKCc6aG92ZXInKSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghaXNGaWx0ZXJFbmFibGVkKSB7XG4gICAgICAgIGlmICghYnViYmxlLmNsYXNzTGlzdC5jb250YWlucygnYnViYmxlLWV4cGFuZGVkJykpIHtcbiAgICAgICAgICAgIHNldEJ1YmJsZVN0YXRlKGJ1YmJsZSwgcmVhY3Rpb25zRWxlbWVudCwgJ2V4cGFuZGVkJywgdG90YWxSZWFjdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsYXN0S25vd25Db3VudCA9IHBhcnNlSW50KGJ1YmJsZS5kYXRhc2V0Lmxhc3RDb3VudCwgMTApO1xuICAgIGNvbnN0IHNob3VsZEJlRXhwYW5kZWQgPSB0b3RhbFJlYWN0aW9ucyA+PSBtaW5SZWFjdGlvbnM7XG4gICAgY29uc3QgaXNFeHBhbmRlZCA9IGJ1YmJsZS5jbGFzc0xpc3QuY29udGFpbnMoJ2J1YmJsZS1leHBhbmRlZCcpO1xuXG4gICAgaWYgKCFmb3JjZSAmJiBsYXN0S25vd25Db3VudCA9PT0gdG90YWxSZWFjdGlvbnMpIHtcbiAgICAgICAgaWYgKHNob3VsZEJlRXhwYW5kZWQgPT09IGlzRXhwYW5kZWQpIHJldHVybjtcbiAgICB9XG5cbiAgICBidWJibGUuZGF0YXNldC5sYXN0Q291bnQgPSB0b3RhbFJlYWN0aW9ucztcblxuICAgIGlmIChzaG91bGRCZUV4cGFuZGVkKSB7XG4gICAgICAgIHNldEJ1YmJsZVN0YXRlKGJ1YmJsZSwgcmVhY3Rpb25zRWxlbWVudCwgJ2V4cGFuZGVkJywgdG90YWxSZWFjdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNldEJ1YmJsZVN0YXRlKGJ1YmJsZSwgcmVhY3Rpb25zRWxlbWVudCwgJ2NvbGxhcHNlZCcsIHRvdGFsUmVhY3Rpb25zKTtcbiAgICAgICAgYXR0YWNoSG92ZXIoYnViYmxlLCByZWFjdGlvbnNFbGVtZW50KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlZnJlc2hBbGxCdWJibGVzKGZvcmNlID0gZmFsc2UpIHtcbiAgICBjb25zdCBjaGF0TmFtZSA9IGdldEN1cnJlbnRDaGF0TmFtZSgpO1xuICAgIGlmICghY2hhdE5hbWUpIHJldHVybjtcbiAgICBjb25zdCBtaW5SZWFjdGlvbnMgPSBmaWx0ZXJTdG9yYWdlLmdldE1pblJlYWN0aW9ucyhjaGF0TmFtZSk7XG4gICAgY29uc3QgYnViYmxlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idWJibGUtY29udGVudCcpO1xuICAgIGJ1YmJsZXMuZm9yRWFjaCgoYnViYmxlKSA9PiBwcm9jZXNzQnViYmxlKGJ1YmJsZSwgbWluUmVhY3Rpb25zLCBmb3JjZSkpO1xufVxuXG5sZXQgcGFuZWw7XG5sZXQgaW5wdXQ7XG5sZXQgbGFzdENoYXROYW1lID0gbnVsbDtcblxuZnVuY3Rpb24gaW5pdFVJKCkge1xuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGctZmlsdGVyLXBhbmVsJykpIHtcbiAgICAgICAgcGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGctZmlsdGVyLXBhbmVsJyk7XG4gICAgICAgIGlucHV0ID0gcGFuZWwucXVlcnlTZWxlY3RvcignI3RnLWZpbHRlci1jaGF0LWxpbWl0Jyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcGFuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwYW5lbC5pZCA9ICd0Zy1maWx0ZXItcGFuZWwnO1xuICAgIHBhbmVsLmlubmVySFRNTCA9IGZpbHRlcnNUZW1wbGF0ZTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBhbmVsKTtcbiAgICBpbnB1dCA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoJyN0Zy1maWx0ZXItY2hhdC1saW1pdCcpO1xuXG4gICAgY29uc3QgYnRuTWludXMgPSBwYW5lbC5xdWVyeVNlbGVjdG9yKCcjdGctZmlsdGVyLWRlY3JlYXNlJyk7XG4gICAgY29uc3QgYnRuUGx1cyA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoJyN0Zy1maWx0ZXItaW5jcmVhc2UnKTtcbiAgICBjb25zdCBidG5SZWZyZXNoID0gcGFuZWwucXVlcnlTZWxlY3RvcignI3RnLWZpbHRlci1yZWZyZXNoJyk7XG4gICAgY29uc3QgYnRuVG9nZ2xlID0gcGFuZWwucXVlcnlTZWxlY3RvcignI3RnLWZpbHRlci10b2dnbGUnKTtcblxuICAgIGJ0blRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgaXNGaWx0ZXJFbmFibGVkID0gIWlzRmlsdGVyRW5hYmxlZDtcblxuICAgICAgICBpZiAoaXNGaWx0ZXJFbmFibGVkKSB7XG4gICAgICAgICAgICBidG5Ub2dnbGUudGV4dENvbnRlbnQgPSAn0KTQuNC70YzRgtGAOiDQktCa0JsnO1xuICAgICAgICAgICAgYnRuVG9nZ2xlLnN0eWxlLmJhY2tncm91bmQgPSAnI2VlZmJlZSc7XG4gICAgICAgICAgICBidG5Ub2dnbGUuc3R5bGUuYm9yZGVyQ29sb3IgPSAnI2MzZTZjYic7XG4gICAgICAgICAgICBidG5Ub2dnbGUuc3R5bGUuY29sb3IgPSAnIzAwMCc7XG4gICAgICAgICAgICBpbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnRuVG9nZ2xlLnRleHRDb250ZW50ID0gJ9Ck0LjQu9GM0YLRgDog0JLQq9Ca0JsnO1xuICAgICAgICAgICAgYnRuVG9nZ2xlLnN0eWxlLmJhY2tncm91bmQgPSAnI2Y4ZDdkYSc7XG4gICAgICAgICAgICBidG5Ub2dnbGUuc3R5bGUuYm9yZGVyQ29sb3IgPSAnI2Y1YzZjYic7XG4gICAgICAgICAgICBidG5Ub2dnbGUuc3R5bGUuY29sb3IgPSAnIzcyMWMyNCc7XG4gICAgICAgICAgICBpbnB1dC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmVmcmVzaEFsbEJ1YmJsZXModHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBidG5SZWZyZXNoLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICByZWZyZXNoQWxsQnViYmxlcyh0cnVlKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGFwcGx5VmFsdWUodmFsKSB7XG4gICAgICAgIGNvbnN0IGNoYXROYW1lID0gZ2V0Q3VycmVudENoYXROYW1lKCk7XG4gICAgICAgIGlmICghY2hhdE5hbWUpIHJldHVybjtcbiAgICAgICAgY29uc3Qgc2FmZSA9IE1hdGgubWF4KDAsIHBhcnNlSW50KHZhbCwgMTApIHx8IDApO1xuICAgICAgICBmaWx0ZXJTdG9yYWdlLnNldE1pblJlYWN0aW9ucyhjaGF0TmFtZSwgc2FmZSk7XG4gICAgICAgIGlucHV0LnZhbHVlID0gc2FmZTtcbiAgICAgICAgcmVmcmVzaEFsbEJ1YmJsZXModHJ1ZSk7XG4gICAgfVxuXG4gICAgbGV0IGRlYm91bmNlVGltZXI7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xuICAgICAgICBjbGVhclRpbWVvdXQoZGVib3VuY2VUaW1lcik7XG4gICAgICAgIGRlYm91bmNlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGFwcGx5VmFsdWUoZS50YXJnZXQudmFsdWUpLCAzMDApO1xuICAgIH0pO1xuXG4gICAgYnRuTWludXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBhcHBseVZhbHVlKChwYXJzZUludChpbnB1dC52YWx1ZSwgMTApIHx8IDApIC0gMSkpO1xuICAgIGJ0blBsdXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBhcHBseVZhbHVlKChwYXJzZUludChpbnB1dC52YWx1ZSwgMTApIHx8IDApICsgMSkpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVQYW5lbCgpIHtcbiAgICBjb25zdCBjaGF0TmFtZSA9IGdldEN1cnJlbnRDaGF0TmFtZSgpO1xuICAgIGlmICghY2hhdE5hbWUpIHtcbiAgICAgICAgcGFuZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgbGFzdENoYXROYW1lID0gbnVsbDtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBwYW5lbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBpbnB1dC52YWx1ZSA9IGZpbHRlclN0b3JhZ2UuZ2V0TWluUmVhY3Rpb25zKGNoYXROYW1lKTtcblxuICAgIGNvbnN0IHRpdGxlID0gcGFuZWwucXVlcnlTZWxlY3RvcignI3RnLWZpbHRlci1jaGF0LXRpdGxlJyk7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSBg0KfQsNGCOiAke2NoYXROYW1lfWA7XG4gICAgbGFzdENoYXROYW1lID0gY2hhdE5hbWU7XG59XG5cbi8vIC0tLSDQoNC10LPRg9C70Y/RgNC90LDRjyDQv9GA0L7QstC10YDQutCwINGB0L7RgdGC0L7Rj9C90LjRjyAtLS1cbmZ1bmN0aW9uIHJlZnJlc2hDaGF0VmlldygpIHtcbiAgICBpZiAoZG9jdW1lbnQuaGlkZGVuKSByZXR1cm47XG5cbiAgICBjb25zdCBjaGF0TmFtZSA9IGdldEN1cnJlbnRDaGF0TmFtZSgpO1xuICAgIGlmICghY2hhdE5hbWUpIHJldHVybjtcblxuICAgIGlmIChjaGF0TmFtZSAhPT0gbGFzdENoYXROYW1lKSB1cGRhdGVQYW5lbCgpO1xuICAgIHJlZnJlc2hBbGxCdWJibGVzKCk7XG59XG5cbmZ1bmN0aW9uIHNldHVwU2lkZWJhckhlYWRlck9ic2VydmVyKCkge1xuICAgIGNvbnN0IHNpZGViYXJIZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuc2lkZWJhci1oZWFkZXIudG9wYmFyJyk7XG4gICAgaWYgKCFzaWRlYmFySGVhZGVyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTaWRlYmFyIGhlYWRlciBub3QgZm91bmQsIHJldHJ5aW5nIGluIDEgc2Vjb25kLi4uJyk7XG4gICAgICAgIHNldFRpbWVvdXQoc2V0dXBTaWRlYmFySGVhZGVyT2JzZXJ2ZXIsIDEwMDApO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbmV3IE11dGF0aW9uT2JzZXJ2ZXIocmVmcmVzaENoYXRWaWV3KS5vYnNlcnZlKHNpZGViYXJIZWFkZXIsIHtcbiAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgYXR0cmlidXRlRmlsdGVyOiBbJ2NsYXNzJ10sXG4gICAgfSk7XG59XG5cbkdNX2FkZFN0eWxlKHN0eWxlcyk7XG5pbml0VUkoKTtcbnVwZGF0ZVBhbmVsKCk7XG5yZWZyZXNoQWxsQnViYmxlcygpO1xuc2V0dXBTaWRlYmFySGVhZGVyT2JzZXJ2ZXIoKTtcblxuLy8g0JfQsNC/0YPRgdC60LDQtdC8INGA0LXQs9GD0LvRj9GA0L3Rg9GOINC/0YDQvtCy0LXRgNC60YNcbnNldEludGVydmFsKHJlZnJlc2hDaGF0VmlldywgQ09ORklHLkNIRUNLX0lOVEVSVkFMKTtcblxud2luZG93LlRlbGVncmFtRmlsdGVyID0ge1xuICAgIHJlZnJlc2g6IHJlZnJlc2hBbGxCdWJibGVzLFxuICAgIGdldEN1cnJlbnRDaGF0OiBnZXRDdXJyZW50Q2hhdE5hbWUsXG4gICAgc3RvcmFnZToge1xuICAgICAgICBnZXRDaGF0c1NldHRpbmdzOiBmaWx0ZXJTdG9yYWdlLmdldENoYXRzU2V0dGluZ3MsXG4gICAgICAgIGdldEFsbENoYXROYW1lczogZmlsdGVyU3RvcmFnZS5nZXRBbGxDaGF0TmFtZXMsXG4gICAgICAgIHJlbW92ZUNoYXRTZXR0aW5nczogZmlsdGVyU3RvcmFnZS5yZW1vdmVDaGF0U2V0dGluZ3MsXG4gICAgICAgIGNsZWFyQWxsRGF0YTogZmlsdGVyU3RvcmFnZS5jbGVhckFsbERhdGEsXG4gICAgfSxcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=