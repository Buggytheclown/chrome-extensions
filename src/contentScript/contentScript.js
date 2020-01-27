const config = {
  logger: () => {}
};
const log = (msg, ...rest) => config.logger(`!!__Extension: ${msg}`, ...rest);
const sendMessage = msg => chrome.runtime.sendMessage(msg);

const actionCreators = {
  setTotalCount(count) {
    return { type: "setTotalCount", payload: count };
  }
};

log("contentScript was loaded");

const commetsSelector = ".voting-wjt_comments .voting-wjt__counter";
const controllers = {
  goToComment(action) {
    const count = action.payload;
    if (count < 0) return;
    const comments = [...document.querySelectorAll(commetsSelector)];
    if (count > comments.length - 1) return;
    comments
      .sort(
        (a, b) =>
          b.textContent.replace("–", "-") - a.textContent.replace("–", "-")
      )
      [count].scrollIntoView();
  },
  retrieveCommentCount() {
    sendMessage(
      actionCreators.setTotalCount(
        document.querySelectorAll(commetsSelector).length
      )
    );
  }
};

chrome.runtime.onMessage.addListener(function(request, sender) {
  log("get message", request, sender);
  const action = request.message;
  if (action.type in controllers) {
    controllers[action.type](action);
  }
});

chrome.runtime.sendMessage(
  {
    type: "SET_BADGE",
    payload: {
      text: document.querySelectorAll(commetsSelector).length.toString()
    }
  },
  function(response) {}
);
