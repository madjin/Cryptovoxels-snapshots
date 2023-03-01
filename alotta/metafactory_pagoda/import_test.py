import bpy
import json
import os
import urllib.request

# Load the JSON data file from the command line argument
import argparse
parser = argparse.ArgumentParser()
parser.add_argument("json_file", help="Path to the JSON data file")
args = parser.parse_args()

# Load the JSON data from the file
with open(args.json_file, 'r') as f:
    data = json.load(f)

# Create a dictionary to hold the downloaded files
files = {}

# Loop through the features and download any files that haven't already been downloaded
for feature in data["parcel"]["features"]:
    if "url" in feature:
        url = feature["url"]
        filename = os.path.join(os.path.dirname(os.path.abspath(__file__)), url.split("/")[-1])
        if not os.path.exists(filename):
            print(f"Downloading {url}...")
            urllib.request.urlretrieve(url, filename)
        files[feature["uuid"]] = filename

# Loop through the features again and import the models
for feature in data["parcel"]["features"]:
    if feature["type"] == "vox-model":
        filename = files[feature["uuid"]]
        bpy.ops.import_scene.gltf(filepath=filename, import_pack_images=True)
        obj = bpy.context.selected_objects[0]
        obj.scale = feature["scale"]
        obj.location = feature["position"]
        obj.rotation_euler = feature["rotation"]
        if feature["flipX"]:
            obj.scale[0] *= -1
    elif feature["type"] == "image":
        url = feature["url"]
        filename = os.path.join(os.path.dirname(os.path.abspath(__file__)), url.split("/")[-1])
        if not os.path.exists(filename):
            print(f"Downloading {url}...")
            urllib.request.urlretrieve(url, filename)
        img = bpy.data.images.load(filename)
        if feature["color"]:
            tex = bpy.data.textures.new(name="Texture", type="IMAGE")
            tex.image = img
            mat = bpy.data.materials.new(name="Material")
            mat.texture_slots.add()
            ts = mat.texture_slots[0]
            ts.texture = tex
            ts.texture_coords = "UV"
            ts.mapping = "FLAT"
        else:
            mat = bpy.data.materials.new(name="Material")
            mat.use_shadeless = True
            mat.use_alpha = True
            tex = bpy.data.textures.new(name="Texture", type="IMAGE")
            tex.image = img
            slot = mat.texture_slots.add()
            slot.texture = tex
            slot.texture_coords = "UV"
            slot.blend_type = "MULTIPLY"
            if feature["inverted"]:
                slot.invert_rgb = True
        plane = bpy.data.objects.new("ImagePlane", bpy.data.meshes.new("ImagePlane"))
        bpy.context.scene.objects.link(plane)
        bpy.context.scene.objects.active = plane
        plane.select = True
        plane.scale = feature["scale"]
        plane.location = feature["position"]
        plane.rotation_euler = feature["rotation"]
        plane.data.materials.append(mat)
