function evalWithState(state, string) {
  return Function("state", `{with(state){return  ${string}}}`)(state);
}

class Uren {
  render(state) {
    [...document.querySelectorAll("[data-bind]")].forEach(el => {
      const stateKey = el.dataset.bind;
      if (stateKey in state) {
        el.textContent = state[stateKey];
      }
    });

    [...document.querySelectorAll("[data-attrs]")].forEach(el => {
      const attrs = el.dataset.attrs;
      const attrsMap = evalWithState(state,attrs);

      Object.entries(attrsMap).forEach(([k, v]) => {
        el[k] = v;
      });
    });

    [...document.querySelectorAll("[data-if]")].forEach(el => {
      const rawCondidion = el.dataset.if;
      const condidion = evalWithState(state, rawCondidion);

      el.hidden = !condidion;
    });

    // chrome.browserAction.setBadgeText({text: (model.getState().total || '') + ''});
  }
}

