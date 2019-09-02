# order-fun
A mobile web app for customers to order food together

For server side:

source venv/bin/activate
pip install -r requirements.txt
gunicorn --worker-class eventlet -w 1 -b 0.0.0.0:5555 main:app
