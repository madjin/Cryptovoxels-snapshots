import os
import json
import bpy

# Get the directory of the Blender file
blend_file = bpy.data.filepath
blend_dir = os.path.dirname(blend_file)

# Build the path to the JSON file
json_path = os.path.join(blend_dir, '2074.json')

# Load JSON data from file
print(f"Loading JSON file from {json_path}...")
with open(json_path) as f:
    data = json.load(f)
for i in range(len(data['parcel']['features'])):
    feature = data['parcel']['features'][i]
    if feature['type'] == 'vox-model':
        glb_file = os.path.join(blend_dir, 'models', feature['uuid'] + '.glb')
        if not os.path.exists(glb_file):
            print(f"{glb_file} not found")
            continue
        print(f"Importing {glb_file}...")
        bpy.ops.import_scene.gltf(filepath=glb_file)
        imported_obj = bpy.context.selected_objects[0]
        imported_obj.scale = obj['scale']
        imported_obj.location = obj['position']
        imported_obj.rotation_euler = obj['rotation']
        if obj['flipX']:
            imported_obj.scale.x *= -1
        print(f"Imported object {imported_obj.name} set to scale {imported_obj.scale}, position {imported_obj.location}, and rotation {imported_obj.rotation_euler}.")