"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Save, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"

interface ConfigParameter {
  id: string
  name: string
  value: string | boolean | number
  type: "text" | "boolean" | "number"
  description: string
  isValid: boolean
  errorMessage?: string
}

export default function ConfigurationPage() {
  const [parameters, setParameters] = useState<ConfigParameter[]>([
    {
      id: "budget_max",
      name: "Budget Maximum",
      value: 2000000,
      type: "number",
      description: "Montant maximum autorisé pour le budget annuel",
      isValid: true,
    },
    {
      id: "vote_quorum",
      name: "Quorum de Vote",
      value: 60,
      type: "number",
      description: "Pourcentage minimum de participation requis pour valider un vote",
      isValid: true,
    },
    {
      id: "auto_notifications",
      name: "Notifications Automatiques",
      value: true,
      type: "boolean",
      description: "Activer l'envoi automatique de notifications",
      isValid: true,
    },
    {
      id: "validation_delay",
      name: "Délai de Validation",
      value: 48,
      type: "number",
      description: "Délai en heures pour valider les transactions",
      isValid: true,
    },
  ])

  const [isModifying, setIsModifying] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // Workflow: Accède à la configuration -> Affiche les paramètres actuels
  const handleStartModification = () => {
    setIsModifying(true)
  }

  // Workflow: Modifie les paramètres -> Applique les changements
  const handleParameterChange = (id: string, newValue: string | boolean | number) => {
    setParameters((prev) =>
      prev.map((param) => {
        if (param.id === id) {
          const updatedParam = { ...param, value: newValue }
          // Validation des paramètres
          updatedParam.isValid = validateParameter(updatedParam)
          if (!updatedParam.isValid) {
            updatedParam.errorMessage = getValidationError(updatedParam)
          }
          return updatedParam
        }
        return param
      }),
    )
    setHasChanges(true)
  }

  // Workflow: DecisionNode10 -> Affiche une alerte si les paramètres sont invalides
  const validateParameter = (param: ConfigParameter): boolean => {
    switch (param.id) {
      case "budget_max":
        return typeof param.value === "number" && param.value > 0 && param.value <= 10000000
      case "vote_quorum":
        return typeof param.value === "number" && param.value >= 50 && param.value <= 100
      case "validation_delay":
        return typeof param.value === "number" && param.value >= 1 && param.value <= 168
      default:
        return true
    }
  }

  const getValidationError = (param: ConfigParameter): string => {
    switch (param.id) {
      case "budget_max":
        return "Le budget maximum doit être entre 1 et 10 000 000 €"
      case "vote_quorum":
        return "Le quorum doit être entre 50% et 100%"
      case "validation_delay":
        return "Le délai doit être entre 1 et 168 heures"
      default:
        return "Valeur invalide"
    }
  }

  // Workflow: Corrige les paramètres (si erreurs détectées)
  const handleSaveConfiguration = () => {
    const errors: string[] = []
    const invalidParams = parameters.filter((p) => !p.isValid)

    if (invalidParams.length > 0) {
      invalidParams.forEach((param) => {
        errors.push(`${param.name}: ${param.errorMessage}`)
      })
      setValidationErrors(errors)
      return
    }

    // Simulation de la sauvegarde
    setValidationErrors([])
    setHasChanges(false)
    setIsModifying(false)

    // Notification au responsable budgétaire (workflow)
    console.log("Configuration sauvegardée - Notification envoyée au responsable budgétaire")
  }

  const handleCancelModification = () => {
    setIsModifying(false)
    setHasChanges(false)
    setValidationErrors([])
    // Restaurer les valeurs originales si nécessaire
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            Configuration du Système
          </h1>
          <p className="text-gray-600 mt-2">Gestion des paramètres globaux du système budgétaire</p>
        </div>

        {/* Workflow Status */}
        <Card className="mb-6 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              État du Workflow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant={isModifying ? "default" : "secondary"}>
                {isModifying ? "Mode Modification" : "Mode Consultation"}
              </Badge>
              {hasChanges && (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  Modifications en attente
                </Badge>
              )}
              {validationErrors.length > 0 && <Badge variant="destructive">Erreurs de validation détectées</Badge>}
            </div>
          </CardContent>
        </Card>

        {/* Validation Errors Alert */}
        {validationErrors.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Erreurs de validation :</strong>
              <ul className="mt-2 list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Paramètres Généraux</TabsTrigger>
            <TabsTrigger value="votes">Configuration Votes</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Paramètres Généraux du Système</CardTitle>
                <CardDescription>Configuration des paramètres principaux</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {parameters
                  .filter((p) => ["budget_max", "validation_delay"].includes(p.id))
                  .map((param) => (
                    <div key={param.id} className="space-y-2">
                      <Label htmlFor={param.id} className="text-sm font-medium">
                        {param.name}
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id={param.id}
                          type={param.type}
                          value={param.value.toString()}
                          onChange={(e) =>
                            handleParameterChange(
                              param.id,
                              param.type === "number" ? Number.parseFloat(e.target.value) : e.target.value,
                            )
                          }
                          disabled={!isModifying}
                          className={!param.isValid ? "border-red-500" : ""}
                        />
                        {param.isValid ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{param.description}</p>
                      {!param.isValid && param.errorMessage && (
                        <p className="text-sm text-red-600">{param.errorMessage}</p>
                      )}
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="votes">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Configuration du Système de Vote</CardTitle>
                <CardDescription>Paramètres pour les processus de vote</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {parameters
                  .filter((p) => p.id === "vote_quorum")
                  .map((param) => (
                    <div key={param.id} className="space-y-2">
                      <Label htmlFor={param.id} className="text-sm font-medium">
                        {param.name}
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id={param.id}
                          type="number"
                          value={param.value.toString()}
                          onChange={(e) => handleParameterChange(param.id, Number.parseFloat(e.target.value))}
                          disabled={!isModifying}
                          className={!param.isValid ? "border-red-500" : ""}
                          min="50"
                          max="100"
                        />
                        <span className="text-sm text-gray-500">%</span>
                        {param.isValid ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{param.description}</p>
                      {!param.isValid && param.errorMessage && (
                        <p className="text-sm text-red-600">{param.errorMessage}</p>
                      )}
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Configuration des Notifications</CardTitle>
                <CardDescription>Paramètres pour le système de notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {parameters
                  .filter((p) => p.id === "auto_notifications")
                  .map((param) => (
                    <div key={param.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor={param.id} className="text-sm font-medium">
                            {param.name}
                          </Label>
                          <p className="text-sm text-gray-600">{param.description}</p>
                        </div>
                        <Switch
                          id={param.id}
                          checked={param.value as boolean}
                          onCheckedChange={(checked) => handleParameterChange(param.id, checked)}
                          disabled={!isModifying}
                        />
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex gap-4 justify-end">
              {!isModifying ? (
                <Button onClick={handleStartModification} className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Modifier la Configuration
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCancelModification}>
                    Annuler
                  </Button>
                  <Button onClick={handleSaveConfiguration} disabled={!hasChanges} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Sauvegarder
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Workflow Information */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Workflow de Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>
                  <strong>Administrateur Système :</strong> Accède à la configuration et modifie les paramètres
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>
                  <strong>Système :</strong> Affiche les paramètres actuels et applique les changements
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>
                  <strong>Responsable Budgétaire :</strong> Consulte les paramètres mis à jour
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>
                  <strong>Validation :</strong> Le système vérifie la validité des paramètres avant sauvegarde
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
