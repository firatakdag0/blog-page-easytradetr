<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Dosya adı
            $table->string('filename'); // Dosya adı (orijinal)
            $table->string('path'); // Dosya yolu
            $table->string('url'); // Erişim URL'i
            $table->bigInteger('size'); // Dosya boyutu (byte)
            $table->string('mime_type'); // MIME type
            $table->integer('width')->nullable(); // Genişlik (resim için)
            $table->integer('height')->nullable(); // Yükseklik (resim için)
            $table->text('alt_text')->nullable(); // Alt text
            $table->text('caption')->nullable(); // Açıklama
            $table->boolean('is_active')->default(true); // Aktif mi
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
