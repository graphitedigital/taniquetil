<?php

namespace ArranJacques\Taniquetil\Http\Controllers\Api;

use ArranJacques\Taniquetil\ExceptionRepository;
use ArranJacques\Taniquetil\Http\Controllers\TaniquetilController;

class ChartsApiController extends TaniquetilController
{
    /**
     * @var \ArranJacques\Taniquetil\ExceptionRepository
     */
    protected $exceptionRepo;

    /**
     * ChartsApiController constructor.
     *
     * @param \ArranJacques\Taniquetil\ExceptionRepository $exceptionRepo
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