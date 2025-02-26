<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Template;
use Illuminate\Database\Seeder;

class CategoryTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create categories
        $categories = [
            'sports' => 'Sports',
            'concerts' => 'Concerts'
        ];

        foreach ($categories as $key => $id) {
            Category::create(['id' => $id]);

            // Create templates for each category
            $this->createTemplatesForCategory($id, $key);
        }
    }

    /**
     * Create templates for a specific category.
     */
    private function createTemplatesForCategory(string $categoryId, string $categoryKey): void
    {
        // Each category gets a vertical and horizontal template
        $templates = [
            [
                'id' => $categoryKey . '-vertical',
                'supports_background_image' => true,
            ],
            [
                'id' => $categoryKey . '-horizontal',
                'supports_background_image' => true,
            ],
        ];

        foreach ($templates as $templateData) {
            Template::create([
                'id' => $templateData['id'],
                'category_id' => $categoryId,
                'supports_background_image' => $templateData['supports_background_image'],
            ]);
        }
    }
}