import { Client } from "./client";
import { HealthResponse } from "./models";

/**
 * Health check methods
 */
export class HealthMixin extends Client {
  /**
   * Performs a health check on the API
   */
  async healthCheck(): Promise<HealthResponse> {
    return this.doRequest<HealthResponse>("GET", "/health");
  }
}
