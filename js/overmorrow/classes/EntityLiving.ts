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

  public defendAgainst(attacker: EntityLiving, item: Item): void {
    //if (attacker.action == null) return;
    //let damage: number = attacker.action.power; // Strong/weak attack damage is handled by the Action initialization
    let damage: number = item.power; // Replace once actions are implemented
    let attackVector: Vector = directionToVector(attacker.direction);
    let defenceVector: Vector = directionToVector(this.direction);
    // If not being directly attacked
    if (!attacker.clone().offset(attackVector.x, attackVector.y).intersects(this))
      damage /= 2;
    // Account for direct, diagonal blocking
    else if (this.clone().offset(defenceVector.x, defenceVector.y).intersects(attacker))
      defenceVector.magnitude = 0;
    // If item can block and is blocking the same direction as the attacker (see if direction vectors end at same tile)
    if (((this.itemPrimary !== null && this.itemPrimary.type.isShield)
          || (this.itemSecondary !== null && this.itemSecondary.type.isShield))
        && attacker.clone().offset(attackVector.x, attackVector.y).intersects(this.clone().offset(defenceVector.x, defenceVector.y)))
      damage /= 8;

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