import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SiteService } from "../../../services/SiteService";

export interface ISitesProps {
  context: WebPartContext;
  SiteService: SiteService;
  onSiteSelected: (name: string, ket: string) => void;
}
