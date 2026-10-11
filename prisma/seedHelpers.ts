import { NamedModel, NamedSeedData } from "./seedTypes";

export const supportsColor = Boolean(
  process.stdout.isTTY && !process.env.NO_COLOR,
);

export const color = (code: number, text: string) =>
  supportsColor ? `\x1b[${code}m${text}\x1b[0m` : text;

export const seedData = async <T extends NamedSeedData>({
  data,
  model,
}: {
  data: readonly T[];
  model: NamedModel<T>;
}) => {
  let created = 0;
  let alreadyExisted = 0;

  for (const item of data) {
    const existed = await model.findUnique({
      where: { name: item.name },
    });

    await model.upsert({
      where: { name: item.name },
      update: {},
      create: item,
    });

    if (existed) alreadyExisted++;
    else created++;
  }

  console.log(
    `   ${color(32, `➕ ${created} created`)} · ${color(
      33,
      `↩️ ${alreadyExisted} already existed`,
    )}`,
  );
};

export const runSeedStep = async (
  title: string,
  action: () => Promise<void>,
) => {
  const startedAt = Date.now();
  console.log(
    `\n${color(36, "⏳")} ${color(1, title)} ${color(90, "— starting")}`,
  );

  try {
    await action();
    const seconds = ((Date.now() - startedAt) / 1000).toFixed(2);
    console.log(
      `${color(32, "✅")} ${title} ${color(90, `— done in ${seconds}s`)}`,
    );
  } catch (error) {
    const seconds = ((Date.now() - startedAt) / 1000).toFixed(2);
    console.error(
      `${color(31, "❌")} ${title} ${color(90, `— failed after ${seconds}s`)}`,
    );
    throw error;
  }
};
