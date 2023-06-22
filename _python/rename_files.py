import os

# Walk through the files in ./src/posts and rename them so they no longer have the .docx.md extension
for root, dirs, files in os.walk('./src/posts'):
    for file in files:
        if '.docx.' in file:
            f = os.path.join(root, file)
            new_name = os.path.join(root, file.replace('.docx.', ''))
            os.rename(f, new_name)
            print('Renamed: ' + f)
