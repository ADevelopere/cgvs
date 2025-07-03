<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TemplateCategory;
use App\Models\Template;
use App\Models\Student;
use App\Models\TemplateVariable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Faker\Factory as Faker;
use App\Exceptions\DemoImagesNotFoundException;

class DemoDataSeeder extends Seeder
{
    private $faker;
    private $arabicFaker;

    public function __construct()
    {
        $this->faker = Faker::create();
        // Using ar_SA locale for Arabic names
        $this->arabicFaker = Faker::create('ar_SA');
    }

    public function run()
    {
        // Start transaction
        DB::beginTransaction();

        try {
            // 1. Create Template Categories
            $this->createTemplateCategories();

            // 2. Create Templates
            $this->createTemplates();

            // 3. Create Students
            $this->createStudents();

            // Commit transaction
            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    private function createTemplateCategories()
    {
        // Define top-level categories
        $topCategories = [
            [
                'name' => 'الشهادات الأكاديمية',
                'description' => 'شهادات التخرج والدورات الأكاديمية',
                'subcategories' => [
                    [
                        'name' => 'شهادات البكالوريوس',
                        'description' => 'شهادات إتمام درجة البكالوريوس'
                    ],
                    [
                        'name' => 'شهادات الماجستير',
                        'description' => 'شهادات إتمام درجة الماجستير'
                    ]
                ]
            ],
            [
                'name' => 'الشهادات المهنية',
                'description' => 'شهادات التدريب والتأهيل المهني',
                'subcategories' => [
                    [
                        'name' => 'شهادات التدريب التقني',
                        'description' => 'شهادات الدورات التقنية والبرمجة'
                    ],
                    [
                        'name' => 'شهادات الإدارة',
                        'description' => 'شهادات في مجال الإدارة والقيادة'
                    ]
                ]
            ],
            [
                'name' => 'شهادات الحضور',
                'description' => 'شهادات حضور الفعاليات والمؤتمرات',
                'subcategories' => [
                    [
                        'name' => 'شهادات المؤتمرات',
                        'description' => 'شهادات حضور المؤتمرات العلمية'
                    ],
                    [
                        'name' => 'شهادات ورش العمل',
                        'description' => 'شهادات حضور ورش العمل التدريبية'
                    ]
                ]
            ],
            [
                'name' => 'شهادات التقدير',
                'description' => 'شهادات تقدير الإنجازات والتميز',
                'subcategories' => [
                    [
                        'name' => 'شهادات التفوق',
                        'description' => 'شهادات تقدير للطلاب المتفوقين'
                    ],
                    [
                        'name' => 'شهادات التميز',
                        'description' => 'شهادات تقدير للإنجازات المتميزة'
                    ]
                ]
            ],
            [
                'name' => 'الشهادات التطوعية',
                'description' => 'شهادات العمل التطوعي والخدمة المجتمعية',
                'subcategories' => [
                    [
                        'name' => 'شهادات العمل التطوعي',
                        'description' => 'شهادات المشاركة في الأعمال التطوعية'
                    ],
                    [
                        'name' => 'شهادات خدمة المجتمع',
                        'description' => 'شهادات المساهمة في خدمة المجتمع'
                    ]
                ]
            ]
        ];

        foreach ($topCategories as $index => $categoryData) {
            $topCategory = TemplateCategory::create([
                'name' => $categoryData['name'],
                'description' => $categoryData['description'],
                'order' => $index + 1
            ]);

            // Create subcategories
            foreach ($categoryData['subcategories'] as $subIndex => $subCategoryData) {
                TemplateCategory::create([
                    'name' => $subCategoryData['name'],
                    'description' => $subCategoryData['description'],
                    'parent_category_id' => $topCategory->id,
                    'order' => $subIndex + 1
                ]);
            }
        }
    }

    private function createTemplates()
    {
        // Get list of demo images from storage
        $demoImages = collect(Storage::disk('public')->files('img'))
            ->filter(fn($file) => str_starts_with(basename($file), 'demo'))
            ->values()
            ->all();

        if (empty($demoImages)) {
            throw new DemoImagesNotFoundException();
        }

        // Map categories to images
        $categories = [
            'الشهادات الأكاديمية',
            'الشهادات المهنية',
            'شهادات الحضور',
            'شهادات التقدير',
            'الشهادات التطوعية'
        ];

        // Create templates using available demo images
        foreach ($categories as $index => $categoryName) {
            // Get an image from the available demo images, cycling through them if we have fewer images than categories
            $imagePath = $demoImages[$index % count($demoImages)];

            // Find the category
            $category = TemplateCategory::where('name', $categoryName)->first();
            if ($category) {
                // Create template for this category
                Template::create([
                    'name' => 'نموذج ' . $category->name,
                    'description' => 'نموذج تجريبي ل' . $category->name,
                    'category_id' => $category->id,
                    'image_url' => $imagePath,
                    'order' => 1
                ]);

                // Create some template variables
                $this->createTemplateVariables($category);
            }
        }
    }

    private function createTemplateVariables($category)
    {
        // Get a template from this category
        $template = $category->templates()->first();
        if (!$template) {
            return;
        }

        // Create different types of variables based on category
        switch ($category->name) {
            case 'الشهادات الأكاديمية':
                $this->createAcademicVariables($template);
                break;
            case 'الشهادات المهنية':
                $this->createProfessionalVariables($template);
                break;
            case 'شهادات الحضور':
                $this->createAttendanceVariables($template);
                break;
            case 'شهادات التقدير':
                $this->createAppreciationVariables($template);
                break;
            case 'الشهادات التطوعية':
                $this->createVolunteerVariables($template);
                break;
            default:
                // If none of the above cases match, create just the base variables
                $this->createBaseVariables($template);
                break;
        }
    }

    private function createAcademicVariables($template)
    {
        $this->createBaseVariables($template);
        
        // Add academic-specific variables
        TemplateVariable::create([
            'template_id' => $template->id,
            'name' => 'التخصص',
            'type' => 'text',
            'description' => 'التخصص الأكاديمي',
            'required' => true,
            'min_length' => 3,
            'max_length' => 100
        ]);

        TemplateVariable::create([
            'template_id' => $template->id,
            'name' => 'المعدل',
            'type' => 'number',
            'description' => 'المعدل التراكمي',
            'required' => true,
            'min_value' => 0,
            'max_value' => 5,
            'decimal_places' => 2
        ]);
    }

    private function createBaseVariables($template)
    {
        // Common variables for all templates
        TemplateVariable::create([
            'template_id' => $template->id,
            'name' => 'اسم الطالب',
            'type' => 'text',
            'description' => 'الاسم الكامل للطالب',
            'required' => true,
            'order' => 1,
            'min_length' => 3,
            'max_length' => 100
        ]);

        TemplateVariable::create([
            'template_id' => $template->id,
            'name' => 'تاريخ الإصدار',
            'type' => 'date',
            'description' => 'تاريخ إصدار الشهادة',
            'required' => true,
            'order' => 2,
            'format' => 'Y-m-d'
        ]);

        TemplateVariable::create([
            'template_id' => $template->id,
            'name' => 'الرقم المرجعي',
            'type' => 'text',
            'description' => 'الرقم المرجعي للشهادة',
            'required' => true,
            'order' => 3,
            'pattern' => '^[A-Z0-9]{8}$'
        ]);
    }

    private function createProfessionalVariables($template)
    {
        $this->createBaseVariables($template);
        
        TemplateVariable::create([
            'template_id' => $template->id,
            'name' => 'المجال',
            'type' => 'select',
            'description' => 'مجال التدريب',
            'required' => true,
            'order' => 4,
            'options' => json_encode([
                'تقنية المعلومات',
                'إدارة الأعمال',
                'الموارد البشرية',
                'التسويق الرقمي',
                'إدارة المشاريع'
            ])
        ]);

        TemplateVariable::create([
            'template_id' => $template->id,
            'name' => 'مدة التدريب',
            'type' => 'number',
            'description' => 'عدد ساعات التدريب',
            'required' => true,
            'order' => 5,
            'min_value' => 1,
            'max_value' => 1000
        ]);
    }

    private function createAttendanceVariables($template)
    {
        $this->createBaseVariables($template);

        TemplateVariable::create([
            'template_id' => $template->id,
            'name' => 'اسم الفعالية',
            'type' => 'text',
            'description' => 'اسم المؤتمر أو ورشة العمل',
            'required' => true,
            'order' => 6,
            'min_length' => 5,
            'max_length' => 200
        ]);

        TemplateVariable::create([
            'template_id' => $template->id,
            'name' => 'مكان الانعقاد',
            'type' => 'text',
            'description' => 'مكان انعقاد الفعالية',
            'required' => true,
            'order' => 7,
            'min_length' => 3,
            'max_length' => 100
        ]);
    }

    private function createAppreciationVariables($template)
    {
        $this->createBaseVariables($template);

        TemplateVariable::create([
            'template_id' => $template->id,
            'name' => 'سبب التقدير',
            'type' => 'text',
            'description' => 'سبب منح شهادة التقدير',
            'required' => true,
            'order' => 8,
            'min_length' => 10,
            'max_length' => 500
        ]);

        TemplateVariable::create([
            'template_id' => $template->id,
            'name' => 'المستوى',
            'type' => 'select',
            'description' => 'مستوى التقدير',
            'required' => true,
            'order' => 9,
            'options' => json_encode([
                'ممتاز',
                'جيد جداً',
                'جيد',
                'مقبول'
            ])
        ]);
    }

    private function createVolunteerVariables($template)
    {
        $this->createBaseVariables($template);

        TemplateVariable::create([
            'template_id' => $template->id,
            'name' => 'نوع العمل التطوعي',
            'type' => 'text',
            'description' => 'وصف العمل التطوعي',
            'required' => true,
            'order' => 10,
            'min_length' => 5,
            'max_length' => 200
        ]);

        TemplateVariable::create([
            'template_id' => $template->id,
            'name' => 'عدد ساعات التطوع',
            'type' => 'number',
            'description' => 'إجمالي ساعات العمل التطوعي',
            'required' => true,
            'order' => 11,
            'min_value' => 1,
            'max_value' => 1000
        ]);
    }

    private function createStudents()
    {
        // Arabic first names
        $arabicFirstNames = [
            'محمد', 'أحمد', 'عبدالله', 'عبدالرحمن', 'خالد', 'سعد', 'فهد', 'عمر', 'ياسر', 'سلطان',
            'نورة', 'سارة', 'ريم', 'منى', 'لطيفة', 'عائشة', 'فاطمة', 'مريم', 'هند', 'أسماء'
        ];

        // Arabic middle names (father names)
        $arabicMiddleNames = [
            'محمد', 'أحمد', 'عبدالله', 'عبدالرحمن', 'خالد', 'سعد', 'فهد', 'عمر', 'ياسر', 'سلطان',
            'عبدالعزيز', 'إبراهيم', 'سليمان', 'عثمان', 'صالح'
        ];

        // Arabic last names
        $arabicLastNames = [
            'العتيبي', 'القحطاني', 'الغامدي', 'الدوسري', 'المطيري', 'الشهري', 'الزهراني',
            'الحربي', 'السلمي', 'المالكي', 'العمري', 'الشمري', 'الحارثي', 'البقمي', 'الغنام'
        ];

        // Generate 1000 students
        for ($i = 0; $i < 1000; $i++) {
            // Generate random Arabic name
            $firstName = $arabicFirstNames[array_rand($arabicFirstNames)];
            $middleName = $arabicMiddleNames[array_rand($arabicMiddleNames)];
            $lastName = $arabicLastNames[array_rand($arabicLastNames)];
            $fullName = $firstName . ' ' . $middleName . ' ' . $lastName;

            // Randomly decide which fields to include
            $data = [
                'name' => $fullName
            ];

            // 70% chance to have email
            if ($this->faker->boolean(70)) {
                $data['email'] = $this->faker->email();
            }

            // 60% chance to have phone number
            if ($this->faker->boolean(60)) {
                $data['phone_number'] = '05' . $this->faker->numberBetween(00000000, 99999999);
            }

            // 80% chance to have date of birth
            if ($this->faker->boolean(80)) {
                $data['date_of_birth'] = $this->faker->date();
            }

            // 90% chance to have gender
            if ($this->faker->boolean(90)) {
                $data['gender'] = $this->faker->randomElement(['male', 'female']);
            }

            // 75% chance to have nationality
            if ($this->faker->boolean(75)) {
                $data['nationality'] = $this->faker->randomElement([
                    'SA', 'EG', 'JO', 'PS', 'SY', 'LB', 'IQ', 'YE', 'BH', 'KW', 'QA', 'AE', 'OM'
                ]);
            }

            Student::create($data);
        }
    }
}
