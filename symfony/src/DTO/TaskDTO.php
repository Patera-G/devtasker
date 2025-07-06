<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class TaskDTO
{
    #[Assert\NotBlank(message: "Title is required.")]
    #[Assert\Length(max: 255)]
    public ?string $title = null;

    #[Assert\Length(max: 1000)]
    public ?string $description = null;

    #[Assert\Choice(choices: ['todo', 'in_progress', 'done'], message: 'Choose a valid status.')]
    public ?string $status = null;

    #[Assert\Choice(choices: ['low', 'medium', 'high'], message: 'Choose a valid priority.')]
    public ?string $priority = null;

    #[Assert\DateTime(format: 'Y-m-d H:i:s', message: 'Invalid date format. Use "Y-m-d H:i:s".')]
    public ?string $dueDate = null;

    public ?int $projectId = null;

    public function __construct(
        ?string $title = null,
        ?string $description = null,
        ?string $status = null,
        ?string $priority = null,
        ?string $dueDate = null,
        ?int $projectId = null
    ) {
        $this->title = $title;
        $this->description = $description;
        $this->status = $status;
        $this->priority = $priority;
        $this->dueDate = $dueDate;
        $this->projectId = $projectId;
    }
}