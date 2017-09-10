from flask import Flask
from flask import render_template
from datetime import time
from qpython import qconnection

import pandas as pd
import numpy as np


app = Flask(__name__)

q = qconnection.QConnection(host='localhost', port=5001, pandas=False)
# initialize connection
q.open()
#print(q)
print('IPC version: %s. Is connected: %s' % (q.protocol_version, q.is_connected()))

@app.route("/<int:bars_count>/")
def chart(bars_count):
    if bars_count <= 0:
        bars_count = 20

    prices, times, legend, result = get_timeseries_data(bars_count=bars_count)
    
    #print(prices)
    #print(times)
    print(result.meta)
    header = str(result.meta)
    
    return render_template('price_chart.html', prices=prices, labels=times, legend=legend, header=header, result=result)


def get_timeseries_data(bars_count):
    legend = 'Prices'
    prices = []
    times = []

    try:
        #result = q('tables[]')
        query = '0!-{}#select from prices where id=last id'.format(bars_count)
        print(query)

        result = q(query)
        
        print(type(result))
        print(result.size)
        #print(result.meta)
        #print(result[0][1])
        #print(type(result[0]['time']))
        #print(pd.to_datetime(result[0]['time']))
        
        for r in result:
            print(r)
            prices.append(r['px'])
            t = pd.to_datetime(r['time']).timetuple()
            times.append(time(hour=t.tm_hour, minute=t.tm_min, second=t.tm_sec))

    #except QException as msg:
    except ValueError as msg:
        print('q error: \'%s' % msg)
    
    #print(prices)
    #print(times)
    return prices, times, legend, result


@app.route('/t/<tablename>/')
def show_table(tablename):
    query = '0!select from {}'.format(tablename)
    
    print(query)
    x = q(query)    
    print(type(x))
    print(x)
    
    x = pd.DataFrame(x)
    print('xxxx convert to pandas dataframe')
    print(x)
    
    return render_template("show_table.html", name=tablename, data=x)


if __name__ == "__main__":
    app.run(debug=True)
