// Skills are stored in MongoDB as a plain string `iconKey` (e.g. "SiReact")
// because a React component can't be saved to a database. This map turns
// that key back into the actual icon component on the frontend, reusing the
// exact same icon set the portfolio already used.
import {
  SiJavascript,
  SiMongodb,
  SiFirebase,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiFramer,
  SiGit,
  SiReact,
  SiNodedotjs,
  SiCplusplus,
  SiC,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { FiCode } from "react-icons/fi";

export const ICON_MAP = {
  SiJavascript,
  SiMongodb,
  SiFirebase,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiFramer,
  SiGit,
  SiReact,
  SiNodedotjs,
  SiCplusplus,
  SiC,
  FaJava,
};

// Falls back to a generic code icon for any iconKey an admin enters that
// isn't in the map above, instead of crashing the page.
export function getIcon(iconKey) {
  return ICON_MAP[iconKey] || FiCode;
}

export const AVAILABLE_ICON_KEYS = Object.keys(ICON_MAP);
