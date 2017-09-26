
console.log('running app.js test...');

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
    var mytest = d3.select('#mytest')
    
    console.log('xxxx - mytest');
    console.log(mytest);
    
    // mytest.html('<h1>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx my test</h1>');
    // document.getElementById("mytest").innerHTML = JSON.stringify(data);

    mytest.html(JSON.stringify(data));
    console.log('xxxx - mytest2222');    
    
    // Display a random winner if data is available
    if(data.length){
        // nbviz.displayWinner(data[Math.floor(Math.random() * data.length)]);
    	console.log('xxx got data.length' + data.length);
    }
    
});