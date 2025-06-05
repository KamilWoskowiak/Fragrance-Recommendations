FROM public.ecr.aws/lambda/python:3.11

COPY requirements.txt .

RUN pip install -r requirements.txt --no-cache-dir --upgrade

COPY app ./app
COPY data ./data

ENV PYTHONPATH="/:${PYTHONPATH}"

CMD ["app.main:handler"]