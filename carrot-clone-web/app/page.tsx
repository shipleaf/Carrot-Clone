"use client";

import { useKakaoMap } from "@/hooks/useKakaoMap";
import MapSkeleton from "@/components/map-skeleton";
import MapErrorModal from "@/components/map-error-modal";

export default function Home() {
  const { mapRef, status } = useKakaoMap();

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#f2f3f5]">
      <div ref={mapRef} className="h-full w-full" aria-label="Kakao map" />

      {(status === "loading" || status === "error") && <MapSkeleton />}

      {status === "error" && <MapErrorModal />}
    </main>
  );
}
