import * as React from "react";
import styles from "./List.module.scss";
import { ReactElement } from "react";
import { IDocument } from "../../../../utils/types";

interface IListProps {
  documents: IDocument[];
  siteName: string;
}

const Documents = ({ documents, siteName }: IListProps): ReactElement => {
  return (
    <>
      <h3>Site: {siteName}</h3>
      <h4>Document library</h4>
      <ul className={styles.links}>
        {documents.map((item) => (
          <li key={item.id}>
            <a href={item.webUrl} target="_blank" rel="noreferrer">
              {item.LinkFilename}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Documents;
