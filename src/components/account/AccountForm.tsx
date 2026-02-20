"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AccountFormProps {
  userId: string;
  currentName: string;
  email: string;
}

export function AccountForm({ userId: _userId, currentName, email }: AccountFormProps) {
  const [name, setName] = useState(currentName);
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError("Display name is required");
      return;
    }
    if (trimmed.length > 60) {
      setNameError("Display name must be under 60 characters");
      return;
    }
    setNameError("");
    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? "Failed to save");
      }
      toast.success("Settings saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div>
        <Label htmlFor="name">Display Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 60))}
          maxLength={60}
          disabled={saving}
          className="mt-1"
        />
        {nameError && <p className="text-sm text-red-500 mt-1">{nameError}</p>}
        <p className="text-xs text-muted-foreground mt-1">
          This is how your name appears on your reviews.
        </p>
      </div>

      <div>
        <Label>Email</Label>
        <p className="text-sm text-muted-foreground mt-1">{email}</p>
        <p className="text-xs text-muted-foreground">Managed by Google &middot; Can&apos;t be changed here</p>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
