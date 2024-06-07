
const fs = require("fs");
const parse = require("csv-parse");
const coldpColumns = require('./coldpcolumns')
const transform = require("stream-transform");

const getYargs = () =>  process.argv.reduce((acc, curr, idx) => {
    if(curr?.startsWith('--')){
      acc[curr.substring(2)] = process.argv[idx+1]
    }
    return acc
   }, {})

const pr2ranks = ['domain',
'supergroup',
'division',
'subdivision',
'class',
'order',
'family',
'genus',
'species']

const parentMap = new Map()

const isXtaxon = (str) => {
    const regex = new RegExp('X+');
    return regex.test(str)
}
const getName = (rank, name) => {
    const splitted = name.split("_");
    if(rank !== "species" && !isXtaxon(splitted[splitted.length -1])){
        return name.replace(/_/g, ' ')
    } else if(rank === "species" && splitted[splitted.length -1] !== 'sp.'){
        return name.replace(/_/g, ' ')
    } else {
        return ""
    }
}

const run = (inputFile) => {
    const parser = parse({
        delimiter: "\t",
        columns: true,
        ltrim: true,
        rtrim: true,
        quote: null,
        relax_column_count: true,
      });
    
      const outputStream = fs.createWriteStream('output/NameUsage.txt', {
        flags: 'a' 
      })
      outputStream.write(coldpColumns.NameUsage.join("\t")+"\n")
    
      const inputStream = fs.createReadStream(inputFile/* `data/pr2_version_5.0.0_merged.txt` */);
      inputStream.on('error', (err) => {
            console.log("error")
            console.log(err)
        })
     
        const transformer = transform(function(record, callback){
    
            let res = "";
            pr2ranks.forEach((rank, index) => {
                let tx = "";
                for(let i=0; i<= index; i++){
                    let parent = tx;
                    const scientificName = getName(pr2ranks[i], record[pr2ranks[i]])
                    if(scientificName){
                        tx = i > 0  ? tx+ ";"+record[pr2ranks[i]]  :  record[pr2ranks[i]]
                    }
                    if(!parentMap.has(tx) && scientificName){
                        // 'ID','parentID','scientificName','rank', 'status',
                        res += `${rank === 'species' ? record.taxo_id : tx}\t${parent}\t${scientificName}\t${pr2ranks[i]}\taccepted\n`
                        parentMap.set(tx, parent)
                    }
                }
            })
    
             callback(null, res)
         }, {
           parallel: 1
         })
         
        inputStream.pipe(parser).pipe(transformer).pipe(outputStream)
}




try {
    const args = getYargs()
    run(args?.data)
} catch (error) {
    console.log(error)
    process.exit(1);
}


