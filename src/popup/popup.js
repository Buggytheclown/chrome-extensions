const render = new Uren().render;

const config = {
  logger: console.log
};
const noop = () => {};
const exec = string => chrome.tabs.executeScript(null, { code: string });
const execFunction = (fn, arg) => exec(`(${fn.toString()})(${arg})`);
const execLog = string => exec(`console.log('log:', '${string}')`);
const log = (msg, ...rest) => config.logger(`!!__Extension: ${msg}`, ...rest);
const sendMessage = message =>
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { message });
  });

const actionCreators = {
  goToComment(payload) {
    return {
      type: "goToComment",
      payload
    };
  },
  retrieveCommentCount() {
    return {
      type: "retrieveCommentCount"
    };
  }
};

const model = (() => {
  const state = {
    count: -1,
    get showCount() {
      return state.count + 1;
    },
    total: null
  };
  function update(fn) {
    fn(state);
    render(model.getState());
  }

  function getState() {
    return state;
  }

  const actions = {
    toNext() {
      model.update(state => {
        state.count++;
      });
      sendMessage(actionCreators.goToComment(model.getState().count));
    },
    toPrev() {
      model.update(state => {
        state.count--;
      });
      sendMessage(actionCreators.goToComment(model.getState().count));
    },
    setTotalCount({ payload }) {
      model.update(state => {
        state.total = payload;
      });
    },
    toStart() {
      model.update(state => {
        state.count = 0;
      });
      sendMessage(actionCreators.goToComment(model.getState().count));
    },
    toEnd() {
      model.update(state => {
        state.count = state.total - 1;
      });
      sendMessage(actionCreators.goToComment(model.getState().count));
    }
  };
  return {
    getState,
    update,
    actions
  };
})();

document.addEventListener("DOMContentLoaded", function() {
  render(model.getState());
  sendMessage(actionCreators.retrieveCommentCount());

  document.querySelector("body").addEventListener("click", event => {
    const action = event.target.dataset.action;
    (model.actions[action] || noop)(event);
  });
});

chrome.runtime.onMessage.addListener(function(action, sender) {
  log("get message", action, sender);
  (model.actions[action.type] || noop)(action);
});
