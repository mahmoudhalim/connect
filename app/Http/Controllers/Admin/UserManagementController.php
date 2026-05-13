<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'role']);
        $filters = array_filter($filters, fn($v) => $v !== null && $v !== '');

        $users = User::when($request->search, function ($query) use ($request) {
            $query->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%");
        })
            ->when($request->role && $request->role !== 'all', function ($query) use ($request) {
                $query->where('role', $request->role);
            })
            ->latest()
            ->paginate(15)
            ->appends($filters);

        $stats = [
            'total' => User::count(),
            'employers' => User::where('role', 'employer')->count(),
            'candidates' => User::where('role', 'candidate')->count(),
            'admins' => User::where('role', 'admin')->count(),
        ];

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $filters,
            'stats' => $stats,
        ]);
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->role === 'admin') {
            return back()->with('error', 'Admin accounts cannot be deleted.');
        }

        $user->delete();

        return back()->with('success', 'User deleted successfully.');
    }
}
