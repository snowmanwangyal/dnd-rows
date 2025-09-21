/**
 * Utility functions for the dashboard grid system
 */

export interface GridPosition {
  rowId: string;
  position: number;
  span: number;
}

/**
 * Calculate if a position is valid for a given span
 * @param position - Starting column position (0-11)
 * @param span - Number of columns to span (1-12)
 * @returns true if the position and span fit within the 12-column grid
 */
export const isValidPosition = (position: number, span: number): boolean => {
  return position >= 0 && position + span <= 12 && span > 0 && span <= 12;
};

/**
 * Get all available positions for a given span
 * @param span - Number of columns to span
 * @returns Array of valid starting positions
 */
export const getAvailablePositions = (span: number): number[] => {
  const positions: number[] = [];
  for (let i = 0; i <= 12 - span; i++) {
    positions.push(i);
  }
  return positions;
};

/**
 * Check if two grid positions overlap
 * @param pos1 - First position
 * @param pos2 - Second position
 * @returns true if positions overlap
 */
export const positionsOverlap = (pos1: GridPosition, pos2: GridPosition): boolean => {
  if (pos1.rowId !== pos2.rowId) return false;
  
  const pos1End = pos1.position + pos1.span;
  const pos2End = pos2.position + pos2.span;
  
  return !(pos1End <= pos2.position || pos2End <= pos1.position);
};

/**
 * Find the next available position for a given span
 * @param occupiedPositions - Array of occupied positions
 * @param span - Number of columns to span
 * @returns Next available position, or -1 if none found
 */
export const findNextAvailablePosition = (
  occupiedPositions: GridPosition[],
  span: number
): number => {
  for (let position = 0; position <= 12 - span; position++) {
    const testPosition: GridPosition = {
      rowId: '', // Will be set by caller
      position,
      span,
    };
    
    const hasOverlap = occupiedPositions.some(occupied => 
      positionsOverlap(testPosition, occupied)
    );
    
    if (!hasOverlap) {
      return position;
    }
  }
  
  return -1;
};

/**
 * Calculate the CSS flex value for a given span
 * @param span - Number of columns to span
 * @returns CSS flex value
 */
export const getFlexValue = (span: number): string => {
  const percentage = (span / 12) * 100;
  return `0 0 calc(${percentage}% - 8px)`;
};

/**
 * Generate a unique ID for grid items
 * @param prefix - Optional prefix for the ID
 * @returns Unique ID string
 */
export const generateGridId = (prefix: string = 'item'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};