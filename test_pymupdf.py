import fitz

def extract_text(pdf_path):
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        print("EXTRACTION SUCCESSFUL:")
        print(text[:500])
    except Exception as e:
        print("EXTRACTION FAILED:")
        print(str(e))

extract_text("debug_uploaded.pdf")
