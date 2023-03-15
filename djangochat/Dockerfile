FROM python:3.11-slim-bullseye
COPY .  /usr/src/app/djangochat/
WORKDIR /usr/src/app/djangochat/
RUN pip install -r requirements.txt
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
