import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Edit2, MoreVertical, Trash, Plus } from "lucide-react";
import ExtensionCard from "./ExtensionCard";
import { Group, Extension } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface GroupCardProps {
  group: Group;
  extensions: Extension[];
  onRename: (group: Group) => void;
  onDelete: (group: Group) => void;
  onToggleGroup: (groupId: string, enabled: boolean) => void;
  onToggleExtension: (id: string) => void;
  getExtensionIcon: (extension: Extension) => string | undefined;
  onAddExtension: (group: Group) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  extensions,
  onRename,
  onDelete,
  onToggleGroup,
  onToggleExtension,
  getExtensionIcon,
  onAddExtension,
}) => {
  const menuItems = [
    {
      icon: Plus,
      label: "Add Extension",
      onClick: () => onAddExtension(group),
    },
    { icon: Edit2, label: "Rename", onClick: () => onRename(group) },
    {
      icon: Trash,
      label: "Delete",
      onClick: () => onDelete(group),
      className: "text-red-500 hover:!text-red-500",
    },
  ];

  return (
    <Card key={group.id} className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-lg font-semibold">{group.name}</CardTitle>
          {group.id !== "all" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {menuItems.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={item.onClick}
                    className={item.className}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <Switch
          className="mr-4"
          checked={group.extensionIds.some(
            (id) => extensions.find((ext) => ext.id === id)?.enabled
          )}
          onCheckedChange={(checked) => onToggleGroup(group.id, checked)}
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-x-2 gap-y-4">
          {group.extensionIds.length > 0 ? (
            group.extensionIds.map((extId) => {
              const ext = extensions.find((e) => e.id === extId);
              if (!ext) return null;
              return (
                <ExtensionCard
                  key={ext.id}
                  id={ext.id}
                  name={ext.name}
                  enabled={ext.enabled}
                  icon={getExtensionIcon(ext)}
                  onToggle={onToggleExtension}
                />
              );
            })
          ) : (
            <div
              className="col-span-5 p-4 border border-dashed bg-gray-50 rounded-lg text-gray-500 text-center"
              onClick={() => onAddExtension(group)}
            >
              Click to add extensions
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupCard;
