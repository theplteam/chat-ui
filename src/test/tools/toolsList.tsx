import { ToolType } from "@plteam/chat-ui";
import { BulbIcon, EditSparkleIcon, ImageCollectionIcon, InternetIcon, AnalysesIcon } from "./icons";

export const toolsList: ToolType[] = [
  {
    id: 'image',
    icon: ImageCollectionIcon,
    label: 'Create an image',
    smallLabel: "Image",
  },
  {
    id: 'search',
    icon: InternetIcon,
    label: 'Search the web',
    smallLabel: "Search",
  },
  {
    id: 'canvas',
    icon: EditSparkleIcon,
    label: 'Write text or code',
    smallLabel: "Canvas",
  },
  {
    id: 'research',
    icon: AnalysesIcon,
    label: 'Run deep research',
    smallLabel: "Research"
  },
  {
    id: 'justify',
    icon: BulbIcon,
    label: 'Think more',
    smallLabel: "Justify",
  },
];
