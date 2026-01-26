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
  ListIngestionSourcesResponse,
  FileReaderOptions,
  IngestSourceType,
  GenericResponse,
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
   * If the source is mongodb, then empty path lists all DBs. If path is a DB, lists all collections in that DB.
   */
  async listStorage(
    path?: string,
    source?: IngestSourceType
  ): Promise<ListStorageResponse> {
    const queryParams: Record<string, string> = {};
    if (path) {
      queryParams.path = path;
    }
    if (source) {
      queryParams.source = source;
    }
    return this.doRequest<ListStorageResponse>(
      "GET",
      "/api/data/v1/storage/list",
      undefined,
      queryParams
    );
  }

  /**
   * Lists available ingestion sources
   */
  async listIngestSources(): Promise<ListIngestionSourcesResponse> {
    return this.doRequest<ListIngestionSourcesResponse>(
      "GET",
      "/api/data/v1/ingest/sources"
    );
  }

  /**
   * Reads the first few rows of a CSV document or MongoDB collection
   * If the source is mongodb, then path is in the format "database/collection"
   * options.mongo_filter can be used to filter the documents returned in case of mongodb
   */
  async readDocument(
    path: string,
    options: FileReaderOptions = {}
  ): Promise<ReadDocumentResponse> {
    if (!path) {
      throw new Error("path cannot be empty");
    }

    const rows = options.limit ?? 0;
    if (rows < 0) {
      throw new Error("rows cannot be negative");
    }

    const skip = options.skip ?? 0;
    if (skip < 0) {
      throw new Error("skip cannot be negative");
    }

    if (options.source === IngestSourceType.MongoDB && path.split("/").length !== 2) {
      throw new Error("for mongodb source, path must be in the format 'database/collection'");
    }

    if (options.source && options.source !== IngestSourceType.File && options.source !== IngestSourceType.MongoDB) {
      throw new Error(`invalid source type - ${options.source}`);
    }

    const queryParams: Record<string, string> = {
      path,
      source: options.source || IngestSourceType.File,
    };

    if (rows > 0) {
      queryParams.rows = rows.toString();
    }
    if (skip > 0) {
      queryParams.skip = skip.toString();
    }
    if (options.source === IngestSourceType.MongoDB && options.mongo_filter) {
      queryParams.mongo_filter = JSON.stringify(options.mongo_filter);
    }

    return this.doRequest<ReadDocumentResponse>(
      "GET",
      "/api/data/v1/storage/read",
      undefined,
      queryParams
    );
  }

  /**
   * Uploads a data file to the uploads storage which can be used for ingestion
   */
  async uploadDataFile(filename: string): Promise<GenericResponse> {
    await this.doFileRequest("POST", "/api/data/v1/storage/upload", filename);
    return { success: true, message: "Upload completed" };
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
