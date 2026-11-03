FROM python:3.13-slim-bookworm@sha256:281d39ff02e3b389401586134ff9e6572954687822a58055ec07a60ded4e0b7f AS publisher
RUN apt-get update \
 && apt-get install -y --no-install-recommends git openssh-client ca-certificates \
 && rm -rf /var/lib/apt/lists/* \
 && groupadd --gid 65532 publisher \
 && useradd --uid 65532 --gid 65532 --home-dir /tmp --no-create-home publisher
WORKDIR /opt/codestra-cicd
COPY publisher.py ./publisher.py
COPY config ./config
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 HOME=/tmp
USER 65532:65532
ENTRYPOINT ["python3", "/opt/codestra-cicd/publisher.py"]

FROM python:3.13-slim-bookworm@sha256:281d39ff02e3b389401586134ff9e6572954687822a58055ec07a60ded4e0b7f AS test
RUN apt-get update \
 && apt-get install -y --no-install-recommends git openssh-client ca-certificates \
 && rm -rf /var/lib/apt/lists/* \
 && groupadd --gid 65532 publisher \
 && useradd --uid 65532 --gid 65532 --home-dir /tmp --no-create-home publisher
WORKDIR /opt/codestra-cicd
COPY publisher.py enroll.py ./
COPY config ./config
COPY tests ./tests
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 HOME=/tmp
USER 65532:65532
ENTRYPOINT ["python3", "-m", "unittest", "discover", "-s", "tests", "-v"]
