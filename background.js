const DEFAULT_HOST = "192.168.100.1";
const DEFAULT_PORT = 7896;
const DEFAULT_SCHEME = "socks5";   // socks5 或 http

chrome.runtime.onInstalled.addListener(async () => {
  const settings = await chrome.storage.local.get(["host", "port", "scheme", "enabled"]);
  if (!settings.host) {
    await chrome.storage.local.set({
      host: DEFAULT_HOST,
      port: DEFAULT_PORT,
      scheme: DEFAULT_SCHEME,
      enabled: true
    });
  }
  applyProxy();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    applyProxy();
  }
});

async function applyProxy() {
  const { host, port, scheme, enabled } = await chrome.storage.local.get(["host", "port", "scheme", "enabled"]);

  if (!enabled || !host || !port) {
    chrome.proxy.settings.set({ value: { mode: "direct" }, scope: "regular" });
    console.log("PROXY DISABLED");
    return;
  }

  const proxyConfig = {
    mode: "fixed_servers",
    rules: {
      singleProxy: {
        scheme: scheme || "socks5",
        host: host,
        port: parseInt(port)
      }
    }
  };

  chrome.proxy.settings.set({
    value: proxyConfig,
    scope: "regular"
  }, () => {
    console.log(`PROXY ENABLED → ${scheme.toUpperCase()}://${host}:${port}`);
  });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "applyProxy") {
    applyProxy();
    sendResponse({ success: true });
  }
});