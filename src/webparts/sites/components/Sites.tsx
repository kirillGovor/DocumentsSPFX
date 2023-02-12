import * as React from "react";
import { ReactElement, useEffect } from "react";
import { ISitesProps } from "./ISitesProps";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { ISite } from "../../../utils/types";

const Sites = ({ SiteService, onSiteSelected }: ISitesProps): ReactElement => {
  const [sites, setSites] = React.useState<ISite[]>([]);

  const fetchData = async (): Promise<void> => {
    const sites = await SiteService.getSites();
    setSites(sites || []);
  };

  useEffect((): void => {
    // eslint-disable-next-line no-void
    void fetchData();
  }, []);

  const onSelectSite = (
    _: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    onSiteSelected(item.text, item.key.toString());
  };

  return (
    <div>
      <Dropdown
        placeholder="Select site"
        label="Select site"
        options={sites}
        onChange={onSelectSite}
      />
    </div>
  );
};

export default Sites;
