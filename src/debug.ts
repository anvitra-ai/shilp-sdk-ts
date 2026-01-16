import { Client } from "./client";
import {
  DebugDistanceResponse,
  DebugNodeInfoResponse,
  DebugLevelsResponse,
  DebugNodesAtLevelResponse,
  DebugReferenceNodeResponse,
} from "./models";

/**
 * Debug methods for collection inspection
 */
export class DebugMixin extends Client {
  /**
   * Gets the distance of a node in a collection for debug purposes
   */
  async getCollectionDistance(
    collectionName: string,
    field: string,
    nodeID: number,
    text: string
  ): Promise<DebugDistanceResponse> {
    return this.doRequest<DebugDistanceResponse>(
      "GET",
      `/api/collections/v1/debug/${collectionName}/${field}/distance/${nodeID}`,
      undefined,
      { text }
    );
  }

  /**
   * Gets node info of a collection for debug purposes
   */
  async getCollectionNodeInfo(
    collectionName: string,
    field: string,
    nodeID: number
  ): Promise<DebugNodeInfoResponse> {
    return this.doRequest<DebugNodeInfoResponse>(
      "GET",
      `/api/collections/v1/debug/${collectionName}/${field}/nodes/${nodeID}`
    );
  }

  /**
   * Gets node neighbors at a level of a collection for debug purposes
   */
  async getCollectionNodeNeighborsAtLevel(
    collectionName: string,
    field: string,
    nodeID: number,
    level: number,
    limit?: number,
    offset?: number
  ): Promise<DebugNodeInfoResponse> {
    const queryParams: Record<string, string> = {};
    if (limit !== undefined) {
      queryParams.limit = limit.toString();
    }
    if (offset !== undefined) {
      queryParams.offset = offset.toString();
    }

    return this.doRequest<DebugNodeInfoResponse>(
      "GET",
      `/api/collections/v1/debug/${collectionName}/${field}/nodes/${nodeID}/neighbors/${level}`,
      undefined,
      queryParams
    );
  }

  /**
   * Gets levels of a collection for debug purposes
   */
  async getCollectionLevels(
    collectionName: string
  ): Promise<DebugLevelsResponse> {
    return this.doRequest<DebugLevelsResponse>(
      "GET",
      `/api/collections/v1/debug/${collectionName}/levels`
    );
  }

  /**
   * Gets nodes at a level of a collection for debug purposes
   */
  async getCollectionNodesAtLevel(
    collectionName: string,
    level: number
  ): Promise<DebugNodesAtLevelResponse> {
    return this.doRequest<DebugNodesAtLevelResponse>(
      "GET",
      `/api/collections/v1/debug/${collectionName}/levels/${level}`
    );
  }

  /**
   * Gets node by reference node ID of a collection for debug purposes
   */
  async getCollectionNodeByReferenceNodeID(
    collectionName: string,
    nodeID: number
  ): Promise<DebugReferenceNodeResponse> {
    return this.doRequest<DebugReferenceNodeResponse>(
      "GET",
      `/api/collections/v1/debug/${collectionName}/nodes/reference_node/${nodeID}`
    );
  }
}
