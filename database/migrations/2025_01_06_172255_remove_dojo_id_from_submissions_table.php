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
        Schema::table('submissions', function (Blueprint $table) {
            // Drop the foreign key constraint
            $table->dropForeign(['dojo_id']);
            // Drop the dojo_id column
            $table->dropColumn('dojo_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            // Add the dojo_id column back
            $table->unsignedBigInteger('dojo_id');
            // Add the foreign key constraint back
            $table->foreign('dojo_id')->references('id')->on('dojos')->constrained()->cascadeOnDelete();
        });
    }
};