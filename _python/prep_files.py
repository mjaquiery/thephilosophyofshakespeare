import yaml
import os
import tempfile

import docx

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
            # Extract metadata from the .docx file and let yaml handle it because
            # pandoc doesn't escape stuff properly
            doc = docx.Document(docx_file)
            filename_without_ext = os.path.splitext(docx_file)[0].replace('\\', '')
            title = doc.core_properties.title if doc.core_properties.title != '' else \
                os.path.basename(filename_without_ext)
            metadata = {
                'plain-title': title,
                'author': "Richard Burrow",
                'layout': 'layouts/post.njk',
                'footer': 'footer1',
                'date': doc.core_properties.modified.strftime("%Y-%m-%d"),
                'created': doc.core_properties.created.strftime("%Y-%m-%d"),
            }
            print(metadata)
            metadata_file_path = tempfile.mktemp('.yaml')
            with open(metadata_file_path, 'w+') as metadata_file:
                metadata_file.write('---\n')
                yaml.dump(metadata, metadata_file)
                metadata_file.write('---\n')
            # Run pandoc via command line to convert .docx to .md
            os.system(f"pandoc -f docx -t markdown -o \"{filename_without_ext}.md\" -H {metadata_file_path} \"{docx_file}\"")
            os.remove(metadata_file_path)
            # Tidy up duplicated metadata header
            with open(f"{filename_without_ext}.md", 'r') as md_file:
                lines = md_file.readlines()
                metadata_markers = []
                for i, line in enumerate(lines):
                    if line == '---\n':
                        metadata_markers.append(i)
                if len(metadata_markers) > 2:
                    markers_to_remove = metadata_markers[1:-1]
                    for marker in markers_to_remove:
                        lines[marker] = f"# {lines[marker]}"
            with open(f"{filename_without_ext}.md", 'w') as md_file:
                md_file.writelines(lines)
