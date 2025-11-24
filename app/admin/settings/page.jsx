"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, RefreshCw, Server } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground">Manage platform configuration and monitor service health.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Service Health Monitor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Service Heartbeat
            </CardTitle>
            <CardDescription>Real-time status of external APIs and internal workers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {[
                { name: "MTN Mobile Money API", status: "operational" },
                { name: "Telecel Cash API", status: "operational" },
                { name: "AT Money API", status: "degraded" },
                { name: "SMS Gateway (Hubtel)", status: "operational" },
                { name: "Order Fulfillment Bot", status: "operational" },
              ].map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <span className="font-medium text-sm">{service.name}</span>
                  {service.status === "operational" ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex gap-1">
                      <CheckCircle className="w-3 h-3" /> Online
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex gap-1">
                      <AlertTriangle className="w-3 h-3" /> Unstable
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Health Check
            </Button>
          </CardContent>
        </Card>

        {/* General Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Controls</CardTitle>
            <CardDescription>Global switches for system behavior.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-1">
                <Label htmlFor="maintenance" className="text-base">
                  Maintenance Mode
                </Label>
                <p className="text-xs text-slate-500">
                  Disable all customer purchases. Admins can still access the dashboard.
                </p>
              </div>
              <Switch id="maintenance" />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-1">
                <Label htmlFor="auto-fulfill" className="text-base">
                  Auto-Fulfillment
                </Label>
                <p className="text-xs text-slate-500">
                  Automatically process orders via the bot. Turn off to switch to manual mode.
                </p>
              </div>
              <Switch id="auto-fulfill" defaultChecked />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-1">
                <Label htmlFor="new-resellers" className="text-base">
                  Allow New Resellers
                </Label>
                <p className="text-xs text-slate-500">Enable public registration for new reseller accounts.</p>
              </div>
              <Switch id="new-resellers" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Admin Notifications</CardTitle>
            <CardDescription>Configure where you receive system alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Alert Email Address</Label>
                <Input defaultValue="admin@joybundle.com" />
              </div>
              <div className="space-y-2">
                <Label>Emergency Phone (SMS)</Label>
                <Input defaultValue="+233 54 555 0199" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
