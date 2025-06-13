<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Template;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategoryTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create categories
        $categories = [
            'sports',
            'concerts',
        ];

        foreach ($categories as $categoryName) {
            Category::create([
                'id' => $categoryName,
                'name' => Str::ucfirst($categoryName)
            ]);

            // Create templates for each category
            $this->createTemplatesForCategory($categoryName);
        }
    }

    /**
     * Create templates for a specific category.
     */
    private function createTemplatesForCategory(string $categoryId): void
    {
        // Each category gets only a vertical template
        Template::create([
            'id' => "{$categoryId}-vertical",
            'name' => Str::ucfirst($categoryId) . ' Vertical',
            'category_id' => $categoryId,
            'supports_background_image' => true,
        ]);
    }
}