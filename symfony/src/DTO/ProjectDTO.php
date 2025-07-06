<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class ProjectDTO
{
    #[Assert\NotBlank(message:"Name is required.")]
    #[Assert\Length(max: 255)]
    public ?string $name = null;

    #[Assert\Length(max: 1000)]
    public ?string $description = null;

    #[Assert\DateTime(format: 'Y-m-d H:i:s', message: 'Invalid date format. Use "Y-m-d H:i:s".')]
    public ?string $deadline = null;

    public ?int $userId = null;

    public function __construct(?string $name = null, ?string $description = null, ?string $deadline = null, ?int $userId = null)
    {
        $this->name = $name;
        $this->description = $description;
        $this->deadline = $deadline;
        $this->userId = $userId;
    }
}