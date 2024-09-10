export interface Extension extends chrome.management.ExtensionInfo {}

export interface Group {
  id: string;
  name: string;
  extensionIds: string[];
}