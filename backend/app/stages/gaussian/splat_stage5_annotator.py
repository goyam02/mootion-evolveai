"""3D Gaussian Splatting Stage 5: Annotator.

Part of the Mootion ASK module 3D Gaussian splat pipeline.
Adds annotations, labels, camera waypoints, and narration cues.
"""


def annotate_splats(splat_config: dict, scene_timestamps: list[float]) -> dict:
    """Add annotations and metadata to 3D splat scene.

    Args:
        splat_config: SPLAT_CONFIG_JSON from stage 1
        scene_timestamps: List of timestamps for scene keyframes

    Returns:
        Dictionary containing annotation output
    """
    # TODO: Replace with live implementation
    return {
        "label_overlays": [
            {
                "timestamp_ms": 0,
                "position_3d": [0.0, 0.0, 0.0],
                "label": "Origin Point",
                "style": {"font_size": 16, "color": "#FFFFFF", "background": "#000000"}
            },
            {
                "timestamp_ms": 1000,
                "position_3d": [1.0, 0.0, 0.0],
                "label": "X-Axis",
                "style": {"font_size": 16, "color": "#FF0000", "background": "#000000"}
            },
            {
                "timestamp_ms": 2000,
                "position_3d": [0.0, 1.0, 0.0],
                "label": "Y-Axis",
                "style": {"font_size": 16, "color": "#00FF00", "background": "#000000"}
            }
        ],
        "camera_waypoints": [
            {
                "timestamp_ms": 0,
                "position": [5.0, 3.0, 5.0],
                "target": [0.0, 0.0, 0.0],
                "transition": "smooth",
                "duration_ms": 0
            },
            {
                "timestamp_ms": 1000,
                "position": [3.0, 2.0, 4.0],
                "target": [1.0, 0.0, 0.0],
                "transition": "smooth",
                "duration_ms": 500
            },
            {
                "timestamp_ms": 2000,
                "position": [2.0, 2.5, 3.5],
                "target": [0.0, 1.0, 0.0],
                "transition": "smooth",
                "duration_ms": 500
            }
        ],
        "narration_cues": [
            {
                "timestamp_ms": 0,
                "duration_ms": 3000,
                "text": "This 3D Gaussian splat represents a volumetric scene with multiple splats.",
                "voiceover": True
            },
            {
                "timestamp_ms": 3000,
                "duration_ms": 4000,
                "text": "Each splat contributes to the final rendered view based on its properties.",
                "voiceover": True
            },
            {
                "timestamp_ms": 7000,
                "duration_ms": 3000,
                "text": "The scene can be explored from multiple camera angles.",
                "voiceover": True
            }
        ],
        "metadata": {
            "total_labels": 3,
            "total_waypoints": 3,
            "total_narration_cues": 3,
            "audio_duration_seconds": 10.0
        }
    }