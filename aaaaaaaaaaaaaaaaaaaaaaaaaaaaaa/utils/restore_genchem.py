import re

# Read the restored file
with open('allTestData_restored.js', 'r', encoding='utf-8') as f:
    restored_content = f.read()

# Extract General Chemistry section (from "General Chemistry": [ to ], before next key)
pattern = r'"General Chemistry":\s*\[(.*?)\],\s*"'
match = re.search(pattern, restored_content, re.DOTALL)
if match:
    genchem_content = match.group(1)
    print(f"Found General Chemistry section, length: {len(genchem_content)}")
    
    # Read script.js
    with open('script.js', 'r', encoding='utf-8') as f:
        script_content = f.read()
    
    # Replace General Chemistry section in script.js
    script_pattern = r'"General Chemistry":\s*\[.*?\],'
    new_genchem = f'"General Chemistry": [{genchem_content}],'
    
    if re.search(script_pattern, script_content, re.DOTALL):
        script_content = re.sub(script_pattern, new_genchem, script_content, flags=re.DOTALL)
        
        # Write back
        with open('script.js', 'w', encoding='utf-8') as f:
            f.write(script_content)
        print("Successfully replaced General Chemistry section in script.js")
    else:
        print("Could not find General Chemistry section in script.js")
else:
    print("Could not find General Chemistry section in allTestData_restored.js")

