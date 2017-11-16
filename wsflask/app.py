#!/usr/bin/env python
from threading import Lock
from flask import Flask, render_template, session, request
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect

# kdb lib
from qpython import qconnection
from qpython.qtype import QException
from qpython.qconnection import MessageType
from qpython.qcollection import QDictionary
from qpython.qcollection import QTable


import pandas as pd
import numpy as np
import json


# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.
async_mode = None

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)
thread = None
thread_lock = Lock()

# create connection object
q = qconnection.QConnection(host = 'localhost', port = 5001, username='socketio', password='xxxx', pandas=False)

def initQ():

    # initialize connection
    q.open()

    print(q)
    print('IPC version: %s. Is connected: %s' % (q.protocol_version, q.is_connected()))


def background_thread():
    """Example of how to send server generated events to clients."""
    print('xxxx starting background_thread...')
    count = 0
    while True:        
        socketio.sleep(5)
        count += 1

        query = '0!select from trade'
        x = q(query)        
        print(x)
        df = pd.DataFrame(x)
        json = df.to_json()
        json2 = df.to_json(orient='records')
        print(json)

        socketio.emit('my_response',
                      {'data': json, 'count': count, 'data2': json2},
                      namespace='/test')


def background_thread_sub():
    print('xxxx starting background_thread_sub...')
    count = 0
    while True:        
        try:
            message = q.receive(data_only = False, raw = False)

            print('xxxx')
            print(message)

            if message.type != MessageType.ASYNC:
                print('Unexpected message, expected message type: ASYNC')

            print('type: %s, message type: %s, data size: %s ' % (type(message), message.type, message.size))

            if isinstance(message.data, list):
                if len(message.data) == 3 and message.data[0] == b'upd' and isinstance(message.data[2], QTable):
                    #for row in message.data[2]:
                    #    print(row)
                    x = message.data[2]
                    print(x)
                    df = pd.DataFrame(x)
                    print(df)

                    json = df.to_json()
                    json2 = df.to_json(orient='records')

                    table = df.to_json(orient='table')
                    print(table)

                    count += 1
                    socketio.emit('my_response',{'data': json, 'count': count, 'data2': json2, 'table': table}, namespace='/test')


        except QException as e:
            print(e)
            print('xxxx background_thread_sub exiting...')
            break



@app.route('/')
def index():
    return render_template('index.html', async_mode=socketio.async_mode)


@socketio.on('my_event', namespace='/test')
def test_message(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': message['data'], 'count': session['receive_count']})


@socketio.on('my_broadcast_event', namespace='/test')
def test_broadcast_message(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': message['data'], 'count': session['receive_count']},
         broadcast=True)


@socketio.on('my_ping', namespace='/test')
def ping_pong():
    emit('my_pong')


@socketio.on('connect', namespace='/test')
def test_connect():
    # initQ
    initQ()

    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(target=background_thread_sub)

    emit('my_response', {'data': 'Connected, Q is ready to publish data...', 'count': 0})


@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected', request.sid)




if __name__ == '__main__':
    socketio.run(app, debug=True)
