<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Pallant\Taniquetil\Support\Traits\DatabaseConnection;

class CreateTaniquetilExceptionsTable extends Migration
{
    use DatabaseConnection;

    /**
     * CreateTaniquetilExceptionsTable constructor.
     */
    public function __construct()
    {
        $this->connection = $this->getCorrespondingConnection(config('taniquetil.database-connection'));
    }

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('taniquetil_exceptions', function (Blueprint $table) {
            $table->increments('id');
            $table->string('type', 255);
            $table->text('message');
            $table->string('code', 255);
            $table->string('file', 255);
            $table->integer('line');
            $table->text('trace');
            $table->timestampTz('datetime', 0)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('taniquetil_exceptions');
    }

}
