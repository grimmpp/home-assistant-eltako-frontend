import subprocess
import sys

def compile_typescript():
    """Compile TypeScript code using npm script."""
    print("Compiling TypeScript files...")
    # result = subprocess.run(["npm", "run", "build"], check=True)
    result = subprocess.run(["npx", "vite", "build"], check=True)
    if result.returncode != 0:
        print("TypeScript compilation failed.")
        sys.exit(result.returncode)