import { Client } from "./client";
import * as http from "http";
import * as https from "https";
import { URL } from "url";
import {
  IngestRequest,
  IngestResponse,
  SearchRequest,
  SearchResponse,
  ListStorageResponse,
  ReadDocumentResponse,
  ListEmbeddingModelsResponse,
} from "./models";

/**
 * Data ingestion and search methods
 */
export class DataMixin extends Client {
  /**
   * Ingests data into a collection
   */
  async ingestData(req: IngestRequest): Promise<IngestResponse> {
    return this.doRequest<IngestResponse>("POST", "/api/data/v1/ingest", req);
  }

  /**
   * Searches for data in a collection using POST request
   * This method supports field-specific weights via the SearchRequest.weights field
   */
  async searchData(req: SearchRequest): Promise<SearchResponse> {
    return this.doRequest<SearchResponse>("POST", "/api/data/v1/search", req);
  }

  /**
   * Lists contents of a directory in uploads storage
   */
  async listStorage(path?: string): Promise<ListStorageResponse> {
    const queryParams = path ? { path } : undefined;
    return this.doRequest<ListStorageResponse>(
      "GET",
      "/api/data/v1/storage/list",
      undefined,
      queryParams
    );
  }

  /**
   * Reads the first few rows of a CSV document
   */
  async readDocument(
    path: string,
    rows?: number,
    skip?: number
  ): Promise<ReadDocumentResponse> {
    if (!path) {
      throw new Error("path cannot be empty");
    }
    if (rows !== undefined && rows < 0) {
      throw new Error("rows cannot be negative");
    }
    if (skip !== undefined && skip < 0) {
      throw new Error("skip cannot be negative");
    }

    const queryParams: Record<string, string> = { path };
    if (rows !== undefined && rows > 0) {
      queryParams.rows = rows.toString();
    }
    if (skip !== undefined && skip > 0) {
      queryParams.skip = skip.toString();
    }

    return this.doRequest<ReadDocumentResponse>(
      "GET",
      "/api/data/v1/storage/read",
      undefined,
      queryParams
    );
  }

  /**
   * Streams ingestion statistics via Server-Sent Events
   * Returns an async generator that yields event strings
   */
  async *streamIngestStats(collection: string): AsyncGenerator<string> {
    const url = new URL(
      `/api/data/v1/ingest/stats?collection=${collection}`,
      this.baseURL
    );
    const protocol = url.protocol === "https:" ? https : http;

    const response = await new Promise<http.IncomingMessage>(
      (resolve, reject) => {
        const req = protocol.request(url, (res) => {
          resolve(res);
        });

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
   * Lists all available embedding providers and their models
   */
  async listEmbeddingModels(): Promise<ListEmbeddingModelsResponse> {
    return this.doRequest<ListEmbeddingModelsResponse>(
      "GET",
      "/api/data/v1/embedding/models"
    );
  }
}
