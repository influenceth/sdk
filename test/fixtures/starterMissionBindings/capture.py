"""Capture Serde arrays and hashes printed by generate.cairo; performs no hashing."""
import json
import re
import sys
from pathlib import Path

fixture_path = Path(__file__).with_name('vectors.json')
vectors = json.loads(fixture_path.read_text())
values = [int(value, 16) for value in re.findall(r'\[DEBUG\]\s+(0x[0-9a-f]+)', Path(sys.argv[1]).read_text())]
for index, vector in enumerate(vectors):
    marker = int.from_bytes(vector['name'].encode(), 'big')
    assert values.pop(0) == marker, vector['name']
    if index + 1 < len(vectors):
        next_marker = int.from_bytes(vectors[index + 1]['name'].encode(), 'big')
        end = values.index(next_marker)
    else:
        end = len(values)
    chunk, values = values[:end], values[end:]
    assert len(chunk) > 1
    vector['serialized'] = [str(value) for value in chunk[:-1]]
    vector['hash'] = str(chunk[-1])
fixture_path.write_text(json.dumps(vectors, indent=2) + '\n')
