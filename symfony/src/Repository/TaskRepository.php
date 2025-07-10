<?php

namespace App\Repository;

use App\Entity\Task;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Task>
 */
class TaskRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Task::class);
    }

    public function findByFilters(array $filters = [], array $sort = [], int $page = 1, int $limit = 10): array
    {
        $qb = $this->createQueryBuilder('t');

        if (!empty($filters['status'])) {
            $qb->andWhere('t.status = :status')
                ->setParameter('status', $filters['status']);
        }

        if (!empty($filters['priority'])) {
            $qb->andWhere('t.priority = :priority')
            ->setParameter('priority', $filters['priority']);
        }

        if (!empty($filters['projectId'])) {
            $qb->andWhere('t.project = :projectId')
            ->setParameter('projectId', $filters['projectId']);
        }

        foreach ($sort as $field => $direction) {
            $direction = strtoupper($direction);
            if (!in_array($direction, ['ASC', 'DESC'])) {
                $direction = 'ASC';
            }

            if ($field === 'priority') {
                // Custom CASE order for priority
                $caseExpr = "CASE t.priority
                    WHEN 'high' THEN 3
                    WHEN 'medium' THEN 2
                    WHEN 'low' THEN 1
                    ELSE 4
                END";

                $qb->addOrderBy($caseExpr, $direction);
            } elseif (in_array($field, ['createdAt', 'deadline'])) {
                $qb->addOrderBy('t.' . $field, $direction);
            }
        }

        $offset = ($page - 1) * $limit;
        $qb->setFirstResult($offset)
           ->setMaxResults($limit);

        return $qb->getQuery()->getResult();
    }

    public function countByFilters(array $filters = []): int
    {
        $qb = $this->createQueryBuilder('t')
            ->select('COUNT(t.id)');

        if (!empty($filters['status'])) {
            $qb->andWhere('t.status = :status')
                ->setParameter('status', $filters['status']);
        }

        if (!empty($filters['priority'])) {
            $qb->andWhere('t.priority = :priority')
                ->setParameter('priority', $filters['priority']);
        }

        if (!empty($filters['projectId'])) {
            $qb->andWhere('t.project = :projectId')
                ->setParameter('projectId', $filters['projectId']);
        }

        return (int) $qb->getQuery()->getSingleScalarResult();
    }

    //    /**
    //     * @return Task[] Returns an array of Task objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('t.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Task
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
