"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react"

interface Prevision {
  id: number
  type: "recette" | "depense"
  montant: number
  datePrevue: string
  dateEnregistrement: string
  statut: "active" | "modifiee" | "annulee"
  description: string
  categorie: string
}

export default function PrevisionsPage() {
  const [previsions, setPrevisions] = useState<Prevision[]>([
    {
      id: 1,
      type: "recette",
      montant: 50000,
      datePrevue: "2024-02-15",
      dateEnregistrement: "2024-01-10",
      statut: "active",
      description: "Subvention annuelle",
      categorie: "Subventions",
    },
    {
      id: 2,
      type: "depense",
      montant: 25000,
      datePrevue: "2024-02-20",
      dateEnregistrement: "2024-01-12",
      statut: "active",
      description: "Achat équipements",
      categorie: "Matériel",
    },
    {
      id: 3,
      type: "recette",
      montant: 15000,
      datePrevue: "2024-03-01",
      dateEnregistrement: "2024-01-15",
      statut: "modifiee",
      description: "Vente services",
      categorie: "Services",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    type: "recette" as "recette" | "depense",
    montant: "",
    datePrevue: "",
    description: "",
    categorie: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newPrevision: Prevision = {
      id: editingId || Date.now(),
      type: formData.type,
      montant: Number.parseFloat(formData.montant),
      datePrevue: formData.datePrevue,
      dateEnregistrement: new Date().toISOString().split("T")[0],
      statut: "active",
      description: formData.description,
      categorie: formData.categorie,
    }

    if (editingId) {
      setPrevisions((prev) => prev.map((p) => (p.id === editingId ? newPrevision : p)))
    } else {
      setPrevisions((prev) => [...prev, newPrevision])
    }

    setFormData({ type: "recette", montant: "", datePrevue: "", description: "", categorie: "" })
    setShowForm(false)
    setEditingId(null)
  }

  const handleEdit = (prevision: Prevision) => {
    setFormData({
      type: prevision.type,
      montant: prevision.montant.toString(),
      datePrevue: prevision.datePrevue,
      description: prevision.description,
      categorie: prevision.categorie,
    })
    setEditingId(prevision.id)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    setPrevisions((prev) => prev.filter((p) => p.id !== id))
  }

  const recettes = previsions.filter((p) => p.type === "recette")
  const depenses = previsions.filter((p) => p.type === "depense")

  const totalRecettes = recettes.reduce((sum, r) => sum + r.montant, 0)
  const totalDepenses = depenses.reduce((sum, d) => sum + d.montant, 0)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Prévisions</h1>
            <p className="text-gray-600 mt-2">Planification des recettes et dépenses futures</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle Prévision
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recettes Prévues</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalRecettes.toLocaleString()} €</div>
              <p className="text-xs text-muted-foreground">{recettes.length} prévisions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Dépenses Prévues</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{totalDepenses.toLocaleString()} €</div>
              <p className="text-xs text-muted-foreground">{depenses.length} prévisions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Solde Prévisionnel</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${totalRecettes - totalDepenses >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {(totalRecettes - totalDepenses).toLocaleString()} €
              </div>
              <p className="text-xs text-muted-foreground">Différence recettes/dépenses</p>
            </CardContent>
          </Card>
        </div>

        {/* Form Modal */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId ? "Modifier" : "Nouvelle"} Prévision</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "recette" | "depense") => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recette">Recette</SelectItem>
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
                    <Label htmlFor="datePrevue">Date Prévue</Label>
                    <Input
                      id="datePrevue"
                      type="date"
                      value={formData.datePrevue}
                      onChange={(e) => setFormData({ ...formData, datePrevue: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="categorie">Catégorie</Label>
                    <Input
                      id="categorie"
                      value={formData.categorie}
                      onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
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
                  <Button type="submit">{editingId ? "Modifier" : "Créer"}</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                      setFormData({ type: "recette", montant: "", datePrevue: "", description: "", categorie: "" })
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Previsions List */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="recettes">Recettes</TabsTrigger>
            <TabsTrigger value="depenses">Dépenses</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Toutes les Prévisions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {previsions.map((prevision) => (
                    <div key={prevision.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={prevision.type === "recette" ? "default" : "destructive"}>
                            {prevision.type === "recette" ? "Recette" : "Dépense"}
                          </Badge>
                          <Badge variant="outline">{prevision.categorie}</Badge>
                          <Badge variant={prevision.statut === "active" ? "default" : "secondary"}>
                            {prevision.statut}
                          </Badge>
                        </div>
                        <h3 className="font-semibold">{prevision.description}</h3>
                        <p className="text-sm text-muted-foreground">
                          Prévu le {prevision.datePrevue} • Créé le {prevision.dateEnregistrement}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${prevision.type === "recette" ? "text-green-600" : "text-red-600"}`}
                        >
                          {prevision.type === "recette" ? "+" : "-"}
                          {prevision.montant.toLocaleString()} €
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(prevision)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(prevision.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recettes">
            <Card>
              <CardHeader>
                <CardTitle>Prévisions de Recettes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recettes.map((prevision) => (
                    <div key={prevision.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{prevision.categorie}</Badge>
                          <Badge variant={prevision.statut === "active" ? "default" : "secondary"}>
                            {prevision.statut}
                          </Badge>
                        </div>
                        <h3 className="font-semibold">{prevision.description}</h3>
                        <p className="text-sm text-muted-foreground">Prévu le {prevision.datePrevue}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">+{prevision.montant.toLocaleString()} €</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(prevision)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(prevision.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="depenses">
            <Card>
              <CardHeader>
                <CardTitle>Prévisions de Dépenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {depenses.map((prevision) => (
                    <div key={prevision.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{prevision.categorie}</Badge>
                          <Badge variant={prevision.statut === "active" ? "default" : "secondary"}>
                            {prevision.statut}
                          </Badge>
                        </div>
                        <h3 className="font-semibold">{prevision.description}</h3>
                        <p className="text-sm text-muted-foreground">Prévu le {prevision.datePrevue}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">-{prevision.montant.toLocaleString()} €</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(prevision)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(prevision.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
