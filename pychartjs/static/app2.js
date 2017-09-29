
console.log('running app2.js ...');

// Global parameters:
// do not resize the chart canvas when its container does (keep at 600x400px)
Chart.defaults.global.responsive = false;

var timeFormat = 'hh:mm:ss';

function newDateString(hours, minutes, seconds) {
	return moment().hour(hours).minute(minutes).second(seconds).format(timeFormat);
}


// this is actually a Ajax call
d3.json("/trade/json", function(error, table) {
	
	if (error) {
		console.log('xxxx ERROR: ');
		console.log(error);
		return;
	}

	console.log('hahaha table:');
	console.log(table);
	
	var schema = table.schema;
	console.log('hahaha schema:');
	console.log(schema);
	
	var headers = schema.fields;
	var haha = [];
	
	console.log('xxxx headers: ' + headers);
	console.log('xxxx headers: ' + headers[0].name);
	
	for (var i = 1; i < headers.length; i++) {
		haha[i-1] = headers[i].name;
	}
	
	console.log('xxxx headers2: ' + haha);

	var data = table.data;
	
	console.log('hahaha data');
	console.log(data);
	
	if (data == null) {
		console.log('ERROR: no data, not processing D3 code, exiting...');
		return;
	}
	
    var columns, rows, cells;

	// display header first
    if (data.length) {
    	var row0 = data[0];    	
    	columns = Object.keys(row0);
    	
    	console.log('xxx got row: ' + JSON.stringify(row0));
    	console.log(row0);
    	console.log('xxx columns: ' + columns);

    	var thead = d3.select('#nobel-list thead');    	
    	var names = thead.append('tr').selectAll('th').data(columns).enter().append('th');
    	
    	names.text(function(col) {
    		return col;
    	});
    }

    // Sort the winners' data by year
    //var data = data.sort(function(a, b) {
    //    return +b.year - +a.year;
    //});
    
    // Bind our winners' data to the table rows 
    rows = d3.select('#nobel-list tbody')
        .selectAll('tr')
        .data(data);

    console.log('rows:');
    console.log(rows);
    
    rows.enter().append('tr')
        .on('click', function(d) {
            console.log('You clicked a row ' + JSON.stringify(d));
            //console.log(d);
            //nbviz.displayWinner(d);
        });
    
    // Fade out excess rows over 2 seconds
    rows.exit()
        .transition().duration(2000)
        .style('opacity', 0)
        .remove();

    cells = rows.selectAll('td')
        .data(function(row) {
            //return [d.id, d.ts, d.tp, d.time];
        	return columns.map(function(column) {
        		return { column: column, value: row[column]};
        	});
        });
    
    // Append data cells, then set their text  
    cells.enter().append('td');    
    cells.text(function(d) {
    	return d.value;
    });

    // Display a random winner if data is available
    if(data.length){
        // nbviz.displayWinner(data[Math.floor(Math.random() * data.length)]);
    	console.log('xxx got data.length: ' + data.length);
    }
    
    // prepare dataset for chart: labels, prices, lengend
    console.log('xxxx charts data:');
    console.log(data);
    
    var prices= [], times =[], labels = [];
    var ohlc = [], volume = [];
    
	for (var i = 0; i < data.length; i++) {
		var d = data[i];
		var t = d.time;
		prices[i] = d.tp;
		// times[i] = t;
		times[i] = moment(t).format('HH:mm:ss')
		
		// data2[i] = [moment(t).toDate().getTime(), d.tp];
		ohlc.push([moment(t).toDate().getTime(), d.tp]);
		volume.push([moment(t).toDate().getTime(), d.ts]);
		
	}
	
	console.log(prices);
	console.log(times);
	
    // define the chart data
    var chartData = {
      labels : times,
      datasets : [{
          label: 'My Price Chart2',
          fill: true,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data : prices,
          spanGaps: false
      }]
    };
    

    // get chart canvas
    var holder = document.getElementById("myChart2");
    var ctx = document.getElementById("myChart2").getContext("2d");

    // create a callback function for updating the caption
    var original = Chart.defaults.global.legend.onClick;
    Chart.defaults.global.legend.onClick = function(e, legendItem) {
      update_caption(legendItem);
      original.call(this, e, legendItem);
    };
    
    // create the chart using the chart canvas
    var myChart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            label: function(tooltipItems, data) {
                     firstPointCtx = "First Point Selected: ";
                     return tooltipItems.yLabel;
                   }
          }
        },
      }
    });

    // get the text element below the chart
    var pointSelected = document.getElementById("pointSelected");

    // create a callback function for updating the selected index on the chart
    holder.onclick = function(evt){
      var activePoint = myChart.getElementAtEvent(evt);
      console.log(evt);
      console.log(activePoint);
      
      if (Object.keys(activePoint).length > 0) {
	        console.log('x:' + activePoint[0]._view.x);
	        console.log('maxWidth: ' + activePoint[0]._xScale.maxWidth);
	        console.log('y: ' + activePoint[0]._view.y);
	        console.log('index: ' + activePoint[0]._index);
	        var index = activePoint[0]._index;
	        
	        //console.log('haha: ' + {{labels}})
	        //pointSelected.innerHTML = 'Price selected... index: ' + activePoint[0]._index +', px=' + {{ prices }}[activePoint[0]._index];
	        pointSelected.innerHTML = 'Price selected: ' + prices[index];
    	}
    };
    
    
    // draw highchart
    //$.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (data2) {
    
    	// set the allowed units for data grouping
    	groupingUnits = [[
        'week',                         // unit name
        [1]                             // allowed multiples
        ], [
        'month',
        [1, 2, 3, 4, 6]
        ]],

        // Create the chart
        Highcharts.stockChart('container', {

            rangeSelector: {
                buttons: [{
                    type: 'hour',
                    count: 1,
                    text: '1h'
                }, {
                    type: 'day',
                    count: 1,
                    text: '1D'
                }, {
                    type: 'all',
                    count: 1,
                    text: 'All'
                }],
                selected: 1,
                inputEnabled: false
            },

            title: {
                text: 'AAPL Stock Price'
            },

            yAxis: [{
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'Price'
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
                name: 'AAPL',
                data: ohlc,
                tooltip: {
                    valueDecimals: 2
                }
            }, {
                type: 'column',
                name: 'Volume',
                data: volume,
                yAxis: 1,
                //dataGrouping: {
                //    units: groupingUnits
                //}
            }]
        });
    //});
    
});

