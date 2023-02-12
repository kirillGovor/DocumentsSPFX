import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IWebPartPropertiesMetadata,
} from "@microsoft/sp-webpart-base";

import {
  IDynamicDataPropertyDefinition,
  IDynamicDataCallables
} from '@microsoft/sp-dynamic-data';

import Sites from "./components/Sites";
import { ISitesProps } from "./components/ISitesProps";
import { SiteService } from "../../services/SiteService";
import { ISiteProperty } from "../../utils/types";

export interface ISiteWebPartProps {}

export default class SitesWebPart extends BaseClientSideWebPart<ISiteWebPartProps> implements IDynamicDataCallables {
  private SiteService: SiteService;
  private _selectedSite: ISiteProperty | undefined;

  private _siteSelected = (name: string, key: string): void => {
    this._selectedSite = {name, key};
    this.context.dynamicDataSourceManager.notifyPropertyChanged("site");
  };

  public render(): void {
    const element: React.ReactElement<ISitesProps> = React.createElement(
      Sites,
      {
        context: this.context,
        SiteService: this.SiteService,
        onSiteSelected: this._siteSelected,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return new Promise<void>((resolve, _reject) => {
      this.SiteService = new SiteService(this.context);
      this.context.dynamicDataSourceManager.initializeSource(this);
      resolve();
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected get propertiesMetadata(): IWebPartPropertiesMetadata {
    return {
      site: {
        dynamicPropertyType: "string",
      },
    };
  }

  public getPropertyDefinitions(): ReadonlyArray<IDynamicDataPropertyDefinition> {
    return [{ id: "site", title: "site" }];
  }

  public getPropertyValue(propertyId: string): ISiteProperty | undefined {
    switch (propertyId) {
      case "site":
        return this._selectedSite;
    }

    throw new Error("Bad property id");
  }
}
