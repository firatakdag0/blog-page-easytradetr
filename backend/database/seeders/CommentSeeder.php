<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $posts = Post::all();

        $comments = [
            [
                'post_id' => 1,
                'author_name' => 'Ayşe Özkan',
                'author_email' => 'ayse.ozkan@example.com',
                'content' => 'Çok faydalı bir yazı olmuş, teşekkürler! Özellikle dijital dönüşüm konusundaki örnekler çok açıklayıcıydı. EasyTrade\'in çözümleri gerçekten işletmemize çok yardımcı oldu.',
                'status' => 'approved',
            ],
            [
                'post_id' => 1,
                'author_name' => 'Mehmet Yıldız',
                'author_email' => 'mehmet.yildiz@example.com',
                'content' => 'Bu konuda daha detaylı bilgi alabilir miyim? Özellikle barkod sistemi kurulumu hakkında. Küçük bir market işletiyorum ve bu sistemleri entegre etmek istiyorum.',
                'status' => 'pending',
            ],
            [
                'post_id' => 2,
                'author_name' => 'Fatma Kaya',
                'author_email' => 'fatma.kaya@example.com',
                'content' => 'Harika açıklamalar, işime çok yarayacak. Teşekkür ederim. Barkod sistemi kurduktan sonra stok takibimiz çok daha kolay hale geldi.',
                'status' => 'approved',
            ],
            [
                'post_id' => 2,
                'author_name' => 'Ali Demir',
                'author_email' => 'ali.demir@example.com',
                'content' => 'Bu sistemin maliyeti nedir? Küçük işletmeler için uygun mu? Detaylı bilgi alabilir miyim?',
                'status' => 'approved',
            ],
            [
                'post_id' => 3,
                'author_name' => 'Zeynep Arslan',
                'author_email' => 'zeynep.arslan@example.com',
                'content' => 'POS sistemleri konusunda çok değerli bilgiler paylaşmışsınız. Uygulamaya başlayacağım. EasyTrade\'in POS çözümleri gerçekten kullanıcı dostu.',
                'status' => 'approved',
            ],
            [
                'post_id' => 3,
                'author_name' => 'Can Özkan',
                'author_email' => 'can.ozkan@example.com',
                'content' => 'Müşteri deneyimi konusunda çok değerli bilgiler paylaşmışsınız. Uygulamaya başlayacağım.',
                'status' => 'pending',
            ],
            [
                'post_id' => 4,
                'author_name' => 'Elif Yılmaz',
                'author_email' => 'elif.yilmaz@example.com',
                'content' => 'Bulut teknolojisi gerçekten işletmemizi kurtardı. Artık her yerden erişebiliyoruz. EasyTrade\'in cloud çözümleri çok güvenilir.',
                'status' => 'approved',
            ],
            [
                'post_id' => 5,
                'author_name' => 'Burak Kaya',
                'author_email' => 'burak.kaya@example.com',
                'content' => 'Perakende sektöründe çalışıyorum ve bu yazı çok işime yaradı. Müşteri deneyimi gerçekten çok önemli.',
                'status' => 'approved',
            ],
            [
                'post_id' => 6,
                'author_name' => 'Selin Özkan',
                'author_email' => 'selin.ozkan@example.com',
                'content' => 'Ön muhasebe yazılımı seçerken bu kriterler çok yardımcı oldu. EasyTrade\'in çözümleri gerçekten kapsamlı.',
                'status' => 'approved',
            ],
            [
                'post_id' => 7,
                'author_name' => 'Deniz Yıldız',
                'author_email' => 'deniz.yildiz@example.com',
                'content' => 'Stok yönetimi konusunda yaşadığımız sorunları bu yazı sayesinde çözdük. Teşekkürler!',
                'status' => 'approved',
            ],
            [
                'post_id' => 8,
                'author_name' => 'Gizem Arslan',
                'author_email' => 'gizem.arslan@example.com',
                'content' => 'CRM sistemleri gerçekten müşteri ilişkilerimizi güçlendirdi. EasyTrade\'in CRM çözümü çok kullanışlı.',
                'status' => 'approved',
            ],
            [
                'post_id' => 1,
                'author_name' => 'Spam User',
                'author_email' => 'spam@spam.com',
                'content' => 'Click here for amazing deals! Buy now and get 50% off!',
                'status' => 'spam',
            ],
        ];

        foreach ($comments as $commentData) {
            Comment::create($commentData);
        }

        // Post comment count'larını güncelle
        foreach ($posts as $post) {
            $post->comments_count = Comment::where('post_id', $post->id)->where('status', 'approved')->count();
            $post->save();
        }
    }
}
