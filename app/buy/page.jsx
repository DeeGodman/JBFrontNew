"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" // Added Alert import
import { Loader2, CheckCircle2, AlertTriangle, Menu, HelpCircle, Search } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn, NETWORKS, formatCurrency } from "@/lib/utils"
import Link from "next/link" // Added Link import




//MY OWN IMPORTS RIGHT NOW
import toast from "react-hot-toast";
import { Waveform } from 'ldrs/react'
import 'ldrs/react/Waveform.css'
import { BASE_URL } from "@/lib/api/client"
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Mock API function
const fetchBundles = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  //NOTE DCHUKS---------> I HAVE TO PULL THE ACTUAL DATA FROM BACKEND
  return [
    { id: 1, name: "1GB Data", price: 15, network: "mtn" },
    { id: 2, name: "2GB Data", price: 28, network: "mtn" },
    { id: 3, name: "5GB Data", price: 60, network: "mtn" },
    { id: 4, name: "1GB Data", price: 14, network: "telecel" },
    { id: 5, name: "5GB Data", price: 55, network: "telecel" },
    { id: 6, name: "10GB Data", price: 100, network: "at" },
  ]
}







 


export default function BuyPage() {
  const [step, setStep] = useState(1) // 1: Network, 2: Bundle, 3: Details, 4: Payment, 5: Success
  const [selectedNetwork, setSelectedNetwork] = useState(null)
  const [selectedBundle, setSelectedBundle] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [processing, setProcessing] = useState(false)

  //The ones i am personally adding myself
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);
  const [emailAddress, setEmailAddress] = useState("")
  const [verifying, setVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
 // Initialize state directly from localStorage
const [resellerCode, setResellerCode] = useState(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("resellerCode") || "";
  }
  return "";
});


  //This particular state is to hold payment data so i can let users see their payment details after successful payment
  const [paymentData, setPaymentData] = useState(null);



   //UseEffect for getting the reseller Code from localStorage if it exists
  //   useEffect(() => {
  //     const code = localStorage.getItem("resellerCode");
  //     if (code) {
  //       setResellerCode(code);
  //     }
  //   }, []);

  // console.log("Current Reseller Code in Buy Page:", resellerCode);






const fetchResellerCommission = async () => {
  try {
    // If no reseller code, return null (no commission)
    if (!resellerCode) {
      return {
        success: true,
        data: null, // No reseller
        message: "No reseller code found"
      };
    }
    
    const response = await fetch(`https://2c8186ee0c04.ngrok-free.app/api/v1/users/public/commission/${resellerCode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
    });
    
    // Handle non-2xx errors
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      
      // If reseller not found, return null (don't show error toast)
      if (response.status === 404) {
        console.warn("Reseller code not found:", resellerCode);
        return {
          success: true,
          data: null,
          message: "Reseller not found"
        };
      }
      
      throw new Error(err.message || "Failed to fetch reseller commission ");
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch commission");
    }
    
    console.log("Fetched reseller commission:", data);
    return data.data; // { success, data: { resellerCode, commissionRate, name } }
    
  } catch (error) {
    console.error("Fetch reseller commission error:", error.message);
    toast.error(error.message || "Error fetching reseller info");
    throw error;
  }
};


 const {
    data: resellerData,
    isLoading: isLoadingReseller,
    isError: isErrorReseller,
    refetch: refetchReseller,
  } = useQuery({
    queryKey: ["resellerCommission"],
    queryFn: fetchResellerCommission,
 
  });



//   const {
//   data,
//   isLoading,
//   isError,
//   refetch,
// } = useQuery({
//   queryKey: ["bundles"],
//   queryFn: fetchBundles,
// });


  console.log("Current reseller data:", resellerData);



  // Function to verify payment
  const verifyPayment = async (reference) => {
    setVerifying(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://2c8186ee0c04.ngrok-free.app/api/v1/payments/paystack/verify/${reference}`,
        {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            "ngrok-skip-browser-warning": "true"
          }
        }
      );

      const data = await response.json();
      console.log('Payment verification response:', data);
     //might need to change this to data.data.status later

      if (response.ok && data.status) {
        console.log("That specicifi UI thingy is happening")
        setPaymentStatus(data.data.status);
        console.log(paymentStatus)
        setPaymentData(data.data);
        setStep(5)
        // Optional: Clear the URL parameters after successful verification
        // router.replace("/buy");
      } else {
        setPaymentStatus('failed');
        setError(data.message || 'Payment verification failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setPaymentStatus('error');
      setError('Unable to verify payment. Please contact support.');
    } finally {
      setVerifying(false);
    }
  };



useEffect(() => {
    const reference = searchParams.get('reference');
    
    // If there's a reference in the URL, verify the payment
    if (reference) {  
         // Immediately wipe the URL so the user never sees the reference version
    router.replace("/buy");
      verifyPayment(reference);
    }
  }, [searchParams]);





 //CALLING BUNDLE FROM BACKEND USING FETCH API 
const fetchBundles = async () => {
  try {
    //I will replace this with the BASE_URL from .env later
    const response = await fetch(`https://2c8186ee0c04.ngrok-free.app/api/v1/bundles/getBundleFromDb`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
         "ngrok-skip-browser-warning": "true"
       },
    });

    // Handle non-2xx errors
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Something went wrong");
    }

    // Parse JSON
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch bundles");
    }

    toast.success(data.message);
    console.log("Fetched bundles:", data);

    return data; 
    //  { success, message, data: bundles }
  } catch (error) {
    console.error("Fetch bundles error:", error.message);
    toast.error(error.message || "Unexpected error");
    throw error;
  }
};


  // useQuery hook
const {
  data,
  isLoading,
  isError,
  refetch,
} = useQuery({
  queryKey: ["bundles"],
  queryFn: fetchBundles,
});

console.log("This is current data:", data);



//The actuaal data bundle
const bundles = data?.data || [];
console.log("Bundles to display:", bundles);



  const filteredBundles = bundles?.filter((b) => b.network === selectedNetwork) || []

  const handleNetworkSelect = (networkId) => {
    setSelectedNetwork(networkId)
    setStep(2)
  }

  const handleBundleSelect = (bundle) => {
    setSelectedBundle(bundle)
    setStep(3)
  }





  //I have to now integrate payment gateway here
  const handlePayment = async (e) => {
    e.preventDefault()
    setProcessing(true)
   try {
    // Call your backend to initialize payment
    const response = await fetch('https://2c8186ee0c04.ngrok-free.app/api/v1/payments/paystack/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailAddress,
        amount: selectedBundle.JBSP, // Paystack expects amount in kobo/pesewas
        bundleId: selectedBundle.Bundle_id,
        phoneNumberReceivingData: phoneNumber,
        resellerCode: resellerCode,
        callback_url: "http://localhost:3000/buy"
       
      })
    });

    const data = await response.json();
   
    console.log('Payment initialization response on frontend:', data);



    if (!data.status) {
      throw new Error(data.message || 'Payment initialization failed');
    }


   console.log('Redirecting to Paystack checkout:', data.data.data.authorization_url);  // something fishy here will check later 
   console.log

    // Redirect to Paystack checkout
    window.location.href = data.data.data.authorization_url;

  } catch (error) {
    console.error('Payment error:', error);
    toast.error(error.message || 'Failed to initialize payment');
    setProcessing(false);
  }
}



  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Joy Data" className="h-8 w-8 rounded border border-slate-100" />
            <span className="font-bold text-lg text-slate-900">Joy Online</span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-4">
            <Link 
              href="/track-order" 
              className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors flex items-center gap-1"
            >
              <Search className="h-4 w-4" />
              Track Order
            </Link>
            <Link 
              href="/support" 
              className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors flex items-center gap-1"
            >
              <HelpCircle className="h-4 w-4" />
              Support
            </Link>
          </nav>

          {/* Mobile Nav */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 mt-8">
                  <Link href="/track-order" className="font-medium text-lg flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Track Order
                  </Link>
                  <Link href="/support" className="font-medium text-lg flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Support
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md py-8">
          {/* Progress Steps */}
          <div className="flex justify-between mb-8 px-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                    step >= i ? "bg-primary text-primary-foreground" : "bg-slate-200 text-slate-500",
                  )}
                >
                  {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {i === 1 ? "Network" : i === 2 ? "Bundle" : "Checkout"}
                </span>
              </div>
            ))}
          </div>

          <Card className="shadow-xl border-slate-100 ring-0">
            <CardHeader>
              <CardTitle>
                {step === 1 && "Select Network"}
                {step === 2 && "Choose Package"}
                {step === 3 && "Enter Details"}

                {/* THIS IS THE PROCESS WE HAVE TO INTEGRATE PAYMENT GATEWAY IN DELA */}
                {step === 5 && "Order Confirmed"}    
              
              </CardTitle>
              <CardDescription>
                {step === 1 && "Which network do you want to top up?"}
                {step === 2 && `Available bundles for ${NETWORKS.find((n) => n.id === selectedNetwork)?.name}`}
                {step === 3 && "Enter the recipient phone number"}
                {step === 5 && "Your data is on its way!"}
              </CardDescription>
            </CardHeader>




        {/* // SELECTING NETWORK -----NOTE DELA */}
            <CardContent>
              {step === 1 && (
                <div className="grid grid-cols-1 gap-3">
                  {NETWORKS.map((net) => (
                    <button
                      key={net.id}
                      onClick={() => handleNetworkSelect(net.id)}
                      className={cn(
                        "flex items-center p-4 rounded-xl border-2 border-transparent transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm",
                        net.color,
                      )}
                    >
                      <img
                        src={net.logo}
                        alt={net.name}
                        className="h-8 w-8 rounded-full border border-white/60 mr-3 bg-white object-contain"
                      />
                      <span className="font-bold text-lg">{net.name}</span>
                    </button>
                  ))}
                </div>
              )}



          {/* SELECTING BUNDLE ----NOTE DELA*/}
              {step === 2 && (
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">


                      {/* DISPLAYS FILTERED BUNDLES BASED ON NETWORK SELECTED -----NOTE DELA */}
                      {filteredBundles.map((bundle) => (
                        <button
                         //I have changed the bundle.id to bundle.Bundle_id to match the backend data structure -----NOTE DELA
                          key={bundle.Bundle_id}
                          onClick={() => handleBundleSelect(bundle)}
                          className="flex items-center justify-between p-4 rounded-lg border hover:border-primary hover:bg-blue-50 transition-all bg-white group"
                        >
                          <span className="font-medium group-hover:text-primary">{bundle.name}</span>
                          <Badge variant="secondary" className="text-base px-3 py-1">
                            {/* //WOULD HAVE TO DISPLAY PRICE AFTER MULTIPLYING BY RESELLERS COMMISSION RATE -------NOTE DELA*/}
                            {formatCurrency( bundle.JBSP + (bundle.JBSP * resellerData.commissionRate / 100))}     
                          </Badge>
                        </button>
                      ))}
                    </div>
                  )}
                  <Button variant="ghost" className="w-full" onClick={() => setStep(1)}>
                    Back to Networks
                  </Button>
                </div>
              )}




              {/* //PAYMENT DETAILS FORM PAYSTACK INTEGRATION HAPPENS OVER HERE ----NOTE DELA*/}
              {step === 3 && (
                <form onSubmit={handlePayment} className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-lg space-y-2 border">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Network</span>
                      <span className="flex items-center gap-2 font-medium">
                        {NETWORKS.find((n) => n.id === selectedNetwork)?.logo && (
                          <img
                            src={NETWORKS.find((n) => n.id === selectedNetwork)?.logo}
                            alt={NETWORKS.find((n) => n.id === selectedNetwork)?.name}
                            className="h-5 w-5 rounded-full border border-slate-200 bg-white object-contain"
                          />
                        )}
                        {NETWORKS.find((n) => n.id === selectedNetwork)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Bundle</span>
                      <span className="font-medium">{selectedBundle?.name}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="font-bold">Total</span>

                      {/* //ONCE AGAIN WOULD HAVE TO DISPLAY PRICE AFTER MULTIPLYING BY RESELLERS COMMISSION RATE -------NOTE DELA */}
                      <span className="font-bold text-primary text-lg">{formatCurrency( selectedBundle?.JBSP + (selectedBundle?.JBSP * resellerData.commissionRate / 100))}</span>
                    </div>
                  </div>

                  

                  <Alert variant="destructive" className="bg-amber-50 text-amber-900 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-4" />
                    <AlertTitle className="text-amber-800">Important Warning</AlertTitle>
                    <AlertDescription className="text-xs leading-relaxed mt-1">
                      Please double-check the phone number below. The platform is <strong>not responsible</strong> for
                      bundles sent to the wrong number due to user error. Transactions cannot be reversed once
                      processed.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                  <Label htmlFor="phone">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="example@gmail.com"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="text-lg tracking-widest"
                        required
                      />



                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="024 XXX XXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="text-lg tracking-widest"
                      required
                      pattern="[0-9]{10}"
                    />
                    <p className="text-xs text-slate-500">Please ensure this number is registered on Mobile Money.</p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1 border-2 border-black bg-green-600 text-white hover:bg-green-900" disabled={!phoneNumber || processing}>
                      {processing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing
                        </>
                      ) : (
                        "Pay Now"
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {step === 5 && (
                <div className="flex flex-col items-center text-center space-y-4 py-6">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl">{`Payment ${paymentStatus}!`}</h3>
                    {
                      paymentStatus === 'success' ? (
                        <p className="text-slate-500 max-w-[260px] mx-auto"> Your {selectedBundle?.name} bundle is being processed and will be delivered to {phoneNumber}{" "}
                      shortly. Thank you for choosing Joy Data! kindly copy your reference to track bundle {paymentData.reference}</p>
                      ) :  (
                        <p className="text-red-600  max-w-[260px] mx-auto">Your payment failed. Please try again.</p>
                      ) 
                    }

                    {/* <p className="text-slate-500 max-w-[260px] mx-auto">
                      Your {selectedBundle?.name} bundle is being processed and will be delivered to {phoneNumber}{" "}
                      shortly. Thank you for choosing Joy Data!
                    </p> */}


                  </div>
                  <div className="pt-4 w-full">
                    <Button
                      className="w-full"
                      onClick={() => {
                        setStep(1)
                        setPhoneNumber("")
                        setSelectedNetwork(null)
                        setSelectedBundle(null)
                      }}
                    >
                      Buy Another
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
