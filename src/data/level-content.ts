// data/level-content.ts
import { listLevels } from "./levels";
import { fetchCatalog, filterTilesForLevel, Tile } from "./tiles";
import { getPatternsByIds, Pattern } from "./patterns";

export type LevelContent = {
  levelId: string;
  title: string;
  patterns: Pattern[];
  tiles: Tile[];
  points: number;
};

export async function loadLevel(levelId: string): Promise<LevelContent> {
  const levels = await listLevels();
  const level = levels.find(l => l.id === levelId);
  if (!level) throw new Error("Level not found");

  const [patterns, catalog] = await Promise.all([
    getPatternsByIds(level.pattern_ids),
    fetchCatalog(),
  ]);

  const tiles = filterTilesForLevel(catalog, level.tile_filters);
  return {
    levelId,
    title: level.title.en,
    patterns,
    tiles,
    points: level.points,
  };
}
