export type NamedSeedData = { name: string };
export type NamedModel<T extends NamedSeedData> = {
  findUnique(args: { where: { name: string } }): Promise<unknown | null>;
  upsert(args: {
    where: { name: string };
    update: {};
    create: T;
  }): Promise<unknown>;
};
