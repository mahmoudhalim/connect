import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: string;
}

interface Props {
    categories: Category[];
}

export default function Index({ categories }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('');

    const openCreate = () => {
        setEditing(null);
        setName('');
        setIcon('');
        setDialogOpen(true);
    };

    const openEdit = (cat: Category) => {
        setEditing(cat);
        setName(cat.name);
        setIcon(cat.icon || '');
        setDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) {
            router.put(`/admin/categories/${editing.id}`, { name, icon }, {
                preserveScroll: true,
                onSuccess: () => setDialogOpen(false),
            });
        } else {
            router.post('/admin/categories', { name, icon }, {
                preserveScroll: true,
                onSuccess: () => setDialogOpen(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(`/admin/categories/${id}`, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Categories" />
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-on-surface">Categories</h1>
                    <p className="text-on-surface-variant text-sm">Manage job categories</p>
                </div>
                <Button onClick={openCreate}>Add Category</Button>
            </div>

            <div className="rounded-xl border border-outline-variant bg-surface-container overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-outline-variant text-xs text-on-surface-variant uppercase tracking-wider bg-surface-container-low">
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Slug</th>
                            <th className="px-6 py-4 font-medium">Icon</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-outline-variant">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant">No categories found.</td>
                            </tr>
                        ) : (
                            categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-surface-container transition-colors">
                                    <td className="px-6 py-4 text-on-surface font-medium">{cat.name}</td>
                                    <td className="px-6 py-4 text-on-surface-variant font-mono text-xs">{cat.slug}</td>
                                    <td className="px-6 py-4 text-on-surface-variant">{cat.icon || '—'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button type="button" variant="outline" size="sm" onClick={() => openEdit(cat)}>Edit</Button>
                                            <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(cat.id)}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{editing ? 'Edit Category' : 'Add Category'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Web Development" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="icon">Material Icon</Label>
                                <Input id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. code" />
                                <p className="text-xs text-on-surface-variant">Icon name from Material Symbols</p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

Index.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
