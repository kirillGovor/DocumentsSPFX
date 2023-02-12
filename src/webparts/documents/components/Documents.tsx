import * as React from "react";
import { IDocumentsProps } from "./IDocumentsProps";
import { ReactElement, useEffect, useState } from "react";
import { IDocument } from "../../../utils/types";
import NoFilesFound from "./NoFilesFound/NoFilesFound";
import Loader from "./Loader/Loader";
import List from "./List/List";

const Documents = ({
  site,
  DocumentService,
  context,
}: IDocumentsProps): ReactElement => {
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (): Promise<void> => {
    setLoading(true);

    const data = await DocumentService.getDocumentList(
      site?.key || context.pageContext.site.id.toString()
    );

    setDocuments(data);
    setLoading(false);
  };

  useEffect((): void => {
    // eslint-disable-next-line no-void
    void fetchData();
  }, [site?.key]);

  return (
    <section>
      {loading ? (
        <Loader />
      ) : (
        <>
          {documents.length === 0 ? (
            <NoFilesFound />
          ) : (
            <List
              siteName={site?.name || context.pageContext.web.title}
              documents={documents}
            />
          )}
        </>
      )}
    </section>
  );
};

export default Documents;
