#!/bin/bash

# Download vox2svox and svox2gltf here: https://github.com/webspace-sdk/svox-tools/releases/tag/1.0.2
# Special thanks to gfodor and Smooth Voxels: https://svox.glitch.me/
# I only tested this on WSL2 and Linux


# Check if vox2svox and svox2gltf exist in current directory
if [ ! -f "./vox2svox" ] || [ ! -f "./svox2gltf" ]; then
  echo "vox2svox and/or svox2gltf not found in current directory."

  # Ask user if they want to download from svox-tools release page
  read -p "Do you want to download them? [y/n] " choice
  case "$choice" in
    y|Y )
      # Prompt user for OS
      echo "Which operating system are you using?"
      select os in "Linux" "MacOS" "Windows" "Exit"; do
        case $os in
          Linux ) url="https://github.com/webspace-sdk/svox-tools/releases/latest/download/svox-tools-1.0.1-linux.tar.gz"; break;;
          MacOS ) url="https://github.com/webspace-sdk/svox-tools/releases/latest/download/svox-tools-1.0.1-macos.tar.gz"; break;;
          Windows ) url="https://github.com/webspace-sdk/svox-tools/releases/latest/download/svox-tools-1.0.1-windows.tar.gz"; break;;
          Exit ) echo "Exiting."; exit;;
          * ) echo "Invalid option. Please select 1-4.";;
        esac
      done

      # Download and extract the programs
      wget "$url"
      tar -xvf "svox-tools-1.0.1-$(echo $os | tr '[:upper:]' '[:lower:]').tar.gz"
      find ./ -name "vox2svox" -exec mv {} . \; -o -name "svox2gltf" -exec mv {} . \;
      ;;
    n|N )
      echo "Exiting."; exit;;
    * ) echo "Invalid choice. Please enter y/n."; exit;;
  esac
fi


# Convert .vox files to .svox
for i in *.vox; do
  output=$(basename "$i" .vox).svox
  echo "processing $output"
  ./vox2svox "$i" "$output"
done

# Convert .svox files to .glb
for i in *.svox; do
  output=$(basename "$i" .svox).glb
  ./svox2gltf "$i" "$output"
done

echo "Done converting svox to glb"
