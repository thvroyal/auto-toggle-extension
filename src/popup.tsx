import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "./components/ui/button";
import "./styles.css";

interface Extension {
  id: string;
  name: string;
  enabled: boolean;
}

const Popup = () => {
  const [extensions, setExtensions] = useState<Extension[]>([]);

  useEffect(() => {
    chrome.management.getAll((result) => {
      const filteredExtensions = result
        .filter((ext) => ext.type === "extension" && ext.id !== chrome.runtime.id)
        .map((ext) => ({
          id: ext.id,
          name: ext.name,
          enabled: ext.enabled,
        }));
      setExtensions(filteredExtensions);
    });
  }, []);

  const toggleExtension = (id: string, enabled: boolean) => {
    chrome.management.setEnabled(id, !enabled, () => {
      setExtensions((prevExtensions) =>
        prevExtensions.map((ext) =>
          ext.id === id ? { ...ext, enabled: !enabled } : ext
        )
      );
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-w-[400px] max-h-[600px] overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Installed Extensions</h1>
      <ul className="space-y-3">
        {extensions.map((ext) => (
          <li
            key={ext.id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
          >
            <span className="font-medium">{ext.name}</span>
            <Button
              onClick={() => toggleExtension(ext.id, ext.enabled)}
              variant={ext.enabled ? "destructive" : "default"}
              size="sm"
            >
              {ext.enabled ? "Disable" : "Enable"}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
