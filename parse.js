const fuzz = require('fuzzball');
const fs = require('fs')
var json2xls = require('json2xls');
const humanizeDuration = require('humanize-duration')
var uniq = require('lodash/uniq');
var mean = require('lodash/mean');

const names = [
    'yuvraj timsina',
    'yuvraj timalsina',
    'yuvraj timsena',
    'yubraj timsena',
]

fs.readFile('list.txt', 'utf8', function(err, contents) {

    let results  = [];

    const dbnames = uniq(contents.split('||'));

    let fromto = process.argv.pop()
    let from = fromto.split('-')[0]
    let to = fromto.split('-')[1]

    let total = to - from;

    let averages = [];

    uniq(names).splice(from,to).map((name, i)=>{

        let start = new Date();

        i = i + 1

        let ress = dbnames.map((e)=>{

            let percentage = fuzz.ratio(e, name)

            if(percentage > 94) {
                return { name, similar_name: e, percentage }
            }

            return null;

        }).filter(Boolean)

        if(ress.length > 0) {
            results = results.concat(ress)
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