import json
import random

# Tiled map parameters
width = 25
height = 20
tile_size = 32

# Create the base grid (fill with grass tile index 1)
ground_layer = [1] * (width * height)

# Add some variety (flowers/rocks could be at indices 2-10)
for i in range(width * height):
    if random.random() < 0.1:  # 10% chance for decor
        ground_layer[i] = random.randint(2, 6)

# Construct JSON structure
map_data = {
    "backgroundcolor": "#2d3436",
    "compressionlevel": -1,
    "height": height,
    "infinite": False,
    "layers": [
        {
            "data": ground_layer,
            "height": height,
            "id": 1,
            "name": "Ground",
            "opacity": 1,
            "type": "tilelayer",
            "visible": True,
            "width": width,
            "x": 0,
            "y": 0
        }
    ],
    "nextlayerid": 2,
    "nextobjectid": 1,
    "orientation": "orthogonal",
    "renderorder": "right-down",
    "tiledversion": "1.10.1",
    "tileheight": tile_size,
    "tilesets": [
        {
            "firstgid": 1,
            "image": "assets/stardew_tileset.png",
            "imageheight": 1024,
            "imagewidth": 1024,
            "margin": 0,
            "name": "stardew_style",
            "spacing": 0,
            "tilecount": 1024,
            "tileheight": tile_size,
            "tilewidth": tile_size
        }
    ],
    "tilewidth": tile_size,
    "type": "map",
    "version": "1.10",
    "width": width
}

# Write out map.json
with open('c:\\Users\\mawenzhi\\Desktop\\nex.js项目\\XLGWY\\public\\assets\\map.json', 'w') as f:
    json.dump(map_data, f, indent=4)
