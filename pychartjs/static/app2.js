
console.log('running app2.js ...');

d3.json("/trade/json", function(table) {

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
    
});