import re
import zlib

with open("debug_uploaded.pdf", "rb") as f:
    data = f.read()

# Find all streams
streams = re.findall(b'stream\r?\n(.*?)endstream', data, flags=re.DOTALL)
print(f"Found {len(streams)} streams")

extracted_text = []

for idx, s in enumerate(streams):
    # Try to decompress
    try:
        decompressed = zlib.decompress(s)
    except zlib.error as e:
        # Try to decompress partially
        decomp = zlib.decompressobj()
        try:
            decompressed = decomp.decompress(s)
            decompressed += decomp.flush()
        except Exception:
            decompressed = decomp.unconsumed_tail # whatever we got
            pass

    # Extract strings from the decompressed stream
    # Strings in PDF are in parentheses (...)
    # We can also just look for printable characters
    if decompressed:
        strings = re.findall(b'\((.*?)\)', decompressed)
        for string in strings:
            # simple decode
            try:
                decoded = string.decode('latin1')
                # filter out very short or non-text looking strings
                if len(decoded) > 3 and any(c.isalpha() for c in decoded):
                    extracted_text.append(decoded)
            except:
                pass

with open("recovered.txt", "w", encoding="utf-8") as out_f:
    out_f.write("Recovered Text:\n")
    for t in extracted_text:
        out_f.write(t + "\n")
print("Saved to recovered.txt")
