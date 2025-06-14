import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Vote,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

export default function DashboardPage() {
  const budgetData = {
    totalBudget: 1500000,
    spent: 850000,
    remaining: 650000,
    pendingVotes: 5,
    activeUsers: 24,
    notifications: 3,
  }

  const spentPercentage = (budgetData.spent / budgetData.totalBudget) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble de la situation budgétaire</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Budget Total</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{budgetData.totalBudget.toLocaleString()} €</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                Budget annuel alloué
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Dépensé</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <ArrowDownRight className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{budgetData.spent.toLocaleString()} €</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                {spentPercentage.toFixed(1)}% du budget
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Restant</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{budgetData.remaining.toLocaleString()} €</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                Disponible
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Votes en Attente</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Vote className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{budgetData.pendingVotes}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <AlertTriangle className="h-3 w-3 mr-1 text-orange-500" />
                Propositions à voter
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                Utilisation du Budget
              </CardTitle>
              <CardDescription>Progression des dépenses par rapport au budget total</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Dépenses</span>
                  <span className="font-bold text-blue-600">{spentPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={spentPercentage} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-red-600 font-medium">Dépensé</p>
                  <p className="font-bold text-red-700">{budgetData.spent.toLocaleString()} €</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-green-600 font-medium">Restant</p>
                  <p className="font-bold text-green-700">{budgetData.remaining.toLocaleString()} €</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                Activité Récente
              </CardTitle>
              <CardDescription>Dernières actions et notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Utilisateurs actifs</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {budgetData.activeUsers}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Vote className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Votes en cours</span>
                </div>
                <Badge variant="outline" className="border-green-200 text-green-700">
                  {budgetData.pendingVotes}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium">Notifications</span>
                </div>
                <Badge variant="destructive" className="bg-orange-500">
                  {budgetData.notifications}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              Transactions Récentes
            </CardTitle>
            <CardDescription>Dernières opérations financières</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  type: "Dépense",
                  description: "Achat matériel informatique",
                  montant: -15000,
                  date: "2024-01-15",
                  statut: "Approuvé",
                },
                {
                  id: 2,
                  type: "Recette",
                  description: "Subvention gouvernementale",
                  montant: 50000,
                  date: "2024-01-14",
                  statut: "Encaissé",
                },
                {
                  id: 3,
                  type: "Dépense",
                  description: "Frais de formation",
                  montant: -8500,
                  date: "2024-01-13",
                  statut: "En attente",
                },
                {
                  id: 4,
                  type: "Recette",
                  description: "Vente d'équipements",
                  montant: 3200,
                  date: "2024-01-12",
                  statut: "Encaissé",
                },
              ].map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.montant > 0 ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {transaction.montant > 0 ? (
                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold text-lg ${transaction.montant > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {transaction.montant > 0 ? "+" : ""}
                      {transaction.montant.toLocaleString()} €
                    </p>
                    <Badge
                      variant={
                        transaction.statut === "Approuvé" || transaction.statut === "Encaissé" ? "default" : "secondary"
                      }
                      className={
                        transaction.statut === "Approuvé" || transaction.statut === "Encaissé"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-orange-100 text-orange-700 border-orange-200"
                      }
                    >
                      {transaction.statut}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
