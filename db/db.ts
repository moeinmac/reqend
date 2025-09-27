import localForage from "localforage";
import { StorageName } from "./models.type";

const collectionStorage = localForage.createInstance({
  name: "reqend",
  storeName: "collection",
  driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE],
});

const requestStorage = localForage.createInstance({
  name: "reqend",
  storeName: "request",
  driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE],
});

const storage = (storageName: StorageName) => (storageName === "collection" ? collectionStorage : requestStorage);

export const getItem = async <T>(storageName: StorageName, key: string): Promise<T | null> => {
  try {
    return await storage(storageName).getItem<T>(key);
  } catch (err) {
    console.error("Storage get error:", err);
    return null;
  }
};

export const setItem = async <T>(storageName: StorageName, key: string, value: T): Promise<void> => {
  try {
    await storage(storageName).setItem(key, value);
  } catch (err) {
    console.error("Storage set error:", err);
  }
};

export const removeItem = async (storageName: StorageName, key: string): Promise<void> => {
  try {
    await storage(storageName).removeItem(key);
  } catch (err) {
    console.error("Storage remove error:", err);
  }
};

export const clear = async (storageName: StorageName): Promise<void> => {
  try {
    await storage(storageName).clear();
  } catch (err) {
    console.error("Storage clear error:", err);
  }
};
