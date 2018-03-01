<?php

namespace Pallant\Taniquetil\Http\Controllers\Api;

use Pallant\Taniquetil\ExceptionRepository;
use Pallant\Taniquetil\Http\Controllers\TaniquetilController;

class ChartsApiController extends TaniquetilController
{
    /**
     * @var \Pallant\Taniquetil\ExceptionRepository
     */
    protected $exceptionRepo;

    /**
     * ChartsApiController constructor.
     *
     * @param \Pallant\Taniquetil\ExceptionRepository $exceptionRepo
     */
    public function __construct(ExceptionRepository $exceptionRepo)
    {
        $this->exceptionRepo = $exceptionRepo;
    }

    /**
     * Handle GET requests to the "taniquetil::api.charts.count-over-time" route.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCountOverTime()
    {
        $data = $this->exceptionRepo->includeArchived()->getDailyCounts(30);

        return $this->apiResponse(['data' => $data]);
    }

}