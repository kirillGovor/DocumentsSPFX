import { WebPartContext } from "@microsoft/sp-webpart-base";
import { DocumentService } from "../../../services/DocumentService";
import { ISiteProperty } from "../../../utils/types";

export interface IDocumentsProps {
  site: ISiteProperty;
  DocumentService: DocumentService;
  context: WebPartContext;
}
