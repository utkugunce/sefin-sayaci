import os
import math
from PIL import Image, ImageDraw

def generate_icon(size, filename, is_maskable=False):
    # Create image with dark background
    bg_color = (15, 23, 42)  # slate-900 #0f172a
    image = Image.new("RGBA", (size, size), bg_color)
    draw = ImageDraw.Draw(image)
    
    # Coordinates of center
    cx, cy = size / 2, size / 2
    
    if is_maskable:
        # Drawing an outer circle just to show maskable boundaries
        r_outer = size * 0.4
    else:
        r_outer = size * 0.45
        
    # Draw a gradient circle or a nice solid circle for the logo
    # Warm orange/amber accent color: #f97316 (rgb 249, 115, 22)
    accent_color = (249, 115, 22)
    draw.ellipse([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], fill=accent_color)
    
    # Draw a simple white chef hat or clock symbol inside
    # Let's draw a clock (representing timer recipes)
    # Circle outline for clock face
    r_clock = r_outer * 0.6
    draw.ellipse([cx - r_clock, cy - r_clock, cx + r_clock, cy + r_clock], outline=(255, 255, 255), width=int(size * 0.04))
    
    # Draw clock hands (Hour/Minute)
    # Center dot
    r_dot = size * 0.03
    draw.ellipse([cx - r_dot, cy - r_dot, cx + r_dot, cy + r_dot], fill=(255, 255, 255))
    
    # Minute hand pointing up
    draw.line([cx, cy, cx, cy - r_clock * 0.75], fill=(255, 255, 255), width=int(size * 0.04))
    # Hour hand pointing right-ish
    draw.line([cx, cy, cx + r_clock * 0.5, cy + r_clock * 0.2], fill=(255, 255, 255), width=int(size * 0.04))
    
    # Save the file
    image.save(filename)
    print(f"Generated {filename} ({size}x{size})")

if __name__ == "__main__":
    generate_icon(192, "icon-192.png")
    generate_icon(512, "icon-512.png")
    generate_icon(512, "icon-maskable.png", is_maskable=True)
