import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import Pagination from '@/components/Pagination';
import type { PaginatedData } from '@/types/pagination';
import type { Auth } from '@/types/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
}

interface Filters {
    search?: string;
    role?: string;
}

interface Props {
    users: PaginatedData<UserData>;
    filters?: Filters;
    stats: {
        total: number;
        employers: number;
        candidates: number;
        admins: number;
    };
}

function getRoleBadge(role: string) {
    const styles: Record<string, string> = {
        admin: 'bg-primary/10 text-primary border-primary/20',
        employer: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
        candidate: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    };
    return styles[role] || 'bg-surface-variant text-on-surface-variant border-outline-variant';
}

export default function Index({ users, filters, stats }: Props) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [role, setRole] = useState(filters?.role ?? 'all');

    const applyFilters = () => {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (role !== 'all') params.role = role;
        router.get('/admin/users', params, { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        setSearch('');
        setRole('all');
        router.get('/admin/users', {}, { preserveState: true, replace: true });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString();
    };

    const statsData = [
        { label: 'Total Users', value: stats.total, icon: 'people', color: 'text-on-surface' },
        { label: 'Employers', value: stats.employers, icon: 'badge', color: 'text-cyan-500' },
        { label: 'Candidates', value: stats.candidates, icon: 'person_search', color: 'text-violet-500' },
        { label: 'Admins', value: stats.admins, icon: 'admin_panel_settings', color: 'text-primary' },
    ];

    return (
        <>
            <Head title="User Management" />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-on-surface">User Management</h1>
                <p className="text-on-surface-variant text-sm">View and manage platform users</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statsData.map((stat, i) => (
                    <div key={i} className="bg-surface-container border border-outline-variant rounded-lg p-4 flex flex-col">
                        <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-2">
                            <span className={`material-symbols-outlined text-lg ${stat.color}`}>{stat.icon}</span>
                            {stat.label}
                        </div>
                        <span className="text-2xl font-bold text-on-surface">{stat.value}</span>
                    </div>
                ))}
            </div>

            <div className="bg-surface border border-outline-variant rounded-t-lg p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-72 flex items-center h-10 rounded bg-surface-container-lowest border border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                    <div className="grid place-items-center h-full w-10 text-on-surface-variant">
                        <span className="material-symbols-outlined text-lg">search</span>
                    </div>
                    <input
                        className="peer h-full w-full outline-none text-sm text-on-surface bg-transparent pr-2"
                        placeholder="Search by name or email..."
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className="w-full md:w-40 bg-surface-container-lowest">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="employer">Employer</SelectItem>
                            <SelectItem value="candidate">Candidate</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button type="button" onClick={applyFilters}>Search</Button>
                    <Button type="button" variant="outline" onClick={resetFilters}>Reset</Button>
                </div>
            </div>

            <div className="bg-surface border-x border-b border-outline-variant rounded-b-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-outline-variant text-xs text-on-surface-variant uppercase tracking-wider bg-surface-container-low">
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium">Role</th>
                            <th className="px-6 py-4 font-medium">Verified</th>
                            <th className="px-6 py-4 font-medium">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-outline-variant">
                        {users.data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">No users found.</td>
                            </tr>
                        ) : (
                            users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-surface-container transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-xs font-bold text-on-surface-variant">
                                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                            </div>
                                            <span className="font-medium text-on-surface">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-on-surface-variant">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getRoleBadge(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-on-surface-variant">{user.email_verified_at ? 'Yes' : 'No'}</td>
                                    <td className="px-6 py-4 text-on-surface-variant">{formatDate(user.created_at)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {users.last_page > 1 && (
                    <div className="p-4 border-t border-outline-variant flex items-center justify-between text-sm text-on-surface-variant bg-surface-container-low">
                        <span>Showing {users.data.length} of {users.total} users</span>
                        <Pagination links={users.links} />
                    </div>
                )}
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
