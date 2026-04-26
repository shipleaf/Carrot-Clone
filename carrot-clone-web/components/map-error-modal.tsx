type Props = {
  onConfirm?: () => void;
};

export default function MapErrorModal({ onConfirm }: Props) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
      return;
    }
    window.ReactNativeWebView?.postMessage("close");
    window.close();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative w-full max-w-[320px] rounded-xl bg-white px-5 pb-5 pt-6 shadow-lg">
        <h2 className="mb-2 text-center text-[17px] font-semibold leading-snug text-[#333D4B]">
          지도를 불러올 수 없습니다
        </h2>
        <p className="mb-6 text-center text-[14px] leading-relaxed text-[#6B7684]">
          지도 레이아웃을 불러오는 중{"\n"}오류가 발생했습니다.
        </p>

        <button
          onClick={handleConfirm}
          className="w-full rounded-lg bg-[#FF6F0F] py-3 text-[15px] font-semibold text-white active:opacity-80"
        >
          확인
        </button>
      </div>
    </div>
  );
}
