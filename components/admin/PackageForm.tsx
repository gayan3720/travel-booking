"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { IPackage } from "@/schemas/types";

const packageFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers, and hyphens only"),
  description: z.string().min(20, "Description too short"),
  destination: z.string().min(2),
  durationDays: z.coerce.number().int().positive(),
  price: z.coerce.number().positive(),
  category: z.string().min(2),
  maxPax: z.coerce.number().int().positive(),
  included: z.array(z.object({ value: z.string().min(1) })),
  excluded: z.array(z.object({ value: z.string().min(1) })),
  isActive: z.boolean(),
});

type PackageFormValues = z.infer<typeof packageFormSchema>;

async function savePackage(id: string | undefined, data: PackageFormValues) {
  const res = await fetch(id ? `/api/packages/${id}` : "/api/packages", {
    method: id ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      included: data.included.map((i) => i.value),
      excluded: data.excluded.map((e) => e.value),
    }),
  });
  if (!res.ok) throw new Error("Failed to save package");
  return res.json();
}

export default function PackageForm({ existing }: { existing?: IPackage }) {
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: existing
      ? {
          ...existing,
          included: existing.included.map((v) => ({ value: v })),
          excluded: existing.excluded.map((v) => ({ value: v })),
        }
      : {
          title: "",
          slug: "",
          description: "",
          destination: "",
          durationDays: 1,
          price: 0,
          category: "",
          maxPax: 10,
          included: [{ value: "" }],
          excluded: [{ value: "" }],
          isActive: true,
        },
  });

  const includedArray = useFieldArray({ control, name: "included" });
  const excludedArray = useFieldArray({ control, name: "excluded" });

  const mutation = useMutation({
    mutationFn: (data: PackageFormValues) => savePackage(existing?._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });

  const title = watch("title");

  // Auto-generate slug from title if creating new
  const handleTitleBlur = () => {
    if (!existing) {
      setValue(
        "slug",
        title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-4 max-w-2xl"
    >
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input {...register("title")} onBlur={handleTitleBlur} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Slug (URL)</label>
        <Input {...register("slug")} />
        {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea rows={4} {...register("description")} />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Destination</label>
          <Input {...register("destination")} />
        </div>
        <div>
          <label className="text-sm font-medium">Category</label>
          <Input {...register("category")} placeholder="e.g. adventure, family" />
        </div>
        <div>
          <label className="text-sm font-medium">Duration (days)</label>
          <Input type="number" {...register("durationDays")} />
        </div>
        <div>
          <label className="text-sm font-medium">Price</label>
          <Input type="number" {...register("price")} />
        </div>
        <div>
          <label className="text-sm font-medium">Max Pax</label>
          <Input type="number" {...register("maxPax")} />
        </div>
      </div>

      {/* Included list */}
      <div>
        <label className="text-sm font-medium">Included</label>
        {includedArray.fields.map((field, idx) => (
          <div key={field.id} className="flex gap-2 mt-1">
            <Input {...register(`included.${idx}.value`)} />
            <Button type="button" variant="ghost" onClick={() => includedArray.remove(idx)}>
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => includedArray.append({ value: "" })}
        >
          + Add item
        </Button>
      </div>

      {/* Excluded list */}
      <div>
        <label className="text-sm font-medium">Excluded</label>
        {excludedArray.fields.map((field, idx) => (
          <div key={field.id} className="flex gap-2 mt-1">
            <Input {...register(`excluded.${idx}.value`)} />
            <Button type="button" variant="ghost" onClick={() => excludedArray.remove(idx)}>
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => excludedArray.append({ value: "" })}
        >
          + Add item
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={watch("isActive")}
          onCheckedChange={(val) => setValue("isActive", val)}
        />
        <span className="text-sm">Active (visible on site)</span>
      </div>

      {/* Image upload would integrate here via Cloudinary widget — omitted for brevity */}

      <Button type="submit" disabled={isSubmitting || mutation.isPending}>
        {existing ? "Update Package" : "Create Package"}
      </Button>
    </form>
  );
}
