<?php

namespace ArranJacques\Taniquetil\Http\Controllers;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\MessageBag;

class TaniquetilController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Return an api response.
     *
     * @param array $data
     * @param bool $status
     * @param int $header
     * @return \Illuminate\Http\JsonResponse
     */
    protected function apiResponse(array $data = [], bool $status = true, $header = 200): JsonResponse
    {
        return response()->json([
            'status' => $status,
            'data' => $this->prepareData($data),
        ], $header);
    }

    /**
     * @param $messages
     * @param string $errorType
     * @param int $headers
     * @return \Illuminate\Http\JsonResponse
     */
    protected function apiErrorResponse($messages = [], string $errorType = 'general', $headers = 200)
    {
        if ($messages instanceof MessageBag) {
            $messages = $messages->messages();
        }

        if (is_string($messages)) {
            $messages = ['error' => [$messages]];
        }

        return $this->apiResponse($data = [
            'errorType' => $errorType,
            'errors' => $messages,
        ], false, $headers);
    }

    /**
     * @param array $data
     * @return array
     */
    protected function prepareData(array $data): array
    {
        $prepared = [];

        foreach ($data as $name => $value) {
            if (is_object($value)) {
                if ($value instanceof Arrayable) {
                    $value = $value->toArray();
                } elseif (method_exists($value, '__toString')) {
                    $value->__toString();
                }
            }
            $prepared[$name] = $value;
        }

        return $prepared;
    }
}
