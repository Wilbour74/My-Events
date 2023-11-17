<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;


class RegisterController extends AbstractController
{
    #[Route('/register', name: 'app_register')]
    public function createUser(Request $request, EntityManagerInterface $entityManager)
    {
        $data = json_decode($request->getContent(), true);


        $user = new User();

        $user->setEmail($data['email']);
        $user->setPassword($data['password']);
        $user->setPseudo($data['pseudo']);
        $user->setDescription($data['description']);
        $user->setAvatar($data['photoURL']); 

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateur créé avec succès'], JsonResponse::HTTP_CREATED);
    }
}
