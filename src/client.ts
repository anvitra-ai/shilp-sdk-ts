import * as http from "http";
import * as https from "https";
import { URL, URLSearchParams } from "url";
import * as fs from "fs";
import FormData from "form-data";

/**
 * HTTP client options
 */
export interface ClientOptions {
  timeout?: number;
  httpAgent?: http.Agent;
  httpsAgent?: https.Agent;
}

/**
 * Client for the Shilp API
 */
export class Client {
  protected baseURL: string;
  private timeout: number;
  private httpAgent?: http.Agent;
  private httpsAgent?: https.Agent;

  /**
   * Creates a new Shilp API client
   * @param baseURL - Base URL of the Shilp API server
   * @param options - Client options
   */
  constructor(baseURL: string, options?: ClientOptions) {
    this.baseURL = baseURL.replace(/\/$/, "");
    this.timeout = options?.timeout || 30000;
    this.httpAgent = options?.httpAgent;
    this.httpsAgent = options?.httpsAgent;
  }

  /**
   * Performs an HTTP request
   */
  protected async doRequest<T>(
    method: string,
    path: string,
    body?: any,
    queryParams?: Record<string, string>
  ): Promise<T> {
    const url = new URL(path, this.baseURL);

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const protocol = url.protocol === "https:" ? https : http;
    const agent = url.protocol === "https:" ? this.httpsAgent : this.httpAgent;

    return new Promise((resolve, reject) => {
      const options: http.RequestOptions = {
        method,
        timeout: this.timeout,
        agent,
        headers: {
          "Content-Type": "application/json",
        },
      };

      const req = protocol.request(url, options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(
              new Error(`API error: ${data} (status: ${res.statusCode})`)
            );
            return;
          }

          try {
            const result = data ? JSON.parse(data) : {};
            resolve(result as T);
          } catch (err) {
            reject(new Error(`Failed to decode response: ${err}`));
          }
        });
      });

      req.on("error", (err) => {
        reject(new Error(`Request failed: ${err.message}`));
      });

      req.on("timeout", () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  }

  /**
   * Performs a file upload request
   */
  protected async doFileRequest(
    method: string,
    path: string,
    filename: string
  ): Promise<void> {
    const url = new URL(path, this.baseURL);
    const protocol = url.protocol === "https:" ? https : http;
    const agent = url.protocol === "https:" ? this.httpsAgent : this.httpAgent;

    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append("file", fs.createReadStream(filename));

      const options: http.RequestOptions = {
        method,
        timeout: this.timeout,
        agent,
        headers: form.getHeaders(),
      };

      const req = protocol.request(url, options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(
              new Error(`API error: ${data} (status: ${res.statusCode})`)
            );
            return;
          }
          resolve();
        });
      });

      req.on("error", (err) => {
        reject(new Error(`Request failed: ${err.message}`));
      });

      req.on("timeout", () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });

      form.pipe(req);
    });
  }

  /**
   * Performs an HTTP request with file response
   */
  protected async doRequestWithFileResponse(
    method: string,
    path: string,
    body?: any,
    queryParams?: Record<string, string>
  ): Promise<NodeJS.ReadableStream> {
    const url = new URL(path, this.baseURL);

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const protocol = url.protocol === "https:" ? https : http;
    const agent = url.protocol === "https:" ? this.httpsAgent : this.httpAgent;

    return new Promise((resolve, reject) => {
      const options: http.RequestOptions = {
        method,
        timeout: this.timeout,
        agent,
        headers: {
          "Content-Type": "application/json",
        },
      };

      const req = protocol.request(url, options, (res) => {
        if (res.statusCode && res.statusCode >= 400) {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            reject(
              new Error(`API error: ${data} (status: ${res.statusCode})`)
            );
          });
          return;
        }

        resolve(res);
      });

      req.on("error", (err) => {
        reject(new Error(`Request failed: ${err.message}`));
      });

      req.on("timeout", () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  }
}
