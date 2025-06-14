"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, BellRing, Clock, CheckCircle, AlertTriangle, RefreshCw, Settings } from "lucide-react"

interface Notification {
  id: number
  message: string
  dateEnvoi: string
  type: "info" | "warning" | "success" | "error"
  destinataire: string
  statut: "envoye" | "lu" | "en_attente" | "echec"
  evenement: string
  relanceCount: number
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "Nouvelle proposition de budget soumise pour vote",
      dateEnvoi: "2024-01-15T10:30:00",
      type: "info",
      destinataire: "Tous les membres votants",
      statut: "envoye",
      evenement: "Proposition soumise",
      relanceCount: 0,
    },
    {
      id: 2,
      message: "Vote approuvé : Achat matériel informatique",
      dateEnvoi: "2024-01-14T14:20:00",
      type: "success",
      destinataire: "Responsable budgétaire",
      statut: "lu",
      evenement: "Vote terminé",
      relanceCount: 0,
    },
    {
      id: 3,
      message: "Délai de validation dépassé pour transaction #1234",
      dateEnvoi: "2024-01-13T09:15:00",
      type: "warning",
      destinataire: "Responsable paiement",
      statut: "en_attente",
      evenement: "Délai dépassé",
      relanceCount: 2,
    },
  ])

  const [autoNotifications, setAutoNotifications] = useState(true)
  const [relanceActive, setRelanceActive] = useState(true)

  // Workflow: Concerné par un événement -> Déclenche et envoie une notification
  const handleEventTriggered = (eventType: string, message: string, recipient: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      dateEnvoi: new Date().toISOString(),
      type: "info",
      destinataire: recipient,
      statut: "envoye",
      evenement: eventType,
      relanceCount: 0,
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Workflow: Met à jour l'état de l'événement
    console.log(`Notification envoyée pour événement: ${eventType}`)
  }

  // Workflow: Reçoit et agit -> Marque comme lu
  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, statut: "lu" as const } : notif)))
  }

  // Workflow: Agit après relance -> Gestion des relances automatiques
  const handleRelance = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => {
        if (notif.id === id && notif.statut === "en_attente") {
          return {
            ...notif,
            relanceCount: notif.relanceCount + 1,
            dateEnvoi: new Date().toISOString(),
          }
        }
        return notif
      }),
    )
  }

  // Workflow: DecisionNode9 -> Relance la notification si pas de réponse
  useEffect(() => {
    if (!relanceActive) return

    const interval = setInterval(() => {
      setNotifications((prev) =>
        prev.map((notif) => {
          const hoursSinceLastSent = (Date.now() - new Date(notif.dateEnvoi).getTime()) / (1000 * 60 * 60)

          // Relance automatique après 24h si pas de réponse et moins de 3 relances
          if (notif.statut === "en_attente" && hoursSinceLastSent >= 24 && notif.relanceCount < 3) {
            return {
              ...notif,
              relanceCount: notif.relanceCount + 1,
              dateEnvoi: new Date().toISOString(),
            }
          }
          return notif
        }),
      )
    }, 60000) // Vérification chaque minute

    return () => clearInterval(interval)
  }, [relanceActive])

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "envoye":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-700">
            <Bell className="h-3 w-3 mr-1" />
            Envoyé
          </Badge>
        )
      case "lu":
        return (
          <Badge variant="default" className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Lu
          </Badge>
        )
      case "en_attente":
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        )
      case "echec":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Échec
          </Badge>
        )
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  const notificationsEnAttente = notifications.filter((n) => n.statut === "en_attente")
  const notificationsLues = notifications.filter((n) => n.statut === "lu")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <BellRing className="h-6 w-6 text-white" />
            </div>
            Gestion des Notifications
          </h1>
          <p className="text-gray-600 mt-2">Système de notifications automatiques et relances</p>
        </div>

        {/* Configuration */}
        <Card className="mb-6 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration des Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-notifications" className="text-sm font-medium">
                    Notifications Automatiques
                  </Label>
                  <p className="text-sm text-gray-600">Envoi automatique lors d'événements</p>
                </div>
                <Switch id="auto-notifications" checked={autoNotifications} onCheckedChange={setAutoNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="relance-active" className="text-sm font-medium">
                    Relances Automatiques
                  </Label>
                  <p className="text-sm text-gray-600">Relance si pas de réponse après 24h</p>
                </div>
                <Switch id="relance-active" checked={relanceActive} onCheckedChange={setRelanceActive} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Notifications</CardTitle>
              <Bell className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{notifications.length}</div>
              <p className="text-xs text-gray-500">Notifications envoyées</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">En Attente</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{notificationsEnAttente.length}</div>
              <p className="text-xs text-gray-500">Nécessitent une action</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Lues</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{notificationsLues.length}</div>
              <p className="text-xs text-gray-500">Actions effectuées</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Relances</CardTitle>
              <RefreshCw className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {notifications.reduce((sum, n) => sum + n.relanceCount, 0)}
              </div>
              <p className="text-xs text-gray-500">Relances envoyées</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Toutes ({notifications.length})</TabsTrigger>
            <TabsTrigger value="pending">En Attente ({notificationsEnAttente.length})</TabsTrigger>
            <TabsTrigger value="read">Lues ({notificationsLues.length})</TabsTrigger>
            <TabsTrigger value="test">Test Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Toutes les Notifications</CardTitle>
                <CardDescription>Historique complet des notifications système</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-start gap-4">
                        {getTypeIcon(notification.type)}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{notification.message}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span>Pour: {notification.destinataire}</span>
                            <span>Événement: {notification.evenement}</span>
                            <span>{new Date(notification.dateEnvoi).toLocaleString()}</span>
                          </div>
                          {notification.relanceCount > 0 && (
                            <p className="text-sm text-orange-600 mt-1">
                              {notification.relanceCount} relance(s) envoyée(s)
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(notification.statut)}
                        {notification.statut === "en_attente" && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(notification.id)}>
                              Marquer comme lu
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleRelance(notification.id)}>
                              Relancer
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Notifications en Attente</CardTitle>
                <CardDescription>Notifications nécessitant une action</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notificationsEnAttente.length > 0 ? (
                    notificationsEnAttente.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start justify-between p-4 border border-orange-200 bg-orange-50 rounded-lg"
                      >
                        <div className="flex items-start gap-4">
                          <AlertTriangle className="h-5 w-5 text-orange-500 mt-1" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{notification.message}</h3>
                            <p className="text-sm text-gray-600 mt-1">Pour: {notification.destinataire}</p>
                            <p className="text-sm text-orange-600 mt-1">
                              {notification.relanceCount} relance(s) • Envoyé le{" "}
                              {new Date(notification.dateEnvoi).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                            Traiter
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRelance(notification.id)}>
                            Relancer
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-gray-600">Aucune notification en attente</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="read">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Notifications Lues</CardTitle>
                <CardDescription>Notifications traitées avec succès</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notificationsLues.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 p-4 border border-green-200 bg-green-50 rounded-lg"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{notification.message}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Traité par: {notification.destinataire} • {new Date(notification.dateEnvoi).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Test de Notifications</CardTitle>
                <CardDescription>Simuler l'envoi de notifications pour tester le workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() =>
                      handleEventTriggered("Test Vote", "Test: Nouvelle proposition soumise au vote", "Membres votants")
                    }
                    className="flex items-center gap-2"
                  >
                    <Bell className="h-4 w-4" />
                    Simuler Notification Vote
                  </Button>
                  <Button
                    onClick={() =>
                      handleEventTriggered(
                        "Test Budget",
                        "Test: Dépassement de budget détecté",
                        "Responsable budgétaire",
                      )
                    }
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Simuler Alerte Budget
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Workflow Information */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Workflow des Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>
                  <strong>Événement Déclenché :</strong> Le système détecte un événement nécessitant une notification
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>
                  <strong>Envoi Automatique :</strong> La notification est envoyée au destinataire approprié
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>
                  <strong>Suivi et Relance :</strong> Le système relance automatiquement si pas de réponse après 24h
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>
                  <strong>Action Utilisateur :</strong> Le destinataire traite la notification et marque comme lu
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
