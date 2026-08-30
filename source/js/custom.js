/**
 * LGQ的博客 · 左侧竖列导航坞
 * 桌面端(≥900px)把顶栏菜单克隆到 body 根节点做左侧悬浮坞，
 * 脱离 #nav 的 transform 影响（Butterfly 滚动时会变换顶栏，fixed 子元素会失效）。
 */
(function () {
  var dock = null;
  var lastClicked = null; // 记录用户实际点击的入口元素

  function buildDock() {
    if (document.getElementById('lz-dock')) return;
    var items = document.querySelector('#nav #menus .menus_items');
    if (!items) return;
    dock = document.createElement('div');
    dock.id = 'lz-dock';
    dock.innerHTML =
      '<div class="lz-brand">' +
      '<img src="/img/avatar.png" alt="刘国庆的头像">' +
      '<div><div class="lz-name">刘国庆</div><div class="lz-sub">个人博客</div></div>' +
      '</div>' +
      items.outerHTML;
    // 记录用户点击的是哪个入口（「首页」和「最新文章」指向同一页面，点击谁亮谁）
    dock.addEventListener('click', function (e) {
      var a = e.target.closest('.menus_item > a');
      if (a) lastClicked = a;
    });
    document.body.appendChild(dock);
    refreshDockActive();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildDock);
  } else {
    buildDock();
  }

  // pjax 切换页面后，按当前路径刷新侧边栏菜单的高亮状态
  function refreshDockActive() {
    if (!dock) return;
    var links = dock.querySelectorAll('.menus_item > a');
    var path = location.pathname;
    var seenRoot = false; // 直接打开首页（无点击记录）时，只亮「首页」
    links.forEach(function (a) {
      var href = a.getAttribute('href') || '/';
      var isActive = false;
      if (href !== '/') {
        isActive = path.indexOf(href) === 0;
      } else if (path === '/') {
        if (lastClicked && dock.contains(lastClicked)) {
          isActive = lastClicked === a; // 点击谁亮谁
        } else {
          isActive = !seenRoot; // 刷新/直达：默认亮「首页」
        }
      }
      if (href === '/') seenRoot = true;
      a.classList.toggle('active', isActive);
    });
  }
  document.addEventListener('pjax:complete', refreshDockActive);
})();
