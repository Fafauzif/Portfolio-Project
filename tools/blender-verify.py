from pathlib import Path
from tempfile import mkdtemp
import bpy

folder = Path(mkdtemp(prefix="fieldwork-blender-"))
print(f"Verification output: {folder}")
scene = bpy.context.scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.ops.mesh.primitive_cube_add(size=1.8)
cube = bpy.context.active_object
assert cube.type == 'MESH' and len(cube.data.vertices) == 8
bpy.ops.object.camera_add(location=(4, -6, 3.6))
camera = bpy.context.active_object
camera.rotation_euler = (cube.location - camera.location).to_track_quat('-Z', 'Y').to_euler()
scene.camera = camera
bpy.ops.object.light_add(type='AREA', location=(1, -3, 5))
bpy.context.active_object.data.energy = 420
bpy.context.active_object.data.shape = 'DISK'
bpy.context.active_object.data.size = 4
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 8
scene.cycles.use_denoising = False
scene.render.resolution_x = 240
scene.render.resolution_y = 180
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.filepath = str(folder / 'blender-cycles-cube.png')
bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=str(folder / 'blender-cycles-cube.blend'))
bpy.ops.object.select_all(action='DESELECT')
cube.select_set(True)
bpy.context.view_layer.objects.active = cube
bpy.ops.export_scene.gltf(filepath=str(folder / 'blender-cycles-cube.glb'), export_format='GLB', use_selection=True)
for filename in ('blender-cycles-cube.png', 'blender-cycles-cube.blend', 'blender-cycles-cube.glb'):
    artifact = folder / filename
    assert artifact.is_file() and artifact.stat().st_size > 0
    print(f'PASS {filename} {artifact.stat().st_size} bytes')
print(f'PASS Blender {bpy.app.version_string}, bpy cube, {scene.render.engine} {scene.cycles.device}')
