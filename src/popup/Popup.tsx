import React, { useState } from "react";
import GroupCard from "../components/GroupCard";
import NewGroupForm from "../components/NewGroupForm";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { useExtensions } from "../hooks/useExtensions";
import { useGroups } from "../hooks/useGroups";
import { Group } from "../types";
import { getExtensionIcon } from "../utils/chromeUtils";

const Popup: React.FC = () => {
  const { extensions, handleToggleExtension } = useExtensions();
  const { groups, updateGroups } = useGroups(extensions);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"rename" | "delete" | "add">(
    "rename"
  );
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);

  const handleAddGroup = (name: string) => {
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name,
      extensionIds: [],
    };
    updateGroups([...groups, newGroup]);
  };

  const openRenameDialog = (group: Group) => {
    setSelectedGroup(group);
    setNewGroupName(group.name);
    setDialogType("rename");
    setDialogOpen(true);
  };

  const openDeleteDialog = (group: Group) => {
    setSelectedGroup(group);
    setDialogType("delete");
    setDialogOpen(true);
  };

  const openAddExtensionDialog = (group: Group) => {
    setSelectedGroup(group);
    setSelectedExtensions(group.extensionIds);
    setDialogType("add");
    setDialogOpen(true);
  };

  const handleRename = () => {
    if (selectedGroup && newGroupName.trim() !== "") {
      const updatedGroups = groups.map((group) =>
        group.id === selectedGroup.id
          ? { ...group, name: newGroupName.trim() }
          : group
      );
      updateGroups(updatedGroups);
      setDialogOpen(false);
    }
  };

  const handleDelete = () => {
    if (selectedGroup && selectedGroup.id !== "all") {
      const allGroup = groups.find((group) => group.id === "all");
      if (!allGroup) {
        console.error("'All' group not found");
        return;
      }

      const updatedAllGroup = {
        ...allGroup,
        extensionIds: [
          ...new Set([...allGroup.extensionIds, ...selectedGroup.extensionIds]),
        ],
      };

      const updatedGroups = groups
        .filter((group) => group.id !== selectedGroup.id)
        .map((group) => (group.id === "all" ? updatedAllGroup : group));

      updateGroups(updatedGroups);
      setDialogOpen(false);
    }
  };

  const toggleGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (group) {
      group.extensionIds.forEach((id) => handleToggleExtension(id));
    }
  };

  const isExtensionInOtherGroups = (extId: string) => {
    return groups.some(
      (group) =>
        group.id !== "all" &&
        group.id !== selectedGroup?.id &&
        group.extensionIds.includes(extId)
    );
  };

  const handleCheckboxChange = (extId: string, checked: boolean) => {
    setSelectedExtensions((prev) =>
      checked ? [...prev, extId] : prev.filter((id) => id !== extId)
    );
  };

  const handleAddExtensions = () => {
    if (selectedGroup) {
      const updatedGroups = groups.map((group) => {
        if (group.id === selectedGroup.id) {
          return {
            ...group,
            extensionIds: [...selectedExtensions],
          };
        }
        return group;
      });
      updateGroups(updatedGroups);
      setDialogOpen(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-w-[400px] max-h-[600px] overflow-y-auto">
      <NewGroupForm onAddGroup={handleAddGroup} />
      {groups.map((group) => {
        if (group.id === "all" && group.extensionIds.length === 0) return null;
        return (
          <GroupCard
            key={group.id}
            group={group}
            extensions={extensions}
            onRename={openRenameDialog}
            onDelete={openDeleteDialog}
            onToggleGroup={toggleGroup}
            onToggleExtension={handleToggleExtension}
            getExtensionIcon={getExtensionIcon}
            onAddExtension={openAddExtensionDialog}
          />
        );
      })}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-sm rounded-lg"
          aria-describedby="dialog-description"
        >
          <DialogHeader>
            <DialogTitle>
              {dialogType === "rename"
                ? "Rename Group"
                : dialogType === "delete"
                ? "Delete Group"
                : "Add Extensions"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription hidden>
            {dialogType === "rename"
              ? "Rename the group to a new name."
              : dialogType === "delete"
              ? "Delete the group and all its extensions."
              : "Add extensions to the group."}
          </DialogDescription>
          {dialogType === "rename" ? (
            <>
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter new group name"
              />
              <DialogFooter>
                <Button onClick={handleRename}>Rename</Button>
              </DialogFooter>
            </>
          ) : dialogType === "delete" ? (
            <>
              <p>Are you sure you want to delete this group?</p>
              <DialogFooter>
                <Button onClick={handleDelete} variant="destructive">
                  Delete
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="max-h-[300px] overflow-y-auto px-2">
                {extensions.map((ext) => {
                  const isInOtherGroup = isExtensionInOtherGroups(ext.id);
                  if (isInOtherGroup) return null;
                  return (
                    <div
                      key={ext.id}
                      className="flex items-center space-x-2 py-2"
                    >
                      <Checkbox
                        id={ext.id}
                        checked={selectedExtensions.includes(ext.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(ext.id, checked as boolean)
                        }
                      />
                      <img
                        src={getExtensionIcon(ext)}
                        alt={ext.name}
                        className="w-4 h-4 mr-2"
                      />
                      <label htmlFor={ext.id} className="flex-grow">
                        {ext.name}
                      </label>
                    </div>
                  );
                })}
              </div>
              <DialogFooter>
                <Button onClick={handleAddExtensions}>
                  {selectedGroup?.id === "all"
                    ? "Update All Group"
                    : "Update Group"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Popup;
