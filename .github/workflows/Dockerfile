# Debug main.yml
FROM ghcr.io/catthehacker/ubuntu:act-22.04
RUN apt-get update
RUN apt-get install -y pandoc pip
RUN pip install python-docx PyYAML
# RUN git clone https://github.com/mjaquiery/philosophyofshakespeare.git
COPY . philosophyofshakespeare
WORKDIR philosophyofshakespeare
RUN python _python/prep_files.py
RUN mv ./src/_raw/*.md ./src/posts || true
RUN mv ./src/_raw/*.html ./src/posts || true
RUN python _python/rename_files.py
CMD npm run serve
