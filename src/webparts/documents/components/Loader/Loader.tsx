import * as React from "react";
import { ReactElement } from "react";
import { mergeStyles, Shimmer, ThemeProvider } from "@fluentui/react";

const wrapperClass = mergeStyles({
  padding: 2,
  selectors: {
    "& > .ms-Shimmer-container": {
      margin: "10px 0",
    },
  },
});

const Loader = (): ReactElement => {
  return (
    <ThemeProvider className={wrapperClass}>
      <Shimmer width="25%" />
      <Shimmer width="75%" />
      <Shimmer width="75%" />
      <Shimmer width="75%" />
    </ThemeProvider>
  );
};

export default Loader;
