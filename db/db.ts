import localForage from "localforage";
import { StorageName } from "./models.type";

type StorageMap = Record<StorageName, LocalForage>;

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

const activeRequestStorage = localForage.createInstance({
  name: "reqend",
  storeName: "activeReq",
  driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE],
});

const envStorage = localForage.createInstance({
  name: "reqend",
  storeName: "env",
  driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE],
});

const storageMap: StorageMap = {
  activeReq: activeRequestStorage,
  collection: collectionStorage,
  env: envStorage,
  request: requestStorage,
};

const storage = (storageName: StorageName) => storageMap[storageName];

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

export const getAllItems = async <T>(storageName: StorageName) => {
  try {
    const items: T[] = [];
    await storage(storageName).iterate<T, void>((value) => {
      items.unshift(value);
    });
    return items;
  } catch (err) {
    console.error("Storage getAll error:", err);
  }
};
