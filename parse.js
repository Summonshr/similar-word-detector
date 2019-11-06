const fuzz = require('fuzzball');
const fs = require('fs')
var json2xls = require('json2xls');
const humanizeDuration = require('humanize-duration')
var uniq = require('lodash/uniq');
var mean = require('lodash/mean');

const words = [
    'yuvraj timsina',
    'yuvraj timalsina',
    'yuvraj timsena',
    'yubraj timsena',
]

let results  = [];
let fromto = process.argv.pop()
let from = fromto.split('-')[0]
let to = fromto.split('-')[1]
let total = to - from;
let averages = [];

fs.readFile('list.txt', 'utf8', function(err, file_contents) {

    const list = uniq(file_contents.split('||'));

    uniq(words).splice(from,to).map((name, i)=>{

        let start = new Date();

        i = i + 1

        let similar_words = list.map((e)=>{

            let percentage = fuzz.ratio(e, name)

            if(percentage > 94) {
                return { name, similar_name: e, percentage }
            }

            return null;

        }).filter(Boolean)

        if(similar_words.length > 0) {
            results = results.concat(similar_words)
        }

        if(results) {

            let xls = json2xls(results)

            fs.writeFileSync(fromto+'.xlsx', xls, 'binary', function (err) {
                    console.log(err)
            });

            let end = new Date()

            let estimate = Math.round(end-start) * (total - i - 1);

            averages.push(estimate)

            let remaining_time = humanizeDuration(mean(averages), {round:true})

            process.stdout.write('\033c');

            console.log('Finished Processing ' + i +' items')

            console.log('Remaining Time: ' + remaining_time)

        }

        if(total == i) {
            process.stdout.write('\033c');
            console.log('Finished')
        }

    });

});