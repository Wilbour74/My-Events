<?php

namespace App\Entity;

use App\Repository\MembresSortieRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MembresSortieRepository::class)]
class MembresSortie
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;
    /**
     * @ORM\ManyToOne(targetEntity=Sortie::class)
     * @ORM\JoinColumn(name="id_sortie", referencedColumnName="id")
     */
    #[ORM\Column(nullable: true)]
    private ?int $id_sortie = null;

    /**
     * @ORM\ManyToOne(targetEntity=User1::class)
     * @ORM\JoinColumn(name="id_user", referencedColumnName="id")
     */

    #[ORM\Column(nullable: true)]
    private ?int $id_user = null;

    #[ORM\Column]
    private ?bool $is_creator = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdSortie(): ?int
    {
        return $this->id_sortie;
    }

    public function setIdSortie(?int $id_sortie): static
    {
        $this->id_sortie = $id_sortie;

        return $this;
    }

    public function getIdUser(): ?int
    {
        return $this->id_user;
    }

    public function setIdUser(?int $id_user): static
    {
        $this->id_user = $id_user;

        return $this;
    }
    
    public function isCreator(): ?bool
    {
        return $this->is_creator;
    }

    public function setIsCreator(bool $is_creator): static
    {
        $this->is_creator = $is_creator;

        return $this;
    }


}
