"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Vote, CheckCircle, XCircle, Clock } from "lucide-react"

interface VoteProposition {
  id: number
  propositionId: number
  dateVote: string
  resultatVote: boolean | null
  description: string
  montant: number
  type: "recette" | "depense"
  statut: "en_cours" | "approuve" | "rejete"
  votesFor: number
  votesAgainst: number
  totalVoters: number
  dateExpiration: string
}

export default function VotesPage() {
  const [votes, setVotes] = useState<VoteProposition[]>([
    {
      id: 1,
      propositionId: 101,
      dateVote: "2024-01-15",
      resultatVote: null,
      description: "Achat de nouveaux ordinateurs pour le service informatique",
      montant: 25000,
      type: "depense",
      statut: "en_cours",
      votesFor: 8,
      votesAgainst: 3,
      totalVoters: 15,
      dateExpiration: "2024-01-25",
    },
    {
      id: 2,
      propositionId: 102,
      dateVote: "2024-01-10",
      resultatVote: true,
      description: "Subvention pour projet de développement durable",
      montant: 50000,
      type: "recette",
      statut: "approuve",
      votesFor: 12,
      votesAgainst: 2,
      totalVoters: 15,
      dateExpiration: "2024-01-20",
    },
    {
      id: 3,
      propositionId: 103,
      dateVote: "2024-01-08",
      resultatVote: false,
      description: "Rénovation des bureaux administratifs",
      montant: 75000,
      type: "depense",
      statut: "rejete",
      votesFor: 4,
      votesAgainst: 10,
      totalVoters: 15,
      dateExpiration: "2024-01-18",
    },
    {
      id: 4,
      propositionId: 104,
      dateVote: "2024-01-20",
      resultatVote: null,
      description: "Formation du personnel en cybersécurité",
      montant: 15000,
      type: "depense",
      statut: "en_cours",
      votesFor: 5,
      votesAgainst: 1,
      totalVoters: 15,
      dateExpiration: "2024-01-30",
    },
  ])

  const [userVotes, setUserVotes] = useState<{ [key: number]: boolean }>({})

  const handleVote = (voteId: number, decision: boolean) => {
    setUserVotes((prev) => ({ ...prev, [voteId]: decision }))

    setVotes((prev) =>
      prev.map((vote) => {
        if (vote.id === voteId) {
          const newVotesFor = decision ? vote.votesFor + 1 : vote.votesFor
          const newVotesAgainst = !decision ? vote.votesAgainst + 1 : vote.votesAgainst
          const totalVotes = newVotesFor + newVotesAgainst

          // Simuler la logique de décision (majorité simple)
          let newStatut = vote.statut
          let newResultat = vote.resultatVote

          if (totalVotes >= Math.ceil(vote.totalVoters * 0.6)) {
            // Quorum de 60%
            if (newVotesFor > newVotesAgainst) {
              newStatut = "approuve"
              newResultat = true
            } else {
              newStatut = "rejete"
              newResultat = false
            }
          }

          return {
            ...vote,
            votesFor: newVotesFor,
            votesAgainst: newVotesAgainst,
            statut: newStatut,
            resultatVote: newResultat,
          }
        }
        return vote
      }),
    )
  }

  const votesEnCours = votes.filter((v) => v.statut === "en_cours")
  const votesApprouves = votes.filter((v) => v.statut === "approuve")
  const votesRejetes = votes.filter((v) => v.statut === "rejete")

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "en_cours":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Clock className="h-3 w-3 mr-1" />
            En cours
          </Badge>
        )
      case "approuve":
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approuvé
          </Badge>
        )
      case "rejete":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejeté
          </Badge>
        )
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  const VoteCard = ({ vote }: { vote: VoteProposition }) => {
    const participationRate = ((vote.votesFor + vote.votesAgainst) / vote.totalVoters) * 100
    const approvalRate =
      vote.votesFor + vote.votesAgainst > 0 ? (vote.votesFor / (vote.votesFor + vote.votesAgainst)) * 100 : 0
    const hasUserVoted = userVotes[vote.id] !== undefined

    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg">{vote.description}</CardTitle>
              <CardDescription className="mt-2">
                Proposition #{vote.propositionId} • {vote.type === "recette" ? "Recette" : "Dépense"} de{" "}
                {vote.montant.toLocaleString()} €
              </CardDescription>
            </div>
            {getStatusBadge(vote.statut)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Participation</p>
              <div className="flex items-center gap-2">
                <Progress value={participationRate} className="flex-1" />
                <span className="text-sm font-medium">{participationRate.toFixed(0)}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {vote.votesFor + vote.votesAgainst} / {vote.totalVoters} votants
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Approbation</p>
              <div className="flex items-center gap-2">
                <Progress value={approvalRate} className="flex-1" />
                <span className="text-sm font-medium">{approvalRate.toFixed(0)}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {vote.votesFor} pour, {vote.votesAgainst} contre
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Expiration</p>
              <p className="font-medium">{vote.dateExpiration}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {vote.statut === "en_cours" ? "Vote en cours" : "Vote terminé"}
              </p>
            </div>
          </div>

          {vote.statut === "en_cours" && !hasUserVoted && (
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={() => handleVote(vote.id, true)} className="flex-1 bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approuver
              </Button>
              <Button onClick={() => handleVote(vote.id, false)} variant="destructive" className="flex-1">
                <XCircle className="h-4 w-4 mr-2" />
                Rejeter
              </Button>
            </div>
          )}

          {hasUserVoted && (
            <div className="pt-4 border-t">
              <Badge variant="outline" className="text-blue-600">
                <Vote className="h-3 w-3 mr-1" />
                Vous avez voté {userVotes[vote.id] ? "POUR" : "CONTRE"}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Système de Vote</h1>
          <p className="text-gray-600 mt-2">Votez sur les propositions budgétaires</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{votes.length}</div>
              <p className="text-xs text-muted-foreground">Propositions soumises</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Cours</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{votesEnCours.length}</div>
              <p className="text-xs text-muted-foreground">Votes actifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approuvés</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{votesApprouves.length}</div>
              <p className="text-xs text-muted-foreground">Propositions acceptées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejetés</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{votesRejetes.length}</div>
              <p className="text-xs text-muted-foreground">Propositions refusées</p>
            </CardContent>
          </Card>
        </div>

        {/* Votes Tabs */}
        <Tabs defaultValue="en_cours" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="en_cours">En Cours ({votesEnCours.length})</TabsTrigger>
            <TabsTrigger value="tous">Tous ({votes.length})</TabsTrigger>
            <TabsTrigger value="approuves">Approuvés ({votesApprouves.length})</TabsTrigger>
            <TabsTrigger value="rejetes">Rejetés ({votesRejetes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="en_cours">
            <div className="space-y-4">
              {votesEnCours.length > 0 ? (
                votesEnCours.map((vote) => <VoteCard key={vote.id} vote={vote} />)
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucun vote en cours actuellement</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tous">
            <div className="space-y-4">
              {votes.map((vote) => (
                <VoteCard key={vote.id} vote={vote} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="approuves">
            <div className="space-y-4">
              {votesApprouves.length > 0 ? (
                votesApprouves.map((vote) => <VoteCard key={vote.id} vote={vote} />)
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucune proposition approuvée</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rejetes">
            <div className="space-y-4">
              {votesRejetes.length > 0 ? (
                votesRejetes.map((vote) => <VoteCard key={vote.id} vote={vote} />)
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucune proposition rejetée</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
