export const productAdapter = (p: any) => ({
  _id: p._id,
  title: p.name || p.title,
  description: p.shortDescription ?? p.description ?? "",
  brand: p.brand ?? "",
  category: p.category ?? "",
  subCategory: p.subCategory ?? "",

  price: p.baseVariant?.comparePrice ?? p.mrp ?? 0,
  mrp: p.baseVariant?.price ?? p.price ?? 0,

  discountPercent:
    p.baseVariant?.comparePrice && p.baseVariant?.price
      ? Math.round(
          ((p.baseVariant.comparePrice - p.baseVariant.price) /
            p.baseVariant.comparePrice) *
            100
        )
      : p.discountPercent ?? 0,

  stock: p.baseVariant?.stock ?? p.stock ?? 0,

  images: p.gallery ?? p.images ?? [],
  thumbnail:
    p.baseVariant?.images?.[0] ??
    p.gallery?.[0] ??
    p.thumbnail ??
    "",

  variants: p.variants ?? [],
  specifications: p.specifications ?? [],
  features: p.features ?? [],
  warranty: p.warranty ?? "",
  sku: p.baseVariant?.sku ?? p.sku ?? "",

  rating: p.rating ?? 0,
  totalReviews: p.totalReviews ?? 0,

  isPublished: p.isActive ?? p.isPublished ?? true,
});