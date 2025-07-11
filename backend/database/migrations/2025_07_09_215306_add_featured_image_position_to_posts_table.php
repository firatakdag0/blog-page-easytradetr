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
        Schema::table('posts', function (Blueprint $table) {
            $table->float('featured_image_position_x')->nullable()->after('featured_image');
            $table->float('featured_image_position_y')->nullable()->after('featured_image_position_x');
            $table->float('featured_image_scale')->nullable()->after('featured_image_position_y');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('featured_image_position_x');
            $table->dropColumn('featured_image_position_y');
            $table->dropColumn('featured_image_scale');
        });
    }
};
