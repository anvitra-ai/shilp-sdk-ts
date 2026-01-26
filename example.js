import { ShilpClient, StorageBackendType } from "./dist/index.js";

async function main() {
  // Initialize the client
  const client = new ShilpClient("http://localhost:3000");

  try {
    // Check health
    const health = await client.healthCheck();
    console.log(`Health check: ${health.success}, Version: ${health.version}`);

    // List collections
    const collections = await client.listCollections();
    console.log("Collections:", collections.data);

    // Drop collection if exists
    await client.dropCollection("my-collection").catch(() => {});

    // Create a new collection
    const createResp = await client.addCollection({
      name: "my-collection",
      storage_type: StorageBackendType.File,
      reference_storage_type: StorageBackendType.File,
    });
    console.log("Collection created:", createResp.success);

    // Insert a record
    const insertResp = await client.insertRecord({
      collection: "my-collection",
      id: "record-1",
      record: {
        title: "Hello World",
      },
      fields: ["title"],
    });
    console.log("Record inserted:", insertResp.success);

    // Flush collection
    const flushResp = await client.flushCollection("my-collection");
    console.log("Collection flushed:", flushResp.success);

    // Search
    const results = await client.searchData({
      collection: "my-collection",
      query: "Hello",
      fields: ["title"],
      limit: 10,
    });
    console.log("Search results:", results.data);

    // Cleanup
    await client.dropCollection("my-collection");
    console.log("Collection dropped successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
