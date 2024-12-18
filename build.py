import subprocess
import sys
import os

def compile_typescript():
    """Compile TypeScript code using npm script."""
    print("Compiling TypeScript files...")
    # result = subprocess.run(["npm", "run", "build"], check=True)
    result = subprocess.run(["npx", "vite", "build"], check=True)
    if result.returncode != 0:
        print("TypeScript compilation failed.")
        sys.exit(result.returncode)

def build_package():
    """Run Poetry build process."""

    print("Create Python package...")
    open(os.path.join(os.path.dirname(__file__), 'static', '__init__.py'), 'w').close()

    print("Building the Python package...")
    result = subprocess.run(["poetry", "build"], check=True)
    if result.returncode != 0:
        print("Poetry build failed.")
        sys.exit(result.returncode)

if __name__ == "__main__":
    compile_typescript()
    build_package()
