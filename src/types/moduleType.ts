export const ModuleType = {
  PRODUCT: "product",
  USER: "user",
} as const;

export type ModuleType = (typeof ModuleType)[keyof typeof ModuleType];
