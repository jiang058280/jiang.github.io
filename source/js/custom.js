/**
 * LGQ的博客 · 左侧竖列导航坞
 * 桌面端(≥900px)把顶栏菜单克隆到 body 根节点做左侧悬浮坞，
 * 脱离 #nav 的 transform 影响（Butterfly 滚动时会变换顶栏，fixed 子元素会失效）。
 * 支持「文章」父子菜单：点击父项展开/收起子项；
 * 子菜单中的文章列表由构建时生成的 content-index.json 动态填充。
 */
(function () {
  var dock = null;
  var lastClicked = null; // 记录用户实际点击的入口元素
  var contentIndex = null;

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
    // 点击处理：父项（无链接的 group）切换展开；子链接记录用于高亮
    dock.addEventListener('click', function (e) {
      var group = e.target.closest('span.site-page.group');
      if (group) {
        group.parentElement.classList.toggle('open');
        return;
      }
      var a = e.target.closest('a');
      if (a && a.parentElement.classList.contains('menus_item')) lastClicked = a;
    });
    document.body.appendChild(dock);
    refreshDockActive();
    loadContentIndex();
  }

  // 拉取构建时生成的全站内容索引，把文章标题动态插入「文章」子菜单
  function loadContentIndex() {
    fetch('/content-index.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        contentIndex = data;
        insertPostList();
      })
      .catch(function () { /* 索引不可用时静默降级 */ });
  }

  function insertPostList() {
    if (!dock || !contentIndex) return;
    var ul = dock.querySelector('.menus_item .menus_item_child');
    if (!ul || ul.querySelector('.lz-post-item')) return;
    var posts = contentIndex.posts || [];
    if (!posts.length) return;
    var divider = document.createElement('li');
    divider.innerHTML = '<div class="lz-menu-divider"></div>';
    ul.appendChild(divider);
    posts.forEach(function (p) {
      var li = document.createElement('li');
      li.innerHTML =
        '<a class="site-page child lz-post-item" href="' + p.url + '">' +
        '<span> ' + p.title + '</span></a>';
      ul.appendChild(li);
    });
    refreshDockActive();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildDock);
  } else {
    buildDock();
  }

  // 个人简介页启用全宽科幻布局（隐藏右侧栏，内容占满）
  function applyPageClass() {
    document.body.classList.toggle('lz-about-full', location.pathname.indexOf('/about') === 0);
  }
  document.addEventListener('DOMContentLoaded', applyPageClass);

  // pjax 切换页面后，按当前路径刷新高亮；子项高亮时自动展开其父菜单
  function refreshDockActive() {
    if (!dock) return;
    var links = dock.querySelectorAll('.menus_item > a, .menus_item_child a');
    var path = location.pathname;
    var seenRoot = false; // 多个入口指向首页时（首页/文章），只高亮「首页」
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
      if (isActive) {
        var ul = a.closest('.menus_item_child');
        if (ul) ul.parentElement.classList.add('open');
      }
    });
  }
  document.addEventListener('pjax:complete', function () {
    applyPageClass();
    refreshDockActive();
  });
})();
