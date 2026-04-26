"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Store {
  id: number;
  name: string;
  category: string;
}

interface TrendingItem {
  slug: string;
  name: string;
  emoji: string;
}

export default function UpdateStockPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<number | "">("");
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/stores?swLat=35.1&swLng=126.7&neLat=35.3&neLng=126.9")
      .then((r) => r.json())
      .then((data: Store[]) => setStores(data.filter((s) => s.category === "카페")));

    fetch("/api/trending-items")
      .then((r) => r.json())
      .then((data: TrendingItem[]) => {
        setTrendingItems(data);
        if (data[0]) setSelectedSlug(data[0].slug);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedStoreId === "" || !selectedSlug || quantity === "") return;
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 0) {
      setResult({ ok: false, message: "수량은 0 이상의 숫자를 입력해주세요." });
      return;
    }

    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch(`/api/stores/${selectedStoreId}/inventory`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: selectedSlug, quantity: qty, note: note || undefined }),
      });

      if (res.ok) {
        setResult({ ok: true, message: `재고가 ${qty}개로 업데이트되었습니다.` });
        setQuantity("");
        setNote("");
      } else {
        const err = (await res.json()) as { error?: string };
        setResult({ ok: false, message: err.error ?? "업데이트 실패" });
      }
    } catch {
      setResult({ ok: false, message: "네트워크 오류가 발생했습니다." });
    } finally {
      setSubmitting(false);
    }
  }

  const selectedItem = trendingItems.find((t) => t.slug === selectedSlug);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "32px 28px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <Image src="/assets/dubai_cookie.png" alt="두바이쫀득쿠키" width={36} height={36} />
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#212124", margin: 0 }}>
              재고 업데이트
            </h1>
            <p style={{ fontSize: 12, color: "#8B95A1", margin: 0 }}>사장님 전용</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>트렌딩 아이템</label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              style={inputStyle}
              required
            >
              {trendingItems.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.emoji} {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>매장 선택</label>
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value === "" ? "" : Number(e.target.value))}
              style={inputStyle}
              required
            >
              <option value="">매장을 선택해주세요</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>
              남은 수량{" "}
              {selectedItem && (
                <span style={{ color: "#8B95A1", fontWeight: 400 }}>
                  ({selectedItem.emoji} {selectedItem.name})
                </span>
              )}
            </label>
            <input
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>메모 (선택)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="예: 오후 3시 재입고 예정"
              style={inputStyle}
              maxLength={80}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 4,
              padding: "13px 0",
              background: submitting ? "#ccc" : "#FF6F0F",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "업데이트 중..." : "재고 업데이트"}
          </button>
        </form>

        {result && (
          <p
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: result.ok ? "#e6f7ee" : "#fff1f0",
              color: result.ok ? "#1a7f4f" : "#c0392b",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {result.ok ? "✓ " : "✗ "}
            {result.message}
          </p>
        )}
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#3d3d3d",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1.5px solid #e0e0e0",
  borderRadius: 8,
  fontSize: 14,
  color: "#212124",
  background: "#fafafa",
  outline: "none",
  boxSizing: "border-box",
};
