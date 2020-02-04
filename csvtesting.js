var csv = require ('convert-csv-to-json');

var json = csv.getJsonFromCsv('pupils_data.csv');

for(var i=0; i<json.length;i++){
    console.log(json[i]);
}
