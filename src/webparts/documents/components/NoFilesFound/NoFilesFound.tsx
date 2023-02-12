import * as React from "react";
import styles from "./NoFilesFound.module.scss";
import { ReactElement } from "react";

const NoFilesFound = (): ReactElement => {
  return (
    <div className={styles.noFilesFound}>
      <img alt="No files Found" src={require("../../assets/noFiles.png")} />
      <h3>No Files Found :(</h3>
    </div>
  );
};

export default NoFilesFound;
