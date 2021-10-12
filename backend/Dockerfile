FROM python:slim

RUN useradd fileStorage

WORKDIR /home/fileStorage

COPY requirements.txt requirements.txt
RUN python -m venv venv
RUN venv/bin/pip install -r requirements.txt
RUN venv/bin/pip install gunicorn

COPY app.py app_tests.py ./
RUN chmod +x boot.sh

ENV FLASK_APP app.py

RUN chown -R fileStorage:fileStorage ./
USER fileStorage

EXPOSE 5000
ENTRYPOINT ["./boot.sh"]