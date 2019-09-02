from flask import session
from flask_socketio import emit, join_room, leave_room
from .. import socketio
from .images import IMAGES
from collections import defaultdict



room = 'Table1'
ORDER_DETAILS = defaultdict(int)

def _emit_order():
    emit(
        'message',
        {
            'menus': [
                {
                    'group_id': '1',
                    'name':'Sushi',
                    'amount': str(ORDER_DETAILS['1']),
                    'img': IMAGES[0][0],
                    'items': [
                        {
                            'menu_id': '11',
                            'name': 'Salmon Roe',
                            'price': '3.99',
                            'piece': '4',
                            'amount': str(ORDER_DETAILS['11']),
                            'img': IMAGES[0][1]
                        },
                        {
                            'menu_id': '12',
                            'name': 'Striped Bass',
                            'price': '3.84',
                            'piece': '4',
                            'amount': str(ORDER_DETAILS['12']),
                            'img': IMAGES[0][2]
                        },
                        {
                            'menu_id': '13',
                            'name': 'Tuna',
                            'price': '4.29',
                            'piece': '4',
                            'amount': str(ORDER_DETAILS['13']),
                            'img': IMAGES[0][3]
                        }
                    ]
                },
                {
                    'group_id': '2',
                    'name':'Noodles',
                    'amount': str(ORDER_DETAILS['2']),
                    'img': IMAGES[1][0],
                    'items': [
                        {
                            'menu_id': '21',
                            'name': 'Seafood Special',
                            'price': '6.99',
                            'piece': '1',
                            'amount': str(ORDER_DETAILS['21']),
                            'img': IMAGES[1][1]
                        },
                        {
                            'menu_id': '22',
                            'name': 'Detox Vegetable',
                            'price': '7.29',
                            'piece': '1',
                            'amount': str(ORDER_DETAILS['22']),
                            'img': IMAGES[1][2]
                        },
                        {
                            'menu_id': '23',
                            'name': 'So Sukiyaki',
                            'price': '7.99',
                            'piece': '1',
                            'amount': str(ORDER_DETAILS['23']),
                            'img': IMAGES[1][3]
                        }
                    ]
                },
                {
                    'group_id': '3',
                    'name':'Ramen',
                    'amount': str(ORDER_DETAILS['3']),
                    'img': IMAGES[2][0],
                    'items': [
                        {
                            'menu_id': '31',
                            'name': 'Kyoto',
                            'price': '7.99',
                            'piece': '1',
                            'amount': str(ORDER_DETAILS['31']),
                            'img': IMAGES[2][1]
                        },
                        {
                            'menu_id': '32',
                            'name': 'Nabe Hotpot',
                            'price': '8.79',
                            'piece': '1',
                            'amount': str(ORDER_DETAILS['32']),
                            'img': IMAGES[2][2]
                        },
                        {
                            'menu_id': '33',
                            'name': 'Sapporo',
                            'price': '9.99',
                            'piece': '1',
                            'amount': str(ORDER_DETAILS['33']),
                            'img': IMAGES[2][3]
                        }
                    ]
                }
            ]
        },
        room=room
    )

@socketio.on('connect', namespace='/chat')
def test_connect():
    join_room(room)
    _emit_order()


@socketio.on('update', namespace='/chat')
def order(message):
    menu_id = message['menu_id']
    group_id = message['group_id']
    amount = int(message['amount'])
    ORDER_DETAILS[menu_id] += amount
    ORDER_DETAILS[group_id] += amount
    _emit_order()


@socketio.on('submission', namespace='/chat')
def submission(message):
    for key in ORDER_DETAILS:
        ORDER_DETAILS[key] = 0
    _emit_order()


@socketio.on('joined', namespace='/chat')
def joined(message):
    """Sent by clients when they enter a room.
    A status message is broadcast to all people in the room."""
    #room = session.get('room')
    room='abc'
    join_room(room)
    #emit('status', {'msg': session.get('name') + ' has entered the room.' + message['msg']}, room=room)
    emit('status', {'msg': 'Yao has entered the room.'}, room=room)
    #emit('status', {'msg': 'Yao has entered the room.'}, room='room1')


@socketio.on('text', namespace='/chat')
def text(message):
    """Sent by a client when the user entered a new message.
    The message is sent to all people in the room."""
    room = session.get('room')
    emit('message', {'msg': session.get('name') + ':' + message['msg']}, room=room)


@socketio.on('left', namespace='/chat')
def left(message):
    """Sent by clients when they leave a room.
    A status message is broadcast to all people in the room."""
    room = session.get('room')
    leave_room(room)
    emit('status', {'msg': session.get('name') + ' has left the room.'}, room=room)

