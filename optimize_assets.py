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
    
    # Task mapping: (src_path, dest_path, max_width, format)
    tasks = [
        (os.path.join(handoff_assets, 'logo-cream.png'), os.path.join(images_dir, 'logo_cream.png'), 400, 'PNG'),
        (os.path.join(handoff_assets, 'logo-everglade.png'), os.path.join(images_dir, 'logo_everglade.png'), 400, 'PNG'),
        (os.path.join(handoff_assets, 'logo-gold.png'), os.path.join(images_dir, 'logo_gold.png'), 400, 'PNG'),
        (os.path.join(handoff_assets, 'mark-cream.png'), os.path.join(images_dir, 'mark_cream.png'), 200, 'PNG'),
        (os.path.join(handoff_assets, 'mark-gold.png'), os.path.join(images_dir, 'mark_gold.png'), 200, 'PNG'),
        (os.path.join(handoff_assets, 'mark-teal.png'), os.path.join(images_dir, 'mark_teal.png'), 200, 'PNG'),
        (os.path.join(handoff_assets, 'life-tender.jpg'), os.path.join(images_dir, 'life_tender.jpg'), 1400, 'JPEG'),
        (os.path.join(handoff_assets, 'life-marina.jpg'), os.path.join(images_dir, 'life_marina.jpg'), 1400, 'JPEG'),
        (os.path.join(handoff_assets, 'story-mother.jpg'), os.path.join(images_dir, 'story_mother.jpg'), 1000, 'JPEG'),
        (os.path.join(workspace, 'Product/prnt-copy.png'), os.path.join(images_dir, 'sling_leopard.jpg'), 800, 'JPEG'),
        (os.path.join(workspace, 'Product/blk-copy.png'), os.path.join(images_dir, 'sling_midnight.jpg'), 800, 'JPEG'),
        (os.path.join(workspace, 'Product/wit-copy.png'), os.path.join(images_dir, 'sling_sage.jpg'), 800, 'JPEG'),
        (os.path.join(handoff_assets, 'detail-strap.jpg'), os.path.join(images_dir, 'detail_strap.jpg'), 600, 'JPEG'),
        (os.path.join(handoff_assets, 'detail-back.jpg'), os.path.join(images_dir, 'detail_back.jpg'), 600, 'JPEG'),
        (os.path.join(handoff_assets, 'detail-leopard.jpg'), os.path.join(images_dir, 'detail_leopard.jpg'), 600, 'JPEG')
    ]
    
    print("Starting asset optimization for design mockup...")
    for src_path, dest_path, max_width, fmt in tasks:
        resize_image(src_path, dest_path, max_width, format_name=fmt)
    print("Asset optimization complete!")
