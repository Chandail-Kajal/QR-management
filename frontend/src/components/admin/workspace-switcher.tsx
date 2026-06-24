"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuthStore } from "@/stores/auth.store";

export function WorkspaceSwitcher() {
  const { workspaces, selectedWorkspaceId, setWorkspace } = useAuthStore();

  return (
    <Select
      value={String(selectedWorkspaceId)}
      onValueChange={(value) => setWorkspace(Number(value))}
    >
      <SelectTrigger className="w-55">
        <SelectValue placeholder="Select workspace" />
      </SelectTrigger>

      <SelectContent>
        {workspaces.map((workspace) => (
          <SelectItem key={workspace.id} value={String(workspace.id)}>
            {workspace.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
