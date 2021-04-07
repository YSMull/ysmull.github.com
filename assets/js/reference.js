module.exports = function () {
    let links = document.querySelectorAll('a');
    let reftag = document.querySelectorAll('h2');
    if (reftag.length === 0) {
        return;
    } else {
        reftag = reftag[document.querySelectorAll('h2').length - 1];
    }
    if (reftag.innerHTML === '参考资料' || reftag.innerHTML.toString().toLowerCase() === 'reference') {
        reftag.insertAdjacentHTML('afterend', '<ol id="refs"></ol>');
    }
    for (let i = 0; i < links.length; i++) {
        if (links[i].hostname !== location.hostname && /^javascript/.test(links[i].href) === false) {
            let numText = links[i].innerHTML;
            let num = numText.substring(1, numText.length - 1);
            if (!isNaN(num) && num) {
                let note = 'note-' + num;
                let ref = 'ref-' + num;
                let noteTitle = links[i].getAttribute('title');
                let noteHref = links[i].getAttribute('href');
                links[i].setAttribute('href', '#' + note);
                links[i].setAttribute('id', ref);
                links[i].setAttribute('class', 'ref');
                document.getElementById('refs').insertAdjacentHTML('beforeend',
                    '<li id="' + note + '" class="note">' +
                    '<a style="border-bottom: none;" href="#' + ref + '">^</a>' +
                    '<a href="' + noteHref + '" title="' + noteTitle + '" class="exf-text" target="_blank">' +
                    noteTitle +
                    '</a></li>');
            } else {
                links[i].setAttribute('target', '_blank');
            }
        }
    }
    let sort_by_name = function (a, b) {
        return a.id.split('-')[1].localeCompare(b.id.split('-')[1])
    };
    let list = $('#refs > li').sort(sort_by_name);
    for (let i = 0; i < list.length; i++) {
        list[i].parentNode.appendChild(list[i]);
    }
};

