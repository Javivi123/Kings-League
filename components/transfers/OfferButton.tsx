"use client";

import { Euro } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface OfferButtonProps {
  playerId: string;
  playerPrice: number;
  userBalance: number;
}

export function OfferButton({ playerId, playerPrice, userBalance }: OfferButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleOffer = async () => {
    if (loading) return;
    
    if (userBalance < playerPrice) {
      toast.error("No tienes suficientes Euros Kings");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/transfers/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId,
          price: playerPrice,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Oferta enviada exitosamente");
        // Usar window.location.reload() para forzar recarga completa
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        const errorMessage = data.error || data.details || "Error al enviar la oferta";
        toast.error(errorMessage);
        console.error("Error response:", data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error sending offer:", error);
      toast.error("Error al enviar la oferta. Por favor, inténtalo de nuevo.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleOffer}
      disabled={loading || userBalance < playerPrice}
      className="w-full px-4 py-2 bg-blue-kings text-white rounded-lg hover:bg-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Euro className="inline h-4 w-4 mr-1" />
      {loading ? "Enviando..." : `Ofertar ${playerPrice.toFixed(0)} €K`}
    </button>
  );
}

