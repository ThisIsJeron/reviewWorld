"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DangerZoneProps {
  reviewCount: number;
}

export function DangerZone({ reviewCount }: DangerZoneProps) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function handleDelete() {
    if (confirmText.toUpperCase() !== "DELETE") return;
    setDeleting(true);
    try {
      const res = await fetch("/api/user", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? "Failed to delete account");
      }
      await signOut({ callbackUrl: "/?deleted=1" });
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Could not delete account. Please try again.");
      setShowDialog(false);
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-full sm:w-auto"
      >
        Sign Out
      </Button>

      <div>
        <p className="text-sm font-semibold text-red-600 mb-2">Danger Zone</p>
        <Separator className="bg-red-200 mb-4" />
        <p className="text-sm text-muted-foreground mb-4">
          Permanently delete your account and all reviews you&apos;ve written. This cannot be undone.
        </p>
        <Button
          variant="destructive"
          onClick={() => setShowDialog(true)}
          className="w-full sm:w-auto"
        >
          Delete Account
        </Button>
      </div>

      {deleteError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
          {deleteError}
        </p>
      )}

      <Dialog open={showDialog} onOpenChange={(open) => !deleting && setShowDialog(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be undone. The following will be deleted:
            </DialogDescription>
          </DialogHeader>

          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Your account and profile</li>
            <li>All {reviewCount} review{reviewCount === 1 ? "" : "s"} you&apos;ve written</li>
            <li>All reports you&apos;ve filed</li>
          </ul>

          <div>
            <Label htmlFor="confirm-delete">Type &ldquo;DELETE&rdquo; to confirm:</Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="mt-1"
              disabled={deleting}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={confirmText.toUpperCase() !== "DELETE" || deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete my account"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
