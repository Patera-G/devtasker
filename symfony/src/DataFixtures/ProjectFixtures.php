<?php
namespace App\DataFixtures;

use App\Entity\Project;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class ProjectFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $user = $this->getReference('user_demo', 'App\Entity\User');

        $project = new Project();
        $project->setUser($user);
        $project->setName('Demo DevTasker Project');
        $project->setdescription('Sample project to test tasks');
        $project->setCreatedAt(new \DateTimeImmutable());
        $project->setDeadline(new \DateTimeImmutable('+1 month'));

        $manager->persist($project);
        $manager->flush();

        $this->addReference('project_demo', $project);
    }

    public function getDependencies(): array
    {
        return [UserFixtures::class];
    }
}