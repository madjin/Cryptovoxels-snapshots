#!/bin/bash

# Download vox2svox and svox2gltf here: https://github.com/webspace-sdk/svox-tools/releases/tag/1.0.2
# Special thanks to gfodor and Smooth Voxels: https://svox.glitch.me/


# Convert .vox files to .svox
for i in *.vox; do
  output=$(basename "$i" .vox).svox
  echo "processing $output"
  vox2svox "$i" "$output"
done

# Convert .svox files to .glb
for i in *.svox; do
  output=$(basename "$i" .svox).glb
  svox2gltf "$i" "$output"
done

echo "Done converting svox to glb"
