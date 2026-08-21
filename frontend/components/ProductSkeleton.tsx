export default function ProductSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[4/5] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200" />

      {/* Content */}
      <div className="p-6 flex flex-col gap-3">
        {/* Title + heart */}
        <div className="flex justify-between items-start">
          <div className="h-5 bg-gray-200 rounded-full w-3/4" />
          <div className="h-5 w-5 bg-gray-200 rounded-full shrink-0" />
        </div>

        {/* Price */}
        <div className="h-7 bg-gray-200 rounded-full w-2/5" />

        {/* Tallas */}
        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-gray-200" />
          ))}
        </div>

        {/* Stock + stars */}
        <div className="flex justify-between items-center mt-1">
          <div className="h-3 bg-gray-200 rounded-full w-1/3" />
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
