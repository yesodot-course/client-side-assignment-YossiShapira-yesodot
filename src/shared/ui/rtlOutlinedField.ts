import type { MenuProps } from "@mui/material/Menu";
import type { SxProps, Theme } from "@mui/material/styles";

/** Mirrors MUI outlined InputLabel + notch gap to the logical start (visual right under RTL layout). */
const mirrorOutlinedInputLabel: SxProps<Theme> = {
  "& label.MuiInputLabel-root": {
    left: "auto",
    right: 14,
    transformOrigin: "top right",
  },
  "& label.MuiInputLabel-root:not(.MuiInputLabel-shrink)": {
    transform: "translate(0, 16px) scale(1)",
  },
  "& label.MuiInputLabel-root.MuiInputLabel-shrink": {
    transform: "translate(0, -9px) scale(0.75)",
  },
};

export const rtlOutlinedTextFieldSx: SxProps<Theme> = {
  direction: "rtl",
  "& .MuiOutlinedInput-input": { textAlign: "right" },
  "& .MuiOutlinedInput-notchedOutline": { textAlign: "right" },
  ...mirrorOutlinedInputLabel,
};

export const rtlOutlinedTextFieldHtmlInputProps = {
  dir: "rtl" as const,
  style: { textAlign: "right" as const },
};

/** `FormControl` wrapping an outlined `Select` (label is sibling of `OutlinedInput`). */
export const rtlOutlinedFormControlSx: SxProps<Theme> = {
  direction: "rtl",
  "& .MuiOutlinedInput-notchedOutline": { textAlign: "right" },
  /* MUI draws the caret on inline-end + extra padding there; anchor icon on inline-end (visual left under RTL dir). */
  "& .MuiOutlinedInput-root": {
    "& .MuiOutlinedInput-input.MuiSelect-select": {
      textAlign: "right",
      paddingInlineStart: 14,
      paddingInlineEnd: 32,
    },
    "& .MuiSelect-icon": {
      left: 7,
      right: "auto",
    },
  },
  ...mirrorOutlinedInputLabel,
};

export const rtlSelectInputProps = {
  dir: "rtl" as const,
  style: { textAlign: "right" as const },
};

export const rtlSelectMenuPaperSx: SxProps<Theme> = {
  direction: "rtl",
  textAlign: "right",
};

export const rtlSelectMenuProps: Partial<MenuProps> = {
  slotProps: { paper: { sx: rtlSelectMenuPaperSx } },
};
