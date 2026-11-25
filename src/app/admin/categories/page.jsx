import { getCategoriesWithCount } from "@/lib/queries/categories";
import CategoryForm from "@/components/admin/CategoryForm";
import CategoryRow from "@/components/admin/CategoryRow";

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCount();

  return (
    <main className="w-full space-y-6 px-6 py-10 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Kelola Kategori</h1>
          <p className="mt-1 text-sm text-muted">{categories.length} kategori aktif</p>
        </div>
        <CategoryForm />
      </div>

      <div className="overflow-x-auto rounded-sm border border-line bg-surface">
        {categories.length === 0 ? (
          <p className="p-6 text-sm text-muted">Belum ada kategori.</p>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-4 font-medium">Nama Kategori</th>
                <th className="px-6 py-4 font-medium">Jumlah Karya</th>
                <th className="px-6 py-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {categories.map((category) => (
                <CategoryRow key={category.id} category={category} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}