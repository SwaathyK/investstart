'use client'

import { AvatarBuilder } from "@/components/avatar/AvatarBuilder";
import Navigation from "@/components/Navigation";

export default function ProfileAvatarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <Navigation />
      <AvatarBuilder />
    </div>
  );
}
