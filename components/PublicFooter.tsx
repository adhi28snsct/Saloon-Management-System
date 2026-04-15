export default function PublicFooter({ business }: any) {
  return (
    <footer className="border-t border-stone-200 bg-[#fcfaf7] py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left */}
        <div className="text-center md:text-left">
          <h2 className="font-serif text-xl text-stone-900">
            {business?.name}
          </h2>

          <p className="text-stone-500 text-sm mt-1">
            {business?.address || "Visit us at our studio"}
          </p>

          <p className="text-stone-400 text-xs mt-2">
            © {new Date().getFullYear()} {business?.name}
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-sm text-stone-600">

          {business?.phone && (
            <a href={`tel:${business.phone}`} className="hover:text-black">
              📞 {business.phone}
            </a>
          )}

          {business?.email && (
            <a href={`mailto:${business.email}`} className="hover:text-black">
              📧 {business.email}
            </a>
          )}

        </div>
      </div>
    </footer>
  );
}