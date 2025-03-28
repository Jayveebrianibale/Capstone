<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('programs', function (Blueprint $table) {
            if (!Schema::hasColumn('programs', 'code')) {
                $table->string('code')->unique()->after('name');
            }
            if (!Schema::hasColumn('programs', 'year_level')) {
                $table->string('year_level')->nullable()->after('code');
            }
        });
    }

    public function down()
    {
        Schema::table('programs', function (Blueprint $table) {
            if (Schema::hasColumn('programs', 'code')) {
                $table->dropColumn('code');
            }
            if (Schema::hasColumn('programs', 'year_level')) {
                $table->dropColumn('year_level');
            }
        });
    }
};


