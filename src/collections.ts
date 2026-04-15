import { Client } from "./client";
import * as http from "http";
import * as https from "https";
import { URL } from "url";
import {
  ListCollectionsResponse,
  AddCollectionRequest,
  GenericResponse,
  InsertRecordRequest,
  InsertRecordResponse,
  GetCollectionDataResponse,
  GetCollectionSchemaResponse,
  EnableMetadataStoreRequest,
  EnableMetadataStoreResponse,
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
   * Performs Product Quantization training for an existing collection
   */
  async pqTrain(collectionName: string): Promise<GenericResponse> {
    return this.doRequest<GenericResponse>(
      "POST",
      `/api/collections/v1/${collectionName}/pq-train`
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

  /**
   * Gets paginated data records from a collection
   */
  async getCollectionData(
    collectionName: string,
    offset: number,
    limit: number
  ): Promise<GetCollectionDataResponse> {
    return this.doRequest<GetCollectionDataResponse>(
      "GET",
      `/api/collections/v1/${collectionName}/data`,
      undefined,
      { offset: offset.toString(), limit: limit.toString() }
    );
  }

  /**
   * Enables Natural Language Inference for a collection via SSE stream
   * Returns an async generator that yields event strings
   */
  async *enableNli(
    collectionName: string,
    vertical: string
  ): AsyncGenerator<string> {
    const url = new URL(
      `/api/collections/v1/${collectionName}/nli/enable?vertical=${encodeURIComponent(vertical)}`,
      this.baseURL
    );
    const protocol = url.protocol === "https:" ? https : http;

    const response = await new Promise<http.IncomingMessage>(
      (resolve, reject) => {
        const req = protocol.request(
          url,
          {
            headers: this.getAuthorizationHeader(),
          },
          (res) => {
            resolve(res);
          }
        );
        req.on("error", reject);
        req.end();
      }
    );

    for await (const chunk of response) {
      const lines = chunk.toString().split("\n");
      for (const line of lines) {
        if (line.trim()) {
          yield line;
        }
      }
    }
  }

  /**
   * Gets the schema for a collection
   */
  async getCollectionSchema(
    collectionName: string
  ): Promise<GetCollectionSchemaResponse> {
    return this.doRequest<GetCollectionSchemaResponse>(
      "GET",
      `/api/collections/v1/${collectionName}/schema`
    );
  }

  /**
   * Enables metadata store for a collection
   */
  async enableMetadataStore(
    collectionName: string,
    req: EnableMetadataStoreRequest
  ): Promise<EnableMetadataStoreResponse> {
    return this.doRequest<EnableMetadataStoreResponse>(
      "POST",
      `/api/collections/v1/${collectionName}/metadata/enable`,
      req
    );
  }
}
