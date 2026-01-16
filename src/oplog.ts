import { Client } from "./client";
import {
  GetOplogResponse,
  UpdateReplicaLSNRequest,
  UpdateReplicaLSNResponse,
  RegisterReplicaRequest,
  UnRegisterReplicaRequest,
  GenericResponse,
  OplogStatusResponse,
} from "./models";

/**
 * Oplog methods for replica synchronization
 */
export class OplogMixin extends Client {
  /**
   * Retrieves oplog entries after a specific LSN for replica synchronization
   * @param collection - Collection name to retrieve oplog entries for (optional, if empty returns entries for all collections)
   * @param afterLSN - LSN after which to retrieve oplog entries (required)
   * @param limit - Maximum number of oplog entries to retrieve (optional)
   */
  async getOplogEntries(
    collection: string,
    afterLSN: number,
    limit?: number
  ): Promise<GetOplogResponse> {
    const queryParams: Record<string, string> = {
      after_lsn: afterLSN.toString(),
    };

    if (collection) {
      queryParams.collection = collection;
    }

    if (limit !== undefined && limit > 0) {
      queryParams.limit = limit.toString();
    }

    return this.doRequest<GetOplogResponse>(
      "GET",
      "/api/oplog/v1/",
      undefined,
      queryParams
    );
  }

  /**
   * Updates the last applied LSN for a replica (heartbeat)
   * @param collection - Collection name
   * @param replicaID - Replica identifier
   * @param lsn - Last applied LSN
   */
  async updateReplicaLSN(
    collection: string,
    replicaID: string,
    lsn: number
  ): Promise<UpdateReplicaLSNResponse> {
    const req: UpdateReplicaLSNRequest = {
      collection,
      replica_id: replicaID,
      lsn,
    };

    return this.doRequest<UpdateReplicaLSNResponse>(
      "POST",
      "/api/oplog/v1/heartbeat",
      req
    );
  }

  /**
   * Registers a replica for oplog retention tracking
   * @param replicaID - Replica identifier
   */
  async registerReplica(replicaID: string): Promise<GenericResponse> {
    const req: RegisterReplicaRequest = {
      replica_id: replicaID,
    };

    return this.doRequest<GenericResponse>(
      "POST",
      "/api/oplog/v1/register",
      req
    );
  }

  /**
   * Unregisters a replica for oplog retention tracking
   * @param replicaID - Replica identifier
   */
  async unRegisterReplica(replicaID: string): Promise<GenericResponse> {
    const req: UnRegisterReplicaRequest = {
      replica_id: replicaID,
    };

    return this.doRequest<GenericResponse>(
      "POST",
      "/api/oplog/v1/register",
      req
    );
  }

  /**
   * Retrieves current oplog status and statistics for a collection
   * @param collection - Collection name to retrieve oplog status for (required)
   */
  async getOplogStatus(collection: string): Promise<OplogStatusResponse> {
    const queryParams: Record<string, string> = {
      collection,
    };

    return this.doRequest<OplogStatusResponse>(
      "GET",
      "/api/oplog/v1/status",
      undefined,
      queryParams
    );
  }
}
