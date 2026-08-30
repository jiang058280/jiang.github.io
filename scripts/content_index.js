// 构建时生成全站内容索引，供左侧导航坞动态列出文章标题
hexo.extend.generator.register('content-index', function (locals) {
  var posts = locals.posts.sort('-date').map(function (p) {
    return {
      title: p.title || '无标题',
      url: '/' + p.path,
      date: p.date ? p.date.format('YYYY-MM-DD') : ''
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
