"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, FolderTree, Loader2, X } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count: { products: number };
}

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name"),
      description: formData.get("description"),
      image: formData.get("image"),
    };

    const url = editing ? `/api/categories/${editing.id}` : "/api/categories";
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setShowForm(false);
      setEditing(null);
      await fetchCategories();
      router.refresh();
    }

    setFormLoading(false);
  }

  async function handleDelete(cat: Category) {
    if (cat._count.products > 0) {
      alert("Negalima ištrinti kategorijos su produktais!");
      return;
    }
    if (!confirm(`Ar tikrai norite ištrinti "${cat.name}"?`)) return;

    await fetch(`/api/categories/${cat.id}`, { method: "DELETE" });
    await fetchCategories();
    router.refresh();
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-9 flex flex-col items-center gap-5 text-center">
        <div>
          <div className="mx-auto mb-2 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-accent" aria-hidden />
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Kategorijos</h1>
          <p className="mt-1 text-sm text-muted-foreground">{categories.length} kategorijų iš viso</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Nauja kategorija
        </button>
      </div>

      {showForm && (
        <div className="card-elevated mb-8 p-6 text-left sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {editing ? "Redaguoti kategoriją" : "Nauja kategorija"}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Pavadinimas *
                </label>
                <input
                  name="name"
                  required
                  defaultValue={editing?.name}
                  className="input-field"
                  placeholder="pvz. Procesoriai"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Nuotraukos URL
                </label>
                <input
                  name="image"
                  defaultValue={editing?.image ?? ""}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Aprašymas
              </label>
              <textarea
                name="description"
                rows={3}
                defaultValue={editing?.description ?? ""}
                className="input-field min-h-[5.5rem] resize-y"
                placeholder="Kategorijos aprašymas..."
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={formLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:brightness-110 disabled:opacity-50"
              >
                {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "Atnaujinti" : "Sukurti"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-border/80 bg-muted/30 px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                Atšaukti
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="card-elevated p-6 text-left transition-transform hover:-translate-y-0.5"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-primary/5 ring-1 ring-primary/20">
                <FolderTree className="h-5 w-5 text-primary" />
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(cat)}
                  className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat)}
                  className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {cat.name}
            </h3>
            {cat.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {cat.description}
              </p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              {cat._count.products} produktų
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
