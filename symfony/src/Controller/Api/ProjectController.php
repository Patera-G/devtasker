<?php
namespace App\Controller\Api;

use App\Entity\User;
use App\Entity\Project;
use App\DTO\ProjectDTO;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/projects', name: 'api_projects_')]
class ProjectController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private ProjectRepository $projectRepository,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator
    ) {}

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(): Response
    {
        $projects = $this->projectRepository->findAll();
        $json = $this->serializer->serialize($projects, 'json', ['groups' => 'project:read']);
        return new Response($json, 200, ['Content-Type' => 'application/json']);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): Response
    {
        $project = $this->projectRepository->find($id);
        if (!$project) {
            return $this->json(['error' => 'Project not founnd'], 404);
        }
        $json = $this->serializer->serialize($project, 'json', ['groups' => 'project:read']);
        return new Response($json, 200, ['Content-Type' => 'application/json']);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): Response
    {
        $dto = $this->serializer->deserialize($request->getContent(), ProjectDTO::class, 'json');

        $errors = $this->validator->validate($dto);
        if (count($errors) > 0) {
            return $this->json($errors, 400);
        }

        $project = new Project();
        $project->setName($dto->name);
        $project->setDescription($dto->description);
        $project->setDeadline($dto->deadline);
        $project->setCreatedAt(new \DateTimeImmutable());

        $user = $this->getUser();
        if (!$user) {
            $user = $this->em->getRepository(User::class)->findOneBy(['email' => 'dev@example.com']);    
            if (!$user instanceof User) {
                return $this->json(['error' => 'User not authenticated'], 401);
            }
        }
        $project->setUser($user);

        $errors = $this->validator->validate($project);
        if (count($errors) > 0) {
            return $this->json($errors, 400);
        }

        $this->em->persist($project);
        $this->em->flush();

        $json = $this->serializer->serialize($project, 'json', ['groups' => 'project:read']);
        return new Response($json, 201, ['Content-Type' => 'application/json']);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(Request $request, int $id): Response
    {
        $project = $this->projectRepository->find($id);
        if (!$project) {
            return $this->json(['error' => 'Project not found'], 404);
        }

        $dto = $this->serializer->deserialize($request->getContent(), ProjectDTO::class, 'json');
        $errors = $this->validator->validate($dto);
        if (count($errors) > 0) {
            return $this->json($errors, 400);
        }

        if (isset($dto->name)) {
            $project->setName($dto->name);
        }
        if (isset($dto->description)) {
            $project->setDescription($dto->description);
        }
        if (isset($dto->deadline)) {
            $project->setDeadline(new \DateTimeImmutable($dto->deadline));
        }

        $errors = $this->validator->validate($project);
        if (count($errors) > 0) {
            return $this->json($errors, 400);
        }

        $this->em->flush();

        $json = $this->serializer->serialize($project, 'json', ['groups' => 'project:read']);
        return new Response($json, 200, ['Content-Type' => 'application/json']);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): Response
    {
        $project = $this->projectRepository->find($id);
        if (!$project) {
            return $this->json(['error' => 'Project not found'], 404);
        }
        $this->em->remove($project);
        $this->em->flush();

        return $this->json(null, 204);
    }
}