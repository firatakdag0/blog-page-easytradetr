<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Post;
use Illuminate\Support\Facades\Log;

class PublishScheduledPosts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'posts:publish-scheduled';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Zamanlanmış içerikleri otomatik olarak yayınlar';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Zamanlanmış içerikler kontrol ediliyor...');

        // Zamanlanmış ve yayın zamanı gelmiş içerikleri bul
        $scheduledPosts = Post::where('status', 'scheduled')
            ->where('published_at', '<=', now())
            ->get();

        if ($scheduledPosts->isEmpty()) {
            $this->info('Yayınlanacak zamanlanmış içerik bulunamadı.');
            return 0;
        }

        $publishedCount = 0;

        foreach ($scheduledPosts as $post) {
            try {
                $post->update([
                    'status' => 'published',
                    'published_at' => now()
                ]);

                $this->info("✓ '{$post->title}' başarıyla yayınlandı.");
                Log::info("Scheduled post published: {$post->title} (ID: {$post->id})");
                $publishedCount++;

            } catch (\Exception $e) {
                $this->error("✗ '{$post->title}' yayınlanırken hata oluştu: " . $e->getMessage());
                Log::error("Failed to publish scheduled post: {$post->title} (ID: {$post->id})", [
                    'error' => $e->getMessage()
                ]);
            }
        }

        $this->info("Toplam {$publishedCount} içerik yayınlandı.");
        return 0;
    }
}
