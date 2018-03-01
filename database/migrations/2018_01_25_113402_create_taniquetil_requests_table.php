<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Pallant\Taniquetil\Support\Traits\DatabaseConnection;

class CreateTaniquetilRequestsTable extends Migration
{
    use DatabaseConnection;

    /**
     * CreateTaniquetilRequestsTable constructor.
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
        Schema::connection($this->connection)->create('taniquetil_requests', function (Blueprint $table) {

            $table->increments('id');
            $table->integer('exception')->unsigned();
            $table->tinyInteger('console')->nullable();
            $table->string('user', 255)->nullable();
            $table->text('url')->nullable();
            $table->string('protocol', 5)->nullable();
            $table->string('domain', 255)->nullable();
            $table->text('uri')->nullable();
            $table->string('route_name', 255)->nullable();
            $table->text('referrer')->nullable();
            $table->string('user_agent', 255)->nullable();
            $table->string('ip', 45)->nullable();

            $table->foreign('exception')->references('id')->on('taniquetil_exceptions');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::connection($this->connection)->dropIfExists('taniquetil_requests');
    }
}
