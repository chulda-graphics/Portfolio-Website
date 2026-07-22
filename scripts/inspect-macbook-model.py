"""Report the supplied MacBook model bounds and screen orientation in Blender."""

from pathlib import Path

import bpy
from mathutils import Vector


model_path = Path(__file__).parents[1] / "public/models/macbook-pro-14-m5-v1.glb"
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(model_path))

corners = []
for item in bpy.context.scene.objects:
    if item.type == "MESH":
        corners.extend(item.matrix_world @ Vector(corner) for corner in item.bound_box)

minimum = Vector((min(point.x for point in corners), min(point.y for point in corners), min(point.z for point in corners)))
maximum = Vector((max(point.x for point in corners), max(point.y for point in corners), max(point.z for point in corners)))
print("MODEL_BOUNDS", tuple(round(value, 4) for value in minimum), tuple(round(value, 4) for value in maximum))

for item in bpy.context.scene.objects:
    if item.type != "MESH":
        continue
    material_names = [slot.material.name for slot in item.material_slots if slot.material]
    if "HlQwFCAPWzetDQy" not in material_names:
        continue
    normals = [item.matrix_world.to_3x3() @ polygon.normal for polygon in item.data.polygons]
    average = sum(normals, Vector()) / max(len(normals), 1)
    print(
        "SCREEN",
        item.name,
        "POSITION",
        tuple(round(value, 4) for value in item.matrix_world.translation),
        "NORMAL",
        tuple(round(value, 4) for value in average.normalized()),
    )
