<?php
namespace App\DataFixtures;

use App\Entity\Task;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class TaskFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $project = $this->getReference('project_demo', 'App\Entity\Project');

        $task1 = new Task();
        $task1->setProject($project);
        $task1->setTitle('Set up project repository');
        $task1->setDescription('Initialize git repo and basic structure');
        $task1->setStatus('todo');
        $task1->setPriority('high');
        $task1->setCreatedAt(new \DateTimeImmutable());
        $task1->setDueDate(new \DateTimeImmutable('+1 week'));

        $manager->persist($task1);

        $task2 = new Task();
        $task2->setProject($project);
        $task2->setTitle('Create Docker environment');
        $task2->setDescription('Docker-compose, PHP, Nginx, DB services.');
        $task2->setStatus('in_progress');
        $task2->setPriority('medium');
        $task2->setCreatedAt(new \DateTimeImmutable());
        $task2->setDueDate(new \DateTimeImmutable('+14 days'));

        $manager->persist($task2);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [ProjectFixtures::class];
    }
}