<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Information Technology', 'icon' => 'code'],
            ['name' => 'Engineering', 'icon' => 'settings'],
            ['name' => 'Healthcare', 'icon' => 'heart'],
            ['name' => 'Finance & Accounting', 'icon' => 'dollar-sign'],
            ['name' => 'Marketing & Sales', 'icon' => 'bar-chart'],
            ['name' => 'Education', 'icon' => 'book-open'],
            ['name' => 'Human Resources', 'icon' => 'users'],
            ['name' => 'Design & Creative', 'icon' => 'palette'],
            ['name' => 'Legal', 'icon' => 'scale'],
            ['name' => 'Administration', 'icon' => 'briefcase'],
            ['name' => 'Manufacturing', 'icon' => 'factory'],
            ['name' => 'Hospitality', 'icon' => 'utensils'],
            ['name' => 'Construction', 'icon' => 'hard-hat'],
            ['name' => 'Science & Research', 'icon' => 'flask'],
            ['name' => 'Media & Communications', 'icon' => 'tv'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(
                ['slug' => Str::slug($cat['name'])],
                ['name' => $cat['name'], 'icon' => $cat['icon']]
            );
        }
    }
}