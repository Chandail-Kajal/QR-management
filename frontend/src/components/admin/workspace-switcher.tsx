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
      <SelectTrigger
        className="w-55 !bg-white !border-[#E2E8F0] !text-[#1E293B] rounded-xl hover:!bg-[#F8FAFC] hover:!border-[#3B82F6]/40 focus:!ring-1 focus:!ring-[#3B82F6]/50 focus:!border-[#3B82F6]/50 transition-all duration-200 [&_svg]:!text-[#94A3B8]"
      >
        <SelectValue placeholder="Select workspace" />
      </SelectTrigger>

      <SelectContent className="!bg-white !border-[#E2E8F0] !text-[#334155] rounded-xl shadow-xl shadow-black/10">
        {workspaces.map((workspace) => (
          <SelectItem
            key={workspace.id}
            value={String(workspace.id)}
            className="!text-[#334155] focus:!bg-[#3B82F6]/10 focus:!text-[#1E293B] data-[state=checked]:!text-[#3B82F6] data-[state=checked]:font-medium rounded-lg cursor-pointer"
          >
            {workspace.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
