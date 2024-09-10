import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface NewGroupFormProps {
  onAddGroup: (name: string) => void;
}

const NewGroupForm: React.FC<NewGroupFormProps> = ({ onAddGroup }) => {
  const [newGroupName, setNewGroupName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim() !== "") {
      onAddGroup(newGroupName.trim());
      setNewGroupName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex">
      <Input
        type="text"
        value={newGroupName}
        onChange={(e) => setNewGroupName(e.target.value)}
        placeholder="New group name"
        className="mr-2"
      />
      <Button type="submit">Add Group</Button>
    </form>
  );
};

export default NewGroupForm;