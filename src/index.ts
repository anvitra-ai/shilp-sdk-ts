import { ClientOptions } from "./client";
import { CollectionsMixin } from "./collections";
import { DataMixin } from "./data";
import { HealthMixin } from "./health";
import { DebugMixin } from "./debug";
import { OplogMixin } from "./oplog";

/**
 * Apply mixins to create the full Shilp client
 */
function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
        Object.create(null)
      );
    });
  });
}

/**
 * Shilp API Client with all functionality
 */
export class ShilpClient extends CollectionsMixin {
  constructor(baseURL: string, options?: ClientOptions) {
    super(baseURL, options);
  }
}

// Apply all mixins
applyMixins(ShilpClient, [
  CollectionsMixin,
  DataMixin,
  HealthMixin,
  DebugMixin,
  OplogMixin,
]);

// Export the interface for the full client
export interface ShilpClient
  extends CollectionsMixin,
  DataMixin,
  HealthMixin,
  DebugMixin,
  OplogMixin { }

// Export all types
export * from "./models";
export { ClientOptions } from "./client";
export { DiscoveryClient } from "./discovery_client";
