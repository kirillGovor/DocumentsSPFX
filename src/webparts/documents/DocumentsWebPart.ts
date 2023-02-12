import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { IDynamicDataSource } from "@microsoft/sp-dynamic-data";
import {
  BaseClientSideWebPart,
  IWebPartPropertiesMetadata,
} from "@microsoft/sp-webpart-base";

import { DynamicProperty } from "@microsoft/sp-component-base";
import Documents from "./components/Documents";
import { IDocumentsProps } from "./components/IDocumentsProps";
import { DocumentService } from "../../services/DocumentService";
import { ISiteProperty } from "../../utils/types";

export interface IDocumentsWebPartProps {
  description: string;
  site: DynamicProperty<ISiteProperty>;
}

export default class DocumentsWebPart extends BaseClientSideWebPart<IDocumentsWebPartProps> {
  private DocumentService: DocumentService;
  private site: ISiteProperty;
  private _dataSources: IDynamicDataSource[] = [];

  public render(): void {
    const element: React.ReactElement<IDocumentsProps> = React.createElement(
      Documents,
      {
        site: this.site,
        DocumentService: this.DocumentService,
        context: this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return new Promise<void>((resolve, _reject) => {
      this._initDataSources();
      this.context.dynamicDataProvider.registerAvailableSourcesChanged(
        this._initDataSources.bind(this, true)
      );
      this.DocumentService = new DocumentService(this.context);
      resolve();
    });
  }

  private _initDataSources(): void {
    const availableDataSources =
      this.context.dynamicDataProvider.getAvailableSources();

    if (availableDataSources && availableDataSources.length) {
      const dataSources = this._dataSources;
      const availableDataSourcesIds = availableDataSources.map((ds) => ds.id);

      for (let i = 0, len = dataSources.length; i < len; i++) {
        const dataSource = dataSources[i];
        if (availableDataSourcesIds.indexOf(dataSource.id) === -1) {
          dataSources.splice(i, 1);
          try {
            this.context.dynamicDataProvider.unregisterPropertyChanged(
              dataSource.id,
              "site",
              () => {console.log('property has been deregistered')}
            );
          } catch (err) {
            console.error(err);
          }
          i--;
          len--;
        }
      }

      for (let i = 0, len = availableDataSources.length; i < len; i++) {
        const dataSource = availableDataSources[i];
        if (
          !dataSource.getPropertyDefinitions().filter((pd) => pd.id === "site")
            .length
        ) {
          continue;
        }
        if (
          !dataSources ||
          !dataSources.filter((ds) => ds.id === dataSource.id).length
        ) {
          dataSources.push(dataSource);
          this.context.dynamicDataProvider.registerPropertyChanged(
            dataSource.id,
            "site",
            async () => {
              const test = this.context.dynamicDataProvider.tryGetSource(
                this._dataSources[0].id
              );
              this.site = await test.getPropertyValueAsync("site");
              this.render();
            }
          );
        }
      }
    }
  }

  protected get propertiesMetadata(): IWebPartPropertiesMetadata {
    return {
      site: {
        dynamicPropertyType: "object",
      },
    };
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }
}
