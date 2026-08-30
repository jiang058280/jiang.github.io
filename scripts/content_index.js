// 构建时生成全站内容索引（含文章所属分类），供左侧导航坞按分类分组动态列出
hexo.extend.generator.register('content-index', function (locals) {
  var posts = locals.posts.sort('-date').map(function (p) {
    var cats = (p.categories && p.categories.length) ? p.categories.map(function (c) { return c.name; }) : [];
    return {
      title: p.title || '无标题',
      url: '/' + p.path,
      date: p.date ? p.date.format('YYYY-MM-DD') : '',
      categories: cats
    };
  });
  var categories = locals.categories.map(function (c) {
    return { name: c.name, url: '/' + c.path, count: c.posts.length };
  });
  var tags = locals.tags.map(function (t) {
    return { name: t.name, url: '/' + t.path, count: t.posts.length };
  });
  return {
    path: 'content-index.json',
    data: JSON.stringify({ posts: posts, categories: categories, tags: tags })
  };
});
