from flask import Flask
from flask import render_template, request, jsonify

from datetime import time
from qpython import qconnection

import pandas as pd
import numpy as np

import json


class CustomFlask(Flask):
    jinja_options = Flask.jinja_options.copy()
    jinja_options.update(dict(
    block_start_string='$$',
    block_end_string='$$',
    variable_start_string='$',
    variable_end_string='$',
    comment_start_string='$#',
    comment_end_string='#$',
))


#app = CustomFlask(__name__)
app = Flask(__name__)

PORT = 8080

q = qconnection.QConnection(host='localhost', port=5001, pandas=False)
# initialize connection
q.open()
#print(q)
print('IPC version: %s. Is connected: %s' % (q.protocol_version, q.is_connected()))

winners = [
    {'name': 'Albert Einstein', 'category':'Physics'},
    {'name': 'V.S. Naipaul', 'category':'Literature'},
    {'name': 'Dorothy Hodgkin', 'category':'Chemistry'},
    {"name": "./<int:bars_count/", "category": "shows number of ticks in chart", "url": "http://localhost:8080/20/"},
    {"name": "./t/tablename/", "category": "display a table in html", "url": "http://localhost:8080/t/trade/"},
    {"name": "VueJS", "category": "Visualization", "url": "http://localhost:8080/vuejs"},
]

trade = [
    {"id":1, "ts":100, "tp":80.88, "time":559674712891},
    {"id":2, "ts":104, "tp":81.88, "time":559674712891},
    {"id":3, "ts":103, "tp":82.88, "time":559674712891},
    {"id":4, "ts":102, "tp":83.88, "time":559674712891},
]


jsonData = [
    { "name": "Bruce Lee", "power": 9000 },
    { "name": "George feng", "power": 9000 },
    { "name": "Jet Liiiiiiii", "power": 9000 },
]


@app.route("/")
def index():
    return render_template("index.html", heading="George's test page - Menu", winners=winners)


@app.route("/<int:bars_count>/")
def chart(bars_count):
    if bars_count <= 0:
        bars_count = 20

    prices, times, legend, result = get_timeseries_data(bars_count=bars_count)
    
    #print(prices)
    #print(times)
    print(result.meta)
    header = str(result.meta)
    
    return render_template('price_chart.html', prices=prices, labels=times, legend=legend, header=header, result=result, data=json.dumps(jsonData))


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
    x = q(query)    
    
    print(query)
    print(type(x))
    print(x)
    
    x = pd.DataFrame(x)
    print('xxxx convert to pandas dataframe')
    x['time'] = pd.to_datetime(x.time)    
    print(type(x))
    print(x)
    
    return render_template("show_table.html", name=tablename, data=x)


@app.route('/<tablename>/json/')
def table_json(tablename):
    query = '0!select from {} where id=0'.format(tablename)
    query = '-1440#select from trades where id=0'
    
    x = q(query)        
    df = pd.DataFrame(x)
    print('xxxx convert to pandas dataframe -> to_json()')
    df['time'] = pd.to_datetime(df.time)    
    print(type(df.to_json()))
    #print(df.to_json(orient='records'))
    
    #return df.to_json(orient='records')
    #return jsonify(trade)
    return df.to_json(orient='table')

    
@app.route('/vuejs/')
def vuejs_test():
    #query = '0!select from {} where id=0'.format('trade')
    query = '`id`name`tp`ts xcols update time:string time from (0!trade lj `id xkey  smTbl)'
    
    x = q(query)        
    df = pd.DataFrame(x)
    
    print('xxxx dataFrame:')
    print(df)
    
    dfJson = json.dumps(list(df))
    print('header json')
    print(dfJson)
    
    print('data json:')    
    gridData = df.to_json(orient='records')
    print(type(gridData))
    print(gridData)
    
    return render_template('table2.html', who=' from Flask2: george feng', dfColsList=list(df), dfCols=dfJson, data=gridData)
    
    
if __name__ == "__main__":
    app.run(port=PORT, debug=True)
