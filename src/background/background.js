chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type == "SET_BADGE") {
    chrome.tabs.get(sender.tab.id, function(tab) {
      if (chrome.runtime.lastError) {
        return; // the prerendered tab has been nuked, happens in omnibox search
      }
      if (tab.index >= 0) {
        // tab is visible
        if (!tab.id) throw new TypeError(`tab.id is not defined`);
        chrome.browserAction.setBadgeText({
          tabId: tab.id,
          text: message.payload.text
        });
      } else {
        // prerendered tab, invisible yet, happens quite rarely
        chrome.webNavigation.onCommitted.addListener(function update(details) {
          var tabId = sender.tab.id;
          if (details.tabId == tabId) {
            if (!tabId) throw new TypeError(`tabId is not defined`);
            chrome.browserAction.setBadgeText({
              tabId: tabId,
              text: message.payload.text
            });
            chrome.webNavigation.onCommitted.removeListener(update);
          }
        });
      }
    });
  }
});
