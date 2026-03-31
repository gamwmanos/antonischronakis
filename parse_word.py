import sys
import re

file_path = "D:\\ANTONISCHRONAKIS\\ALYSEISKEF1.htm"

def detect_encoding(path):
    encodings = ['utf-8', 'windows-1253', 'utf-16', 'utf-16-le', 'cp1252']
    for enc in encodings:
        try:
            with open(path, 'r', encoding=enc) as f:
                f.read(1000)
            return enc
        except UnicodeDecodeError:
            pass
    return 'utf-8'

enc = detect_encoding(file_path)
print(f"Detected encoding: {enc}")

with open(file_path, 'r', encoding=enc) as f:
    content = f.read()

# Find colors used in the document
colors = set()
for match in re.finditer(r'color\s*:\s*([^;>"\']+)', content, re.IGNORECASE):
    colors.add(match.group(1).strip())

print(f"Colors found: {colors}")

# Find any span or font tag with color
spans = re.findall(r'<span[^>]*style=["\'][^"\']*color\s*:\s*([^;>"\']+)[^"\']*["\'][^>]*>(.*?)</span>', content, re.IGNORECASE | re.DOTALL)
print(f"Number of span tags with color: {len(spans)}")
if len(spans) > 0:
    for i in range(min(5, len(spans))):
        print(f"Span {i}: color={spans[i][0]}, text length={len(spans[i][1])}")
        print(spans[i][1][:100])

# Since Word could also use <font color="..."> 
fonts = re.findall(r'<font[^>]*color=["\']?([^"\'>\s]+)["\']?[^>]*>(.*?)</font>', content, re.IGNORECASE | re.DOTALL)
print(f"Number of font tags with color: {len(fonts)}")
if len(fonts) > 0:
    for i in range(min(5, len(fonts))):
        print(f"Font {i}: color={fonts[i][0]}, text length={len(fonts[i][1])}")
        print(fonts[i][1][:100])

# Also check classes
styles = re.findall(r'<style>(.*?)</style>', content, re.IGNORECASE | re.DOTALL)
if styles:
    print(styles[0][:500])
