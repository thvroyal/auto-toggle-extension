import { Extension } from "../types";

export const getExtensions = (): Promise<Extension[]> => {
  return new Promise((resolve) => {
    chrome.management.getAll((result) => {
      const filteredExtensions = result.filter(
        (ext) => ext.type === "extension" && ext.id !== chrome.runtime.id
      );
      resolve(filteredExtensions);
    });
  });
};

export const toggleExtension = (
  id: string,
  enabled: boolean,
  callback: () => void
) => {
  chrome.management.setEnabled(id, enabled, callback);
};

export const getExtensionIcon = (extension: Extension) => {
  return extension.icons && extension.icons.length > 0
    ? extension.icons[extension.icons.length - 1].url
    : undefined;
};