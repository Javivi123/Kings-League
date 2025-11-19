"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface RequestActionsProps {
  requestId: string;
  currentStatus: string;
}

export function RequestActions({ requestId, currentStatus }: RequestActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (status: "approved" | "rejected") => {
    if (loading) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          status === "approved" ? "Solicitud aprobada" : "Solicitud rechazada"
        );
        router.refresh();
      } else {
        toast.error(data.error || "Error al actualizar la solicitud");
      }
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error("Error al actualizar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus !== "pending") {
    return (
      <span className="text-gray-400 text-sm">-</span>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => handleAction("approved")}
        disabled={loading}
        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Aprobar"
      >
        <Check className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleAction("rejected")}
        disabled={loading}
        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Rechazar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

