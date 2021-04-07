let _ = require('lodash');
let data = require('../../_algorithms/problems.json');
let translation = require('../../_algorithms/translation.json');
let tags = require('../../_algorithms/tags.json');


// https://leetcode-cn.com/problems/api/tags/
// https://leetcode-cn.com/api/problems/all/

let trans = translation.data.translations;
let transTitleMap = _.zipObject(trans.map(i => i.questionId), trans.map(i => i.title));

function getDifficult(level) {
    if (level === 1) return 'easy';
    if (level === 2) return 'medium';
    if (level === 3) return 'hard';
}

let pureData = data.stat_status_pairs.map(i => {
    return {
        id: _.get(i, 'stat.question_id'),
        enTitle: _.get(i, 'stat.question__title'),
        cnTitle: transTitleMap[_.get(i, 'stat.question_id')] || _.get(i, 'stat.question__title'),
        url: _.get(i, 'stat.question__title_slug'),
        difficult: getDifficult(_.get(i, 'difficulty.level')),
    }
})

let leetcodeProblemGroup = _.zipObject(pureData.map(i => i.id), pureData);

let findTagsByProblemId = function (problemId) {
    let result = [];
    tags.topics.forEach(topic => {
        if (topic.questions.includes(problemId)) {
            result.push(topic.translatedName || topic.name);
        }
    })
    return result.filter(a => a);
}

module.exports = {
    findTagsByProblemId,
    leetcodeProblemGroup
};