
import os

filename = 'styles.css'

with open(filename, 'rb') as f:
    content = f.read()

# Replace null bytes
content = content.replace(b'\x00', b'')

with open(filename, 'wb') as f:
    f.write(content)

print(f"Fixed {filename}")
