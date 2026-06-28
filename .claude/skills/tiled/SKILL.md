---
name: tiled
description: >-
  Use when DECORATING or visually editing this repo's WorkAdventure `.tmj` maps
  — placing or arranging tiles, adding decorative props (furniture, plants,
  rugs, walls, floors), building or styling rooms, configuring tilesets,
  setting layer order/depth so art renders behind or above the player, adding
  animated tiles, or using terrain/auto-tile patterns. Trigger phrases:
  "decorate the map", "add furniture/plants/decoration", "place tiles",
  "make the room look nicer", "lay out a new room", "add a tileset", "edit the
  .tmj layers". This is for the visual/decorative side of Tiled maps. For
  FUNCTIONAL zone behavior (Jitsi calls, exitUrl portals, silent zones, start
  points, openWebsite), see the WorkAdventure property reference instead — this
  skill teaches the generic area-object mechanism but not WA's property
  vocabulary.
license: Apache-2.0
compatibility: ''
metadata:
  author: terminal-skills
  version: 1.0.0
  category: Game Development
  tags:
    - level-editor
    - tilemap
    - game-design
    - 2d
    - map-editor
    - workadventure
    - decoration
---

# Tiled — 2D Level Editor for Game Maps

You are an expert in Tiled, the free and open-source 2D level editor for
creating tilemaps, placing objects, and designing game worlds. In **this
repository** the maps are WorkAdventure `.tmj` files (e.g. `conference.tmj`,
`extra/office.tmj`) that are edited as **raw Tiled JSON** — not by clicking in
the Tiled desktop GUI. Apply the concepts below directly to that JSON.

## When to use this skill

Use it for the **decorative / visual** side of a map:

- Placing, arranging, or swapping tiles in tile layers (floors, walls, rugs,
  furniture, plants, signage)
- Adding or laying out a new room and making it look good
- Adding/configuring a tileset (`.tsj` / embedded tileset)
- Getting layer **order and depth** right so decoration renders behind vs.
  above the player
- Animated decorative tiles (torches, water, flags)
- Terrain / auto-tile transitions (grass↔dirt, floor↔wall)

> **Not for functional zones.** Jitsi call zones, `exitUrl` portals, `silent`
> zones, `start` points, and `openWebsite` are WorkAdventure-specific *area
> object properties*. This skill teaches how to create area objects and attach
> custom properties (the mechanism), but the WA property keys live in this
> repo's `CLAUDE.md` and the existing `.tmj` examples. Reference those for
> behavior; use this skill for how the map looks.

## Core Capabilities

### Tilemap Structure

```markdown
## Tiled Map Anatomy

A Tiled map consists of:
- **Tilesets**: Sprite sheets cut into tiles (16×16, 32×32, etc.)
- **Tile layers**: Grid of tile IDs for rendering (ground, walls, decorations)
- **Object layers**: Free-form shapes for game logic (spawn points, zones, paths)
- **Image layers**: Full images (parallax backgrounds, overlays)
- **Group layers**: Organize layers into folders

## Layer ordering (bottom to top):
1. Background (sky, distant mountains)
2. Ground (floor tiles, terrain)
3. Decoration-below (grass, flowers behind player)
4. Collision (invisible wall tiles)
5. Decoration-above (tree canopies, roofs over player)
6. Objects (spawn points, items, zones)
```

> **WorkAdventure note:** decorative tiles meant to appear **above** the player
> (roofs, tree tops, hanging signs) go in a tile layer placed *after* the
> player in the layer list. WA respects layer order for depth.

### Tileset Configuration

```json
// tileset.tsj — Tiled tileset file
{
  "name": "dungeon",
  "tilewidth": 16,
  "tileheight": 16,
  "image": "dungeon-tileset.png",
  "imagewidth": 256,
  "imageheight": 256,
  "tilecount": 256,
  "columns": 16,
  "tiles": [
    {
      "id": 0,
      "type": "floor",
      "properties": [
        { "name": "walkable", "type": "bool", "value": true }
      ]
    },
    {
      "id": 16,
      "type": "wall",
      "properties": [
        { "name": "collides", "type": "bool", "value": true },
        { "name": "destructible", "type": "bool", "value": false }
      ]
    },
    {
      "id": 48,
      "type": "animated-torch",
      "animation": [
        { "tileid": 48, "duration": 200 },
        { "tileid": 49, "duration": 200 },
        { "tileid": 50, "duration": 200 },
        { "tileid": 51, "duration": 200 }
      ]
    }
  ]
}
```

### Decorative & Object Layers

Decorative art lives in **tile layers**. Object layers hold free-form shapes —
in WorkAdventure these are the `area` objects used for spawn/start points and
zones. The custom-property mechanism shown here is the same one WA reads.

```json
// Objects in a Tiled map — exported as JSON
{
  "name": "GameObjects",
  "type": "objectgroup",
  "objects": [
    {
      "name": "PlayerSpawn",
      "type": "spawn",
      "x": 160,
      "y": 240,
      "properties": [
        { "name": "facing", "type": "string", "value": "right" }
      ]
    },
    {
      "name": "DecorTrigger",
      "type": "area",
      "x": 400,
      "y": 64,
      "width": 128,
      "height": 128,
      "properties": [
        { "name": "exampleKey", "type": "string", "value": "exampleValue" }
      ]
    }
  ]
}
```

### Auto-Tiling (Terrain)

```markdown
## Terrain Brushes

Tiled's terrain system auto-selects the correct tile variant based on neighbors:
- Paint with "grass" terrain brush
- Tiled automatically picks corner, edge, and interior tiles
- Supports Wang tiles (blob/corner) for complex terrain transitions

## Setup:
1. Open tileset in Tiled
2. View → Terrain Sets
3. Mark tiles as corners/edges of each terrain type
4. Paint with terrain brush — Tiled handles tile selection

## Common terrain patterns:
- 16-tile minimal (corners + edges)
- 47-tile blob (all neighbor combinations)
- 15-tile Wang corner set
```

> When editing raw `.tmj` JSON without the GUI, you apply the *result* of these
> patterns directly: write the correct tile IDs into the tile layer's `data`
> array. Keep edges/corners consistent with the tileset's terrain layout.

## Editing `.tmj` JSON directly (this repo)

- Tile layers store a flat `data` array of global tile IDs (GIDs), row-major,
  length = `width × height`. `0` means empty.
- A GID is `firstgid` (from the map's `tilesets` entry) + the local tile id.
- To place a decoration: find its GID in the tileset, then set the array index
  `y * width + x` to that GID in the target tile layer.
- Add a new tile layer object to the map's `layers` array; its position in the
  array determines render depth (later = on top).
- After editing, validate the JSON and run `npm run dev` to preview the map.

## Best Practices

1. **Consistent tile size** — match the existing maps' tile size; don't mix.
2. **Separate collision layer** — keep visual tiles out of the `collisions`
   layer; collision is its own invisible layer.
3. **Object layers for logic** — spawn/start points and zones go in object
   layers with custom properties.
4. **Custom properties** — attach metadata to tiles and objects; in WA the
   property *keys* drive behavior (see `CLAUDE.md`).
5. **Terrain consistency** — keep edge/corner tiles consistent for clean
   transitions (grass/dirt, floor/wall).
6. **Layer groups & order** — organize complex maps; remember later layers
   render above the player.
7. **Tile animations** — define animations in the tileset (torches, water,
   flags) for ambient decoration.
8. **Preview before committing** — `npm run dev` and walk the map to confirm
   decoration depth and placement.
