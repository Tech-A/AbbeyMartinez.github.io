/// <reference types="vite/client" />

// Lets you `import { ReactComponent as X } from './x.svg'` OR `import x from './x.svg'`
declare module "*.svg" {
  import * as React from "react";
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  const src: string;
  export default src;
}
