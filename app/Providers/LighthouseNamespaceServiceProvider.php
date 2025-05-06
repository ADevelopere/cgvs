<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\GraphQL\Contracts\LighthouseModel;
use App\GraphQL\Contracts\LighthouseQuery;
use App\GraphQL\Contracts\LighthouseMutation;
use App\GraphQL\Contracts\LighthouseType;
use Symfony\Component\Finder\Finder;
use ReflectionClass;

class LighthouseNamespaceServiceProvider extends ServiceProvider
{
    protected $interfaceMap = [
        'models' => LighthouseModel::class,
        'queries' => LighthouseQuery::class,
        'mutations' => LighthouseMutation::class,
        'types' => LighthouseType::class,
        // Add more mappings as needed
    ];

    public function register()
    {
        $namespaces = [];
        foreach ($this->interfaceMap as $key => $interface) {
            $namespaces[$key] = $this->discoverClasses($interface);
        }
        
        // Merge with existing lighthouse config
        $this->mergeConfigFrom(config_path('lighthouse.php'), 'lighthouse');
        config(['lighthouse.namespaces' => array_merge(
            config('lighthouse.namespaces', []),
            $namespaces
        )]);
    }

    protected function discoverClasses(string $interface): array
    {
        $appPath = base_path('app');
        $namespaces = [];

        foreach ((new Finder)->in($appPath)->files()->name('*.php') as $file) {
            $className = str_replace(
                ['/', '.php'],
                ['\\', ''],
                substr($file->getRealPath(), strlen(base_path('app')) + 1)
            );

            $className = 'App\\' . $className;

            try {
                if (!class_exists($className)) {
                    continue;
                }

                $reflection = new ReflectionClass($className);
                
                if (!$reflection->isAbstract() && $reflection->implementsInterface($interface)) {
                    $namespace = $reflection->getNamespaceName();
                    if (!in_array($namespace, $namespaces)) {
                        $namespaces[] = $namespace;
                    }
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        return array_unique($namespaces);
    }
}