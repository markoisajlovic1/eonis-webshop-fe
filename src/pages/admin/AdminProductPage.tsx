import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoTrashBinOutline, IoChevronBack } from "react-icons/io5";
import { LiaExchangeAltSolid } from "react-icons/lia";

const AdminProductPage = () => {
  const navigate = useNavigate();
  const [discountEnabled, setDiscountEnabled] = useState(false);

  return (
    <div className="p-4 flex flex-col gap-6">
      {/* Actions */}
      <div className="bg-white flex justify-between items-center p-4 rounded-md">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)}>
            <IoChevronBack />
          </button>
          <div>
            <h2 className="text-xl">Novi proizvod</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="border-red-500 bg-red-200 p-2 text-red-500 rounded-md cursor-pointer mr-4">
            <IoTrashBinOutline />
          </button>
          <button className="border py-1 px-3 rounded-md border-gray-400 cursor-pointer">Draft</button>
          <button className="bg-blue-500 text-white rounded-md py-1 px-3 cursor-pointer">Publish</button>
        </div>
      </div>

      {/* Product details */}
      <div className="flex gap-6 items-start">

        {/* Left: image + brand + cat/subcat */}
        <div className="flex flex-col gap-4 w-1/2 shrink-0">
          <div className="rounded-md overflow-hidden flex gap-3">
            <div className="w-1/2 bg-white rounded-md p-4 flex items-center justify-center text-sm text-gray-400">
              Glavna slika
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-3 flex-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-md flex items-center justify-center text-xs text-gray-300 h-20">
                  +
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white flex items-center p-4 gap-6">
            <div className="w-12 h-12 bg-neutral-100 p-2 rounded-full flex items-center justify-center text-xs text-gray-300">
              Logo
            </div>
            <div className="rounded-md flex justify-between gap-1 w-full">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Brend</span>
                <span className="text-sm text-neutral-400">—</span>
              </div>
              <LiaExchangeAltSolid />
            </div>
          </div>

          <div className="bg-white rounded-md p-4 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Kategorija</span>
              <span className="text-sm text-neutral-400">—</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Subkategorija</span>
              <span className="text-sm text-neutral-400">—</span>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white rounded-md p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Naziv proizvoda</label>
              <input
                type="text"
                placeholder="Unesite naziv proizvoda"
                className="border border-neutral-200 rounded-md px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:border-neutral-400 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cena (RSD)</label>
              <input
                min={0}
                type="number"
                placeholder="0"
                className="border border-neutral-200 rounded-md px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:border-neutral-400 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Popust (%)</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-gray-400">Aktiviraj popust</span>
                  <input
                    type="checkbox"
                    checked={discountEnabled}
                    onChange={(e) => setDiscountEnabled(e.target.checked)}
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                  />
                </label>
              </div>
              <input
                type="number"
                min={0}
                max={100}
                placeholder="0"
                disabled={!discountEnabled}
                className={`border rounded-md px-3 py-2 text-sm focus:outline-none transition-colors ${
                  discountEnabled
                    ? "border-neutral-200 text-neutral-800 focus:border-neutral-400"
                    : "border-neutral-100 text-neutral-300 bg-neutral-50 cursor-not-allowed"
                }`}
              />
            </div>
          </div>

          <div className="bg-white rounded-md p-6 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Opis proizvoda</label>
            <textarea
              rows={7}
              placeholder="Unesite opis proizvoda..."
              className="border border-neutral-200 rounded-md px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:border-neutral-400 transition-colors resize-none"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminProductPage;
