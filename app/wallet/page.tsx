"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Euro, TrendingUp, TrendingDown, ArrowRightLeft } from "lucide-react";
import { format } from "date-fns";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
}

export default function WalletPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.role === "presidente") {
      fetchWalletData();
    }
  }, [session]);

  const fetchWalletData = async () => {
    try {
      const res = await fetch("/api/wallet");
      const data = await res.json();
      setBalance(data.balance || 0);
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!session || session.user.role !== "presidente") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p>No tienes acceso a esta página</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 flex items-center space-x-3">
            <Euro className="h-8 w-8 text-gold-kings" />
            <span>Mi Billetera</span>
          </h1>

          {/* Balance Card */}
          <div className="bg-gradient-to-r from-gold-kings to-gold-dark rounded-2xl shadow-lg p-8 mb-6 text-white">
            <div className="text-sm opacity-90 mb-2">Balance Disponible</div>
            <div className="text-5xl font-bold">{balance.toFixed(0)} €K</div>
          </div>

          {/* Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <ArrowRightLeft className="h-6 w-6 text-blue-kings" />
              <span>Historial de Transacciones</span>
            </h2>

            {loading ? (
              <div className="text-center py-8">Cargando...</div>
            ) : transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      {tx.type === "transfer" || tx.type === "investment" ? (
                        <TrendingDown className="h-5 w-5 text-red-kings" />
                      ) : (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      )}
                      <div>
                        <div className="font-semibold">{tx.description}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {format(new Date(tx.createdAt), "d MMM yyyy, HH:mm")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-bold ${
                          tx.type === "transfer" || tx.type === "investment"
                            ? "text-red-kings"
                            : "text-green-500"
                        }`}
                      >
                        {tx.type === "transfer" || tx.type === "investment"
                          ? "-"
                          : "+"}
                        {Math.abs(tx.amount).toFixed(0)} €K
                      </div>
                      <div className="text-xs text-gray-500">
                        {tx.status === "approved"
                          ? "✓ Aprobada"
                          : tx.status === "pending"
                          ? "⏳ Pendiente"
                          : "✗ Rechazada"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay transacciones aún
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

