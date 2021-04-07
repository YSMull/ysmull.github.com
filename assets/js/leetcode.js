let _ = require('lodash');
let data = require('../../_algorithms/problems.json');


function getDifficult(level) {
    if (level === 1) return 'easy';
    if (level === 2) return 'medium';
    if (level === 3) return 'hard';
}

let pureData = data.stat_status_pairs.map(i => {
    return {
        id: _.get(i, 'stat.question_id'),
        url: _.get(i, 'stat.question__title_slug'),
        difficult: getDifficult(_.get(i, 'difficulty.level')),
    }
})

let g = _.zipObject(pureData.map(i => i.id), pureData);

module.exports = g;