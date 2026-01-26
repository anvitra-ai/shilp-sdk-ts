/**
 * Generic response structure
 */
export interface GenericResponse {
  success: boolean;
  message: string;
}

/**
 * Metadata attribute types
 */
export enum AttrType {
  Int64 = 0,
  Float64 = 1,
  String = 2,
  Bool = 3,
}

/**
 * Metadata field definition
 */
export interface MetadataField {
  name: string;
  type: number;
}

/**
 * Storage backend type
 */
export enum StorageBackendType {
  DoesNotExist = -1,
  File = 1,
  S3 = 2,
}

/**
 * Metadata column schema
 */
export interface MetadataColumnSchema {
  name: string;
  type: AttrType;
}

/**
 * Collection representation
 */
export interface Collection {
  name: string;
  is_loaded: boolean;
  fields: string[];
  searchable_fields: string[];
  metadata?: MetadataColumnSchema[];
  has_metadata_enabled: boolean;
  no_reference_storage: boolean;
  storage_type: StorageBackendType;
  reference_storage_type: StorageBackendType;
}

/**
 * Metadata support info
 */
export interface MetadataSupportInfo {
  support_metadata: boolean;
  name: string;
  type: StorageBackendType;
  is_default: boolean;
}

/**
 * List collections response
 */
export interface ListCollectionsResponse {
  success: boolean;
  message: string;
  data: Collection[];
  metadata_info: MetadataSupportInfo[];
}

/**
 * Add collection request
 */
export interface AddCollectionRequest {
  name: string;
  no_reference_storage?: boolean;
  has_metadata_storage?: boolean;
  storage_type?: StorageBackendType;
  reference_storage_type?: StorageBackendType;
}

/**
 * Record data
 */
export interface RecordData {
  id: string;
  expiry: number;
  fields: { [key: string]: any };
  keyword_fields?: { [key: string]: boolean };
  metadata_fields?: { [key: string]: number };
}

/**
 * Insert record request
 */
export interface InsertRecordRequest {
  collection: string;
  expiry?: number;
  id?: string;
  record: { [key: string]: any };
  metadata_fields?: { [key: string]: AttrType };
  embedding_provider?: string;
  fields?: string[];
  keyword_fields?: string[];
  model?: string;
}

/**
 * Insert record response
 */
export interface InsertRecordResponse {
  success: boolean;
  message: string;
  record?: RecordData;
  remaining_records?: number;
}

/**
 * Ingest source type
 */
export enum IngestSourceType {
  File = "file",
  MongoDB = "mongodb",
}

/**
 * Ingest request
 */
export interface IngestRequest {
  // Source configuration - use either file_path OR MongoDB settings
  file_path?: string;
  source_type?: IngestSourceType;

  // MongoDB source configuration
  database_name?: string;
  mongo_collection?: string;
  query?: { [key: string]: any };
  mongo_fetch_batch_size?: number;

  // Common configuration
  collection_name: string;
  keyword_fields?: string[];
  metadata_fields?: { [key: string]: AttrType };
  fields: string[];
  id_field?: string;
  expiry_field?: string;
  embedding_provider?: string;
  embedding_model?: string;
  ingestion_batch_size?: number;
}

/**
 * Ingest response
 */
export interface IngestResponse {
  success: boolean;
  message: string;
  details?: string[];
}

/**
 * List ingestion sources response
 */
export interface ListIngestionSourcesResponse {
  message: string;
  success: boolean;
  data?: IngestSourceType[];
}

/**
 * File reader options
 */
export interface FileReaderOptions {
  source?: IngestSourceType;
  mongo_filter?: { [key: string]: any };
  skip?: number;
  limit?: number;
}

/**
 * Filter operations
 */
export enum FilterOp {
  Equals = 0,
  NotEquals = 1,
  GreaterThan = 2,
  GreaterThanOrEqual = 3,
  LessThan = 4,
  LessThanOrEqual = 5,
  In = 6,
  NotIn = 7,
}

/**
 * Filter expression
 */
export interface FilterExpression {
  attribute?: string;
  op?: FilterOp;
  value?: any;
  values?: any[];
}

/**
 * Compound filter
 */
export interface CompoundFilter {
  and?: FilterExpression[];
}

/**
 * Sort order
 */
export enum SortOrder {
  Ascending = 0,
  Descending = 1,
}

/**
 * Sort expression
 */
export interface SortExpression {
  attribute: string;
  order: SortOrder;
}

/**
 * Compound sort
 */
export interface CompoundSort {
  sorts?: SortExpression[];
}

/**
 * Search request
 */
export interface SearchRequest {
  collection: string;
  query: string;
  fields?: string[];
  limit?: number;
  weights?: { [key: string]: number };
  max_distance?: number;
  filters?: CompoundFilter;
  sort?: CompoundSort;
}

/**
 * Search response
 */
export interface SearchResponse {
  success: boolean;
  message: string;
  data: { [key: string]: any }[];
}

/**
 * Storage item
 */
export interface StorageItem {
  name: string;
  isDir: boolean;
}

/**
 * List storage response
 */
export interface ListStorageResponse {
  success: boolean;
  message: string;
  data: {
    items: StorageItem[];
  };
}

/**
 * Read document response
 */
export interface ReadDocumentResponse {
  success: boolean;
  message: string;
  data: { [key: string]: string }[];
}

/**
 * Health response
 */
export interface HealthResponse {
  success: boolean;
  version: string;
}

/**
 * Debug distance response
 */
export interface DebugDistanceResponse {
  success: boolean;
  message: string;
  data: {
    distance: number;
    vector: number[];
  };
}

/**
 * Debug neighbor
 */
export interface DebugNeighbor {
  node_id: number;
  vector_id: string;
  field: string;
  distance: number;
  metadata: { [key: string]: any };
}

/**
 * Debug node info
 */
export interface DebugNodeInfo {
  node_id: number;
  vector_id: string;
  field: string;
  level: number;
  metadata: { [key: string]: any };
  neighbors: DebugNeighbor[];
}

/**
 * Debug node info response
 */
export interface DebugNodeInfoResponse {
  success: boolean;
  message: string;
  data: DebugNodeInfo | null;
}

/**
 * Debug level info
 */
export interface DebugLevelInfo {
  level: number;
  node_count: number;
}

/**
 * Debug levels response
 */
export interface DebugLevelsResponse {
  success: boolean;
  message: string;
  data: { [key: string]: DebugLevelInfo[] };
}

/**
 * Debug nodes at level response
 */
export interface DebugNodesAtLevelResponse {
  success: boolean;
  message: string;
  data: { [key: string]: number[] };
}

/**
 * Debug vector node
 */
export interface DebugVectorNode {
  id: number;
  field: string;
  vector: number[];
}

/**
 * Debug reference node
 */
export interface DebugReferenceNode {
  id: string;
  metadata: { [key: string]: any };
  nodes: DebugVectorNode[];
}

/**
 * Debug reference node response
 */
export interface DebugReferenceNodeResponse {
  success: boolean;
  message: string;
  data: DebugReferenceNode | null;
}

/**
 * Embedding model
 */
export interface EmbeddingModel {
  name: string;
  is_default: boolean;
}

/**
 * Embedding provider
 */
export interface EmbeddingProvider {
  name: string;
  is_default: boolean;
  models: EmbeddingModel[];
}

/**
 * List embedding models response
 */
export interface ListEmbeddingModelsResponse {
  success: boolean;
  message: string;
  data: EmbeddingProvider[];
  supports_distributed_embedding: boolean;
}

/**
 * Oplog status response
 */
export interface OplogStatusResponse {
  success: boolean;
  message: string;
  last_lsn: number;
  retention_lsn: number;
  replica_count: number;
}

/**
 * Update replica LSN request
 */
export interface UpdateReplicaLSNRequest {
  collection: string;
  replica_id: string;
  lsn: number;
}

/**
 * Update replica LSN response
 */
export interface UpdateReplicaLSNResponse {
  success: boolean;
  message: string;
}

/**
 * Register replica request
 */
export interface RegisterReplicaRequest {
  replica_id: string;
}

/**
 * Unregister replica request
 */
export interface UnRegisterReplicaRequest {
  replica_id: string;
}

/**
 * Operation type
 */
export type OpType =
  | "insert"
  | "update"
  | "delete"
  | "drop_collection"
  | "rename_collection";

/**
 * Record
 */
export interface Record {
  id: string;
  fields: { [key: string]: any };
  keyword_fields?: { [key: string]: boolean };
  metadata_fields?: { [key: string]: AttrType };
  vectors?: { [key: string]: number[] };
  dist?: number;
  nodes?: string[];
  expiry?: number;
}

/**
 * Oplog entry
 */
export interface OplogEntry {
  lsn: number;
  timestamp: string;
  collection: string;
  doc_id: string;
  op_type: OpType;
  vector?: number[];
  metadata?: { [key: string]: any };
  keywords?: string[];
  full_doc?: Record;
  vectors?: { [key: string]: number[] };
  fields?: { [key: string]: any };
  keyword_fields?: { [key: string]: boolean };
  metadata_fields?: { [key: string]: AttrType };
  expiry?: number;
  new_name?: string;
}

/**
 * Get oplog response
 */
export interface GetOplogResponse {
  success: boolean;
  message: string;
  entries: OplogEntry[];
  last_lsn: number;
  count: number;
}

/**
 * Replica information
 */
export interface Replica {
  id: string;
  address: string;
  is_healthy: boolean;
  is_syncing: boolean; // Traffic gate - if true, no traffic sent
}

/**
 * Registry status
 */
export interface Status {
  write_replica: Replica;
  read_replicas: Replica[];
  available_count: number;
  total_count: number;
}

/**
 * Proxy statistics
 */
export interface ProxyStats {
  active_proxies: number;
  targets: string[];
}

/**
 * Discovery statistics
 */
export interface DiscoveryStats {
  registry: Status;
  proxy: ProxyStats;
}

/**
 * Sync status
 */
export enum SyncStatus {
  Ready = "ready",
  Syncing = "syncing",
}

/**
 * Update sync status request
 */
export interface UpdateSyncStatusRequest {
  account_id: string;
  address: string;
  status: SyncStatus;
}

/**
 * Register to discovery request
 */
export interface RegisterToDiscoveryRequest {
  account_id: string;
  address: string;
  id: string;
  is_read: boolean;
  is_write: boolean;
}

/**
 * Replica type
 */
export enum ReplicaType {
  ReadReplica = 0,
  WriteReplica = 1,
  SingleNode = 2,
}
