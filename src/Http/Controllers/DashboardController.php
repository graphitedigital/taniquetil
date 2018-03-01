<?php

namespace Pallant\Taniquetil\Http\Controllers;

class DashboardController extends TaniquetilController
{
    /**
     * Handle GET requests to all dashboard routes.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getIndex()
    {
        return view('taniquetil::dashboard');
    }

}
