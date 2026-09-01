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
        buildCategoryTree(data);
        buildTagTree(data);
      })
      .catch(function () { /* 索引不可用时静默降级 */ });
  }

  // 把「分类」入口改造成可展开的分组树：分类 → 子分类标签 → 文章标题
  function buildCategoryTree(data) {
    if (!dock) return;
    var catLink = dock.querySelector('.menus_item_child a[href="/categories/"]');
    if (!catLink) return;
    var item = catLink.parentElement; // div.menus_item
    var groups = {};
    var noCat = [];
    (data.posts || []).forEach(function (p) {
      var cat = (p.categories && p.categories.length) ? p.categories[0] : '未分类';
      (groups[cat] = groups[cat] || []).push(p);
    });
    var catNames = Object.keys(groups);
    // 没有任何分类化内容时保持原样
    if (!catNames.length || (catNames.length === 1 && catNames[0] === '未分类' && groups['未分类'].length === 0)) return;

    item.classList.add('lz-cat-root', 'open');
    item.innerHTML =
      '<span class="site-page group"><i class="fa-fw fas fa-folder"></i><span> 分类</span><i class="fas fa-chevron-down"></i></span>' +
      '<ul class="lz-cat-child"></ul>';
    var childUl = item.querySelector('.lz-cat-child');

    catNames.forEach(function (cat) {
      var catLi = document.createElement('li');
      catLi.className = 'lz-cat-item';
      catLi.innerHTML =
        '<span class="site-page group lz-cat-group"><span> ' + cat + '</span><i class="fas fa-chevron-down"></i></span>' +
        '<ul class="lz-cat-posts"></ul>';
      var postsUl = catLi.querySelector('.lz-cat-posts');
      groups[cat].forEach(function (p) {
        var li = document.createElement('li');
        li.innerHTML =
          '<a class="site-page child lz-post-item" href="' + p.url + '"><span> ' + p.title + '</span></a>';
        postsUl.appendChild(li);
      });
      childUl.appendChild(catLi);
    });

    // 分类页入口保留：分组树末尾补一个「全部分类」链接
    var allLi = document.createElement('li');
    allLi.innerHTML = '<a class="site-page child lz-allcat" href="/categories/"><span> 全部分类</span></a>';
    childUl.appendChild(allLi);

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
