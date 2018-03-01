<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Pallant\Taniquetil\Support\Traits\DatabaseConnection;

class CreateTaniquetilRequestInputTable extends Migration
{
    use DatabaseConnection;

    /**
     * CreateTaniquetilRequestInputTable constructor.
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
        Schema::connection($this->connection)->create('taniquetil_request_input', function (Blueprint $table) {

            $table->integer('request')->unsigned();
            $table->string('type', 4);
            $table->string('key');
            $table->text('value')->nullable();

            $table->foreign('request')->references('id')->on('taniquetil_requests');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::connection($this->connection)->dropIfExists('taniquetil_request_input');
    }
}
