import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AccountForm } from "@/components/account/AccountForm";
import { DangerZone } from "@/components/account/DangerZone";

export const metadata: Metadata = {
  title: "Account Settings | ReviewWorld",
  robots: { index: false },
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/account");
  }

  const reviewCount = await prisma.review.count({
    where: { userId: session.user.id },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Account</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      {/* Profile Section */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        <Separator className="mb-6" />

        <div className="flex flex-col gap-6">
          {/* Avatar */}
          <div className="flex flex-col gap-1">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "User avatar"}
                width={80}
                height={80}
                className="rounded-full ring-2 ring-border"
                unoptimized
              />
            )}
            <p className="text-xs text-muted-foreground mt-1">Photo synced from Google</p>
          </div>

          <AccountForm
            userId={session.user.id}
            currentName={session.user.name ?? ""}
            email={session.user.email ?? ""}
          />
        </div>
      </Card>

      {/* Account Actions Section */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Account Actions</h2>
        <Separator className="mb-6" />

        <DangerZone reviewCount={reviewCount} />
      </Card>
    </div>
  );
}
