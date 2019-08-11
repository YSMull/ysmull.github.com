$ = require('./js/zepto.min.js');
_ = require('./js/lodash.min.js');
readHis = require('./js/reading.js');
LazyLoad = require("vanilla-lazyload/dist/lazyload.amd");
require('./css/pure.min.css');
require('./css/grids-responsive-min.css');
require('./css/main.scss');

// require('clipboard');
require('./plugins/prism/prism.js');
require('./plugins/prism/prism.css');

require('katex/dist/katex.min.css');

require('gitalk/dist/gitalk.css');
Gitalk = require('gitalk');

gitalk = (id, title, labels, body) => new Gitalk({
  clientID: 'd666a4339c38b486abf4',
  clientSecret: 'ce81d1481ce8f64f8923f17d93f94cbf23068441',
  repo: 'blog',
  owner: 'YSMull',
  admin: ['YSMull'],
  perPage: 20,
  id,
  title,
  distractionFreeMode: false,
  labels,
  body
});
// clickEval = require('./js/scheme.js')
