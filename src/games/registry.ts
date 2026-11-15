import type { GameDefinition } from './types';
import { schlagzeileGame } from './schlagzeile';
import { zeitstrahlGame } from './zeitstrahl';
import { laenderGame } from './laender';

/** Reihenfolge = Reihenfolge der Karten auf dem Startbildschirm. Neue Spiele einfach anhängen. */
export const GAMES: GameDefinition[] = [schlagzeileGame, zeitstrahlGame, laenderGame];

export const findGame = (id: string) => GAMES.find((g) => g.id === id);
