import { getAllItems, getItem, removeItem, setItem } from "../db";
import { Environment, EnvironmentItem } from "../models.type";
import { v4 as ID } from "uuid";

export const getAllEnvsHandler = async () => {
  const allEnvs = await getAllItems<Environment>("env");
  return allEnvs;
};

export const addEnvHandler = async (newEnv: Environment) => {
  await setItem<Environment>("env", newEnv.id, newEnv);
  return newEnv;
};

export const removeEnvHandler = async (envId: string) => await removeItem("env", envId);

export const renameEnvHandler = async (envId: string, newName: string) => {
  const thisEnv = await getItem<Environment>("env", envId);
  if (!thisEnv) return;
  thisEnv.name = newName;
  thisEnv.modifiedAt = new Date().toISOString();
  await setItem<Environment>("env", envId, thisEnv);
  return thisEnv;
};

export const updateEnvItemsHandler = async (envs: EnvironmentItem[], envId: string) => {
  const thisEnv = await getItem<Environment>("env", envId);
  if (!thisEnv) return;
  thisEnv.items = envs;
  await setItem<Environment>("env", envId, thisEnv);
  return thisEnv;
};

export const addNewEnvItemHandler = async (envId: string) => {
  const thisEnv = await getItem<Environment>("env", envId);
  if (!thisEnv) return;

  const newRow: EnvironmentItem = {
    value: "",
    variable: "",
    id: ID(),
    selected: true,
  };
  thisEnv.items = [...thisEnv.items, newRow];
  await setItem<Environment>("env", envId, thisEnv);
  return { updatedEnv: thisEnv, newEnv: newRow };
};

export const removeEnvItemHandler = async (id: string, envId: string) => {
  const thisEnv = await getItem<Environment>("env", envId);
  if (!thisEnv) return;

  const envItemsAfterDelete = thisEnv.items.filter((e) => e.id !== id);
  thisEnv.items = envItemsAfterDelete;
  await setItem<Environment>("env", envId, thisEnv);

  return thisEnv;
};
