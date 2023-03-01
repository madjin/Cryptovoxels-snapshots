import os
import json
import bpy

# Get the directory of the script
script_dir = os.path.dirname(bpy.data.filepath)

# Alternatively, get the directory of the Blender file
# blend_file = bpy.data.filepath
# blend_dir = os.path.dirname(blend_file)

# Build the path to the JSON file
json_path = os.path.join(script_dir, '2074.json')

# Load JSON data from file
with open(json_path) as f:
    data = json.load(f)

# Iterate over each object in the JSON data
for obj in data:
    if obj['type'] == 'vox-model':
        # Construct file paths for .vox and .glb files
        vox_file = os.path.join(os.path.dirname(obj['url']), os.path.basename(obj['url']))
        glb_file = os.path.join('models', obj['uuid'] + '.glb')
        
        # Import .glb file
        bpy.ops.import_scene.gltf(filepath=glb_file)
        
        # Find the imported object
        imported_obj = bpy.context.selected_objects[0]
        
        # Set scale, position, and rotation
        imported_obj.scale = obj['scale']
        imported_obj.location = obj['position']
        imported_obj.rotation_euler = obj['rotation']
        
        if obj['flipX']:
            # Flip the object along the X axis
            imported_obj.scale.x *= -1
