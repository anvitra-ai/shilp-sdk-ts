import { Client } from "./client";
import {
  ListCollectionsResponse,
  AddCollectionRequest,
  GenericResponse,
  InsertRecordRequest,
  InsertRecordResponse,
} from "./models";

/**
 * Collection management methods
 */
export class CollectionsMixin extends Client {
  /**
   * Lists all collections
   */
  async listCollections(): Promise<ListCollectionsResponse> {
    return this.doRequest<ListCollectionsResponse>(
      "GET",
      "/api/collections/v1/"
    );
  }

  /**
   * Adds a new collection
   */
  async addCollection(
    req: AddCollectionRequest
  ): Promise<GenericResponse> {
    return this.doRequest<GenericResponse>(
      "POST",
      "/api/collections/v1/",
      req
    );
  }

  /**
   * Deletes a record from a collection
   */
  async deleteRecord(
    collectionName: string,
    id: string
  ): Promise<GenericResponse> {
    return this.doRequest<GenericResponse>(
      "DELETE",
      `/api/collections/v1/${collectionName}/${id}`
    );
  }

  /**
   * Performs expiry cleanup on a collection
   */
  async expiryCleanup(collectionName: string): Promise<GenericResponse> {
    return this.doRequest<GenericResponse>(
      "POST",
      `/api/collections/v1/${collectionName}/expiry-cleanup`
    );
  }

  /**
   * Drops an existing collection
   */
  async dropCollection(name: string): Promise<GenericResponse> {
    return this.doRequest<GenericResponse>(
      "DELETE",
      `/api/collections/v1/${name}`
    );
  }

  /**
   * Flushes a collection to disk
   */
  async flushCollection(name: string): Promise<GenericResponse> {
    return this.doRequest<GenericResponse>(
      "POST",
      `/api/collections/v1/${name}/flush`
    );
  }

  /**
   * Loads a collection into memory
   */
  async loadCollection(name: string): Promise<GenericResponse> {
    return this.doRequest<GenericResponse>(
      "POST",
      `/api/collections/v1/${name}/load`
    );
  }

  /**
   * Unloads a collection from memory
   */
  async unloadCollection(name: string): Promise<GenericResponse> {
    return this.doRequest<GenericResponse>(
      "POST",
      `/api/collections/v1/${name}/unload`
    );
  }

  /**
   * Exports a collection and returns a ReadableStream for the file
   * The caller is responsible for handling the stream
   */
  async exportCollection(name: string): Promise<NodeJS.ReadableStream> {
    return this.doRequestWithFileResponse(
      "POST",
      `/api/collections/v1/${name}/export`
    );
  }

  /**
   * Imports a collection from a file
   */
  async importCollection(filename: string): Promise<GenericResponse> {
    await this.doFileRequest("POST", "/api/collections/v1/import", filename);
    return { success: true, message: "Import completed" };
  }

  /**
   * Renames an existing collection
   */
  async renameCollection(
    oldName: string,
    newName: string
  ): Promise<GenericResponse> {
    return this.doRequest<GenericResponse>(
      "PUT",
      `/api/collections/v1/${oldName}/rename/${newName}`
    );
  }

  /**
   * Re-indexes a collection for debug purposes
   */
  async reIndexCollection(collectionName: string): Promise<GenericResponse> {
    return this.doRequest<GenericResponse>(
      "PUT",
      `/api/collections/v1/${collectionName}/reindex`
    );
  }

  /**
   * Inserts a new record into a collection
   */
  async insertRecord(
    req: InsertRecordRequest
  ): Promise<InsertRecordResponse> {
    return this.doRequest<InsertRecordResponse>(
      "POST",
      "/api/collections/v1/record",
      req
    );
  }
}
