FROM python:3.11-slim-bullseye
COPY .  /usr/src/app
WORKDIR /usr/src/app
# I cant't install daphne on windows for 3.11 version of python, so it's not in requirements
RUN pip install -r requirements.txt
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
