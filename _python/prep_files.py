import os
import time

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
                continue
            # Run pandoc via command line to convert .docx to .md
            title = file.replace('.docx', '')
            filename_without_ext = os.path.splitext(docx_file)[0].replace('\\', '')
            metadata = {
                'title': title,
                'layout': 'layouts/post.njk',
                'footer': 'footer1',
                'date': time.strftime("%Y-%m-%d", time.localtime(os.path.getctime(docx_file))),
            }
            metadata_str = ' '.join([f'-M {key}="{value}"' for key, value in metadata.items()])
            os.system(f'pandoc -f docx -t markdown -s -o "{filename_without_ext}.md" {metadata_str} "{docx_file}"')
