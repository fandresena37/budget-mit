"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Calendar, BarChart3, PieChart, TrendingUp } from "lucide-react"

interface Rapport {
  id: number
  format: "PDF" | "Excel" | "CSV"
  contenu: string
  type: "budget" | "tresorerie" | "votes" | "previsions"
  dateGeneration: string
  periode: string
  statut: "genere" | "en_cours" | "erreur"
}

export default function RapportsPage() {
  const [rapports, setRapports] = useState<Rapport[]>([
    {
      id: 1,
      format: "PDF",
      contenu: "Rapport budgétaire mensuel - Janvier 2024",
      type: "budget",
      dateGeneration: "2024-01-15",
      periode: "Janvier 2024",
      statut: "genere",
    },
    {
      id: 2,
      format: "Excel",
      contenu: "Analyse de trésorerie - Q4 2023",
      type: "tresorerie",
      dateGeneration: "2024-01-10",
      periode: "Q4 2023",
      statut: "genere",
    },
    {
      id: 3,
      format: "PDF",
      contenu: "Résultats des votes - Décembre 2023",
      type: "votes",
      dateGeneration: "2024-01-05",
      periode: "Décembre 2023",
      statut: "genere",
    },
    {
      id: 4,
      format: "CSV",
      contenu: "Prévisions budgétaires 2024",
      type: "previsions",
      dateGeneration: "2024-01-12",
      periode: "2024",
      statut: "en_cours",
    },
  ])

  const [selectedType, setSelectedType] = useState<string>("tous")
  const [selectedFormat, setSelectedFormat] = useState<string>("tous")

  const handleGenerateReport = (type: string, format: string) => {
    const newRapport: Rapport = {
      id: Date.now(),
      format: format as "PDF" | "Excel" | "CSV",
      contenu: `Nouveau rapport ${type} - ${new Date().toLocaleDateString()}`,
      type: type as "budget" | "tresorerie" | "votes" | "previsions",
      dateGeneration: new Date().toISOString().split("T")[0],
      periode: new Date().toLocaleDateString(),
      statut: "en_cours",
    }

    setRapports((prev) => [newRapport, ...prev])

    // Simuler la génération du rapport
    setTimeout(() => {
      setRapports((prev) => prev.map((r) => (r.id === newRapport.id ? { ...r, statut: "genere" } : r)))
    }, 2000)
  }

  const filteredRapports = rapports.filter((rapport) => {
    const typeMatch = selectedType === "tous" || rapport.type === selectedType
    const formatMatch = selectedFormat === "tous" || rapport.format === selectedFormat
    return typeMatch && formatMatch
  })

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "genere":
        return (
          <Badge variant="default" className="bg-green-600">
            Généré
          </Badge>
        )
      case "en_cours":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            En cours
          </Badge>
        )
      case "erreur":
        return <Badge variant="destructive">Erreur</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "budget":
        return <BarChart3 className="h-4 w-4" />
      case "tresorerie":
        return <TrendingUp className="h-4 w-4" />
      case "votes":
        return <PieChart className="h-4 w-4" />
      case "previsions":
        return <Calendar className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "budget":
        return "Budget"
      case "tresorerie":
        return "Trésorerie"
      case "votes":
        return "Votes"
      case "previsions":
        return "Prévisions"
      default:
        return "Autre"
    }
  }

  const rapportsParType = {
    budget: rapports.filter((r) => r.type === "budget").length,
    tresorerie: rapports.filter((r) => r.type === "tresorerie").length,
    votes: rapports.filter((r) => r.type === "votes").length,
    previsions: rapports.filter((r) => r.type === "previsions").length,
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Rapports</h1>
          <p className="text-gray-600 mt-2">Génération et consultation des rapports financiers</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rapports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rapports.length}</div>
              <p className="text-xs text-muted-foreground">Rapports générés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{rapportsParType.budget}</div>
              <p className="text-xs text-muted-foreground">Rapports budgétaires</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trésorerie</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{rapportsParType.tresorerie}</div>
              <p className="text-xs text-muted-foreground">Analyses financières</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Votes</CardTitle>
              <PieChart className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{rapportsParType.votes}</div>
              <p className="text-xs text-muted-foreground">Résultats de votes</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="consulter" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="consulter">Consulter les Rapports</TabsTrigger>
            <TabsTrigger value="generer">Générer un Rapport</TabsTrigger>
          </TabsList>

          <TabsContent value="consulter">
            <Card>
              <CardHeader>
                <CardTitle>Rapports Disponibles</CardTitle>
                <CardDescription>Consultez et téléchargez vos rapports</CardDescription>

                {/* Filters */}
                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrer par type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">Tous les types</SelectItem>
                        <SelectItem value="budget">Budget</SelectItem>
                        <SelectItem value="tresorerie">Trésorerie</SelectItem>
                        <SelectItem value="votes">Votes</SelectItem>
                        <SelectItem value="previsions">Prévisions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrer par format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">Tous les formats</SelectItem>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="Excel">Excel</SelectItem>
                        <SelectItem value="CSV">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRapports.map((rapport) => (
                    <div key={rapport.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(rapport.type)}
                        <div className="flex-1">
                          <h3 className="font-semibold">{rapport.contenu}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{getTypeLabel(rapport.type)}</Badge>
                            <Badge variant="secondary">{rapport.format}</Badge>
                            {getStatusBadge(rapport.statut)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Généré le {rapport.dateGeneration} • Période: {rapport.periode}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {rapport.statut === "genere" && (
                          <Button size="sm" variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Télécharger
                          </Button>
                        )}
                        {rapport.statut === "en_cours" && (
                          <Button size="sm" variant="outline" disabled>
                            Génération...
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredRapports.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun rapport trouvé avec ces critères</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generer">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Rapport Budgétaire
                  </CardTitle>
                  <CardDescription>Analyse complète des budgets, dépenses et recettes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Contenu inclus:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Répartition des dépenses par catégorie</li>
                      <li>• Évolution des recettes</li>
                      <li>• Comparaison budget/réalisé</li>
                      <li>• Indicateurs de performance</li>
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleGenerateReport("budget", "PDF")} className="flex-1">
                      PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateReport("budget", "Excel")}
                      className="flex-1"
                    >
                      Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Rapport de Trésorerie
                  </CardTitle>
                  <CardDescription>Suivi des flux de trésorerie et de la situation financière</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Contenu inclus:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Évolution du solde de caisse</li>
                      <li>• Flux d'entrée et de sortie</li>
                      <li>• Prévisions de trésorerie</li>
                      <li>• Ratios financiers</li>
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleGenerateReport("tresorerie", "PDF")} className="flex-1">
                      PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateReport("tresorerie", "Excel")}
                      className="flex-1"
                    >
                      Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-purple-500" />
                    Rapport des Votes
                  </CardTitle>
                  <CardDescription>Analyse des résultats de votes et de la participation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Contenu inclus:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Résultats détaillés par proposition</li>
                      <li>• Taux de participation</li>
                      <li>• Analyse des tendances de vote</li>
                      <li>• Statistiques par utilisateur</li>
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleGenerateReport("votes", "PDF")} className="flex-1">
                      PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateReport("votes", "CSV")}
                      className="flex-1"
                    >
                      CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-500" />
                    Rapport de Prévisions
                  </CardTitle>
                  <CardDescription>Analyse des prévisions budgétaires et leur réalisation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Contenu inclus:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Prévisions vs réalisations</li>
                      <li>• Écarts et analyses</li>
                      <li>• Tendances prévisionnelles</li>
                      <li>• Recommandations</li>
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleGenerateReport("previsions", "PDF")} className="flex-1">
                      PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateReport("previsions", "Excel")}
                      className="flex-1"
                    >
                      Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
