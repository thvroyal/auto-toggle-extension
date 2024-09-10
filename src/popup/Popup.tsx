import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import GroupCard from "../components/GroupCard";
import NewGroupForm from "../components/NewGroupForm";
import { useExtensions } from "../hooks/useExtensions";
import { useGroups } from "../hooks/useGroups";
import { getExtensionIcon } from "../utils/chromeUtils";
import { Group } from "../types";

const Popup: React.FC = () => {
  const { extensions, handleToggleExtension } = useExtensions();
  const { groups, updateGroups } = useGroups(extensions);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"rename" | "delete">("rename");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [newGroupName, setNewGroupName] = useState("");

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

  const handleRename = () => {
    if (selectedGroup && newGroupName.trim() !== "") {
      const updatedGroups = groups.map((group) =>
        group.id === selectedGroup.id ? { ...group, name: newGroupName.trim() } : group
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
    const group = groups.find(g => g.id === groupId);
    if (group) {
      group.extensionIds.forEach(id => handleToggleExtension(id));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-w-[400px] max-h-[600px] overflow-y-auto">
      <NewGroupForm onAddGroup={handleAddGroup} />
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          extensions={extensions}
          onRename={openRenameDialog}
          onDelete={openDeleteDialog}
          onToggleGroup={toggleGroup}
          onToggleExtension={handleToggleExtension}
          getExtensionIcon={getExtensionIcon}
        />
      ))}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "rename" ? "Rename Group" : "Delete Group"}
            </DialogTitle>
          </DialogHeader>
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
          ) : (
            <>
              <p>Are you sure you want to delete this group?</p>
              <DialogFooter>
                <Button onClick={handleDelete} variant="destructive">
                  Delete
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