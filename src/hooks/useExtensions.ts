import { useState, useEffect } from "react";
import { Extension } from "../types";
import { getExtensions, toggleExtension } from "../utils/chromeUtils";

export const useExtensions = () => {
  const [extensions, setExtensions] = useState<Extension[]>([]);

  useEffect(() => {
    const loadExtensions = async () => {
      const loadedExtensions = await getExtensions();
      setExtensions(loadedExtensions);
    };

    loadExtensions();
  }, []);
  
  const handleToggleExtension = (id: string) => {
    const extension = extensions.find(ext => ext.id === id);
    if (!extension) return;

    const newEnabled = !extension.enabled;
    
    toggleExtension(id, newEnabled, () => {
      setExtensions((prevExtensions) =>
        prevExtensions.map((ext) =>
          ext.id === id ? { ...ext, enabled: newEnabled } : ext
        )
      );
    });
  };

  return { extensions, setExtensions, handleToggleExtension };
};