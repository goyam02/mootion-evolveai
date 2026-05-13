"""Mootion ASK module - 3D Gaussian Splatting stages.

This module provides stub implementations for the 3D Gaussian splat pipeline.
"""

from .splat_stage1_planner import plan_splat
from .splat_stage2_sampler import sample_points
from .splat_stage3_parameterizer import parameterize_gaussians
from .splat_stage4_rasterizer import rasterize_splats
from .splat_stage5_annotator import annotate_splats

__all__ = [
    "plan_splat",
    "sample_points",
    "parameterize_gaussians",
    "rasterize_splats",
    "annotate_splats"
]