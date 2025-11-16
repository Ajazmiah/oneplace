
document.getElementById("start").addEventListener("click", () => {
    chrome.tabs.create({ url: "http://localhost:3000/" });
});
