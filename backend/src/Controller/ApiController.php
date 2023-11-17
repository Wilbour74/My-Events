<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Nelmio\CorsBundle\Annotation\Cors;
use Nelmio\CorsBundle\NelmioCorsBundle;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Sortie;
use App\Entity\User1;
use App\Entity\Chat;
use App\Entity\MembresSortie;
use Symfony\Component\HttpFoundation\Request;
use DateTime;
use Symfony\Component\HttpFoundation\JsonResponse;


class ApiController extends AbstractController
{
    #[Route('/make/sortie', name: 'make_sortie')]
    public function createSortie(EntityManagerInterface $entityManager, Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $Sortie = new Sortie();
        $Sortie->setIdEvent($data["id"]);
        $Sortie->setNom($data["nom"]);
        // $Sortie->setStartDate($data["start"]);
        $dateDebut = new DateTime($data["start"]);
        $Sortie->setStartDate($dateDebut);
        // $Sortie->setEndDate($data["end"]);
        $dateFin = new DateTime($data["end"]);
        $Sortie->setEndDate($dateFin);
        $Sortie->setMadeById($data["id_user"]);
        $Sortie->setStatut(false);
        $Sortie->setPhoto($data["photo"]);
        
        

        $entityManager->persist($Sortie);
        $entityManager->flush();
        $id_sortie = $Sortie->getId();
        $membre = new MembresSortie();
        $membre->setIdSortie($id_sortie);
        $membre->setIdUser($data["id_user"]);
        $membre->setIsCreator(true);
        $entityManager->persist($membre);
        $entityManager->flush();


        return new Response("Salut");

    }
    #[Route('/make/user', name: "make_user")]
    public function createUser(EntityManagerInterface $entityManager, Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $email = $data["email"];
        $pseudo = $data["pseudo"];
        $photo = $data["photo"];
        $description = $data["description"];
        $userRepo = $entityManager->getRepository(User1::class);
        $user = $userRepo->findBy(["mail" => $email]);

        if ($user) {
            $userId = $user[0]->getId();
            $responseData = ['message' => 'L\'email existe déjà', 'userId' => $userId];
            $response = new JsonResponse($responseData);
            return $response;

        } else {
            $user1 = new User1();
            $user1->setAvatar($photo);
            $user1->setDescription($description);
            $user1->setMail($email);
            $user1->setPseudo($pseudo);

            $entityManager->persist($user1);
            $entityManager->flush();

            $newUserId = $user1->getId();

            $responseData = ['message' => 'Ton compte a été enregistré', 'userId' => $newUserId];
            $response = new JsonResponse($responseData);
            return $response;
        }

    }
    #[Route('/get/user', name: "get_user")]
    public function getUserData(EntityManagerInterface $entityManager) : Response
    {
        $users = $entityManager->getRepository(User1::class)->findAll();
    

        $usersData = [];

        foreach($users as $user){
            $usersData[] = [
                "id" => $user->getId(),
                "pseudo" => $user->getPseudo(),
             ] ;
        }

        return new JsonResponse($usersData);
    }

    #[Route('/event/user/{id_sortie}', name: "event_user")]
    public function getEventUser(EntityManagerInterface $entityManager, $id_sortie): Response
    {
        $membres = $entityManager->getRepository(MembresSortie::class)->findBy(["id_sortie" => $id_sortie]);

    $usersData = [];

    foreach ($membres as $membre) {

        $user = $entityManager->getRepository(User1::class)->find($membre->getIdUser());

        if ($user) {
            $usersData[] = [
                "id" => $user->getId(),
                "pseudo" => $user->getPseudo(),
            ];
        }
    }

    return new JsonResponse($usersData);
}
     #[Route('/list/sortie', name: "list_sortie")]
     public function getSortie(EntityManagerInterface $entityManager)
     {
        $sorties = $entityManager->getRepository(Sortie::class)->findAll();

        $sortiesData = [];

        foreach($sorties as $sortie){

            $sortiesData [] = [
                "nom" => $sortie->getNom(),
                "date_debut" => $sortie->getStartDate(),
                "date_fin" => $sortie->getEndDate(),
                "accessibilité" => $sortie->isStatut(),
                "photo_url" => $sortie->getPhoto(),
                
            ];
        }

        return new JsonResponse($sortiesData);
     }

     #[Route('/message/{id_sortie}', name: "message")]
     public function getMessage(EntityManagerInterface $entityManager, $id_sortie) : Response
     {
        $messages = $entityManager->getRepository(Chat::class)->findBy(["id_sortie" => $id_sortie]);

        $messageData = [];

        foreach($messages as $message){
            $user = $entityManager->getRepository(User1::class)->findOneBy(["id" => $message->getIdUser()]);
            $messageData[] = [
                "message" => $message->getMessage(),
                "pseudo" => $user->getPseudo(),
            ];
        }
        return new JsonResponse($messageData);
     }

     #[Route('/create', name: "message")]
     public function createMessage(EntityManagerInterface $entityManager, Request $request)
     {
        $data = json_decode($request->getContent(), true);
        $message1 = $data["message"];
        $id_sortie = $data["sortieId"];
        $id_user = $data["id_user"];

        $message = new Chat();
        $message->setMessage($message1);
        $message->setIdSortie($id_sortie);
        $message->setIdUser($id_user);
        $message->setTimestamp(new \Datetime());

        $entityManager->persist($message);
        $entityManager->flush();
        return new Response("C'est bon ça marche");
     }

     #[Route('/sortie/{id}', name: "get_sortie_by_id")]
public function getSortieById(EntityManagerInterface $entityManager, $id)
{
    $sortie = $entityManager->getRepository(Sortie::class)->find($id);

    if (!$sortie) {
        throw $this->createNotFoundException('Sortie non trouvée pour l\'ID ' . $id);
    }

    $sortieData = [
        "id" => $sortie->getId(),
        "nom" => $sortie->getNom(),
        "date_debut" => $sortie->getStartDate(),
        "date_fin" => $sortie->getEndDate(),
        "accessibilite" => $sortie->isStatut(),
        "photo_url" => $sortie->getPhoto(),
    ];

    return new JsonResponse($sortieData);
}

}