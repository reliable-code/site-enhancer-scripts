// ==UserScript==
// @name         Asana enhancer
// @description  UI tweaks
// @grant        GM_addStyle
// @match        https://app.asana.com/*
// @namespace    https://github.com/reliable-code/site-enhancer-scripts
// @version      1.0.78723544
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asana.com
// @author       reliable-code
// @downloadURL  https://raw.githubusercontent.com/reliable-code/site-enhancer-scripts/main/specific/asana.user.js
// ==/UserScript==

(()=>{(()=>{"use strict";GM_addStyle(`[aria-label=More].AsanaModeNavButton,.SortableList-sortableItemContainer:has([aria-label=Agents]),.SidebarFooterUpgradeButton,.SidebarInvite,.SidebarFooter-content:has(.SidebarFooterUpgradeButton):has(.SidebarInvite):not(:has(>*:not(.SidebarFooterUpgradeButton):not(.SidebarInvite))),.TrialCalloutCard,.TopbarSettingsMenu-upgradeItem,.CustomizableHomePage-widget:has(>.SortableItem div[aria-label=People]),.StaticCard:has(.CurrentUserProfileGoalsWidgetContent-header),.SidebarModesNavigationCardPresentation:has([aria-label=Portfolios]){display:none!important}
`)})();})();
