// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Search, Filter, CheckCircle, XCircle, Eye, Clock, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
// import { formatCurrency } from "@/lib/utils"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// // Mock Payout Requests from Resellers (both pending and completed)
// const mockPayouts = [
//   // Pending payouts (oldest first for pending)
//   {
//     id: "PAYOUT-001230",
//     date: "2023-11-20 09:15 AM",
//     phone: "024 555 0100",
//     resellerName: "Kwame Asante",
//     amount: 150.0,
//     method: "MTN MoMo",
//     momoNumber: "024 555 0100",
//     status: "pending",
//     walletBalance: 320.0,
//   },
//   {
//     id: "PAYOUT-001231",
//     date: "2023-11-20 11:30 AM",
//     phone: "050 555 0200",
//     resellerName: "Ama Serwaa",
//     amount: 280.0,
//     method: "Vodafone Cash",
//     momoNumber: "050 555 0200",
//     status: "pending",
//     walletBalance: 450.0,
//   },
//   {
//     id: "PAYOUT-001232",
//     date: "2023-11-21 08:45 AM",
//     phone: "027 555 0300",
//     resellerName: "Kofi Mensah",
//     amount: 500.0,
//     method: "MTN MoMo",
//     momoNumber: "027 555 0300",
//     status: "pending",
//     walletBalance: 780.0,
//   },
//   {
//     id: "PAYOUT-001233",
//     date: "2023-11-21 02:20 PM",
//     phone: "020 555 0400",
//     resellerName: "Yaa Pokua",
//     amount: 75.0,
//     method: "AirtelTigo Money",
//     momoNumber: "020 555 0400",
//     status: "pending",
//     walletBalance: 120.0,
//   },
//   {
//     id: "PAYOUT-001234",
//     date: "2023-11-22 10:45 AM",
//     phone: "024 555 0199",
//     resellerName: "Kwame Asante",
//     amount: 150.0,
//     method: "MTN MoMo",
//     momoNumber: "024 555 0199",
//     status: "pending",
//     walletBalance: 320.0,
//   },
//   {
//     id: "PAYOUT-001235",
//     date: "2023-11-22 11:12 AM",
//     phone: "050 555 0200",
//     resellerName: "Ama Serwaa",
//     amount: 280.0,
//     method: "Vodafone Cash",
//     momoNumber: "050 555 0200",
//     status: "pending",
//     walletBalance: 450.0,
//   },
//   {
//     id: "PAYOUT-001236",
//     date: "2023-11-22 11:30 AM",
//     phone: "027 555 0300",
//     resellerName: "Kofi Mensah",
//     amount: 500.0,
//     method: "MTN MoMo",
//     momoNumber: "027 555 0300",
//     status: "pending",
//     walletBalance: 780.0,
//   },
//   {
//     id: "PAYOUT-001237",
//     date: "2023-11-22 12:05 PM",
//     phone: "020 555 0400",
//     resellerName: "Yaa Pokua",
//     amount: 75.0,
//     method: "AirtelTigo Money",
//     momoNumber: "020 555 0400",
//     status: "pending",
//     walletBalance: 120.0,
//   },
//   // Add more pending for pagination testing
//   {
//     id: "PAYOUT-001238",
//     date: "2023-11-22 01:15 PM",
//     phone: "024 555 0500",
//     resellerName: "Akosua Frimpong",
//     amount: 200.0,
//     method: "MTN MoMo",
//     momoNumber: "024 555 0500",
//     status: "pending",
//     walletBalance: 350.0,
//   },
//   {
//     id: "PAYOUT-001239",
//     date: "2023-11-22 02:30 PM",
//     phone: "050 555 0600",
//     resellerName: "Kwaku Boateng",
//     amount: 350.0,
//     method: "Vodafone Cash",
//     momoNumber: "050 555 0600",
//     status: "pending",
//     walletBalance: 500.0,
//   },
//   {
//     id: "PAYOUT-001240",
//     date: "2023-11-22 03:45 PM",
//     phone: "027 555 0700",
//     resellerName: "Abena Osei",
//     amount: 180.0,
//     method: "MTN MoMo",
//     momoNumber: "027 555 0700",
//     status: "pending",
//     walletBalance: 250.0,
//   },
//   {
//     id: "PAYOUT-001241",
//     date: "2023-11-22 04:20 PM",
//     phone: "020 555 0800",
//     resellerName: "Kojo Amponsah",
//     amount: 420.0,
//     method: "AirtelTigo Money",
//     momoNumber: "020 555 0800",
//     status: "pending",
//     walletBalance: 600.0,
//   },
//   {
//     id: "PAYOUT-001242",
//     date: "2023-11-22 05:10 PM",
//     phone: "024 555 0900",
//     resellerName: "Efua Asante",
//     amount: 95.0,
//     method: "MTN MoMo",
//     momoNumber: "024 555 0900",
//     status: "pending",
//     walletBalance: 150.0,
//   },
//   {
//     id: "PAYOUT-001243",
//     date: "2023-11-22 06:30 PM",
//     phone: "050 555 1000",
//     resellerName: "Nana Adjei",
//     amount: 310.0,
//     method: "Vodafone Cash",
//     momoNumber: "050 555 1000",
//     status: "pending",
//     walletBalance: 400.0,
//   },
//   {
//     id: "PAYOUT-001244",
//     date: "2023-11-22 07:15 PM",
//     phone: "027 555 1100",
//     resellerName: "Akwasi Owusu",
//     amount: 225.0,
//     method: "MTN MoMo",
//     momoNumber: "027 555 1100",
//     status: "pending",
//     walletBalance: 300.0,
//   },
//   {
//     id: "PAYOUT-001245",
//     date: "2023-11-22 08:45 PM",
//     phone: "020 555 1200",
//     resellerName: "Adwoa Mensah",
//     amount: 160.0,
//     method: "AirtelTigo Money",
//     momoNumber: "020 555 1200",
//     status: "pending",
//     walletBalance: 220.0,
//   },
//   // Completed payouts (latest first for completed)
//   {
//     id: "PAYOUT-001250",
//     date: "2023-11-23 09:30 AM",
//     phone: "024 555 0500",
//     resellerName: "Akosua Frimpong",
//     amount: 200.0,
//     method: "MTN MoMo",
//     momoNumber: "024 555 0500",
//     status: "completed",
//     walletBalance: 0.0,
//   },
//   {
//     id: "PAYOUT-001251",
//     date: "2023-11-23 08:15 AM",
//     phone: "050 555 0600",
//     resellerName: "Kwaku Boateng",
//     amount: 350.0,
//     method: "Vodafone Cash",
//     momoNumber: "050 555 0600",
//     status: "completed",
//     walletBalance: 150.0,
//   },
//   {
//     id: "PAYOUT-001252",
//     date: "2023-11-22 11:45 PM",
//     phone: "027 555 0700",
//     resellerName: "Abena Osei",
//     amount: 180.0,
//     method: "MTN MoMo",
//     momoNumber: "027 555 0700",
//     status: "completed",
//     walletBalance: 70.0,
//   },
//   {
//     id: "PAYOUT-001253",
//     date: "2023-11-22 10:20 PM",
//     phone: "020 555 0800",
//     resellerName: "Kojo Amponsah",
//     amount: 420.0,
//     method: "AirtelTigo Money",
//     momoNumber: "020 555 0800",
//     status: "completed",
//     walletBalance: 180.0,
//   },
//   {
//     id: "PAYOUT-001254",
//     date: "2023-11-22 09:10 PM",
//     phone: "024 555 0900",
//     resellerName: "Efua Asante",
//     amount: 95.0,
//     method: "MTN MoMo",
//     momoNumber: "024 555 0900",
//     status: "completed",
//     walletBalance: 55.0,
//   },
//   {
//     id: "PAYOUT-001255",
//     date: "2023-11-21 06:30 PM",
//     phone: "050 555 1000",
//     resellerName: "Nana Adjei",
//     amount: 310.0,
//     method: "Vodafone Cash",
//     momoNumber: "050 555 1000",
//     status: "completed",
//     walletBalance: 90.0,
//   },
//   {
//     id: "PAYOUT-001256",
//     date: "2023-11-21 05:15 PM",
//     phone: "027 555 1100",
//     resellerName: "Akwasi Owusu",
//     amount: 225.0,
//     method: "MTN MoMo",
//     momoNumber: "027 555 1100",
//     status: "completed",
//     walletBalance: 75.0,
//   },
//   {
//     id: "PAYOUT-001257",
//     date: "2023-11-21 04:45 PM",
//     phone: "020 555 1200",
//     resellerName: "Adwoa Mensah",
//     amount: 160.0,
//     method: "AirtelTigo Money",
//     momoNumber: "020 555 1200",
//     status: "completed",
//     walletBalance: 60.0,
//   },
// ]





// export default function ConfirmPaymentPage() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [payouts, setPayouts] = useState(mockPayouts)   // mockpayments need to change over here
//   const [statusFilter, setStatusFilter] = useState("all")  // good for first view
//   const [currentPage, setCurrentPage] = useState(1)   // might have to change pagination later
//   const [selectedPayout, setSelectedPayout] = useState(null)
//   const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
//   const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
//   const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
//   const [rejectReason, setRejectReason] = useState("")

//   const itemsPerPage = 8

//   // Sort payouts: oldest pending first, latest completed first
//   const sortedPayouts = [...payouts].sort((a, b) => {
//     if (a.status === "pending" && b.status === "pending") {
//       return new Date(a.date) - new Date(b.date) // Oldest first for pending
//     }
//     if (a.status === "completed" && b.status === "completed") {
//       return new Date(b.date) - new Date(a.date) // Latest first for completed
//     }
//     if (a.status === "pending" && b.status === "completed") {
//       return -1 // Pending comes before completed
//     }
//     if (a.status === "completed" && b.status === "pending") {
//       return 1 // Completed comes after pending
//     }
//     return 0
//   })

//   const filteredPayouts = sortedPayouts.filter((payout) => {
//     const matchesSearch = 
//       payout.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       payout.phone.includes(searchTerm) ||
//       payout.resellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       payout.momoNumber.includes(searchTerm)

//     const matchesStatus = statusFilter === "all" || payout.status === statusFilter

//     return matchesSearch && matchesStatus
//   })

//   // Pagination
//   const totalPages = Math.ceil(filteredPayouts.length / itemsPerPage)
//   const startIndex = (currentPage - 1) * itemsPerPage
//   const endIndex = startIndex + itemsPerPage
//   const paginatedPayouts = filteredPayouts.slice(startIndex, endIndex)

//   // Reset to page 1 when filter changes
//   const handleFilterChange = (newFilter) => {
//     setStatusFilter(newFilter)
//     setCurrentPage(1)
//   }

//   const handleViewDetails = (payout) => {
//     setSelectedPayout(payout)
//     setIsViewDialogOpen(true)
//   }

//   const handleConfirmPayout = (payout) => {
//     setSelectedPayout(payout)
//     setIsConfirmDialogOpen(true)
//   }

//   const handleRejectPayout = (payout) => {
//     setSelectedPayout(payout)
//     setIsRejectDialogOpen(true)
//   }

//   const confirmPayout = () => {
//     setPayouts(payouts.filter((p) => p.id !== selectedPayout.id))
//     setIsConfirmDialogOpen(false)
//     setSelectedPayout(null)
//   }

//   const rejectPayout = () => {
//     setPayouts(payouts.filter((p) => p.id !== selectedPayout.id))
//     setIsRejectDialogOpen(false)
//     setRejectReason("")
//     setSelectedPayout(null)
//   }

//   const pendingCount = payouts.filter((p) => p.status === "pending").length
//   const completedCount = payouts.filter((p) => p.status === "completed").length
//   const totalCount = payouts.length

//   const getFilterLabel = () => {
//     switch (statusFilter) {
//       case "pending":
//         return "Pending"
//       case "completed":
//         return "Completed"
//       default:
//         return "All Status"
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">Confirm Payouts</h2>
//           <p className="text-muted-foreground">Review and confirm reseller payout requests.</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Badge variant="outline" className="gap-1 px-3 py-1">
//             <Clock className="w-4 h-4" />
//             {pendingCount} Pending
//           </Badge>
//           <Badge variant="outline" className="gap-1 px-3 py-1">
//             <CheckCircle className="w-4 h-4" />
//             {completedCount} Completed
//           </Badge>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Payout Requests</CardTitle>
//           <CardDescription>Review reseller payout requests and confirm after processing via MoMo.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center gap-2 mb-4">
//             <div className="relative flex-1 max-w-sm">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
//               <Input
//                 placeholder="Search by ID, name, or MoMo number..."
//                 className="pl-9"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="gap-2">
//                   <Filter className="w-4 h-4" />
//                   {getFilterLabel()}
//                   <ChevronDown className="w-4 h-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem onClick={() => handleFilterChange("all")}>
//                   All Status ({totalCount})
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => handleFilterChange("pending")}>
//                   Pending ({pendingCount})
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => handleFilterChange("completed")}>
//                   Completed ({completedCount})
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           <div className="border rounded-md">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Payout ID</TableHead>
//                   <TableHead>Date & Time</TableHead>
//                   <TableHead>Reseller</TableHead>
//                   <TableHead>MoMo Number</TableHead>
//                   <TableHead>Method</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {paginatedPayouts.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={8} className="text-center py-8 text-slate-500">
//                       No payout requests found.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   paginatedPayouts.map((payout) => (
//                     <TableRow key={payout.id}>
//                       <TableCell className="font-mono text-xs">{payout.id}</TableCell>
//                       <TableCell className="text-xs text-slate-500">{payout.date}</TableCell>
//                       <TableCell>
//                         <div>
//                           <p className="font-medium">{payout.resellerName}</p>
//                           <p className="text-xs text-slate-500">{payout.phone}</p>
//                         </div>
//                       </TableCell>
//                       <TableCell className="font-mono text-xs">{payout.momoNumber}</TableCell>
//                       <TableCell className="text-xs">{payout.method}</TableCell>
//                       <TableCell className="font-medium">{formatCurrency(payout.amount)}</TableCell>
//                       <TableCell>
//                         <Badge 
//                           className={
//                             payout.status === "pending"
//                               ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
//                               : "bg-green-100 text-green-700 hover:bg-green-100"
//                           } 
//                           variant="secondary"
//                         >
//                           {payout.status}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex items-center justify-end gap-1">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8"
//                             onClick={() => handleViewDetails(payout)}
//                             title="View Details"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </Button>
//                           {payout.status === "pending" && (
//                             <>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
//                                 onClick={() => handleConfirmPayout(payout)}
//                                 title="Confirm Payout"
//                               >
//                                 <CheckCircle className="w-4 h-4" />
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
//                                 onClick={() => handleRejectPayout(payout)}
//                                 title="Reject Payout"
//                               >
//                                 <XCircle className="w-4 h-4" />
//                               </Button>
//                             </>
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-between mt-4">
//               <div className="text-sm text-slate-500">
//                 Showing {startIndex + 1} to {Math.min(endIndex, filteredPayouts.length)} of {filteredPayouts.length} results
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="gap-1"
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                   Previous
//                 </Button>
//                 <div className="flex items-center gap-1">
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                     <Button
//                       key={page}
//                       variant={currentPage === page ? "default" : "outline"}
//                       size="sm"
//                       onClick={() => setCurrentPage(page)}
//                       className="w-8 h-8 p-0"
//                     >
//                       {page}
//                     </Button>
//                   ))}
//                 </div>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="gap-1"
//                 >
//                   Next
//                   <ChevronRight className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* View Details Dialog */}
//       <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Payout Request Details</DialogTitle>
//             <DialogDescription>Review the payout request information before processing.</DialogDescription>
//           </DialogHeader>
//           {selectedPayout && (
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <p className="text-slate-500">Payout ID</p>
//                   <p className="font-mono font-medium">{selectedPayout.id}</p>
//                 </div>
//                 <div>
//                   <p className="text-slate-500">Amount</p>
//                   <p className="font-medium text-lg">{formatCurrency(selectedPayout.amount)}</p>
//                 </div>
//                 <div>
//                   <p className="text-slate-500">Reseller</p>
//                   <p className="font-medium">{selectedPayout.resellerName}</p>
//                   <p className="text-xs text-slate-500">{selectedPayout.phone}</p>
//                 </div>
//                 <div>
//                   <p className="text-slate-500">Wallet Balance</p>
//                   <p className="font-medium">{formatCurrency(selectedPayout.walletBalance)}</p>
//                 </div>
//                 <div>
//                   <p className="text-slate-500">MoMo Number</p>
//                   <p className="font-mono font-medium">{selectedPayout.momoNumber}</p>
//                 </div>
//                 <div>
//                   <p className="text-slate-500">Method</p>
//                   <p className="font-medium">{selectedPayout.method}</p>
//                 </div>
//               </div>
//               <div className="border rounded-md p-4 bg-yellow-50 border-yellow-200">
//                 <p className="text-sm font-medium text-yellow-800">Send {formatCurrency(selectedPayout.amount)} to:</p>
//                 <p className="text-lg font-mono font-bold text-yellow-900 mt-1">{selectedPayout.momoNumber}</p>
//                 <p className="text-sm text-yellow-700 mt-1">via {selectedPayout.method}</p>
//               </div>
//             </div>
//           )}
//           <DialogFooter className="flex gap-2 sm:gap-0">
//             <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
//               Close
//             </Button>
//             <Button
//               className="bg-green-600 hover:bg-green-700"
//               onClick={() => {
//                 setIsViewDialogOpen(false)
//                 handleConfirmPayout(selectedPayout)
//               }}
//             >
//               <CheckCircle className="w-4 h-4 mr-2" />
//               Confirm Sent
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Confirm Payout Dialog */}
//       <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Confirm Payout Sent</DialogTitle>
//             <DialogDescription>
//               Confirm that you have sent the payout to the reseller via MoMo. This will mark the request as completed.
//             </DialogDescription>
//           </DialogHeader>
//           {selectedPayout && (
//             <div className="py-4">
//               <div className="bg-green-50 border border-green-200 rounded-md p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="font-medium">{selectedPayout.resellerName}</p>
//                     <p className="text-sm text-slate-500">{selectedPayout.momoNumber} • {selectedPayout.method}</p>
//                   </div>
//                   <p className="text-xl font-bold text-green-600">{formatCurrency(selectedPayout.amount)}</p>
//                 </div>
//               </div>
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button className="bg-green-600 hover:bg-green-700" onClick={confirmPayout}>
//               <CheckCircle className="w-4 h-4 mr-2" />
//               Confirm Sent
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Reject Payout Dialog */}
//       <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Reject Payout Request</DialogTitle>
//             <DialogDescription>
//               Please provide a reason for rejecting this payout request. The reseller will be notified.
//             </DialogDescription>
//           </DialogHeader>
//           {selectedPayout && (
//             <div className="space-y-4">
//               <div className="bg-red-50 border border-red-200 rounded-md p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="font-medium">{selectedPayout.resellerName}</p>
//                     <p className="text-sm text-slate-500">{selectedPayout.momoNumber}</p>
//                   </div>
//                   <p className="text-xl font-bold text-red-600">{formatCurrency(selectedPayout.amount)}</p>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="reason">Rejection Reason</Label>
//                 <Textarea
//                   id="reason"
//                   placeholder="Enter the reason for rejection..."
//                   value={rejectReason}
//                   onChange={(e) => setRejectReason(e.target.value)}
//                 />
//               </div>
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={rejectPayout}>
//               <XCircle className="w-4 h-4 mr-2" />
//               Reject Payout
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }






"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, CheckCircle, XCircle, Eye, Clock, ChevronDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"



//TEST FOR NOW
const BASE_URL = "https://2c8186ee0c04.ngrok-free.app/api/v1"




export default function ConfirmPaymentPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPayout, setSelectedPayout] = useState(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const queryClient = useQueryClient()
  const itemsPerPage = 8

  // Fetch payouts from backend
  const fetchPayouts = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      })

      // Only add status if not "all"
      if (statusFilter !== "all") {
        params.append("status", statusFilter)
      }

      const response = await fetch(`${BASE_URL}/payout/all?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "ngrok-skip-browser-warning": "true",
        },
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || "Failed to fetch payouts")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch payouts")
      }

      return data.data // { payouts: [...], pagination: {...} }
    } catch (error) {
      console.error("Fetch payouts error:", error.message)
      toast.error(error.message || "Failed to load payouts")
      throw error
    }
  }

  // React Query
  const {
    data: payoutData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminPayouts", statusFilter, currentPage],
    queryFn: fetchPayouts,
    refetchOnWindowFocus: true,
    refetchInterval: 60000, //1 minute 
    keepPreviousData: true,
  })

  // Confirm payout mutation
  const confirmMutation = useMutation({
    mutationFn: async (payoutId) => {
      const response = await fetch(`${BASE_URL}/payout/${payoutId}/process`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          action: "approve",
          transactionReference: `JPAY-${Date.now()}` // You can customize this
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || "Failed to confirm payout")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to confirm payout")
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminPayouts"])
      toast.success("Payout confirmed successfully")
      setIsConfirmDialogOpen(false)
      setSelectedPayout(null)
    },
    onError: (error) => {
      toast.error(error.message || "Failed to confirm payout")
    },
  })

  // Reject payout mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ payoutId, reason }) => {
      const response = await fetch(`${BASE_URL}/payout/${payoutId}/process`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          action: "reject",
          rejectionReason: reason
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || "Failed to reject payout")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to reject payout")
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminPayouts"])
      toast.success("Payout rejected")
      setIsRejectDialogOpen(false)
      setSelectedPayout(null)
      setRejectReason("")
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reject payout")
    },
  })

  const payouts = payoutData?.payouts || []
  const pagination = payoutData?.pagination || { page: 1, pages: 1, total: 0 }

  // Client-side search filtering
  const filteredPayouts = payouts.filter((payout) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      payout._id?.toLowerCase().includes(searchLower) ||
      payout.phoneNumber?.includes(searchTerm) ||
      payout.reseller?.name?.toLowerCase().includes(searchLower) ||
      payout.accountName?.toLowerCase().includes(searchLower) ||
      payout.transactionReference?.toLowerCase().includes(searchLower)
    )
  })

  // Count payouts by status (from current page data)
  // const pendingCount = payouts.filter((p) => p.status === "pending").length
   const pendingCount = payoutData?.statusTotals.pending
  // const completedCount = payouts.filter((p) => p.status === "completed").length
    const completedCount = payoutData?.statusTotals.completed
  // const rejectedCount = payouts.filter((p) => p.status === "rejected").length
  const rejectedCount = payoutData?.statusTotals.rejected

  const totalCount = pagination.total

  // Reset to page 1 when filter changes
  const handleFilterChange = (newFilter) => {
    setStatusFilter(newFilter)
    setCurrentPage(1)
  }

  const handleViewDetails = (payout) => {
    setSelectedPayout(payout)
    setIsViewDialogOpen(true)
  }

  const handleConfirmPayout = (payout) => {
    setSelectedPayout(payout)
    setIsConfirmDialogOpen(true)
  }

  const handleRejectPayout = (payout) => {
    setSelectedPayout(payout)
    setIsRejectDialogOpen(true)
  }

  const confirmPayout = () => {
    if (!selectedPayout) return
    confirmMutation.mutate(selectedPayout._id)
  }

  const rejectPayout = () => {
    if (!selectedPayout || !rejectReason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }
    rejectMutation.mutate({
      payoutId: selectedPayout._id,
      reason: rejectReason
    })
  }

  const getFilterLabel = () => {
    switch (statusFilter) {
      case "pending":
        return "Pending"
      case "completed":
        return "Completed"
      case "rejected":
        return "Rejected"
      default:
        return "All Status"
    }
  }

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Confirm Payouts</h2>
          <p className="text-muted-foreground">Review and confirm reseller payout requests.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 px-3 py-1 bg-green-600 text-white">
            <CheckCircle className="w-4 h-4" />
            {completedCount} Completed
          </Badge>
          <Badge variant="outline" className="gap-1 px-3 py-1 bg-amber-600 text-white">
            <Clock className="w-4 h-4" />
            {pendingCount} Pending
          </Badge>
          <Badge variant="outline" className="gap-1 px-3 py-1 bg-red-600 text-white">
            <Clock className="w-4 h-4" />
            {rejectedCount} Rejected
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payout Requests</CardTitle>
          <CardDescription>Review reseller payout requests and confirm after processing via MoMo.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search by ID, name, or MoMo number..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />


            </div>



            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {getFilterLabel()}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleFilterChange("all")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("rejected")}>
                  Rejected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("completed")}>
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* //This right here is the refresh button */}
            <Button onClick={() => queryClient.invalidateQueries(["adminPayouts"])} className={"border-2 border-slate-600 bg-blue-500 text-white hover:bg-green-700"}>Refresh</Button>

          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payout ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Reseller</TableHead>
                  <TableHead>MoMo Number</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        <p className="text-slate-500">Loading payouts...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <XCircle className="h-8 w-8 text-red-500" />
                        <p className="text-red-600 font-medium">Failed to load payouts</p>
                        <p className="text-sm text-slate-500">{error?.message}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => queryClient.invalidateQueries(["adminPayouts"])}
                          className="mt-2"
                        >
                          Try Again
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPayouts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                      No payout requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayouts.map((payout) => (
                    <TableRow key={payout._id}>
                      <TableCell className="font-mono text-xs">{payout._id?.slice(-8) || "N/A"}</TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {formatDate(payout.requestedAt || payout.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payout.reseller?.name || "Unknown"}</p>
                          <p className="text-xs text-slate-500">{payout.reseller?.phoneNumber || "N/A"}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{payout.phoneNumber || "N/A"}</TableCell>
                      <TableCell className="text-xs">{payout.network || "N/A"}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(payout.netAmount || 0)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            payout.status === "pending"
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                              : payout.status === "completed"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-red-100 text-red-700 hover:bg-red-100"
                          }
                          variant="secondary"
                        >
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleViewDetails(payout)}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {payout.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleConfirmPayout(payout)}
                                title="Confirm Payout"
                                disabled={confirmMutation.isPending}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRejectPayout(payout)}
                                title="Reject Payout"
                                disabled={rejectMutation.isPending}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && !isLoading && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-slate-500">
                Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="gap-1 hover:bg-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                    let pageNum
                    if (pagination.pages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={isLoading}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.pages || isLoading}
                  className="gap-1 hover:bg-slate-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payout Request Details</DialogTitle>
            <DialogDescription>Review the payout request information before processing.</DialogDescription>
          </DialogHeader>
          {selectedPayout && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Payout ID</p>
                  <p className="font-mono font-medium">{selectedPayout._id?.slice(-12) || "N/A"}</p>
                </div>
                <div>
                  <p className="text-slate-500">Amount</p>
                  <p className="font-medium text-lg">{formatCurrency(selectedPayout.amount)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Reseller</p>
                  <p className="font-medium">{selectedPayout.reseller?.name || "Unknown"}</p>
                  <p className="text-xs text-slate-500">{selectedPayout.reseller?.phoneNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-slate-500">Net Amount</p>
                  <p className="font-medium">{formatCurrency(selectedPayout.netAmount || 0)}</p>
                </div>
                <div>
                  <p className="text-slate-500">MoMo Number</p>
                  <p className="font-mono font-medium">{selectedPayout.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-slate-500">Method</p>
                  <p className="font-medium">{selectedPayout.network}</p>
                </div>
                <div>
                  <p className="text-slate-500">Account Name</p>
                  <p className="font-medium">{selectedPayout.accountName}</p>
                </div>
                <div>
                  <p className="text-slate-500">Processing Fee</p>
                  <p className="font-medium text-red-600">{formatCurrency(selectedPayout.payoutCharge || 0)}</p>
                </div>
              </div>
              <div className="border rounded-md p-4 bg-yellow-50 border-yellow-200">
                <p className="text-sm font-medium text-yellow-800">Send {formatCurrency(selectedPayout.netAmount)} to:</p>
                <p className="text-lg font-mono font-bold text-yellow-900 mt-1">{selectedPayout.phoneNumber}</p>
                <p className="text-sm text-yellow-700 mt-1">via {selectedPayout.network}</p>
                <p className="text-xs text-yellow-700 mt-2">Account Name: {selectedPayout.accountName}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                setIsViewDialogOpen(false)
                handleConfirmPayout(selectedPayout)
              }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Sent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Payout Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Payout Sent</DialogTitle>
            <DialogDescription>
              Confirm that you have sent the payout to the reseller via MoMo. This will mark the request as completed.
            </DialogDescription>
          </DialogHeader>
          {selectedPayout && (
            <div className="py-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedPayout.reseller?.name || "Unknown"}</p>
                    <p className="text-sm text-slate-500">{selectedPayout.phoneNumber} • {selectedPayout.network}</p>
                  </div>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(selectedPayout.netAmount || selectedPayout.amount)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
              disabled={confirmMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 "
              onClick={confirmPayout}
              disabled={confirmMutation.isPending}
            >
              {confirmMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Sent
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Payout Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Payout Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this payout request. The reseller will be notified.
            </DialogDescription>
          </DialogHeader>
          {selectedPayout && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedPayout.reseller?.name || "Unknown"}</p>
                    <p className="text-sm text-slate-500">{selectedPayout.phoneNumber}</p>
                  </div>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(selectedPayout.amount)}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Rejection Reason *</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter the reason for rejection..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  disabled={rejectMutation.isPending}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              className="outline hover:bg-slate-300"
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={rejectMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="outline bg-red-500 text-white hover:bg-red-900 "
              onClick={rejectPayout}
              disabled={rejectMutation.isPending || !rejectReason.trim()}
            >
              {rejectMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Payout
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}