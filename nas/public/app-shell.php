<?php if (!isset($authenticated) || !$authenticated) { http_response_code(401); exit; } ?>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>단가 계산기 Pro & 단위환산기</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: system-ui, sans-serif;
    background: #f1f5f9;
    color: #1e293b;
    min-height: 100vh;
  }
  input, select, button { font-family: inherit; }
  .transition-all { transition: all 0.15s; }
  
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: #f1f5f9; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 0.75rem 1rem; }
  thead { background: #f1f5f9; }
  tr { border-bottom: 1px solid #f1f5f9; }
  tr:hover { background: #eff6ff; transition: background 0.1s; }
  input[type=checkbox] { accent-color: #4f46e5; cursor: pointer; }
  
  .btn-primary { background: #2563eb; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.5rem 1rem; cursor: pointer; border: none; transition: all 0.1s; }
  .btn-primary:hover { background: #1d4ed8; }
  .btn-outline { border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.5rem 1rem; cursor: pointer; background: white; transition: all 0.1s; }
  .btn-outline:hover { background: #f8fafc; }

  .converter-input:focus-within { border-color: #3b82f6 !important; background: #eff6ff; }

  .mobile-tabs { display: flex; background: #f1f5f9; padding: 0.3rem; border-radius: 0.75rem; margin-bottom: 1.5rem; }
  .converter-wrapper { display: flex; flex-direction: column; gap: 1.5rem; }
  .converter-panel { display: none; }
  .converter-panel.active { display: block; }
  .panel-title { display: none; font-weight: 700; color: #475569; margin-bottom: 1rem; font-size: 1.1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e2e8f0; }

  @media (min-width: 768px) {
    .mobile-tabs { display: none !important; }
    .converter-wrapper { flex-direction: row; gap: 2rem; }
    .converter-panel { display: block !important; flex: 1; min-width: 0; }
    .panel-title { display: block !important; }
  }
</style>
</head>
<body>
<div id="root"></div>
<script src="vendor/react.min.js"></script>
<script src="vendor/react-dom.min.js"></script>
<script src="app.js"></script>
</body>
</html>
