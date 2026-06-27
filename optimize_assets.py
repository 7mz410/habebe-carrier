import os
from PIL import Image

def resize_image(src_path, dest_path, max_width, format_name="JPEG", quality=85):
    if not os.path.exists(src_path):
        print(f"Warning: Source not found: {src_path}")
        return
    try:
        with Image.open(src_path) as img:
            # Convert RGBA to RGB if saving as JPEG
            if img.mode in ('RGBA', 'LA') and format_name == "JPEG":
                background = Image.new("RGB", img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[3]) # 3 is alpha
                img = background
            elif img.mode == 'P' and format_name == "JPEG":
                img = img.convert("RGB")
                
            w, h = img.size
            if w > max_width:
                new_h = int(h * (max_width / w))
                img_resized = img.resize((max_width, new_h), Image.Resampling.LANCZOS)
                img_resized.save(dest_path, format_name, quality=quality)
                print(f"Resized: {os.path.basename(src_path)} -> {os.path.basename(dest_path)} ({max_width}x{new_h})")
            else:
                img.save(dest_path, format_name, quality=quality)
                print(f"Copied: {os.path.basename(src_path)} -> {os.path.basename(dest_path)} ({w}x{h})")
    except Exception as e:
        print(f"Error processing {src_path}: {e}")

if __name__ == '__main__':
    workspace = '/Users/hamzaabuayyash/Downloads/Habebe Carrier'
    handoff_assets = os.path.join(workspace, 'motherhood-brand-website/project/assets')
    images_dir = os.path.join(workspace, 'images')
    os.makedirs(images_dir, exist_ok=True)
    
    # Task mapping: (src_name, dest_name, max_width, format)
    tasks = [
        ('logo-cream.png', 'logo_cream.png', 400, 'PNG'),
        ('logo-everglade.png', 'logo_everglade.png', 400, 'PNG'),
        ('logo-gold.png', 'logo_gold.png', 400, 'PNG'),
        ('mark-cream.png', 'mark_cream.png', 200, 'PNG'),
        ('mark-gold.png', 'mark_gold.png', 200, 'PNG'),
        ('mark-teal.png', 'mark_teal.png', 200, 'PNG'),
        ('life-tender.jpg', 'life_tender.jpg', 1400, 'JPEG'),
        ('life-marina.jpg', 'life_marina.jpg', 1400, 'JPEG'),
        ('story-mother.jpg', 'story_mother.jpg', 1000, 'JPEG'),
        ('sling-leopard.jpg', 'sling_leopard.jpg', 800, 'JPEG'),
        ('sling-midnight.jpg', 'sling_midnight.jpg', 800, 'JPEG'),
        ('sling-sage.jpg', 'sling_sage.jpg', 800, 'JPEG'),
        ('detail-strap.jpg', 'detail_strap.jpg', 600, 'JPEG'),
        ('detail-back.jpg', 'detail_back.jpg', 600, 'JPEG'),
        ('detail-leopard.jpg', 'detail_leopard.jpg', 600, 'JPEG')
    ]
    
    print("Starting asset optimization for design mockup...")
    for src_name, dest_name, max_width, fmt in tasks:
        src_path = os.path.join(handoff_assets, src_name)
        dest_path = os.path.join(images_dir, dest_name)
        resize_image(src_path, dest_path, max_width, format_name=fmt)
    print("Asset optimization complete!")
