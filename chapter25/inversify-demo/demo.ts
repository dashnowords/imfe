import { myContainer } from "./inversify.config";
import { TYPES } from "./types";
import { Warrior } from "./interfaces";

const ninja = myContainer.get<Warrior>(TYPES.Warrior);

console.log(ninja.fight(),'期望结果: cut!');
console.log(ninja.sneak(),'期望结果: hit!');