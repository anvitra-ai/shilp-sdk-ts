# Shilp TypeScript SDK

This is the official TypeScript SDK for the Shilp Vector Database API.

## Installation

```bash
npm install @anvitra-ai/shilp-sdk-ts
```

## Usage

```typescript
import { ShilpClient } from "@anvitra-ai/shilp-sdk-ts";

async function main() {
  // Initialize the client
  const client = new ShilpClient("http://localhost:3000");

  // Check health
  const health = await client.healthCheck();
  console.log(`Health: ${health.success}`);

  // List collections
  const collections = await client.listCollections();
  console.log("Collections:", collections.data);

  // Drop collection if exists

  try {
    await client.dropCollection("my-collection");
  } catch (error) {
    console.error("Error dropping collection:", error);
  }

  // Create a new collection
  await client.addCollection({
    name: "my-collection",
  });

  // Insert a record
  await client.insertRecord({
    collection: "my-collection",
    id: "record-1",
    record: {
      title: "Hello World",
    },
    fields: ["title"],
  });

  // Flush collection in case you are using insert record.
  // Flush can be used post inserting the batch of records.
  await client.flushCollection("my-collection");

  // Search
  const results = await client.searchData({
    collection: "my-collection",
    query: "Hello",
    fields: ["title"],
    limit: 10,
  });
  console.log("Search results:", results.data);

  // Advanced search with max distance filter
  const advancedResults = await client.searchData({
    collection: "my-collection",
    query: "Hello",
    fields: ["title"],
    limit: 10,
    max_distance: 0.5,
  });
  console.log("Advanced search results:", advancedResults.data);

  await client.dropCollection("my-collection");
}

main();
```

### Debug Operations

The SDK also provides debug endpoints for inspecting collection internals:

```typescript
// Re-index a collection
await client.reIndexCollection("my-collection");

// Get collection levels
const levels = await client.getCollectionLevels("my-collection");
console.log("Levels:", levels.data);

// Get nodes at a specific level
const nodes = await client.getCollectionNodesAtLevel("my-collection", 0);
console.log("Nodes:", nodes.data);

// Get node information
const nodeInfo = await client.getCollectionNodeInfo(
  "my-collection",
  "title",
  123
);
console.log("Node info:", nodeInfo.data);

// Get neighbors of a node at a specific level
const neighbors = await client.getCollectionNodeNeighborsAtLevel(
  "my-collection",
  "title",
  123,
  0,
  10,
  0
);
console.log("Neighbors:", neighbors.data);

// Get distance calculation
const distance = await client.getCollectionDistance(
  "my-collection",
  "title",
  123,
  "some text"
);
console.log("Distance:", distance.data);

// Get node by reference ID
const refNode = await client.getCollectionNodeByReferenceNodeID(
  "my-collection",
  456
);
console.log("Reference node:", refNode.data);
```

## Features

- Collection Management (List, Add, Drop, Rename, Load, Unload, Flush, ReIndex)
- Data Ingestion & Search (with keyword fields support)
- Record Management (Insert, Delete, Expiry Cleanup)
- Debug Collection Operations (Distance, Node Info, Levels, Neighbors)
- Oplog Operations (Replica Registration, Heartbeat, Get Entries, Status)
- Storage Listing
- Health Check

### Oplog Operations

The SDK provides oplog (operation log) endpoints for replica synchronization:

```typescript
// Register a replica for oplog tracking
const registerResp = await client.registerReplica("replica-1");
console.log("Registered replica:", registerResp.message);

// Get oplog status for a collection
const status = await client.getOplogStatus("my-collection");
console.log(
  `Oplog status - Last LSN: ${status.last_lsn}, Retention LSN: ${status.retention_lsn}, Replicas: ${status.replica_count}`
);

// Get oplog entries after a specific LSN
const entries = await client.getOplogEntries("my-collection", 1000, 100);
console.log(
  `Retrieved ${entries.count} oplog entries, last LSN: ${entries.last_lsn}`
);

// Get oplog entries for all collections
const allEntries = await client.getOplogEntries("", 1000, 100);

// Update replica LSN (heartbeat)
const updateResp = await client.updateReplicaLSN(
  "my-collection",
  "replica-1",
  1050
);
console.log(`Updated replica LSN: ${updateResp.success}`);
```

## API Documentation

For more details on the Shilp Vector Database API, please refer to the [official documentation](https://github.com/anvitra-ai/shilp-sdk-go).

## License

ISC
