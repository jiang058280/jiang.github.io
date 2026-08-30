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
    dock.innerHTML =
      '<div class="lz-brand">' +
      '<img src="/img/avatar.png" alt="刘国庆的头像">' +
      '<div><div class="lz-name">刘国庆</div><div class="lz-sub">个人博客</div></div>' +
      '</div>' +
      items.outerHTML;
    document.body.appendChild(dock);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildDock);
  } else {
    buildDock();
  }

  // pjax 切换页面后，按当前路径刷新侧边栏菜单的高亮状态
  function refreshDockActive() {
    var links = document.querySelectorAll('#lz-dock .menus_item > a');
    var path = location.pathname;
    links.forEach(function (a) {
      var href = a.getAttribute('href') || '/';
      var active = href === '/' ? path === '/' : path.indexOf(href) === 0;
      a.classList.toggle('active', active);
    });
  }
  document.addEventListener('pjax:complete', refreshDockActive);
})();
