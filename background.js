chrome.runtime.onInstalled.addListener(() => {
  chrome.proxy.settings.set(
    {
      value: {
        mode: "fixed_servers",
        rules: {
          singleProxy: {
            scheme: "socks5",
            host: "127.0.0.1",
            port: 7896
          }
        }
      },
      scope: "regular"
    },
    () => {
      console.log("PROXY FORCE ENABLED");
    }
  );
});
