#!/usr/bin/env bun

/**
 * MUI Component Converter
 *
 * This script converts individual MUI component imports to MUI.Component format.
 * It processes TypeScript/TSX files and replaces component tags with their MUI.Component equivalents.
 */

import logger from "@/lib/logger";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, extname } from "path";

// Define MUI components that should be converted
const MUI_COMPONENTS = [
  // Layout components
  "Box",
  "Container",
  "Grid",
  "Stack",
  "Paper",
  "Card",
  "CardContent",
  "CardActions",
  "CardHeader",

  // Navigation components
  "AppBar",
  "Toolbar",
  "Breadcrumbs",
  "Drawer",
  "Menu",
  "MenuItem",
  "Tabs",
  "Tab",
  "Stepper",
  "Step",
  "StepLabel",

  // Input components
  "Button",
  "IconButton",
  "TextField",
  "Input",
  "InputLabel",
  "FormControl",
  "Select",
  "Checkbox",
  "Radio",
  "RadioGroup",
  "FormControlLabel",
  "Switch",
  "Slider",
  "Rating",
  "Autocomplete",
  "Chip",
  "Badge",

  // Data display components
  "Table",
  "TableBody",
  "TableCell",
  "TableContainer",
  "TableHead",
  "TableRow",
  "TablePagination",
  "Avatar",
  "AvatarGroup",
  "List",
  "ListItem",
  "ListItemButton",
  "ListItemIcon",
  "ListItemText",
  "Divider",
  "Tooltip",
  "Typography",
  "Alert",
  "AlertTitle",
  "Chip",

  // Feedback components
  "Backdrop",
  "CircularProgress",
  "LinearProgress",
  "Skeleton",
  "Snackbar",
  "Alert",
  "AlertTitle",

  // Surface components
  "Dialog",
  "DialogTitle",
  "DialogContent",
  "DialogActions",
  "DialogContentText",
  "Modal",
  "Popover",
  "Popper",
  "ClickAwayListener",

  // Lab components (commonly used)
  "DatePicker",
  "TimePicker",
  "DateTimePicker",
  "LoadingButton",
  "Timeline",
  "TreeView",
  "TreeItem",

  // Other commonly used components
  "Accordion",
  "AccordionSummary",
  "AccordionDetails",
  "ExpansionPanel",
  "ExpansionPanelSummary",
  "ExpansionPanelDetails",
  "BottomNavigation",
  "BottomNavigationAction",
  "Fab",
  "SpeedDial",
  "SpeedDialAction",
  "SpeedDialIcon",
  "Pagination",
  "Tabs",
  "Tab",
  "Stepper",
  "Step",
  "StepLabel",
  "StepContent",
  "MobileStepper",
  "SwipeableDrawer",
  "Hidden",
  "NoSsr",
];

// Colors for logger output
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

interface ConversionStats {
  totalReplacements: number;
  componentsFound: Set<string>;
  hasMuiImport: boolean;
  hasIndividualImports: boolean;
}

class MUIComponentConverter {
  private filePath: string;
  private content: string = "";
  private stats: ConversionStats;

  constructor(filePath: string) {
    this.filePath = resolve(filePath);
    this.stats = {
      totalReplacements: 0,
      componentsFound: new Set(),
      hasMuiImport: false,
      hasIndividualImports: false,
    };
  }

  /**
   * Main conversion method
   */
  public convert(): void {
    this.loadFile();
    this.analyzeFile();
    this.performConversion();
    this.saveFile();
    this.printResults();
  }

  /**
   * Load file content
   */
  private loadFile(): void {
    if (!existsSync(this.filePath)) {
      this.logError(`File not found: ${this.filePath}`);
      process.exit(1);
    }

    const ext = extname(this.filePath);
    if (![".ts", ".tsx", ".js", ".jsx"].includes(ext)) {
      this.logError(
        `Unsupported file type: ${ext}. Only .ts, .tsx, .js, .jsx files are supported.`
      );
      process.exit(1);
    }

    try {
      this.content = readFileSync(this.filePath, "utf-8");
      this.logInfo(`Loaded file: ${this.filePath}`);
    } catch (error) {
      this.logError(`Failed to read file: ${error}`);
      process.exit(1);
    }
  }

  /**
   * Analyze the file to understand its current state
   */
  private analyzeFile(): void {
    // Check for MUI imports
    this.stats.hasMuiImport = this.content.includes(
      'import * as MUI from "@mui/material"'
    );
    this.stats.hasIndividualImports =
      /import\s*{[^}]*}\s*from\s*["']@mui\/material["']/.test(this.content);

    // Find which MUI components are used in the file
    for (const component of MUI_COMPONENTS) {
      const openingTagRegex = new RegExp(`<${component}\\b`, "g");
      const closingTagRegex = new RegExp(`</${component}>`, "g");

      if (
        openingTagRegex.test(this.content) ||
        closingTagRegex.test(this.content)
      ) {
        this.stats.componentsFound.add(component);
      }
    }

    this.logInfo(
      `Found ${this.stats.componentsFound.size} MUI components in use`
    );
    if (this.stats.componentsFound.size > 0) {
      this.logInfo(
        `Components: ${Array.from(this.stats.componentsFound).join(", ")}`
      );
    }
  }

  /**
   * Perform the actual conversion
   */
  private performConversion(): void {
    let convertedContent = this.content;

    // Convert opening tags
    for (const component of this.stats.componentsFound) {
      const openingRegex = new RegExp(`<${component}\\b`, "g");
      const matches = convertedContent.match(openingRegex);
      if (matches) {
        convertedContent = convertedContent.replace(
          openingRegex,
          `<MUI.${component}`
        );
        this.stats.totalReplacements += matches.length;
        this.logInfo(`Converted ${matches.length} opening <${component}> tags`);
      }
    }

    // Convert closing tags
    for (const component of this.stats.componentsFound) {
      const closingRegex = new RegExp(`</${component}>`, "g");
      const matches = convertedContent.match(closingRegex);
      if (matches) {
        convertedContent = convertedContent.replace(
          closingRegex,
          `</MUI.${component}>`
        );
        this.stats.totalReplacements += matches.length;
        this.logInfo(
          `Converted ${matches.length} closing </${component}> tags`
        );
      }
    }

    this.content = convertedContent;
  }

  /**
   * Save the converted content back to file
   */
  private saveFile(): void {
    try {
      writeFileSync(this.filePath, this.content, "utf-8");
      this.logSuccess(`File saved successfully: ${this.filePath}`);
    } catch (error) {
      this.logError(`Failed to save file: ${error}`);
      process.exit(1);
    }
  }

  /**
   * Print conversion results
   */
  private printResults(): void {
    logger.log("\n" + "=".repeat(50));
    logger.log(`${colors.bold}${colors.blue}Conversion Results${colors.reset}`);
    logger.log("=".repeat(50));

    logger.log(`${colors.cyan}File:${colors.reset} ${this.filePath}`);
    logger.log(
      `${colors.cyan}Total replacements:${colors.reset} ${colors.bold}${this.stats.totalReplacements}${colors.reset}`
    );
    logger.log(
      `${colors.cyan}Components converted:${colors.reset} ${this.stats.componentsFound.size}`
    );

    if (this.stats.componentsFound.size > 0) {
      logger.log(`${colors.cyan}Converted components:${colors.reset}`);
      Array.from(this.stats.componentsFound).forEach(component => {
        logger.log(
          `  - ${colors.green}${component}${colors.reset} → ${colors.green}MUI.${component}${colors.reset}`
        );
      });
    }

    if (this.stats.hasMuiImport) {
      logger.log(
        `${colors.yellow}Note:${colors.reset} File already has 'import * as MUI from "@mui/material"' - this is perfect!`
      );
    } else if (this.stats.hasIndividualImports) {
      logger.log(
        `${colors.yellow}Warning:${colors.reset} File has individual imports from @mui/material. Consider adding 'import * as MUI from "@mui/material"' for better organization.`
      );
    } else {
      logger.log(
        `${colors.yellow}Warning:${colors.reset} File doesn't import from @mui/material. Make sure to add the necessary imports.`
      );
    }

    logger.log("\n" + "=".repeat(50));

    if (this.stats.totalReplacements > 0) {
      logger.log(
        `${colors.bold}${colors.green}✅ Conversion completed successfully!${colors.reset}`
      );
    } else {
      logger.log(
        `${colors.bold}${colors.yellow}⚠️  No MUI components found to convert.${colors.reset}`
      );
    }
  }

  /**
   * Log info message
   */
  private logInfo(message: string): void {
    logger.log(`${colors.blue}ℹ${colors.reset} ${message}`);
  }

  /**
   * Log success message
   */
  private logSuccess(message: string): void {
    logger.log(`${colors.green}✅${colors.reset} ${message}`);
  }

  /**
   * Log error message
   */
  private logError(message: string): void {
    logger.error(`${colors.red}❌${colors.reset} ${message}`);
  }
}

/**
 * Main execution function
 */
function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    logger.error(
      `${colors.red}Error:${colors.reset} Please provide a file path as an argument.`
    );
    logger.log(
      `${colors.yellow}Usage:${colors.reset} bun run convert-mui-components.ts <file-path>`
    );
    process.exit(1);
  }

  const filePath = args[0];
  logger.log(
    `${colors.bold}${colors.blue}MUI Component Converter${colors.reset}`
  );
  logger.log(
    `${colors.bold}${colors.blue}======================${colors.reset}\n`
  );

  try {
    const converter = new MUIComponentConverter(filePath);
    converter.convert();
  } catch (error) {
    logger.error(`${colors.red}Error:${colors.reset} ${error}`);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.main) {
  main();
}
