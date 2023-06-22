# Debug main.yml
FROM ghcr.io/catthehacker/ubuntu:act-22.04
RUN apt-get update
RUN apt-get install -y pandoc
# RUN git clone https://github.com/mjaquiery/thephilosophyofshakespeare.git
COPY . thephilosophyofshakespeare
WORKDIR thephilosophyofshakespeare
RUN python _python/prep_files.py
# RUN find ./src/_raw -name \*.docx -type f -exec pandoc -f docx -t markdown -s -o "{}.md" -M title:"{}" "{}" \;
RUN find ./src/_raw -name \*.docx -type f -exec pandoc -f docx -t html -s -o "{}.html" -M title:"{}" "{}" \;
RUN mv ./src/_raw/*.docx.md ./src/posts || true
RUN mv ./src/_raw/*.docx.html ./src/posts || true
RUN python _python/rename_files.py
RUN npm install
RUN npm run build

CMD npm run serve
