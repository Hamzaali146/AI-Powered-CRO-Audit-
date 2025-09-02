FROM python:3.12-slim

WORKDIR /app

# Install build-essential for compiling C extensions if needed by some Python packages.
RUN apt update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN python3 -m pip install --upgrade pip

RUN pip install poetry

COPY pyproject.toml ./

RUN poetry install --no-root

COPY . /app

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
