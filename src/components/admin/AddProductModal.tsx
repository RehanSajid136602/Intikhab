"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { X, Upload } from "lucide-react";
import { useAdminStore } from "@/stores/adminStore";
import type { Product } from "@/types/product";
import { CascadingSelect } from "./CascadingSelect";
import { ShoeSizeStockInput } from "./ShoeSizeStockInput";
import { GeneralSizeStockInput } from "./GeneralSizeStockInput";
import {
  getSubcategories,
  getDefaultSizeSystem,
  requiresSizeQuantities,
} from "@/lib/sizeSystems";

const productSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    sku: z.string().min(2, "SKU must be at least 2 characters"),
    productType: z
      .enum(["shoes", "bags", "accessories", "clothing"])
      .default("shoes"),
    category: z.enum(["men", "women", "kids", "unisex"]).default("men"),
    subcategory: z.string().optional(),
    price: z.number().min(100, "Price must be at least PKR 100"),
    originalPrice: z.preprocess(
      (val) => (val === "" || isNaN(Number(val)) ? undefined : Number(val)),
      z.number().optional(),
    ),
    // Shoe size fields (35-46)
    size35: z.number().min(0, "Stock cannot be negative"),
    size36: z.number().min(0, "Stock cannot be negative"),
    size37: z.number().min(0, "Stock cannot be negative"),
    size38: z.number().min(0, "Stock cannot be negative"),
    size39: z.number().min(0, "Stock cannot be negative"),
    size40: z.number().min(0, "Stock cannot be negative"),
    size41: z.number().min(0, "Stock cannot be negative"),
    size42: z.number().min(0, "Stock cannot be negative"),
    size43: z.number().min(0, "Stock cannot be negative"),
    size44: z.number().min(0, "Stock cannot be negative"),
    size45: z.number().min(0, "Stock cannot be negative"),
    size46: z.number().min(0, "Stock cannot be negative"),
    // For non-shoe products: single size selection
    generalSize: z.string().optional(),
    generalQuantity: z.number().min(0, "Stock cannot be negative").optional(),
    sizeSystem: z
      .enum(["eu", "uk", "us", "bag", "general", "numeric"])
      .default("eu"),
    description: z.string().optional(),
    status: z.enum(["active", "draft"]),
  })
  .refine(
    (data) => {
      // Only require stock validation for active products
      if (data.status !== "active") return true;
      // For shoes, at least one size must have quantity > 0
      if (data.productType === "shoes") {
        const sizes = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];
        return sizes.some(
          (size) => (data[`size${size}` as keyof typeof data] as number) > 0,
        );
      }
      // For other products, generalSize and generalQuantity must be provided
      return Boolean(
        data.generalSize && data.generalQuantity && data.generalQuantity > 0,
      );
    },
    {
      message: "Please enter stock for at least one shoe size (or save as draft)",
      path: ["size35"],
    },
  );

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editProduct?: Product | null;
}

/**
 * Add/Edit product modal with React Hook Form + Zod validation,
 * image upload to Supabase Storage, and Sonner toast on submit.
 */
function AddProductModal({
  isOpen,
  onClose,
  editProduct,
}: AddProductModalProps) {
  const { addProduct, updateProduct, fetchProducts } = useAdminStore();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      productType: "shoes",
      category: "men",
      subcategory: "",
      price: undefined,
      originalPrice: undefined,
      size35: 0,
      size36: 0,
      size37: 0,
      size38: 0,
      size39: 0,
      size40: 0,
      size41: 0,
      size42: 0,
      size43: 0,
      size44: 0,
      size45: 0,
      size46: 0,
      generalSize: "",
      generalQuantity: 0,
      sizeSystem: "eu",
      description: "",
      status: "active",
    },
  });

  // Reset form when editProduct changes (for editing existing products)
  useEffect(() => {
    if (editProduct) {
      reset({
        name: editProduct.name,
        sku: editProduct.sku,
        productType: editProduct.productType || "shoes",
        category: editProduct.category,
        subcategory: editProduct.subcategory || "",
        price: editProduct.price,
        originalPrice: editProduct.originalPrice,
        size35: editProduct.sizeStock?.find((s) => s.size === "35")?.stock ?? 0,
        size36: editProduct.sizeStock?.find((s) => s.size === "36")?.stock ?? 0,
        size37: editProduct.sizeStock?.find((s) => s.size === "37")?.stock ?? 0,
        size38: editProduct.sizeStock?.find((s) => s.size === "38")?.stock ?? 0,
        size39: editProduct.sizeStock?.find((s) => s.size === "39")?.stock ?? 0,
        size40: editProduct.sizeStock?.find((s) => s.size === "40")?.stock ?? 0,
        size41: editProduct.sizeStock?.find((s) => s.size === "41")?.stock ?? 0,
        size42: editProduct.sizeStock?.find((s) => s.size === "42")?.stock ?? 0,
        size43: editProduct.sizeStock?.find((s) => s.size === "43")?.stock ?? 0,
        size44: editProduct.sizeStock?.find((s) => s.size === "44")?.stock ?? 0,
        size45: editProduct.sizeStock?.find((s) => s.size === "45")?.stock ?? 0,
        size46: editProduct.sizeStock?.find((s) => s.size === "46")?.stock ?? 0,
        generalSize: "",
        generalQuantity: 0,
        sizeSystem: editProduct.sizeSystem || "eu",
        description: editProduct.description || "",
        status: editProduct.status,
      });
      // Set existing image previews
      if (Array.isArray(editProduct.images) && editProduct.images.length > 0) {
        setImagePreviews(editProduct.images);
      } else {
        setImagePreviews([]);
      }
    } else {
      reset({
        name: "",
        sku: "",
        productType: "shoes",
        category: "men",
        subcategory: "",
        price: undefined,
        originalPrice: undefined,
        size35: 0,
        size36: 0,
        size37: 0,
        size38: 0,
        size39: 0,
        size40: 0,
        size41: 0,
        size42: 0,
        size43: 0,
        size44: 0,
        size45: 0,
        size46: 0,
        generalSize: "",
        generalQuantity: 0,
        sizeSystem: "eu",
        description: "",
        status: "active",
      });
      setImagePreviews([]);
    }
  }, [editProduct, reset]);

  const category = watch("category");
  const productType = watch("productType");
  const subcategory = watch("subcategory");

  // Get subcategories based on product type
  const subcategories = getSubcategories(productType);
  const defaultSizeSystem = getDefaultSizeSystem(productType);
  const requiresSizeGrid = requiresSizeQuantities(productType);

  // Build routing preview
  const routingPath = subcategory
    ? `/${productType}/${category}/${subcategory}`
    : `/${productType}/${category}`;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const previews: string[] = [];
    const filesArr: File[] = [];
    Array.from(files)
      .slice(0, 4)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            previews.push(ev.target.result as string);
            filesArr.push(file);
            if (previews.length === Math.min(files.length, 4)) {
              setImagePreviews(previews);
              setImageFiles(filesArr);
            }
          }
        };
        reader.readAsDataURL(file);
      });
  };

  /** Upload images to Supabase Storage and return public URLs */
  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];

    const urls: string[] = [];
    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await res.json();
      if (data.url) urls.push(data.url);
    }

    return urls;
  };

  const onSubmit = async (data: ProductFormData) => {
    setSubmitting(true);
    try {
      // Upload images if new files selected
      let imageUrls: string[] = [];
      if (editProduct && Array.isArray(editProduct.images)) {
        imageUrls = editProduct.images.filter(
          (img): img is string => typeof img === 'string' && img.trim() !== ''
        );
      }
      if (imageUrls.length === 0) {
        imageUrls = ["/shoe_collection.jpeg"];
      }

      if (imageFiles.length > 0) {
        setUploading(true);
        const uploaded = await uploadImages();
        setUploading(false);
        const validUploaded = uploaded.filter(
          (img): img is string => typeof img === 'string' && img.trim() !== ''
        );
        if (validUploaded.length > 0) {
          imageUrls = validUploaded;
        } else {
          toast.warning("No images uploaded, using default");
        }
      }

      let totalStock = 0;
      let sizeStock: { size: string; stock: number }[] = [];

      if (data.productType === "shoes") {
        // For shoes: construct sizeStock from individual size fields
        const sizes = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];
        sizeStock = sizes
          .map((size) => ({
            size: size.toString(),
            stock:
              (data[`size${size}` as keyof ProductFormData] as number) || 0,
          }))
          .filter((s) => s.stock > 0);
        totalStock = sizeStock.reduce((sum, s) => sum + s.stock, 0);
      } else {
        // For non-shoe products: use generalSize and generalQuantity
        if (data.generalSize && data.generalQuantity) {
          sizeStock = [{ size: data.generalSize, stock: data.generalQuantity }];
          totalStock = data.generalQuantity;
        }
      }

      const productData = {
        slug: data.name.toLowerCase().replace(/\s+/g, "-"),
        name: data.name,
        brand: "Intikhab",
        productType: data.productType,
        category: data.category,
        subcategory: data.subcategory || null,
        price: data.price,
        originalPrice:
          data.originalPrice && !isNaN(Number(data.originalPrice))
            ? Number(data.originalPrice)
            : null,
        images: imageUrls,
        badge:
          data.originalPrice && !isNaN(Number(data.originalPrice))
            ? ("SALE" as const)
            : null,
        inStock: totalStock > 0,
        stock: totalStock,
        sizeStock,
        sizeSystem: data.sizeSystem,
        installment: Math.ceil(data.price / 2),
        description: data.description || "",
        sku: data.sku,
        status: data.status,
      } as Partial<Product>;

      let result;
      if (editProduct) {
        await updateProduct(editProduct.id, productData);
        result = { success: true };
        toast.success("Product updated successfully");
      } else {
        result = await addProduct(productData);
        if (result) toast.success("Product added successfully");
      }

      if (result) {
        await fetchProducts(); // Refresh the list
      }

      reset();
      setImagePreviews([]);
      setImageFiles([]);
      onClose();
    } catch (err) {
      setUploading(false);
      toast.error(
        err instanceof Error ? err.message : "Failed to save product",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setImagePreviews([]);
    setImageFiles([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-white rounded-sm shadow-xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-brand-border">
              <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wider">
                {editProduct ? "Edit Product" : "Add Product"}
              </h3>
              <button
                onClick={handleClose}
                className="p-1 text-brand-gray hover:text-brand-dark transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Type */}
                <div>
                  <label className="block text-xs font-medium text-brand-dark mb-1.5">
                    Product Type *
                  </label>
                  <select
                    {...register("productType")}
                    className="w-full border border-brand-border px-4 py-2.5 text-sm outline-none focus:border-brand-dark bg-white"
                  >
                    <option value="shoes">Shoes</option>
                    <option value="bags">Bags</option>
                    <option value="accessories">Accessories</option>
                    <option value="clothing">Clothing</option>
                  </select>
                </div>

                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-brand-dark mb-1.5">
                    Product Name *
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    className="w-full border border-brand-border px-4 py-2.5 text-sm outline-none focus:border-brand-dark"
                    placeholder="e.g. Black Sneaker — Classic"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-brand-red">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-xs font-medium text-brand-dark mb-1.5">
                    SKU *
                  </label>
                  <input
                    {...register("sku")}
                    type="text"
                    className="w-full border border-brand-border px-4 py-2.5 text-sm outline-none focus:border-brand-dark"
                    placeholder="INK-BLK-001"
                  />
                  {errors.sku && (
                    <p className="mt-1 text-xs text-brand-red">
                      {errors.sku.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-brand-dark mb-1.5">
                    Category *
                  </label>
                  <select
                    {...register("category")}
                    className="w-full border border-brand-border px-4 py-2.5 text-sm outline-none focus:border-brand-dark bg-white"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                {/* Subcategory */}
                <div>
                  <CascadingSelect
                    label="Subcategory"
                    parentValue={productType}
                    value={subcategory}
                    onChange={(value) => {
                      setValue("subcategory", value as never);
                    }}
                    options={subcategories}
                    placeholder="Select subcategory"
                  />
                  <input {...register("subcategory")} type="hidden" />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-medium text-brand-dark mb-1.5">
                    Price PKR *
                  </label>
                  <input
                    {...register("price", { valueAsNumber: true })}
                    type="number"
                    className="w-full border border-brand-border px-4 py-2.5 text-sm outline-none focus:border-brand-dark"
                    placeholder="3500"
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-brand-red">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-xs font-medium text-brand-dark mb-1.5">
                    Original Price PKR (optional)
                  </label>
                  <input
                    {...register("originalPrice", { valueAsNumber: true })}
                    type="number"
                    className="w-full border border-brand-border px-4 py-2.5 text-sm outline-none focus:border-brand-dark"
                    placeholder="4500"
                  />
                </div>

                {/* Stock per size - Conditional based on product type */}
                <div className="sm:col-span-2">
                  {requiresSizeGrid ? (
                    // For shoes: show ShoeSizeStockInput
                    <>
                      <input
                        {...register("size35", { valueAsNumber: true })}
                        type="hidden"
                      />
                      <input
                        {...register("size36", { valueAsNumber: true })}
                        type="hidden"
                      />
                      <input
                        {...register("size37", { valueAsNumber: true })}
                        type="hidden"
                      />
                      <input
                        {...register("size38", { valueAsNumber: true })}
                        type="hidden"
                      />
                      <input
                        {...register("size39", { valueAsNumber: true })}
                        type="hidden"
                      />
                      <input
                        {...register("size40", { valueAsNumber: true })}
                        type="hidden"
                      />
                      <input
                        {...register("size41", { valueAsNumber: true })}
                        type="hidden"
                      />
                      <input
                        {...register("size42", { valueAsNumber: true })}
                        type="hidden"
                      />
                      <input
                        {...register("size43", { valueAsNumber: true })}
                        type="hidden"
                      />
                      <input
                        {...register("size44", { valueAsNumber: true })}
                        type="hidden"
                      />
                      <input
                        {...register("size45", { valueAsNumber: true })}
                        type="hidden"
                      />
                      <input
                        {...register("size46", { valueAsNumber: true })}
                        type="hidden"
                      />
                      <ShoeSizeStockInput
                        values={{
                          "35": watch("size35") || 0,
                          "36": watch("size36") || 0,
                          "37": watch("size37") || 0,
                          "38": watch("size38") || 0,
                          "39": watch("size39") || 0,
                          "40": watch("size40") || 0,
                          "41": watch("size41") || 0,
                          "42": watch("size42") || 0,
                          "43": watch("size43") || 0,
                          "44": watch("size44") || 0,
                          "45": watch("size45") || 0,
                          "46": watch("size46") || 0,
                        }}
                        onChange={(values) => {
                          // Update form values for each size using setValue
                          Object.entries(values).forEach(([size, qty]) => {
                            const field =
                              `size${size}` as keyof ProductFormData;
                            setValue(field, qty as never);
                          });
                        }}
                        error={
                          (errors as Record<string, { message?: string }>)
                            ?.size35?.message
                        }
                      />
                    </>
                  ) : (
                    // For non-shoe products: show GeneralSizeStockInput
                    <>
                      <input {...register("generalSize")} type="hidden" />
                      <input
                        {...register("generalQuantity", {
                          valueAsNumber: true,
                        })}
                        type="hidden"
                      />
                      <GeneralSizeStockInput
                        sizeSystem={productType === "bags" ? "bag" : "general"}
                        selectedSize={watch("generalSize")}
                        quantity={watch("generalQuantity") || 0}
                        onSizeChange={(value) => {
                          setValue("generalSize", value as never);
                        }}
                        onQuantityChange={(value) => {
                          setValue("generalQuantity", value as never);
                        }}
                        error={
                          (errors as Record<string, { message?: string }>)
                            ?.generalSize?.message
                        }
                      />
                    </>
                  )}
                </div>

                {/* Size System (hidden, auto-set based on product type) */}
                <input
                  {...register("sizeSystem")}
                  type="hidden"
                  value={defaultSizeSystem}
                />

                {/* Routing Preview */}
                <div className="sm:col-span-2 p-3 bg-blue-50 border border-blue-200 rounded-sm">
                  <p className="text-xs font-medium text-blue-800 mb-1">
                    Routing Preview
                  </p>
                  <p className="text-sm text-blue-600 font-mono">
                    {routingPath}
                  </p>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-brand-dark mb-1.5">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    className="w-full border border-brand-border px-4 py-2.5 text-sm outline-none focus:border-brand-dark resize-none"
                    placeholder="Product description..."
                  />
                </div>

                {/* Image Upload */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-brand-dark mb-1.5">
                    Images (max 4)
                  </label>
                  <div className="border-2 border-dashed border-brand-border rounded-sm p-6 text-center">
                    <Upload className="w-8 h-8 text-brand-gray mx-auto mb-2" />
                    <p className="text-xs text-brand-gray mb-2">
                      Click to upload or drag and drop
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      id="product-images"
                    />
                    <label
                      htmlFor="product-images"
                      className="inline-block px-4 py-2 bg-brand-light-gray text-xs font-medium text-brand-dark rounded-sm cursor-pointer hover:bg-brand-border transition-colors"
                    >
                      Choose Files
                    </label>
                  </div>
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {imagePreviews.map((src, i) => (
                        <div
                          key={i}
                          className="aspect-square bg-brand-light-gray rounded-sm overflow-hidden"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={`Preview ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-brand-dark mb-1.5">
                    Status
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        {...register("status")}
                        type="radio"
                        value="active"
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-brand-dark">Active</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        {...register("status")}
                        type="radio"
                        value="draft"
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-brand-dark">Draft</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 text-xs font-medium text-brand-gray hover:text-brand-dark transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="px-6 py-2.5 bg-brand-red text-white text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading
                    ? "Uploading Images..."
                    : submitting
                      ? editProduct
                        ? "Updating..."
                        : "Adding..."
                      : editProduct
                        ? "Update Product"
                        : "Add Product"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { AddProductModal };
export type { AddProductModalProps };
