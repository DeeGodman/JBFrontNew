"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { formatCurrency, NETWORKS } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const initialBundles = [
  { id: 1, name: "1GB Data", price: 15, network: "mtn", volume: "1GB", active: true },
  { id: 2, name: "2GB Data", price: 28, network: "mtn", volume: "2GB", active: true },
  { id: 3, name: "5GB Data", price: 60, network: "mtn", volume: "5GB", active: true },
  { id: 4, name: "1GB Data", price: 14, network: "telecel", volume: "1GB", active: true },
  { id: 5, name: "5GB Data", price: 55, network: "telecel", volume: "5GB", active: true },
  { id: 6, name: "10GB Data", price: 100, network: "at", volume: "10GB", active: false },
]

export default function BundlesPage() {
  const [bundles, setBundles] = useState(initialBundles)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBundle, setEditingBundle] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bundleToDelete, setBundleToDelete] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    network: "mtn",
    volume: "",
    active: true,
  })

  const handleAddNew = () => {
    setEditingBundle(null)
    setFormData({
      name: "",
      price: "",
      network: "mtn",
      volume: "",
      active: true,
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (bundle) => {
    setEditingBundle(bundle)
    setFormData({
      name: bundle.name,
      price: bundle.price,
      network: bundle.network,
      volume: bundle.volume,
      active: bundle.active,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (bundle) => {
    setBundleToDelete(bundle)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (bundleToDelete) {
      setBundles(bundles.filter((b) => b.id !== bundleToDelete.id))
      setDeleteDialogOpen(false)
      setBundleToDelete(null)
    }
  }

  const handleSave = () => {
    if (editingBundle) {
      setBundles(
        bundles.map((b) => (b.id === editingBundle.id ? { ...b, ...formData, price: Number(formData.price) } : b)),
      )
    } else {
      const newBundle = {
        id: Math.max(...bundles.map((b) => b.id)) + 1,
        ...formData,
        price: Number(formData.price),
      }
      setBundles([...bundles, newBundle])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Bundle Management</h2>
        <Button onClick={handleAddNew} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="mr-2 h-4 w-4" />
          Add New Bundle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Packages</CardTitle>
          <CardDescription>Manage pricing and availability of data bundles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Network</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bundles.map((bundle) => (
                <TableRow key={bundle.id}>
                  <TableCell className="font-medium">{bundle.name}</TableCell>
                  <TableCell>
                    {(() => {
                      const net = NETWORKS.find((n) => n.id === bundle.network)
                      return (
                        <div className="flex items-center gap-2">
                          {net?.logo && (
                            <img
                              src={net.logo}
                              alt={net.name}
                              className="h-6 w-6 rounded-full border border-slate-200 bg-white object-contain"
                            />
                          )}
                          <Badge variant="outline" className="px-2 py-0.5 text-xs font-medium">
                            {net?.name ?? bundle.network.toUpperCase()}
                          </Badge>
                        </div>
                      )
                    })()}
                  </TableCell>
                  <TableCell>{bundle.volume}</TableCell>
                  <TableCell>{formatCurrency(bundle.price)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={bundle.active ? "default" : "secondary"}
                      className={bundle.active ? "bg-green-500 hover:bg-green-600" : "bg-slate-200 text-slate-600"}
                    >
                      {bundle.active ? "Active" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-slate-100"
                        onClick={() => handleEdit(bundle)}
                      >
                        <Edit2 className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDeleteClick(bundle)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[460px] bg-white/95 shadow-2xl border border-slate-200">
          <DialogHeader>
            <DialogTitle>{editingBundle ? "Edit Bundle" : "Create New Bundle"}</DialogTitle>
            <DialogDescription>Configure the bundle details, pricing and availability.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                placeholder="e.g. 1GB Promo"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="network" className="text-right">
                Network
              </Label>
              <Select value={formData.network} onValueChange={(val) => setFormData({ ...formData, network: val })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mtn">MTN</SelectItem>
                  <SelectItem value="telecel">Telecel</SelectItem>
                  <SelectItem value="at">AT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="volume" className="text-right">
                Volume
              </Label>
              <Input
                id="volume"
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                className="col-span-3"
                placeholder="e.g. 2.5GB"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (GHS)
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="col-span-3"
                placeholder="0.00"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Status
              </Label>
              <div className="flex items-center gap-2 col-span-3">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <span className="text-sm text-slate-500">
                  {formData.active ? "Active for purchase" : "Hidden from store"}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-2 flex flex-row justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="min-w-[90px] justify-center"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="min-w-[120px] justify-center bg-cyan-600 hover:bg-cyan-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the <strong>{bundleToDelete?.name}</strong> bundle. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete Bundle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
