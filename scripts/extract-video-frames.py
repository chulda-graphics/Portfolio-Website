"""Sample evenly distributed preview frames from a video with Blender's decoder.

Run with Blender in background mode:
  blender --background --python scripts/extract-video-frames.py -- VIDEO OUTPUT COUNT
"""

from __future__ import annotations

import sys
from pathlib import Path

import bpy


def arguments() -> tuple[Path, Path, int]:
    values = sys.argv[sys.argv.index("--") + 1 :]
    if len(values) != 3:
        raise SystemExit("Expected VIDEO OUTPUT_DIRECTORY FRAME_COUNT")
    return Path(values[0]), Path(values[1]), int(values[2])


video_path, output_directory, frame_count = arguments()
output_directory.mkdir(parents=True, exist_ok=True)

scene = bpy.context.scene
scene.sequence_editor_create()
strip = scene.sequence_editor.strips.new_movie(
    name=video_path.stem,
    filepath=str(video_path),
    channel=1,
    frame_start=1,
)

source_width = strip.elements[0].orig_width
source_height = strip.elements[0].orig_height
render_width = min(source_width, 1280)
render_height = max(2, round(source_height * render_width / source_width))
render_height -= render_height % 2

scene.render.use_sequencer = True
scene.render.resolution_x = render_width
scene.render.resolution_y = render_height
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "JPEG"
scene.render.image_settings.color_mode = "RGB"
scene.render.image_settings.quality = 92

first_frame = strip.frame_final_start
last_frame = strip.frame_final_end - 1
for index in range(frame_count):
    progress = 0.03 + (0.94 * index / max(frame_count - 1, 1))
    source_frame = round(first_frame + (last_frame - first_frame) * progress)
    scene.frame_set(source_frame)
    scene.render.filepath = str(output_directory / f"sample-{index + 1:02d}.jpg")
    bpy.ops.render.render(write_still=True)

print(
    f"Extracted {frame_count} frames from {video_path.name} "
    f"({source_width}x{source_height}, {last_frame - first_frame + 1} frames)"
)
