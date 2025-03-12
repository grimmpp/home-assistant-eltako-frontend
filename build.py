import subprocess
import sys
import os
import re

def compile_typescript():
    """Compile TypeScript code using npm script."""
    print("Compiling TypeScript files...")
    #npm install --prefix ./homeassistant-frontend
    # result = subprocess.run(["npm", "run", "build"], check=True)
    result = subprocess.run(["npx", "vite", "build"], check=True)
    if result.returncode != 0:
        print("TypeScript compilation failed.")
        sys.exit(result.returncode)

def build_package():
    """Run Poetry build process."""

    print("Create Python package...")
    open(os.path.join(os.path.dirname(__file__), 'static', '__init__.py'), 'w').close()

    print("Replace module_url const in __init__.py file.")
    replace_js_module_const()
        
    print("Building the Python package...")
    result = subprocess.run(["poetry", "build", "--no-cache"], check=True)
    if result.returncode != 0:
        print("Poetry build failed.")
        sys.exit(result.returncode)

def get_js_module() -> str:
    index_html_file = os.path.join(os.path.dirname(__file__), 'static', 'index.html')

    with open(index_html_file, 'r', encoding='utf-8') as file:
        index_html = file.read()

    pattern = r'(\./assets/index.*?\.js)'
    match = re.search(pattern, index_html)
    js_module = match.group(1)
    return js_module

def replace_js_module_const():
    __init__file = os.path.join(os.path.dirname(__file__), '__init__.py')

    with open(__init__file, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    with open(__init__file, 'w', encoding='utf-8') as file:
        for line in lines:
            if line.lstrip().startswith("local_module_url: Final"):
                file.write(f"local_module_url: Final = '{get_js_module()}'\n")
            elif line.lstrip().startswith("module_url: Final"):
                file.write(f"module_url: Final = '{get_js_module().replace('./', '/eltako/')}'\n")
            else:
                file.write(line)


if __name__ == "__main__":
    compile_typescript()
    build_package()
