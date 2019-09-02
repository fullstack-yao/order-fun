FROM python:3.7

RUN apt-get update

WORKDIR /app
ADD requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

ADD . /app

ENV PORT 5555
CMD ["gunicorn", "main:app", "--worker-tmp-dir /dev/shm --worker-class eventlet -w 1 -b 0.0.0.0:5555"]

