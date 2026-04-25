// 지도 스켈레톤 UI

export default function MapSkeleton() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#e8eaed]">
      <div className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent via-white/40 to-transparent bg-size-[200%_100%]" />

      <div className="absolute inset-0 opacity-30">

        <div className="absolute left-0 right-0 top-[30%] h-3 rounded bg-[#d0d3d8]" />
        <div className="absolute left-0 right-0 top-[55%] h-5 rounded bg-[#d0d3d8]" />
        <div className="absolute left-0 right-0 top-[75%] h-2 rounded bg-[#d0d3d8]" />

        <div className="absolute bottom-0 left-[25%] top-0 w-3 rounded bg-[#d0d3d8]" />
        <div className="absolute bottom-0 left-[60%] top-0 w-5 rounded bg-[#d0d3d8]" />
        <div className="absolute bottom-0 left-[80%] top-0 w-2 rounded bg-[#d0d3d8]" />
      </div>

      <div className="absolute left-[5%] top-[5%] h-[22%] w-[17%] rounded-lg bg-[#dddfe3]" />
      <div className="absolute left-[28%] top-[5%] h-[18%] w-[28%] rounded-lg bg-[#dddfe3]" />
      <div className="absolute right-[5%] top-[5%] h-[20%] w-[14%] rounded-lg bg-[#dddfe3]" />

      <div className="absolute left-[5%] top-[35%] h-[16%] w-[16%] rounded-lg bg-[#dddfe3]" />
      <div className="absolute left-[28%] top-[38%] h-[12%] w-[26%] rounded-lg bg-[#dddfe3]" />
      <div className="absolute right-[5%] top-[33%] h-[18%] w-[18%] rounded-lg bg-[#dddfe3]" />

      <div className="absolute left-[5%] top-[62%] h-[20%] w-[14%] rounded-lg bg-[#dddfe3]" />
      <div className="absolute left-[28%] top-[63%] h-[16%] w-[28%] rounded-lg bg-[#dddfe3]" />
      <div className="absolute right-[5%] top-[60%] h-[22%] w-[16%] rounded-lg bg-[#dddfe3]" />

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
        <div className="h-8 w-6 rounded-t-full rounded-br-full bg-[#c8cad0]" />
        <div className="mx-auto mt-0.5 h-1.5 w-1.5 rounded-full bg-[#c8cad0] opacity-50" />
      </div>
    </div>
  );
}
