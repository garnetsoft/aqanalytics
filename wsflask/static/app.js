$(document).ready(function() {
    // Use a "/test" namespace.
    // An application can open a connection on multiple namespaces, and
    // Socket.IO will multiplex all those connections on a single
    // physical channel. If you don't care about multiple channels, you
    // can set the namespace to an empty string.
    namespace = '/test';

    // Connect to the Socket.IO server.
    // The connection URL has the following format:
    //     http[s]://<domain>:<port>[/<namespace>]
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

    // Event handler for new connections.
    // The callback function is invoked when a connection with the
    // server is established.
    socket.on('connect', function() {
    	socket.emit('my_event', {data: 'I\'m connected!'});
    });

    // Interval function that tests message latency by sending a "ping"
    // message. The server then responds with a "pong" message and the
    // round trip time is measured.
    var ping_pong_times = [];
    var start_time;
    var s = '[';
    window.setInterval(function() {
    	start_time = (new Date).getTime();
    	socket.emit('my_ping');
    }, 30000);

    // Handler for the "pong" message. When the pong is received, the
    // time from the ping is stored, and the average of the last 30
    // samples is average and displayed.
    socket.on('my_pong', function() {
    	var latency = (new Date).getTime() - start_time;
    	ping_pong_times.push(latency);
        ping_pong_times = ping_pong_times.slice(-30); // keep last 30 samples
        var sum = 0;
        for (var i = 0; i < ping_pong_times.length; i++)
        	sum += ping_pong_times[i];

        $('#ping-pong').text(Math.round(10 * sum / ping_pong_times.length) / 10);
        $('#latency').text(ping_pong_times.join(", "));
    });


    // Handlers for the different forms in the page.
    // These accept data from the user and send it to the server in a
    // variety of ways
    $('form#emit').submit(function(event) {
    	socket.emit('my_event', {data: $('#emit_data').val()});
    	return false;
    });

    $('form#broadcast').submit(function(event) {
    	socket.emit('my_broadcast_event', {data: $('#broadcast_data').val()});
    	return false;
    });

    $('form#disconnect').submit(function(event) {
    	socket.emit('disconnect_request');
    	return false;
    });

    // Event handler for server sent data.
    // The callback function is invoked whenever the server emits data
    socket.on('my_response', function(msg) {
        // $('#log').append('<br>' + $('<div/>').text('Received #' + msg.count + ': ' + msg.data).html());
        $('#log').text('<br>' + $('<div/>').text('Received #' + msg.count + ': ' + msg.data).html());
        $('#log').append('<br>' + $('<div/>').text('Received2 #' + msg.count + ': ' + msg.data2).html());

        // update data table and graphs
        //var table = JSON.parse(msg.table);
        console.log('xxxx msg.table tyype: ');
        console.log(typeof(msg));

        updateTableD3(msg);

    });


});


function updateTableD3(msg) {
    console.log('xxxx updateTable');
    console.log(typeof(msg));
    console.log(msg);

    //var table = JSON.parse(msg.table);
    var json = msg.table;
    var table = eval("("+json+")"); // ??

    console.log(typeof(table));
    console.log(table);

    if (table == null) {
        console.log('ERROR: no table data, not processing updateTableD3.');
        return;
    }

    var schema = table.schema;
    console.log('hahaha schema:');
    console.log(schema);
    
    if (schema == null) {
        console.log('ERROR: no table schema data, not processing updateTableD3.');
        return;
    }

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
        var names = thead.selectAll('th').data(columns).enter().append('th');
        
        names.text(function(col) {
            return col;
        });
    }

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

    console.log('----updateTable DONE.');
}

