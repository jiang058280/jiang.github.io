/**
 * LGQ的博客 · 左侧竖列导航坞
 * 桌面端(≥900px)把顶栏菜单克隆到 body 根节点做左侧悬浮坞，
 * 脱离 #nav 的 transform 影响（Butterfly 滚动时会变换顶栏，fixed 子元素会失效）。
 * 支持「文章」父子菜单与按分类分组的动态文章列表：
 * 分类 → 子分类标签 → 各分类下的文章标题（构建时生成的 content-index.json 驱动）。
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
    // 点击处理：所有 group 父项切换展开；顶级子链接记录用于高亮
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

  // 拉取构建时生成的全站内容索引
  function loadContentIndex() {
    fetch('/content-index.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        buildInterviewList(data);
      })
      .catch(function () { /* 索引不可用时静默降级 */ });
  }

  // 整理「文章」入口下的子菜单：移除「分类」「标签」子项（「归档」已从菜单配置删除），
  // 新增「面试题」可折叠分组：文章 → 面试题 → 文章标题列表
  // 文章列表复用 .lz-cat-posts 滚动样式与 .lz-post-item 链接样式，带滚动条
  function buildInterviewList(data) {
    if (!dock) return;
    var catLink = dock.querySelector('.menus_item_child a[href="/categories/"]');
    if (!catLink) return;
    var childMenu = catLink.parentElement.parentElement; // ul.menus_item_child（分类/标签/归档所在）
    var item = childMenu.parentElement; // div.menus_item（「文章」）
    // 1. 移除「分类」子菜单项（href="/categories/"）
    var catLi = catLink.parentElement;
    childMenu.removeChild(catLi);
    // 2. 移除「标签」子菜单项（href="/tags/"）（「归档」已从菜单配置删除，无需处理）
    var tagLink = dock.querySelector('.menus_item_child a[href="/tags/"]');
    if (tagLink) {
      var tagLi = tagLink.parentElement;
      tagLi.parentElement.removeChild(tagLi);
    }
    // 3. 从 content-index.json 的 posts 中筛选 tags 含「面试题」的文章
    var interviewPosts = (data.posts || []).filter(function (p) {
      return p.tags && p.tags.indexOf('面试题') !== -1;
    });
    if (!interviewPosts.length) return;
    // 4. 创建「面试题」可折叠分组（复用 .site-page.group 样式），点击分组展开/收起文章列表
    var groupLi = document.createElement('li');
    groupLi.className = 'lz-cat-item lz-tag-root';
    groupLi.innerHTML =
      '<span class="site-page group"><i class="fa-fw fas fa-folder"></i><span> 面试题</span><i class="fas fa-chevron-down"></i></span>' +
      '<ul class="lz-cat-posts"></ul>';
    var postsUl = groupLi.querySelector('.lz-cat-posts');
    interviewPosts.forEach(function (p) {
      var li = document.createElement('li');
      li.innerHTML =
        '<a class="site-page child lz-post-item" href="' + p.url + '"><span> ' + p.title + '</span></a>';
      postsUl.appendChild(li);
    });
    childMenu.appendChild(groupLi);

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

  // pjax 切换页面后，按当前路径刷新高亮；高亮项的所有祖先分组自动展开
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
        var el = a;
        while (el && el !== dock) {
          if (el.classList) {
            if (el.classList.contains('menus_item')) el.classList.add('open');
            if (el.classList.contains('lz-cat-item')) el.classList.add('open');
          }
          el = el.parentElement;
        }
      }
    });
  }
  document.addEventListener('pjax:complete', function () {
    applyPageClass();
    refreshDockActive();
  });
})();
