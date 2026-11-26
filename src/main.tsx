import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// 兼容未带 # 的旧链接：/p/xxx、/t/xxx、/admin → /#/p/xxx
// 转发到微信/飞书时哈希常被截断，这里做一次原地修正
if (!window.location.hash) {
  const path = window.location.pathname;
  if (/^\/(p|t)\/./.test(path) || /^\/admin(\/|$)/.test(path)) {
    window.location.replace(
      `${window.location.origin}/#${path}${window.location.search}`,
    );
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
