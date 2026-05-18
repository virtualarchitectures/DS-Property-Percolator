#!/bin/bash
set -e

VERSION=$(grep '"version"' manifest.json | cut -d'"' -f 4)
RELEASE_DIR="release"
BASENAME="DS-Property-Percolator-v${VERSION}"
ZIPFILE="${RELEASE_DIR}/${BASENAME}.zip"
XPIFILE="${RELEASE_DIR}/${BASENAME}.xpi"

echo "Building DS-Property-Percolator v${VERSION}..."

# Update version string in interface.html
# perl -i works on Mac, Linux, and Git Bash on Windows (Perl ships with Git for Windows)
perl -i -pe "s/v[0-9]+\.[0-9]+\.[0-9]+[a-zA-Z0-9.\-]*/v${VERSION}/g" popup/interface.html

# Create release directory
mkdir -p "${RELEASE_DIR}"

# Create zip archive
# Use zip if available (Mac, Linux), otherwise use uv to run a Python script (cross-platform)
if command -v zip &>/dev/null; then
  zip -r "${ZIPFILE}" . \
    -x "*.DS_Store" \
    -x "__MACOSX" \
    -x "js/mitm.js" \
    -x "js/ponyfill-2.0.2.js" \
    -x "js/streamsaver-2.0.3.js" \
    -x "js/webtorrent.min.js" \
    -x "*.git*" \
    -x "*.idea*" \
    -x "create-zip.sh" \
    -x "*.zip" \
    -x "*.xpi" \
    -x "tests*" \
    -x "release*" \
    -x "images/zeeschuimer-full.png" \
    -x "images/chirico-full.png" \
    -x "images/example_screenshot.png"
elif command -v uv &>/dev/null; then
  echo "zip not found — using uv Python fallback..."
  export _BUILD_VERSION="${VERSION}"
  export _BUILD_ZIPFILE="${ZIPFILE}"
  uv run - <<'EOF'
import os, zipfile, pathlib

version  = os.environ["_BUILD_VERSION"]
zip_name = os.environ["_BUILD_ZIPFILE"]
root     = pathlib.Path(".")

EXCLUDE_DIRS  = {".git", ".idea", "tests", "release"}
EXCLUDE_FILES = {
    "js/mitm.js", "js/ponyfill-2.0.2.js",
    "js/streamsaver-2.0.3.js", "js/webtorrent.min.js",
    "images/zeeschuimer-full.png", "images/chirico-full.png",
    "images/example_screenshot.png",
}
EXCLUDE_NAMES = {"DS_Store", "__MACOSX", "create-zip.sh"}
EXCLUDE_EXTS  = {".zip", ".xpi"}

def should_exclude(path):
    rel = path.relative_to(root)
    for part in rel.parts:
        if part in EXCLUDE_DIRS or part in EXCLUDE_NAMES:
            return True
    if path.suffix in EXCLUDE_EXTS:
        return True
    if rel.as_posix() in EXCLUDE_FILES:
        return True
    return False

with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as zf:
    for f in root.rglob("*"):
        if f.is_file() and not should_exclude(f):
            zf.write(f, f.relative_to(root))
EOF
else
  echo "Error: neither 'zip' nor 'uv' found."
  echo "Install zip, or install uv from https://docs.astral.sh/uv/"
  exit 1
fi

# Copy zip as xpi for Firefox installation
cp "${ZIPFILE}" "${XPIFILE}"

echo "Created ${ZIPFILE}"
echo "Created ${XPIFILE}"
