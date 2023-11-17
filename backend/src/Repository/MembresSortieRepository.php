<?php

namespace App\Repository;

use App\Entity\MembresSortie;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<MembresSortie>
 *
 * @method MembresSortie|null find($id, $lockMode = null, $lockVersion = null)
 * @method MembresSortie|null findOneBy(array $criteria, array $orderBy = null)
 * @method MembresSortie[]    findAll()
 * @method MembresSortie[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MembresSortieRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MembresSortie::class);
    }

//    /**
//     * @return MembresSortie[] Returns an array of MembresSortie objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('m.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?MembresSortie
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
