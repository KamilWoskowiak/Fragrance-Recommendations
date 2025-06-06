FROM public.ecr.aws/lambda/python:3.12

WORKDIR ${LAMBDA_TASK_ROOT}

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade  \
    -r requirements.txt \
    --target "${LAMBDA_TASK_ROOT}"

COPY app ./app
COPY data ./data

CMD ["app.main.handler"]