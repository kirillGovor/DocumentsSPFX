// import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient } from "@microsoft/sp-http";
import { ISite } from "../utils/types";

interface IRow {
  Cells: IRowItem[];
}

interface IRowItem {
  Key: string;
  Value: string;
}

export class SiteService {
  private context: WebPartContext;

  constructor(context: WebPartContext) {
    this.context = context;
  }

  public transformSite = (results: any): ISite[] => {
    const sites: ISite[] = [];
    const resultsList =
      results?.PrimaryQueryResult?.RelevantResults?.Table?.Rows;

    resultsList.map((result: IRow) => {
      const title = result?.Cells?.find(
        (item: IRowItem) => item.Key === "Title"
      )?.Value;
      const siteId = result?.Cells?.find(
        (item: IRowItem) => item.Key === "SiteId"
      )?.Value;

      sites.push({
        text: title,
        key: siteId,
      });
    });

    return sites;
  };

  public getSites = async (): Promise<ISite[]> => {
    const restApiUrl: string =
      this.context.pageContext.web.absoluteUrl +
      "/_api/search/query?querytext='contentclass:sts_site'&SelectProperties='Title'";
    const client = await this.context.spHttpClient;
    const response = await client.get(
      restApiUrl,
      SPHttpClient.configurations.v1
    );
    const sites = await response.json();

    return this.transformSite(sites);
  };
}
