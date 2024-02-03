// css
require('./css/pure.min.css');
require('./css/grids-responsive-min.css');
require('./css/syntax-github.css');

// utils
$ = require('./js/zepto.min.js');
_ = require('lodash');
vis = require('vis-network');
visData = require('vis-data');
LazyLoad = require("vanilla-lazyload/dist/lazyload.amd");

// comment
require('gitalk/dist/gitalk.css');
let Gitalk = require('gitalk');
gitalk = (id, title, labels, body) => {
    return new Gitalk({
        clientID: 'd666a4339c38b486abf4',
        clientSecret: 'ce81d1481ce8f64f8923f17d93f94cbf23068441',
        accessToken: '259ee3a350d9b1dc517bd1421d2c6146e2d25f20',
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
};


// 自己写的一些工具
readHis = require('./js/reading.js');
initReference = require('./js/reference.js');
initToc = require('./js/toc.js');

// clickEval = require('./js/scheme.js')

// leetcode 元信息
let L = require('./js/leetcode');
leetcodeProblemGroup = L.leetcodeProblemGroup;
findTagsByProblemId = L.findTagsByProblemId;

