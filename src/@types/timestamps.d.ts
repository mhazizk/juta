/*
 * interface for timestamps
 * @interface ITimestamps
 * @property {number} created_at - timestamp in milliseconds
 * @property {string} created_by - user id
 * @property {number} updated_at - timestamp in milliseconds
 * @property {string} updated_by - user id
 *
 */

export interface ITimestamps {
  created_at: number;
  created_by: string | number[];
  updated_at: number;
  updated_by: string | number[];
}
