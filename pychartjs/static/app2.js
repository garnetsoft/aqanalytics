
console.log('running app.js ...');

d3.json("/trade/json", function(data) {
	
	console.log('hahaha xxxx');
	console.log(data);
	
	if (data == null) {
		console.log('ERROR: no data, not processing D3 code, exiting...');
		return;
	}
	
    var rows, cells;
    
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
            //nbviz.displayWinner(d);
        });
    
    // Fade out excess rows over 2 seconds
    rows.exit()
        .transition().duration(2000)
        .style('opacity', 0)
        .remove();

    cells = rows.selectAll('td')
        .data(function(d) {
//        	console.log('xxxx cells:');
//        	console.log(d);
//        	console.log('xxxx d.ts:');
//        	console.log(d.ts);
            return [d.id, d.ts, d.tp, d.time];  
        });
    
    console.log('cells:');
    console.log(cells);
    
    // Append data cells, then set their text  
    cells.enter().append('td');
    
    cells.text(function(d) {
    		//console.log('xxxx cells.text:');
    		//console.log(d);
            return d;
        });

    // Display a random winner if data is available
    if(data.length){
        // nbviz.displayWinner(data[Math.floor(Math.random() * data.length)]);
    	console.log('xxx got data.length' + data.length);
    }
    
});