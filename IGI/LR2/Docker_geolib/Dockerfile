FROM python
WORKDIR /app

COPY geometric_lib/circle.py circle.py
COPY geometric_lib/square.py square.py
COPY geometric_lib/main.py main.py

ENTRYPOINT ["python"]
CMD ["main.py"]