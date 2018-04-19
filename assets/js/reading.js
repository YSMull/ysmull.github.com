(function (global) {
  var readHis = function (target, page, readHistory) {
    this.init()
    this.create(target, page, readHistory)
  }

  readHis.prototype.init = function () {
    var css = `.outer-bar {
      height: 20px;
      width: 100%;
      overflow: auto;
    }

    .outer-bar .inner-bar {
      height: 20px;
      float: left;
      z-index: 100;
      transition: all .2s ease-in-out;
    }
    .outer-bar .inner-bar:hover {
      background-color: #3e999f61 !important;
    }
    `
    head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  };

  readHis.prototype.create = function (target, page, readHistory) {
    let pg = [];
    readHistory.forEach(a => {
      let p = Math.max(Math.min(_.min(a), page),1)
      let q = Math.max(Math.min(_.max(a), page),1)
      pg = pg.concat(_.range(p, q + 1))
    });
    pg = _.uniqBy(_.sortBy(pg));
    let start = 0, end = pg.length - 1;
    let res = [];
    let read_log = []
    if (pg[0] > 1) {
      res.push(1 - pg[0]);
      read_log.push([1, pg[0] - 1])
    }
    let len = 0;
    while (start <= end) {
      let part = 1;
      let start_bak = start;
      while (start < pg.length - 1 && pg[start + 1] - pg[start] == 1) {
        start++;
        part++;
      }
      res.push(part);
      read_log.push([pg[start_bak], pg[start]])
      if (start < pg.length - 1) {
        let unread_part = -(pg[start + 1] - pg[start] - 1);
        res.push(unread_part);
        read_log.push([pg[start] + 1, pg[start + 1] - 1])
      }
      len += part;
      start = start + 1;
    }
    if (pg[pg.length - 1] < page) {
      res.push(pg[pg.length - 1] - page);
      read_log.push([pg[pg.length - 1] + 1, page])
    }

    let barlist = document.getElementById(target)
    barlist.className = 'outer-bar'
    for (var i = 0; i < res.length; i++) {
      let b = document.createElement('div')
      b.className = 'inner-bar'
      let percent = res[i] / page * 100;
      let sp = read_log[i][0]
      let ep = read_log[i][1]
      if (percent > 0) {
        b.title = '已阅读:第' + (sp != ep ? (sp+ '~' + ep) : sp) + '面';
        b.style.backgroundColor = "#2db7f5"
        b.style.width = percent + "%"
      } else {
        b.title = '未阅读:第' + (sp != ep ? (sp+ '~' + ep) : sp) + '面';
        if (-percent <= 0.2) {
          b.style.backgroundColor = "#928f8f"
        } else {
          b.style.backgroundColor = "#8dc1d359"
        }
        b.style.width = -percent + "%"
      }
      barlist.appendChild(b)
    }
  }

  /* CommonJS */
  if (typeof require === 'function' && typeof module === 'object' && module && typeof exports === 'object' && exports)
    module.exports = readHis;
  /* AMD */
  else if (typeof define === 'function' && define['amd'])
    define(function () {
      return readHis;
    });
  /* Global */
  else
    global['readHis'] = global['readHis'] || readHis;
})(window || this)

