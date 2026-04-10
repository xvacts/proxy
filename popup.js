document.addEventListener('DOMContentLoaded', async () => {
  const schemeSelect = document.getElementById('scheme');
  const hostInput = document.getElementById('host');
  const portInput = document.getElementById('port');
  const noteInput = document.getElementById('note');
  const statusDiv = document.getElementById('status');

  // 加载保存的设置（新增 note）
  const data = await chrome.storage.local.get(["host", "port", "scheme", "note", "enabled"]);
  
  schemeSelect.value = data.scheme || "socks5";
  hostInput.value = data.host || "192.168.100.1";
  portInput.value = data.port || 7896;
  noteInput.value = data.note || "这是翻墙节点";   // 默认备注

  updateStatus(data.enabled, data.scheme, data.host, data.port, data.note);

  // 保存并启用
  document.getElementById('save').addEventListener('click', async () => {
    const scheme = schemeSelect.value;
    const host = hostInput.value.trim();
    const port = parseInt(portInput.value);
    const note = noteInput.value.trim() || "这是翻墙节点";

    if (!host || !port || port < 1 || port > 65535) {
      alert("请输入有效的代理地址和端口！");
      return;
    }

    await chrome.storage.local.set({ 
      host, 
      port, 
      scheme, 
      note, 
      enabled: true 
    });

    updateStatus(true, scheme, host, port, note);
    alert(`已保存并启用\n备注：${note}`);
  });

  // 禁用代理
  document.getElementById('disable').addEventListener('click', async () => {
    await chrome.storage.local.set({ enabled: false });
    updateStatus(false);
    alert("代理已禁用 → 直连模式");
  });

  function updateStatus(enabled, scheme = "", host = "", port = "", note = "") {
    if (enabled) {
      statusDiv.className = "status enabled";
      statusDiv.innerHTML = `✅ 已启用<br>
        协议：${scheme.toUpperCase()}<br>
        地址：${host}:${port}<br>
        备注：${note || "这是翻墙节点"}`;
    } else {
      statusDiv.className = "status disabled";
      statusDiv.innerHTML = "❌ 代理已禁用（直连互联网）";
    }
  }
});