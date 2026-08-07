import json
import pandas as pd

lines = []

df = pd.read_csv("Student Social Media And Mental Health Impact.csv")
lines.append("COLUMNS: " + str(list(df.columns)))
lines.append("")
lines.append("TOP COUNTRIES:")
lines.append(str(df['Country'].value_counts().head(12)))
lines.append("")
lines.append("MOST_USED_PLATFORM:")
lines.append(str(df['Most_Used_Platform'].value_counts()))
lines.append("")
lines.append("PURPOSE_OF_USE:")
lines.append(str(df['Purpose_Of_Use'].value_counts()))
lines.append("")
lines.append("ACADEMIC_LEVEL:")
lines.append(str(df['Academic_Level'].value_counts()))
lines.append("")
lines.append("GENDER:")
lines.append(str(df['Gender'].value_counts()))
lines.append("")
lines.append("STRESS_LEVEL:")
lines.append(str(df['Stress_Level'].value_counts()))
lines.append("")

# Inspect notebook cell types
lines.append("=" * 60)
lines.append("NOTEBOOK CELL TYPES:")
with open("sentiment_analysis.ipynb", encoding="utf-8") as f:
    nb = json.load(f)
for i, cell in enumerate(nb["cells"]):
    src = "".join(cell.get("source", [])).strip().splitlines()
    first = src[0] if src else "(empty)"
    lines.append(f"  Cell {i}: type={cell['cell_type']} | first line: {first!r}")

with open("debug_output.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("done")

