import { AzureFunction, Context, HttpRequest } from "@azure/functions";
const { BlobServiceClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {

    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
    const accountName = process.env.AZURE_STORAGE_RESOURCE_NAME;
    if (!accountName) throw Error("Azure Storage accountName not found");
    if (!containerName) throw Error("Azure Storage containerName not found");
    
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      new DefaultAzureCredential()
    );
    
    // create container client
    const containerClient = await blobServiceClient.getContainerClient(
      containerName
    );

        let blobNames = [];

  for await (const blob of containerClient.listBlobsFlat()) {

    // Display blob name and URL
    blobNames.push(blob.name);
  }

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: blobNames
  };
};

export default httpTrigger;
