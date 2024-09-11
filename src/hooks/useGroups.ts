import { useEffect, useState } from "react";
import { ChromeStorageManager } from "../lib/ChromeStorageManager";
import { Group } from "../types";

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
    const allGroup = newGroups.find(group => group.id === "all");
    if (allGroup) {
      const extensionsInOtherGroups = new Set(
        newGroups
          .filter(group => group.id !== "all")
          .flatMap(group => group.extensionIds)
      );
      allGroup.extensionIds = extensions.filter(
        ext => !extensionsInOtherGroups.has(ext.id)
      ).map(ext => ext.id);
    }

    setGroups(newGroups);
    await ChromeStorageManager.set("groups", newGroups);
  };

  return { groups, setGroups, updateGroups };
};