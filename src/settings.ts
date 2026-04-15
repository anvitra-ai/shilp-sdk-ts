import { Client } from "./client";
import {
  GenericResponse,
  GetSettingsResponse,
  SettingsAvailableProvidersResponse,
  SettingsUpdateRequest,
} from "./models";

/**
 * Settings methods
 */
export class SettingsMixin extends Client {
  /**
   * Retrieves current settings
   */
  async getSettings(): Promise<GetSettingsResponse> {
    return this.doRequest<GetSettingsResponse>("GET", "/api/settings/v1/");
  }

  /**
   * Updates settings
   */
  async updateSettings(settings: SettingsUpdateRequest): Promise<GenericResponse> {
    return this.doRequest<GenericResponse>("PUT", "/api/settings/v1/", settings);
  }

  /**
   * Lists available settings providers
   */
  async listProviders(): Promise<SettingsAvailableProvidersResponse> {
    return this.doRequest<SettingsAvailableProvidersResponse>(
      "GET",
      "/api/settings/v1/providers"
    );
  }
}
