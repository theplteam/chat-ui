import SvgIcon from "@mui/material/SvgIcon";

export type ToolType = {
  id: string,
  icon: typeof SvgIcon,
  label: string,
  smallLabel: string,
};
