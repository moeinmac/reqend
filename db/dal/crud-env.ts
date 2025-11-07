import { getAllItems, getItem, removeItem, setItem } from "../db";
import { Environment } from "../models.type";

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
