module.exports = function () {
    // 参考 https://github.com/fooleap/fooleap.github.io/blob/master/assets/js/main.js
    let toc = document.querySelector('.post-toc');
    // toc.offsetWidth = 170;
    // console.log(toc.offsetWidth)
    let subTitles = document.querySelectorAll('.post__content h2,h3');

    let clientHeight = document.documentElement.clientHeight;
    if (toc) {
        function tocShow() {
            let clientWidth = document.documentElement.clientWidth;
            let tocFixed = clientWidth / 2 - 470 - toc.offsetWidth;
            if (tocFixed < 5) {
                toc.style.visibility = 'hidden';
            } else {
                toc.style.visibility = 'visible';
                toc.style.left = tocFixed + 'px';
            }
        }

        function tocScroll() {
            let sectionIds = [];
            let sections = [];
            for (let i = 0; i < subTitles.length; i++) {
                sectionIds.push(subTitles[i].getAttribute('id'));
                sections.push(subTitles[i].offsetTop);
            }
            let pos = document.documentElement.scrollTop || document.body.scrollTop;
            let lob = document.body.offsetHeight - subTitles[subTitles.length - 1].offsetTop;
            for (let i = 0; i < sections.length; i++) {
                if (i === subTitles.length - 1 && clientHeight > lob) {
                    pos = pos + (clientHeight - lob);
                }
                if (sections[i] <= pos && sections[i] < pos + clientHeight) {
                    if (document.querySelector('.active')) {
                        document.querySelector('.active').classList.remove('active');
                    }
                    let queryStr = '[href="#' + sectionIds[i] + '"]';
                    // console.log(queryStr)
                    document.querySelector(queryStr).classList.add('active');
                }
            }
        }

        document.addEventListener('scroll', tocScroll, false);
        window.addEventListener('resize', tocShow, false);
        // $(toc).ready(tocShow)
        tocShow();
    }
}
