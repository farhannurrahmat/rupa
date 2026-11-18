import { getCategoriesWithCount } from "@/lib/queries/categories";
import CategoryForm from "@/components/admin/CategoryForm";
import CategoryRow from "@/components/admin/CategoryRow";

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCount();

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold">Kelola Kategori</h1>
        <CategoryForm />
        <ul className="space-y-3">
          {categories.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </ul>
      </div>
    </main>
  );
}