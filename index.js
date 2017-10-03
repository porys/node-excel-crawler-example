var Crawler = require("crawler");
var excel = require('excel4node');

var workbook = new excel.Workbook();
var worksheet = workbook.addWorksheet('Sheet 1');
worksheet.cell(1,1).string('Company Name');
worksheet.cell(1,2).string('Address');
worksheet.cell(1,3).string('Director');
worksheet.cell(1,4).string('Phone');
worksheet.cell(1,5).string('Link');
var counter = 2;
var k = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            worksheet.cell(counter,1).string($(".member-title").text().trim());
            worksheet.cell(counter,2).string($(".member-info-info .member-info-address").text().trim());
            worksheet.cell(counter,3).string($(".member-info-info .field--name-field-director").text().trim());
            worksheet.cell(counter,4).string($(".member-info-info .field--name-field-phone").text().trim());
            worksheet.cell(counter,5).string($(".member-info-info .field--name-field-link").text().trim());
            counter++;
        }
        done();
        workbook.write('Excel.xlsx');
    }
});
// k.queue("https://itb.dk/member/1508");


var c = new Crawler({
    maxConnections : 1,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            $(".views-field.views-field-view-node .field-content a").each(function(i, link){
              var url = 'https://itb.dk' + $(link).attr("href");
              console.log('checking' + url)
              k.queue(url);
            });


        }
        done();
    }
});


c.queue('https://itb.dk/members');
