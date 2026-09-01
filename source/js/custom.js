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
        buildTagTree(data);
      })
      .catch(function () { /* 索引不可用时静默降级 */ });
  }

  // 删除「文章」入口下的「分类」子菜单项，改为直接平铺渲染面试题文章标题列表
  // 面试题列表复用 .lz-cat-posts 滚动样式与 .lz-post-item 链接样式，随「文章」展开/收起，带滚动条
  function buildInterviewList(data) {
    if (!dock) return;
    var catLink = dock.querySelector('.menus_item_child a[href="/categories/"]');
    if (!catLink) return;
    var childMenu = catLink.parentElement.parentElement; // ul.menus_item_child（分类/标签/归档所在）
    var item = childMenu.parentElement; // div.menus_item（「文章」）
    // 1. 移除「分类」子菜单项（href="/categories/"）
    var catLi = catLink.parentElement;
    childMenu.removeChild(catLi);
    // 2. 从 content-index.json 的 posts 中筛选 tags 含「面试题」的文章
    var interviewPosts = (data.posts || []).filter(function (p) {
      return p.tags && p.tags.indexOf('面试题') !== -1;
    });
    if (!interviewPosts.length) return;
    // 3. 在「文章」入口下直接平铺渲染（复用 .lz-cat-posts 滚动样式与 .lz-post-item 链接样式）
    var wrapLi = document.createElement('li');
    var ul = document.createElement('ul');
    ul.className = 'lz-cat-posts';
    ul.style.display = 'block';
    ul.style.maxHeight = '420px';
    ul.style.overflowY = 'auto';
    interviewPosts.forEach(function (p) {
      var li = document.createElement('li');
      li.innerHTML =
        '<a class="site-page child lz-post-item" href="' + p.url + '"><span> ' + p.title + '</span></a>';
      ul.appendChild(li);
    });
    wrapLi.appendChild(ul);
    childMenu.appendChild(wrapLi);

    refreshDockActive();
  }

  // 把「标签」入口也改造成可展开的分组树：标签 → 子标签（如：面试题）→ 文章标题
  // 子标签分组内文章列表同样带滚动条（见 custom.css .lz-tag-root .lz-cat-posts）
  function buildTagTree(data) {
    if (!dock) return;
    var tagLink = dock.querySelector('.menus_item_child a[href="/tags/"]');
    if (!tagLink) return;
    var item = tagLink.parentElement; // div.menus_item
    var groups = {};
    (data.posts || []).forEach(function (p) {
      var t = (p.tags && p.tags.length) ? p.tags[0] : '未分类';
      (groups[t] = groups[t] || []).push(p);
    });
    var tagNames = Object.keys(groups);
    // 没有任何标签化内容时保持原样
    if (!tagNames.length) return;

    item.classList.add('lz-cat-root', 'lz-tag-root', 'open');
    item.innerHTML =
      '<span class="site-page group"><i class="fa-fw fas fa-tag"></i><span> 标签</span><i class="fas fa-chevron-down"></i></span>' +
      '<ul class="lz-cat-child"></ul>';
    var childUl = item.querySelector('.lz-cat-child');

    tagNames.forEach(function (tag) {
      var tagLi = document.createElement('li');
      tagLi.className = 'lz-cat-item';
      tagLi.innerHTML =
        '<span class="site-page group lz-cat-group"><span> ' + tag + '</span><i class="fas fa-chevron-down"></i></span>' +
        '<ul class="lz-cat-posts"></ul>';
      var postsUl = tagLi.querySelector('.lz-cat-posts');
      groups[tag].forEach(function (p) {
        var li = document.createElement('li');
        li.innerHTML =
          '<a class="site-page child lz-post-item" href="' + p.url + '"><span> ' + p.title + '</span></a>';
        postsUl.appendChild(li);
      });
      childUl.appendChild(tagLi);
    });

    // 标签页入口保留：分组树末尾补一个「全部标签」链接
    var allLi = document.createElement('li');
    allLi.innerHTML = '<a class="site-page child lz-allcat" href="/tags/"><span> 全部标签</span></a>';
    childUl.appendChild(allLi);

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
