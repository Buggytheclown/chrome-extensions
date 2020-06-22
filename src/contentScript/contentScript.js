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

const commentRatingSelector = ".voting-wjt_comments .voting-wjt__counter";
const commentSelector = ".comment";
const controllers = {
  goToComment(action) {
    const count = action.payload;
    if (count < 0) return;
    const comments = [...document.querySelectorAll(commentSelector)];
    if (count > comments.length - 1) return;

    const targetComment = comments.map(comment => ({
      comment,
      rating: comment.querySelector(commentRatingSelector) && comment.querySelector(commentRatingSelector).textContent.replace("–", "-")
    })).sort((a, b) => b.rating - a.rating)
        [count]

    targetComment.comment.scrollIntoView({ block: "center" });
    targetComment.comment.setAttribute("style", "border: 2px solid #1b76c4; padding: 5px;");
    setTimeout(() => targetComment.comment.setAttribute("style", "border: 0px solid #1b76c4; padding: 0px;"), 5000)
  },
  retrieveCommentCount() {
    sendMessage(
      actionCreators.setTotalCount(
        document.querySelectorAll(commentRatingSelector).length
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
      text: document.querySelectorAll(commentRatingSelector).length.toString()
    }
  },
  function(response) {}
);
