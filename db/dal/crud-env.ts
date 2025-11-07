import { getAllItems, removeItem, setItem } from "../db";
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
