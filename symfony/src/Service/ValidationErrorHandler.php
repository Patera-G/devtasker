<?php

namespace App\Service;

use Symfony\Component\Validator\ConstraintViolationListInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ValidationErrorHandler
{
    public function handle(ConstraintViolationListInterface $errors): JsonResponse
    {
        $violations = [];
        foreach ($errors as $error) {
            $violations[] = [
                'propertyPath' => $error->getPropertyPath(),
                'title' => $error->getMessage(),
            ];
        }

        return new JsonResponse([
            'type' => 'https://symfony.com/errors/validation',
            'title' => 'Validation Failed',
            'detail' => implode("\n", array_map(
                fn($v) => $v['propertyPath'] . ': ' . $v['title'],
                $violations
            )),
            'violations' => $violations
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}