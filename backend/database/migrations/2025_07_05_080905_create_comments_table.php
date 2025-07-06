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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // Admin ekleyeceği için nullable
            $table->string('author_name'); // Yorumun görünen ismi (admin panelde girilecek)
            $table->string('author_email')->nullable(); // Admin panelde girilecek
            $table->string('author_avatar')->nullable(); // Admin panelde girilecek
            $table->text('content');
            $table->enum('status', ['pending', 'approved', 'spam'])->default('approved'); // Admin eklediği için approved
            $table->foreignId('parent_id')->nullable()->constrained('comments')->onDelete('cascade'); // Nested comments için
            $table->integer('likes_count')->default(0);
            $table->timestamps();

            $table->index(['post_id', 'status']);
            $table->index(['user_id', 'status']);
            $table->index(['parent_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
