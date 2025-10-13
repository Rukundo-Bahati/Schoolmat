"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Search,
  ShoppingCart,
  User,
  ArrowLeft,
  Facebook,
  Twitter,
  Instagram,
  CreditCard,
  Smartphone,
  Globe,
  Building,
  Banknote,
} from "lucide-react";

// Payment methods configuration
const paymentMethods = [
  {
    id: "mtn",
    name: "MTN Mobile Money",
    icon: <Smartphone className="h-5 w-5 text-yellow-500" />,
    description: "Pay with MTN Mobile Money",
  },
  {
    id: "airtel",
    name: "Airtel Money",
    icon: <Smartphone className="h-5 w-5 text-red-500" />,
    description: "Pay with Airtel Money",
  },
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: <CreditCard className="h-5 w-5 text-blue-500" />,
    description: "Pay with Credit/Debit Card",
  },
  {
    id: "irembo",
    name: "Irembo Pay",
    icon: <Globe className="h-5 w-5 text-green-500" />,
    description: "Pay with Irembo",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: <Building className="h-5 w-5 text-gray-500" />,
    description: "Pay with Bank Transfer",
  },
  {
    id: "cash",
    name: "Cash on Delivery",
    icon: <Banknote className="h-5 w-5 text-green-700" />,
    description: "Pay with Cash on Delivery",
  },
];

import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import {
  fetchCartItems,
  fetchUserProfile,
  submitOrder,
  sendOrderNotifications,
} from "@/lib/api";
import { getSchoolInfo } from "@/lib/school-info";
import { CartItem, UserProfile, SchoolInfo } from "@/lib/api";
import Footer from "@/components/footer";

interface CheckoutForm {
  parentFirstName: string;
  parentLastName: string;
  studentName: string;
  studentClass: string;
  phoneNumber: string;
  emailAddress: string;
  paymentMethod: string;
  mtnNumber?: string;
  airtelNumber?: string;
  iremboAccount?: string;
  ussdCode?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardName?: string;
}

interface StudentClassDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const StudentClassDropdown: React.FC<StudentClassDropdownProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTVETSubmenu, setShowTVETSubmenu] = useState(false);

  // Ensure value is always a string
  const safeValue = value || "";
  const dropdownRef = useRef<HTMLDivElement>(null);

  const regularClasses = [
    { value: "P1", label: "Primary 1" },
    { value: "P2", label: "Primary 2" },
    { value: "P3", label: "Primary 3" },
    { value: "P4", label: "Primary 4" },
    { value: "P5", label: "Primary 5" },
    { value: "P6", label: "Primary 6" },
    { value: "S1", label: "Secondary 1" },
    { value: "S2", label: "Secondary 2" },
    { value: "S3", label: "Secondary 3" },
    { value: "S4", label: "Secondary 4" },
    { value: "S5", label: "Secondary 5" },
    { value: "S6", label: "Secondary 6" },
  ];

  const tvetPrograms = [
    { value: "TVET-Tailoring", label: "Tailoring" },
    { value: "TVET-Tourism", label: "Tourism" },
    { value: "TVET-FoodProcessing", label: "Food Processing" },
    { value: "TVET-Carpentry", label: "Carpentry" },
    { value: "TVET-Electrical", label: "Electrical" },
    { value: "TVET-Plumbing", label: "Plumbing" },
    { value: "TVET-Welding", label: "Welding" },
    { value: "TVET-Masonry", label: "Masonry" },
  ];

  const getDisplayLabel = (val: string) => {
    if (!val) return "Select class";
    const regularClass = regularClasses.find((c) => c.value === val);
    if (regularClass) return regularClass.label;
    const tvetProgram = tvetPrograms.find((p) => p.value === val);
    if (tvetProgram) return `TVET - ${tvetProgram.label}`;
    return val;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowTVETSubmenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white flex items-center justify-between"
      >
        <span className={safeValue ? "text-gray-900" : "text-gray-500"}>
          {getDisplayLabel(safeValue)}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="max-h-60 overflow-y-auto">
            <div className="p-2">
              <div className="font-medium text-sm text-gray-500 mb-1 px-2">
                Regular Classes
              </div>
              {regularClasses.map((cls) => (
                <button
                  key={cls.value}
                  onClick={() => {
                    onChange(cls.value);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none rounded-md"
                >
                  {cls.label}
                </button>
              ))}

              <div className="border-t border-gray-200 my-2"></div>

              <div className="font-medium text-sm text-gray-500 mb-1 px-2">
                TVET Programs
              </div>
              <button
                onClick={() => setShowTVETSubmenu(!showTVETSubmenu)}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none rounded-md flex items-center justify-between"
              >
                <span>TVET Programs</span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    showTVETSubmenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {showTVETSubmenu && (
                <div className="pl-4 border-l-2 border-gray-200 ml-2">
                  <div className="space-y-1 py-1">
                    {tvetPrograms.map((program) => (
                      <button
                        key={program.value}
                        onClick={() => {
                          onChange(program.value);
                          setIsOpen(false);
                          setShowTVETSubmenu(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      >
                        {program.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function CheckoutPage() {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const { clearCart } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingParentInfo, setIsEditingParentInfo] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);

  const [formData, setFormData] = useState<CheckoutForm>({
    parentFirstName: "",
    parentLastName: "",
    studentName: "",
    studentClass: "",
    phoneNumber: "",
    emailAddress: "",
    paymentMethod: "",
    mtnNumber: "",
    airtelNumber: "",
    iremboAccount: "",
    ussdCode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  useEffect(() => {
    if (!token && !authLoading) {
      router.push("/login?redirect=/checkout");
      return;
    }

    if (token) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          // Fetch cart items, user profile, and school info in parallel
          const [cartItemsResult, userProfileResult, schoolInfoResult] =
            await Promise.all([
              fetchCartItems(token),
              fetchUserProfile(token),
              getSchoolInfo(),
            ]);

          setCartItems(cartItemsResult);
          setUserProfile(userProfileResult);
          // Handle the SchoolInfo type mismatch by ensuring address is not undefined
          setSchoolInfo({
            ...schoolInfoResult,
            address: schoolInfoResult.address || "",
          });

          // Populate form with user data if available
          if (userProfileResult) {
            setFormData((prev) => ({
              ...prev,
              parentFirstName: userProfileResult.firstName || "",
              parentLastName: userProfileResult.lastName || "",
              phoneNumber: userProfileResult.phone || "",
              emailAddress: userProfileResult.email || "",
            }));
          }
        } catch (err) {
          console.error("Error fetching checkout data:", err);
          setError("Failed to load checkout information. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [token, authLoading, router]);

  const calculateSubtotal = (items: CartItem[]) => {
    return items.reduce((total, item) => {
      const price =
        typeof item.price === "string" ? parseFloat(item.price) : item.price;
      const quantity =
        typeof item.quantity === "string"
          ? parseInt(item.quantity, 10)
          : item.quantity;
      return total + price * quantity;
    }, 0);
  };

  const total = calculateSubtotal(cartItems);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError(
        "You must be logged in to checkout. Please log in and try again."
      );
      router.push("/login?redirect=/checkout");
      return;
    }

    if (!userProfile) {
      setError(
        "User profile information not available. Please refresh the page."
      );
      return;
    }

    if (!schoolInfo) {
      setError("School information not available. Please refresh the page.");
      return;
    }

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      setError("Your cart is empty. Please add items before checkout.");
      router.push("/products");
      return;
    }

    // Validate form data
    if (!formData.studentName || !formData.studentClass) {
      setError("Please provide student information.");
      return;
    }

    if (!formData.paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    setIsProcessing(true);
    setError(null); // Clear any previous errors

    try {
      // Ensure cart items have correct types
      const processedCartItems = cartItems.map((item) => ({
        ...item,
        price:
          typeof item.price === "string" ? parseFloat(item.price) : item.price,
        quantity:
          typeof item.quantity === "string"
            ? parseInt(item.quantity, 10)
            : item.quantity,
      }));

      // Prepare order data according to the expected backend DTO format
      const orderData = {
        parentName: `${formData.parentFirstName} ${formData.parentLastName}`,
        parentEmail: formData.emailAddress,
        parentPhone: formData.phoneNumber,
        studentName: formData.studentName,
        studentGrade: formData.studentClass || "N/A", // Use studentClass instead of non-existent studentGrade
        studentClass: formData.studentClass,
        items: processedCartItems.map((item) => ({
          productId: item.productId || String(item.id),
          productName: item.name,
          quantity: item.quantity,
          price:
            typeof item.price === "string"
              ? parseFloat(item.price)
              : item.price,
          category: item.category || "Uncategorized",
        })),
        totalAmount: total,
        paymentMethod: formData.paymentMethod,
        deliveryAddress: schoolInfo?.address || "School Delivery",
      };

      // Submit the order
      try {
        const orderResult = await submitOrder(token, orderData);

        if (!orderResult || !orderResult.success) {
          throw new Error(orderResult?.message || "Order submission failed");
        }

        // Store order ID if available
        if (orderResult.orderId) {
          setOrderId(orderResult.orderId || "");
        }

        // If successful:
        // Custom celebration animation
        const celebration = document.createElement("div");
        celebration.className = "fixed inset-0 pointer-events-none z-50";
        celebration.innerHTML = `
          <style>
            .confetti {
              position: absolute;
              width: 10px;
              height: 10px;
              background: #ff6b6b;
              animation: fall 3s linear forwards;
            }
            .confetti:nth-child(2n) { background: #4ecdc4; }
            .confetti:nth-child(3n) { background: #45b7d1; }
            .confetti:nth-child(4n) { background: #96ceb4; }
            .confetti:nth-child(5n) { background: #feca57; }
            @keyframes fall {
              to {
                transform: translateY(100vh) rotate(360deg);
              }
            }
          </style>
        `;

        // Create confetti particles
        for (let i = 0; i < 50; i++) {
          const confetti = document.createElement("div");
          confetti.className = "confetti";
          confetti.style.left = Math.random() * 100 + "%";
          confetti.style.animationDelay = Math.random() * 3 + "s";
          confetti.style.backgroundColor = [
            "#ff6b6b",
            "#4ecdc4",
            "#45b7d1",
            "#96ceb4",
            "#feca57",
          ][Math.floor(Math.random() * 5)];
          celebration.appendChild(confetti);
        }

        document.body.appendChild(celebration);

        // Remove celebration after animation
        setTimeout(() => {
          celebration.remove();
        }, 3000);

        // Send notifications (SMS and email) - optional
        try {
          console.log("Attempting to send order notifications...");
          await sendOrderNotifications(token, orderData);
          console.log("Notifications sent successfully");
        } catch (notificationError: unknown) {
          if (notificationError instanceof Error) {
            console.warn(
              "Notifications not sent (endpoint may not exist):",
              notificationError.message
            );
          } else {
            console.warn(
              "Notifications not sent (endpoint may not exist):",
              notificationError
            );
          }
          // Don't fail the order if notifications fail - this is optional
        }

        // Clear the cart using the cart context which handles both local and server state
        try {
          await clearCart();

          // Force refresh localStorage and cart state to ensure UI consistency
          localStorage.setItem("cartItems", JSON.stringify([]));

          // Show success modal
          setShowSuccessModal(true);
          console.log("Cart cleared successfully");
        } catch (cartError) {
          console.error("Failed to clear cart:", cartError);
          // Don't fail the order if cart clearing fails
        }

        // Show success modal
        setOrderId(orderResult.orderId || "");
        setShowSuccessModal(true);
      } catch (error) {
        console.error("Order processing error:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to process your order. Please try again."
        );
      } finally {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Order processing error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to process your order. Please try again."
      );
      setIsProcessing(false);
    }
  };

  const renderPaymentFields = () => {
    switch (formData.paymentMethod) {
      case "mtn":
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="mtnNumber"
                className="block text-sm font-medium text-gray-700"
              >
                MTN Mobile Money Number
              </label>
              <Input
                id="mtnNumber"
                name="mtnNumber"
                value={formData.mtnNumber}
                onChange={handleInputChange}
                placeholder="+2507X XXX XXXX (Please,include country code)"
                className="mt-1 rounded-full"
              />
            </div>
          </div>
        );
      case "airtel":
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="airtelNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Airtel Money Number
              </label>
              <Input
                id="airtelNumber"
                name="airtelNumber"
                value={formData.airtelNumber}
                onChange={handleInputChange}
                placeholder="07X XXX XXXX"
                className="mt-1 rounded-full"
              />
            </div>
          </div>
        );
      case "card":
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="cardNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Card Number
              </label>
              <Input
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="XXXX XXXX XXXX XXXX"
                className="mt-1 rounded-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="cardExpiry"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expiry Date
                </label>
                <Input
                  id="cardExpiry"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className="mt-1 rounded-full"
                />
              </div>
              <div>
                <label
                  htmlFor="cardCvv"
                  className="block text-sm font-medium text-gray-700"
                >
                  CVV
                </label>
                <Input
                  id="cardCvv"
                  name="cardCvv"
                  value={formData.cardCvv}
                  onChange={handleInputChange}
                  placeholder="XXX"
                  className="mt-1 rounded-full"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="cardName"
                className="block text-sm font-medium text-gray-700"
              >
                Name on Card
              </label>
              <Input
                id="cardName"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="mt-1 rounded-full"
              />
            </div>
          </div>
        );
      case "irembo":
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="iremboAccount"
                className="block text-sm font-medium text-gray-700"
              >
                Irembo Account Email/Phone
              </label>
              <Input
                id="iremboAccount"
                name="iremboAccount"
                value={formData.iremboAccount}
                onChange={handleInputChange}
                placeholder="Email or Phone"
                className="mt-1 rounded-full"
              />
            </div>
          </div>
        );
      case "bank":
        return (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Please make a bank transfer to the following account and provide
              your order number as reference:
            </p>
            <div className="mt-2 p-3 bg-white rounded border border-blue-200">
              <p className="font-medium">Bank: National Bank of Rwanda</p>
              <p>Account Name: School Supplies Ltd</p>
              <p>Account Number: 1234567890</p>
              <p>Branch: Kigali Main Branch</p>
              <p>
                Reference: Your order number will be provided after checkout
              </p>
            </div>
          </div>
        );
      case "cash":
        return (
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              You will pay in cash when your order is delivered to the school. A
              receipt will be provided upon payment.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Checkout</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Parent Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="parentFirstName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            First Name
                          </label>
                          <Input
                            id="parentFirstName"
                            name="parentFirstName"
                            value={formData.parentFirstName}
                            onChange={handleInputChange}
                            className="mt-1 rounded-full"
                            disabled={!isEditingParentInfo}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="parentLastName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Last Name
                          </label>
                          <Input
                            id="parentLastName"
                            name="parentLastName"
                            value={formData.parentLastName}
                            onChange={handleInputChange}
                            className="mt-1 rounded-full"
                            disabled={!isEditingParentInfo}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="phoneNumber"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Phone Number
                          </label>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="mt-1 rounded-full"
                            disabled={!isEditingParentInfo}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="emailAddress"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email Address
                          </label>
                          <Input
                            id="emailAddress"
                            name="emailAddress"
                            value={formData.emailAddress}
                            onChange={handleInputChange}
                            className="mt-1 rounded-full"
                            disabled={!isEditingParentInfo}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={() =>
                            setIsEditingParentInfo(!isEditingParentInfo)
                          }
                          variant="outline"
                          className="rounded-full"
                        >
                          {isEditingParentInfo ? "Save" : "Edit"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Student Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="studentName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Student Name
                        </label>
                        <Input
                          id="studentName"
                          name="studentName"
                          value={formData.studentName}
                          onChange={handleInputChange}
                          className="mt-1 rounded-full"
                          placeholder="Full Name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="studentClass"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Student Class
                        </label>
                        <div className="mt-1">
                          <StudentClassDropdown
                            value={formData.studentClass}
                            onChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                studentClass: value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            formData.paymentMethod === method.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              paymentMethod: method.id,
                            }))
                          }
                        >
                          <div className="flex items-center">
                            <div className="mr-3">{method.icon}</div>
                            <div>
                              <h3 className="font-medium">{method.name}</h3>
                              <p className="text-xs text-gray-500">
                                {method.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {formData.paymentMethod && (
                      <div className="mt-6">
                        <h3 className="font-medium mb-4">Payment Details</h3>
                        {renderPaymentFields()}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="rounded-full bg-blue-700 hover:bg-blue-800 py-6 px-8 text-lg font-semibold"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      `Complete Order - ${new Intl.NumberFormat("en-RW", {
                        style: "currency",
                        currency: "RWF",
                      }).format(total)}`
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100"
                    >
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-md bg-gray-200 overflow-hidden mr-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} x{" "}
                            {new Intl.NumberFormat("en-RW", {
                              style: "currency",
                              currency: "RWF",
                            }).format(
                              typeof item.price === "string"
                                ? parseFloat(item.price)
                                : item.price
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="font-medium">
                        {new Intl.NumberFormat("en-RW", {
                          style: "currency",
                          currency: "RWF",
                        }).format(
                          (typeof item.price === "string"
                            ? parseFloat(item.price)
                            : item.price) *
                            (typeof item.quantity === "string"
                              ? parseInt(item.quantity, 10)
                              : item.quantity)
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="pt-4">
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Subtotal</span>
                      <span>
                        {new Intl.NumberFormat("en-RW", {
                          style: "currency",
                          currency: "RWF",
                        }).format(total)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Delivery</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-lg font-bold">
                        {new Intl.NumberFormat("en-RW", {
                          style: "currency",
                          currency: "RWF",
                        }).format(total)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showSuccessModal} onOpenChange={() => {}}>
        <DialogContent className="!max-w-md w-[90vw] sm:!max-w-md" showCloseButton={false}>
          <DialogTitle className="sr-only">Order Successful</DialogTitle>
          <div className="p-2">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Order Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your order has been placed successfully. We've sent a
                confirmation to your email.
              </p>
              {orderId && (
                <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Order Reference:{" "}
                    <span className="font-bold">{orderId}</span>
                  </p>
                </div>
              )}
              <div className="flex flex-col space-y-3">
                <Button
                  onClick={() => router.push("/parent-dashboard")}
                  className="w-full rounded-full bg-blue-700 hover:bg-blue-800 py-3 text-lg font-semibold"
                >
                  View My Orders
                </Button>
                <Button
                  onClick={() => router.push("/products")}
                  className="w-full rounded-full bg-blue-700 hover:bg-blue-800 py-3 text-lg font-semibold"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
