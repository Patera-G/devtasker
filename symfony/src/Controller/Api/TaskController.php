<?php

namespace App\Controller\Api;

use App\Entity\Task;
use App\Entity\Project;
use App\DTO\TaskDTO;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_USER')]
#[Route('/api/tasks', name: 'api_tasks_')]
class TaskController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private TaskRepository $taskRepository,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator
    ) {}

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request): Response
    {
        $filters = [
            'status' => $request->query->get('status'),
            'priority' => $request->query->get('priority'),
            'projectId' => $request->query->get('projectId'),
        ];

        $sort = [];
        $sortField = $request->query->get('sort');
        $sortOrder = $request->query->get('direction', 'asc');
        if ($sortField) {
            $sort[$sortField] = $sortOrder;
        }

        $page = max(1, (int) $request->query->get('page', 1));
        $limit = min(100, (int) $request->query->get('limit', 10));

        $tasks = $this->taskRepository->findByFilters($filters, $sort, $page, $limit);
        $total = $this->taskRepository->countByFilters($filters);

        $json = $this->serializer->serialize($tasks, 'json', ['groups' => 'task:read']);
        
        return $this->json([
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'data' => json_decode($json)
        ]);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): Response
    {
        $task = $this->taskRepository->find($id);
        if (!$task) {
            return $this->json(['error' => 'Task not found'], 404);
        }

        $json = $this->serializer->serialize($task, 'json', ['groups' => 'task:read']);
        return new Response($json, 200, ['Content-Type' => 'application/json']);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): Response
    {
        $dto = $this->serializer->deserialize($request->getContent(), TaskDTO::class, 'json');
        $errors = $this->validator->validate($dto);

        if (count($errors) > 0) {
            return $this->json($errors, 400);
        }

        $task = new Task();
        $this->mapDtoToTask($dto, $task);
        $task->setCreatedAt(new \DateTimeImmutable());

        $this->em->persist($task);
        $this->em->flush();

        $json = $this->serializer->serialize($task, 'json', ['groups' => 'task:read']);
        return new Response($json, 201, ['Content-Type' => 'application/json']);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(Request $request, int $id): Response
    {
        $task = $this->taskRepository->find($id);
        if (!$task) {
            return $this->json(['error' => 'Task not found'], 404);
        }

        $dto = $this->serializer->deserialize($request->getContent(), TaskDTO::class, 'json');
        $errors = $this->validator->validate($dto);

        if (count($errors) > 0) {
            return $this->json($errors, 400);
        }

        $task->setTitle($dto->title);
        $this->mapDtoToTask($dto, $task);

        $this->em->flush();

        $json = $this->serializer->serialize($task, 'json', ['groups' => 'task:read']);
        return new Response($json, 200, ['Content-Type' => 'application/json']);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): Response
    {
        $task = $this->taskRepository->find($id);
        if (!$task) {
            return $this->json(['error' => 'Task not found'], 404);
        }

        $this->em->remove($task);
        $this->em->flush();

        return $this->json(null, 204);
    }

    private function mapDtoToTask(TaskDTO $dto, Task $task): ?Response
    {
        $project = $this->em->getRepository(Project::class)->find($dto->projectId);
        if (!$project) {
            return $this->json(['error' => 'Project not found.'], 404);
        }

        $task->setTitle($dto->title);
        $task->setDescription($dto->description);
        $task->setStatus($dto->status);
        $task->setPriority($dto->priority);
        $task->setDueDate(new \DateTimeImmutable($dto->dueDate));
        $task->setProject($project);

        return null;
    }

}
