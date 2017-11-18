import Tickable from 'overmorrow/interfaces/Tickable';
import { WorldRenderer } from 'overmorrow/ui/UIWorld';
import Color from 'overmorrow/primitives/Color';
import Rectangle from 'overmorrow/primitives/Rectangle';
import Entity from 'overmorrow/classes/Entity';
import Tile from 'overmorrow/classes/Tile';

export default class World implements Tickable {
	private _name;
	private _entities: Entity[] = [];
	private _tileBuffer; // Where the tiles are first drawn to (only visible or all?), only updated if map changes
	private _tiles: Tile[][]; // Tile information
	private _dirty: boolean = true; // True if tiles have changed and buffer needs to be redrawn
	private _width: number;
	private _height: number;
	// TODO Handle layers, maybe give tiles backgrounds and foregrounds, gotta do something for TiledMap layers

	constructor(width: number, height: number) {
		this._width = width;
		this._height = height;
		this._tiles = new Array(height);
		this._tiles.forEach((row) => { row = new Array(width); });
	}

	public setName(name: string): World {
		this._name = name;
		return this;
	}

	get width(): number {
		return this._width;
	}
	get height(): number {
		return this._height;
	}

	public getTileAt(x: number, y: number): Tile {
		return this._tiles[y][x];
	}

	public tick(delta: number): void {
		this._tiles.forEach((row) => { row.forEach((tile) => { if (tile !== null) tile.tick(delta) }) });
	}

	public draw(ui: WorldRenderer): void {
		/*let area = ui.getVisibleTileArea();
		for (let y = area.y1; y <= area.y2; y++) {
			for (let x = area.x1; x <= area.x2; x++) {
				if (this._tiles[y][x] != null)
					this._tiles[y][x].draw(ui);
			}
		}*/
		// X
		//  X X
		//  XX
		ui.drawRect(new Rectangle(0,0,1,1), Color.red);
		ui.drawRect(new Rectangle(1,1,1,1), Color.green);
		ui.drawRect(new Rectangle(1,2,1,1), Color.green);
		ui.drawRect(new Rectangle(2,2,1,1), Color.green);
		ui.drawRect(new Rectangle(3,1,1,1), Color.green);
	}

	public loadFromTiledMap(url: string): boolean { // Returns true if successfully loaded
		return false;
	}
}