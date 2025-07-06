<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class OptimizeDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:optimize {--analyze : Analyze table statistics} {--cache : Clear and warm cache}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Optimize database performance by analyzing tables and clearing cache';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Database optimization started...');

        if ($this->option('analyze')) {
            $this->analyzeTables();
        }

        if ($this->option('cache')) {
            $this->clearAndWarmCache();
        }

        $this->info('✅ Database optimization completed!');
    }

    private function analyzeTables()
    {
        $this->info('📊 Analyzing table statistics...');

        $tables = ['posts', 'categories', 'tags', 'comments', 'likes', 'saves', 'users'];

        foreach ($tables as $table) {
            try {
                DB::statement("ANALYZE TABLE {$table}");
                $this->line("✓ Analyzed table: {$table}");
            } catch (\Exception $e) {
                $this->warn("⚠ Could not analyze table {$table}: " . $e->getMessage());
            }
        }
    }

    private function clearAndWarmCache()
    {
        $this->info('🗑️ Clearing cache...');
        Cache::flush();
        $this->line('✓ Cache cleared');

        $this->info('🔥 Warming up cache...');

        // Cache'leri yeniden oluştur
        try {
            // Categories cache
            \App\Models\Category::active()->ordered()->withCount('posts')->get();
            $this->line('✓ Categories cache warmed');

            // Featured posts cache
            \App\Models\Post::selectForList()
                ->with(['category:id,name,slug,color', 'author:id,name,avatar', 'tags:id,name,slug,color'])
                ->featured()
                ->published()
                ->orderBy('published_at', 'desc')
                ->limit(10)
                ->get();
            $this->line('✓ Featured posts cache warmed');

            // Trending posts cache
            \App\Models\Post::selectForList()
                ->with(['category:id,name,slug,color', 'author:id,name,avatar', 'tags:id,name,slug,color'])
                ->trending()
                ->published()
                ->orderBy('published_at', 'desc')
                ->limit(10)
                ->get();
            $this->line('✓ Trending posts cache warmed');

        } catch (\Exception $e) {
            $this->warn("⚠ Could not warm cache: " . $e->getMessage());
        }
    }
}
