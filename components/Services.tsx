"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Scissors, Trash2, PlusCircle, LayoutGrid } from "lucide-react";

export default function ServicesUI({
  services,
  loading,
  form,
  setForm,
  setImage,
  handleAdd,
  handleDelete,
}: any) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("No file chosen");

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 md:px-8">

      {/* HEADER */}
      <header className="border-b pb-8 pt-6">
        <h1 className="text-4xl font-serif mb-2">Service Menu</h1>
        <p className="text-sm text-gray-500 italic">
          Curate and manage your premium offerings.
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">

        {/* FORM */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex gap-2">
              <PlusCircle className="w-5 h-5" /> Add Service
            </h2>

            <form onSubmit={handleAdd} className="space-y-5">

              {/* SERVICE NAME */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Service Name
                </label>
                <Input
                  placeholder="e.g. Haircut"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="bg-white border border-gray-300 text-black placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-black"
                />
              </div>

              {/* PRICE */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Price (₹)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 500"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  className="bg-white border border-gray-300 text-black placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-black"
                />
              </div>

              {/* DURATION */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Duration (mins)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 30"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                  className="bg-white border border-gray-300 text-black placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-black"
                />
              </div>

              {/* IMAGE UPLOAD */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Service Image
                </label>

                <div className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                  <span className="text-sm text-gray-500 truncate">
                    {fileName}
                  </span>

                  <label className="cursor-pointer text-xs font-medium bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImage(file);
                          setFileName(file.name);
                          setPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>

                {/* IMAGE PREVIEW */}
                {preview && (
                  <div className="mt-2">
                    <img
                      src={preview}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* BUTTON */}
              <Button className="w-full mt-2">
                Create Service
              </Button>

            </form>
          </div>
        </div>

        {/* LIST */}
        <div className="lg:col-span-8">
          <div className="flex justify-between mb-6">
            <h2 className="font-bold flex gap-2">
              <LayoutGrid className="w-5 h-5" /> Services
            </h2>
            <span>{services.length} total</span>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : services.length === 0 ? (
            <div className="text-center py-20 border rounded-xl bg-white">
              <Scissors className="mx-auto mb-4 text-gray-300" size={40} />
              <p className="text-gray-500">No services added yet</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {services.map((s: any) => (
                <div
                  key={s.id}
                  className="p-4 border rounded-xl bg-white relative group transition hover:shadow-md"
                >

                  {/* IMAGE */}
                  {s.image && (
                    <div className="h-32 mb-3 rounded overflow-hidden">
                      <img
                        src={s.image}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <h3 className="font-semibold text-gray-900">
                    {s.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    ₹{s.price} • {s.duration} min
                  </p>

                  <button
                    onClick={() => handleDelete(s.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}