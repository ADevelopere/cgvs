<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Model;
use Symfony\Component\Finder\Finder;
use ReflectionClass;

class LighthouseModelServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register()
    {
        $modelNamespaces = $this->discoverModels();

        // Merge with existing lighthouse config
        config(['lighthouse.namespaces.models' => $modelNamespaces]);
    }

    protected function discoverModels(): array
    {
        $appPath = base_path('app');
        $modelNamespaces = [];

        foreach ((new Finder)->in($appPath)->files() as $file) {
            $className = str_replace(
                ['/', '.php'],
                ['\\', ''],
                substr($file->getRealPath(), strlen(base_path('app')) + 1)
            );

            $className = 'App\\' . $className;

            try {
                $reflection = new ReflectionClass($className);

                if ($reflection->isSubclassOf(Model::class) && !$reflection->isAbstract()) {
                    $namespace = $reflection->getNamespaceName();
                    if (!in_array($namespace, $modelNamespaces)) {
                        $modelNamespaces[] = $namespace;
                    }
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        return array_unique($modelNamespaces);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
