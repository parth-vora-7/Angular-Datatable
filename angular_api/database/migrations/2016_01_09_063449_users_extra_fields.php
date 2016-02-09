<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UsersExtraFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name');
	    $table->string('last_name');
	    $table->longText('address');
	    $table->string('phone_no');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
	Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('first_name');
	    $table->dropColumn('last_name');
	    $table->dropColumn('address');
	    $table->dropColumn('phone_no');
        });	
    }
}
