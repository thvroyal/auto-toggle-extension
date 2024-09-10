import { useState, useEffect } from "react";
import { Group } from "../types";
import { ChromeStorageManager } from "../lib/ChromeStorageManager";

export const useGroups = (extensions: chrome.management.ExtensionInfo[]) => {
  const [groups, setGroups] = useState<Group[]>([
    { id: "all", name: "All", extensionIds: [] },
  ]);

  useEffect(() => {
    const loadGroups = async () => {
      const savedGroups = await ChromeStorageManager.get<Group[]>("groups");
      if (savedGroups) {
        setGroups(savedGroups);
      } else {
        setGroups([
          {
            id: "all",
            name: "All",
            extensionIds: extensions.map((ext) => ext.id),
          },
        ]);
      }
    };

    loadGroups();
  }, [extensions]);

  const updateGroups = async (newGroups: Group[]) => {
    setGroups(newGroups);
    await ChromeStorageManager.set("groups", newGroups);
  };

  return { groups, setGroups, updateGroups };
};