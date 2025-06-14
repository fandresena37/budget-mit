"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp, AlertCircle } from "lucide-react"

interface Transaction {
  id: number
  montant: number
  type: "encaissement" | "depense" | "verification"
  date: string
  beneficiaireSource: string
  description: string
  statut: "en_attente" | "valide" | "rejete"
}

interface Caisse {
  solde: number
  derniereMiseAJour: string
  transactions: Transaction[]
}

export default function CaissePage() {
  const [caisse, setCaisse] = useState<Caisse>({
    solde: 125000,
    derniereMiseAJour: "2024-01-15T10:30:00",
    transactions: [
      {
        id: 1,
        montant: 50000,
        type: "encaissement",
        date: "2024-01-15",
        beneficiaireSource: "Subvention Gouvernementale",
        description: "Subvention annuelle pour projets",
        statut: "valide",
      },
      {
        id: 2,
        montant: -25000,
        type: "depense",
        date: "2024-01-14",
        beneficiaireSource: "TechCorp Solutions",
        description: "Achat équipements informatiques",
        statut: "valide",
      },
      {
        id: 3,
        montant: -8500,
        type: "depense",
        date: "2024-01-13",
        beneficiaireSource: "Formation Plus",
        description: "Formation cybersécurité",
        statut: "en_attente",
      },
      {
        id: 4,
        montant: 15000,
        type: "encaissement",
        date: "2024-01-12",
        beneficiaireSource: "Vente Matériel",
        description: "Vente ancien équipement",
        statut: "valide",
      },
    ],
  })

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: "encaissement" as "encaissement" | "depense",
    montant: "",
    beneficiaireSource: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newTransaction: Transaction = {
      id: Date.now(),
      montant: formData.type === "depense" ? -Number.parseFloat(formData.montant) : Number.parseFloat(formData.montant),
      type: formData.type,
      date: new Date().toISOString().split("T")[0],
      beneficiaireSource: formData.beneficiaireSource,
      description: formData.description,
      statut: "en_attente",
    }

    setCaisse((prev) => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions],
      derniereMiseAJour: new Date().toISOString(),
    }))

    setFormData({ type: "encaissement", montant: "", beneficiaireSource: "", description: "" })
    setShowForm(false)
  }

  const handleValidateTransaction = (id: number, statut: "valide" | "rejete") => {
    setCaisse((prev) => {
      const updatedTransactions = prev.transactions.map((t) => (t.id === id ? { ...t, statut } : t))

      // Recalculer le solde
      const validTransactions = updatedTransactions.filter((t) => t.statut === "valide")
      const newSolde = validTransactions.reduce((sum, t) => sum + t.montant, 0)

      return {
        ...prev,
        transactions: updatedTransactions,
        solde: newSolde,
        derniereMiseAJour: new Date().toISOString(),
      }
    })
  }

  const transactionsEnAttente = caisse.transactions.filter((t) => t.statut === "en_attente")
  const transactionsValidees = caisse.transactions.filter((t) => t.statut === "valide")
  const transactionsRejetees = caisse.transactions.filter((t) => t.statut === "rejete")

  const totalEncaissements = transactionsValidees.filter((t) => t.montant > 0).reduce((sum, t) => sum + t.montant, 0)

  const totalDepenses = Math.abs(
    transactionsValidees.filter((t) => t.montant < 0).reduce((sum, t) => sum + t.montant, 0),
  )

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            En attente
          </Badge>
        )
      case "valide":
        return (
          <Badge variant="default" className="bg-green-600">
            Validé
          </Badge>
        )
      case "rejete":
        return <Badge variant="destructive">Rejeté</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        {transaction.montant > 0 ? (
          <ArrowUpCircle className="h-8 w-8 text-green-500" />
        ) : (
          <ArrowDownCircle className="h-8 w-8 text-red-500" />
        )}
        <div className="flex-1">
          <h3 className="font-semibold">{transaction.description}</h3>
          <p className="text-sm text-muted-foreground">{transaction.beneficiaireSource}</p>
          <p className="text-xs text-muted-foreground">{transaction.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-lg font-bold ${transaction.montant > 0 ? "text-green-600" : "text-red-600"}`}>
          {transaction.montant > 0 ? "+" : ""}
          {transaction.montant.toLocaleString()} €
        </p>
        <div className="flex items-center gap-2 mt-2">
          {getStatusBadge(transaction.statut)}
          {transaction.statut === "en_attente" && (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-50"
                onClick={() => handleValidateTransaction(transaction.id, "valide")}
              >
                Valider
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => handleValidateTransaction(transaction.id, "rejete")}
              >
                Rejeter
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion de la Caisse</h1>
            <p className="text-gray-600 mt-2">Suivi des encaissements et dépenses</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle Transaction
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Solde Actuel</CardTitle>
              <Wallet className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${caisse.solde >= 0 ? "text-green-600" : "text-red-600"}`}>
                {caisse.solde.toLocaleString()} €
              </div>
              <p className="text-xs text-muted-foreground">
                Mis à jour le {new Date(caisse.derniereMiseAJour).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Encaissements</CardTitle>
              <ArrowUpCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalEncaissements.toLocaleString()} €</div>
              <p className="text-xs text-muted-foreground">Recettes validées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Dépenses</CardTitle>
              <ArrowDownCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{totalDepenses.toLocaleString()} €</div>
              <p className="text-xs text-muted-foreground">Sorties validées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{transactionsEnAttente.length}</div>
              <p className="text-xs text-muted-foreground">Transactions à valider</p>
            </CardContent>
          </Card>
        </div>

        {/* Form Modal */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Nouvelle Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type de Transaction</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "encaissement" | "depense") => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="encaissement">Encaissement</SelectItem>
                        <SelectItem value="depense">Dépense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="montant">Montant (€)</Label>
                    <Input
                      id="montant"
                      type="number"
                      value={formData.montant}
                      onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="beneficiaireSource">
                      {formData.type === "encaissement" ? "Source" : "Bénéficiaire"}
                    </Label>
                    <Input
                      id="beneficiaireSource"
                      value={formData.beneficiaireSource}
                      onChange={(e) => setFormData({ ...formData, beneficiaireSource: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Enregistrer</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setFormData({ type: "encaissement", montant: "", beneficiaireSource: "", description: "" })
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Transactions Tabs */}
        <Tabs defaultValue="en_attente" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="en_attente">En Attente ({transactionsEnAttente.length})</TabsTrigger>
            <TabsTrigger value="toutes">Toutes ({caisse.transactions.length})</TabsTrigger>
            <TabsTrigger value="validees">Validées ({transactionsValidees.length})</TabsTrigger>
            <TabsTrigger value="rejetees">Rejetées ({transactionsRejetees.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="en_attente">
            <Card>
              <CardHeader>
                <CardTitle>Transactions en Attente de Validation</CardTitle>
                <CardDescription>Transactions nécessitant une approbation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactionsEnAttente.length > 0 ? (
                    transactionsEnAttente.map((transaction) => (
                      <TransactionCard key={transaction.id} transaction={transaction} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune transaction en attente</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="toutes">
            <Card>
              <CardHeader>
                <CardTitle>Toutes les Transactions</CardTitle>
                <CardDescription>Historique complet des mouvements de caisse</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caisse.transactions.map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validees">
            <Card>
              <CardHeader>
                <CardTitle>Transactions Validées</CardTitle>
                <CardDescription>Mouvements approuvés et comptabilisés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactionsValidees.length > 0 ? (
                    transactionsValidees.map((transaction) => (
                      <TransactionCard key={transaction.id} transaction={transaction} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune transaction validée</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejetees">
            <Card>
              <CardHeader>
                <CardTitle>Transactions Rejetées</CardTitle>
                <CardDescription>Mouvements refusés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactionsRejetees.length > 0 ? (
                    transactionsRejetees.map((transaction) => (
                      <TransactionCard key={transaction.id} transaction={transaction} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune transaction rejetée</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
