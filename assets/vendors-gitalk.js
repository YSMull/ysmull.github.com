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
