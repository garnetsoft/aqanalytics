# aqanalytics - let the visulization begin ...

.z.ts:{[h] update updateTime:`$string .z.Z from `trade; (neg last exec h from select from handle where user=`socketio, active=1 )(`upd;`trade;value trade)}

test:{[db;tm] show "test xxxx: ",(string tm) }
test2:{[id;tm] show "test2 xxxx: ",(string tm); show timer.job }

 .timer.add[`timer.job;`test;(`test;p`db);tm+0D00:00:05]; // fixed time
 .timer.add[`timer.job;`test2;(`.timer.until;0D00:00:10;p`eod;(`test2;99));tm]; // repeat every 10 sec
 
 
q)\t 5000 / 5 seconds

q)handle
h  | active user  host                              address        time
---| -------------------------------------------------------------------------------------------
0  | 1      gfeng gfeng01-desk.questpartnersllc.com 192 168 82 113 2017.11.06D05:29:24.452490000
512| 0            gfeng01-desk.questpartnersllc.com 127 0   0  1   2017.11.13D03:49:29.804609000
516| 0            gfeng01-desk.questpartnersllc.com 127 0   0  1   2017.11.06D05:40:07.331931000
520| 0            gfeng01-desk.questpartnersllc.com 127 0   0  1   2017.11.06D05:40:39.260580000
540| 0            gfeng01-desk.questpartnersllc.com 127 0   0  1   2017.11.06D08:56:49.331535000
544| 1            gfeng01-desk.questpartnersllc.com 127 0   0  1   2017.11.08D06:17:12.616904000
288| 0            gfeng01-desk.questpartnersllc.com 127 0   0  1   2017.11.13D03:49:29.624821000
576| 0            gfeng01-desk.questpartnersllc.com 127 0   0  1   2017.11.08D05:32:36.108451000
568| 0            gfeng01-desk.questpartnersllc.com 127 0   0  1   2017.11.08D06:16:00.928114000
572| 0            gfeng01-desk.questpartnersllc.com 127 0   0  1   2017.11.13D04:29:21.397695000
584| 0            gfeng01-desk.questpartnersllc.com 127 0   0  1   2017.11.08D06:11:18.624633000
560| 0            gfeng01-desk.questpartnersllc.com 127 0   0  1   2017.11.08D06:17:00.573625000
592| 0            gfeng01-desk.questpartnersllc.com 127 0   0  1   2017.11.13D04:30:10.547386000
564| 0            gfeng01-desk.questpartnersllc.com 127 0   0  1   2017.11.13D04:48:57.380193000
596| 1            gfeng01-desk.questpartnersllc.com 127 0   0  1   2017.11.13D04:49:00.109814000
548| 0            gfeng01-desk.questpartnersllc.com 127 0   0  1   2017.11.13D04:47:40.801630000
528| 0            gfeng01-desk.questpartnersllc.com 127 0   0  1   2017.11.13D04:45:12.657703000

q).z.ts:{[h] -596 (`upd;`trade;value trade)}
q)


$.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-ohlcv.json&callback=?', function (data) {

    // split the data set into ohlc and volume
    var ohlc = [],
        volume = [],
        dataLength = data.length,
        // set the allowed units for data grouping
        groupingUnits = [[
            'week',                         // unit name
            [1]                             // allowed multiples
        ], [
            'month',
            [1, 2, 3, 4, 6]
        ]],

        i = 0;

    for (i; i < dataLength; i += 1) {
        ohlc.push([
            data[i][0], // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);

        volume.push([
            data[i][0], // the date
            data[i][5] // the volume
        ]);
    }


    // create the chart
    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Historical'
        },

        yAxis: [{
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'OHLC'
            },
            height: '60%',
            lineWidth: 2
        }, {
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'Volume'
            },
            top: '65%',
            height: '35%',
            offset: 0,
            lineWidth: 2
        }],

        tooltip: {
            split: true
        },

        series: [{
            type: 'candlestick',
            name: 'AAPL',
            data: ohlc,
            dataGrouping: {
                units: groupingUnits
            }
        }, {
            type: 'column',
            name: 'Volume',
            data: volume,
            yAxis: 1,
            dataGrouping: {
                units: groupingUnits
            }
        }]
    });
});
