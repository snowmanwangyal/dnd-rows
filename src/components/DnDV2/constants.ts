// Maximum items allowed per row
export const MAX_ITEMS_PER_ROW = 4;

// Indicator sizing
export const INDICATOR_WIDTH_PX = 12; // Width of each vertical indicator in pixels
export const INDICATOR_MIN_WIDTH_PX = 8; // Minimum width for indicators
export const INDICATOR_MAX_WIDTH_PX = 24; // Maximum width for indicators

// Minimum item width as percentage of available space (excluding indicators)
export const MIN_ITEM_WIDTH_PERCENTAGE = 20; // 20% minimum width per item

// Drop zone prefixes for vertical indicators
export const VERTICAL_INDICATOR_LEFT_PREFIX = "v-indicator-left-";
export const VERTICAL_INDICATOR_RIGHT_PREFIX = "v-indicator-right-";

// Drop zone prefixes for horizontal indicators
export const HORIZONTAL_INDICATOR_ABOVE_PREFIX = "h-indicator-above-";
export const HORIZONTAL_INDICATOR_BELOW_PREFIX = "h-indicator-below-";

// Utility functions for generating indicator IDs
export const createLeftIndicatorId = (rowId: string, itemIndex: number): string => 
  `${VERTICAL_INDICATOR_LEFT_PREFIX}${rowId}-${itemIndex}`;

export const createRightIndicatorId = (rowId: string, itemIndex: number): string => 
  `${VERTICAL_INDICATOR_RIGHT_PREFIX}${rowId}-${itemIndex}`;

export const createHorizontalAboveIndicatorId = (rowId: string): string => 
  `${HORIZONTAL_INDICATOR_ABOVE_PREFIX}${rowId}`;

export const createHorizontalBelowIndicatorId = (rowId: string): string => 
  `${HORIZONTAL_INDICATOR_BELOW_PREFIX}${rowId}`;

// Utility functions for parsing indicator IDs
export const parseIndicatorId = (id: string) => {
  if (id.startsWith(VERTICAL_INDICATOR_LEFT_PREFIX)) {
    const parts = id.replace(VERTICAL_INDICATOR_LEFT_PREFIX, '').split('-');
    return {
      type: 'vertical' as const,
      position: 'left' as const,
      rowId: parts[0],
      itemIndex: parseInt(parts[1], 10)
    };
  }
  
  if (id.startsWith(VERTICAL_INDICATOR_RIGHT_PREFIX)) {
    const parts = id.replace(VERTICAL_INDICATOR_RIGHT_PREFIX, '').split('-');
    return {
      type: 'vertical' as const,
      position: 'right' as const,
      rowId: parts[0],
      itemIndex: parseInt(parts[1], 10)
    };
  }
  
  if (id.startsWith(HORIZONTAL_INDICATOR_ABOVE_PREFIX)) {
    const rowId = id.replace(HORIZONTAL_INDICATOR_ABOVE_PREFIX, '');
    return {
      type: 'horizontal' as const,
      position: 'above' as const,
      rowId
    };
  }
  
  if (id.startsWith(HORIZONTAL_INDICATOR_BELOW_PREFIX)) {
    const rowId = id.replace(HORIZONTAL_INDICATOR_BELOW_PREFIX, '');
    return {
      type: 'horizontal' as const,
      position: 'below' as const,
      rowId
    };
  }
  
  return null;
};

export const isVerticalIndicator = (id: string): boolean => 
  id.startsWith(VERTICAL_INDICATOR_LEFT_PREFIX) || id.startsWith(VERTICAL_INDICATOR_RIGHT_PREFIX);

export const isHorizontalIndicator = (id: string): boolean => 
  id.startsWith(HORIZONTAL_INDICATOR_ABOVE_PREFIX) || id.startsWith(HORIZONTAL_INDICATOR_BELOW_PREFIX);

export const isIndicator = (id: string): boolean => 
  isVerticalIndicator(id) || isHorizontalIndicator(id);