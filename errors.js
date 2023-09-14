export class IllegalArgumentException extends Error {
 /** @param {string} argumentName */
 constructor(argumentName) {
   super(`Invalid argument passed : ${argumentName}`);
   this.name = "IllegalArgumentException";
 }
}

export class InvalidOperationError extends Error {
 /** @param {string} message */
 constructor(message) {
   super(message);
   this.name = "InvalidOperationError";
 }
}

export class NotFoundError extends Error {
 /** @param {string} entity */
 constructor(entity) {
   super(`Entity ${entity} with given ID not found in system.`);
   this.name = "NotFoundError";
 }
}

export class NotImplementedError extends Error {
 constructor() {
   super(`Unimplemented Code`)
   this.name = "NotImplementedError";
 }
}
