import os

# Walk through .docx files in ./src/_raw and remove those with corresponding
# .md files in ./src/posts
for root, dirs, files in os.walk('./src/_raw'):
    for file in files:
        if file.endswith('.docx'):
            docx_file = os.path.join(root, file)
            md_file = os.path.join('./src/posts', f"{file}.md")
            if os.path.isfile(md_file):
                os.remove(docx_file)
                print('Removed: ' + docx_file)
