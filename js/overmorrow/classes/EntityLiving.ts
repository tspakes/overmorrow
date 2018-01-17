import Entity from 'overmorrow/classes/Entity';
import Rectangle from 'overmorrow/primitives/Rectangle';
import World from 'overmorrow/classes/World';
import Inventory from './Inventory';
import Action from './Action';
import Item, { ItemType } from './Item';
import EntityItem from './EntityItem';
import { Direction, directionToVector } from '../Utilities';
import Vector from '../primitives/Vector';

export default abstract class EntityLiving extends Entity {
  // Defines entities with inventory that can use items and engage in combat
  protected _health: number;
  protected _maxHealth: number;
  protected _action: Action = null;
  protected _inventory: Inventory = null;
  protected _speedSprint: number;
  public direction: Direction = Direction.SOUTH; // Direction attacking/blocking, not visual
  public itemPrimary: Item = null;
  public itemSecondary: Item = null;
  public action: Action = null;

  public get health(): number {
    return this._health;
  }
  public set health(value: number) {
    this._health = value;
  }
  public get maxHealth(): number {
    return this._maxHealth;
  }
	public get speedSprint(): number {
		return this._speedSprint;
  }

  constructor(x: number, y: number, width: number, height: number, type: string, speedWalk: number, speedSprint: number, maxHealth: number) {
    super(x, y, width, height, type, speedWalk);
    this._speedSprint = speedSprint;
    this._maxHealth = maxHealth;
    this._health = this._maxHealth;
  }

  protected die(world: World) {
    // Drop items into world
    if (this._inventory !== null)
      for (let item of this._inventory.getItems())
        world.addEntity(new EntityItem(this.x1, this.y1, item, 30));
    // TODO Leave behind some particle effects or something
    world.removeEntity(this);
  }

  public useItem(world: World, item: Item): void {
    item.type.action(item, world, this);
  }

  private canBlock(): boolean {
    return (this.itemPrimary !== null && this.itemPrimary.type.canBlock)
      || (this.itemSecondary !== null && this.itemSecondary.type.canBlock);
  }

  public defendAgainst(attacker: EntityLiving, item: Item): void {
    //if (attacker.action == null) return;
    //let damage: number = attacker.action.power; // Strong/weak attack damage is handled by the Action initialization
    let damage: number = item.power; // Replace once actions are implemented
    let aVec: Vector = directionToVector(attacker.direction);
    let dVec: Vector = directionToVector(this.direction);

    // Check direct attack
    if (!attacker.clone().offsetByVector(aVec).intersects(this))
      damage /= 2;
    // Normalize vectors to same possible directions based on relative positioning
    // TODO Use rectangles instead
    /*if (attacker.x1 > this.x2 || attacker.x2 < this.x1)
      aVec.x *= -1;
    if (attacker.y1 > this.y2 || attacker.y2 < this.y1)
      aVec.y *= -1;*/
    /*if (attacker.x1 != this.x1) {
      if (aVec.x < 0)
        aVec.x *= -1;
      if (dVec.x < 0)
        dVec.x *= -1;
    }
    if (attacker.y1 != this.y1) {
      if (aVec.y < 0)
        aVec.y *= -1;
      if (dVec.y < 0)
        dVec.y *= -1;
    }*/
    /*if (attacker.x1 != this.x1) {
      aVec.x *= -1;
    }
    if (attacker.y1 != this.y1) {
      aVec.y *= -1;
    }
    if (attacker.x1 != this.x1 && attacker.y1 != this.y1)
      aVec.transpose();
    // Check blocked
    if (aVec.equals(dVec) && this.canBlock())
      damage /= 8;*/

    // TODO Check if vectors intersect at a 0 or 90 degree angle
    //  Parallel or perpendicular

    this._health -= damage;
    if (DEBUG) console.log(this.type + ' ' + this.id + ' took ' + damage + ' damage.');
  }

  public giveItem(item: Item): Item {
    if (this._inventory === null)
      return item;
    return this._inventory.addItem(item);
  }

  public takeItem(type: ItemType, amt: number): Item {
    throw new Error("Method not implemented.");
  }

  public tick(delta: number, world: World): void {
    super.tick(delta, world);
    if (this._health <= 0)
      this.die(world);
  }
}