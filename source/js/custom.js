/**
 * LGQ的博客 · 左侧竖列导航坞
 * 桌面端(≥900px)把顶栏菜单克隆到 body 根节点做左侧悬浮坞，
 * 脱离 #nav 的 transform 影响（Butterfly 滚动时会变换顶栏，fixed 子元素会失效）。
 */
(function () {
  function buildDock() {
    if (document.getElementById('lz-dock')) return;
    var items = document.querySelector('#nav #menus .menus_items');
    if (!items) return;
    var dock = document.createElement('div');
    dock.id = 'lz-dock';
    dock.innerHTML = items.outerHTML;
    document.body.appendChild(dock);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildDock);
  } else {
    buildDock();
  }
})();
