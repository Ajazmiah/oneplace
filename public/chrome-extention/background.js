chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const togglePanel = () => {
        const panel = document.querySelector(".joblogPopUp");
        if (panel) {
          panel.style.right = panel.style.right === "0px" ? "-100%" : "0px";
        }
      };

      togglePanel();
    },
  });
});
