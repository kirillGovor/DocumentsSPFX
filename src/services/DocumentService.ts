import { MSGraphClientV3, GraphRequest } from "@microsoft/sp-http-msgraph";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IDocument } from "../utils/types";

interface IDocumentItem {
  webUrl: string;
  fields: IDocument;
}

export class DocumentService {
  private context: WebPartContext;

  constructor(context: WebPartContext) {
    this.context = context;
  }

  private getClient = async (): Promise<MSGraphClientV3> => {
    return await this.context.msGraphClientFactory.getClient("3");
  };

  public getDocumentList = async (id: string): Promise<IDocument[]> => {
    const documents: IDocument[] = [];
    const queryDocumentItem =
      "?expand=fields(select=Name,Id,contentType,LinkFilename,webUrl)";
    const client = await this.getClient();
    const request: GraphRequest = client.api(`/sites/${id}/lists`);
    const documentLibrariesInfo = await request.get();
    const documentLibraries: MicrosoftGraph.Event[] =
      documentLibrariesInfo.value;

    for (const item of documentLibraries) {
      const request1: GraphRequest = await client.api(
        `/sites/${id}/lists/${item.id}/items${queryDocumentItem}`
      );
      const documentItems = await request1.get();

      documentItems?.value?.forEach((item: IDocumentItem) => {
        documents.push({ ...item.fields, webUrl: item.webUrl });
      });
    }

    return documents;
  };
}
