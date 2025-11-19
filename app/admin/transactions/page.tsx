import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShoppingCart, Euro } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TransactionActions } from "@/components/admin/TransactionActions";

async function getTransactions() {
  return await prisma.transaction.findMany({
    include: {
      team: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

function getTypeLabel(type: string) {
  switch (type) {
    case "transfer":
      return "Transferencia";
    case "wildcard":
      return "Carta Comodín";
    case "investment":
      return "Inversión";
    default:
      return type;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "approved":
      return "bg-green-500";
    case "rejected":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "approved":
      return "Aprobada";
    case "rejected":
      return "Rechazada";
    default:
      return status;
  }
}

export default async function AdminTransactionsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const transactions = await getTransactions();
  const pendingCount = transactions.filter((t) => t.status === "pending").length;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <ShoppingCart className="h-8 w-8 text-blue-kings" />
            <h1 className="text-4xl font-bold">Gestión de Transacciones</h1>
            {pendingCount > 0 && (
              <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-semibold">
                {pendingCount} pendientes
              </span>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black-kings text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Tipo</th>
                    <th className="px-6 py-4 text-left">Equipo</th>
                    <th className="px-6 py-4 text-left">Descripción</th>
                    <th className="px-6 py-4 text-left">Cantidad</th>
                    <th className="px-6 py-4 text-left">Estado</th>
                    <th className="px-6 py-4 text-left">Fecha</th>
                    <th className="px-6 py-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr
                      key={transaction.id}
                      className={`border-b border-gray-200 dark:border-gray-700 ${
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-50 dark:bg-gray-900"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <ShoppingCart className="h-5 w-5 text-blue-kings" />
                          <span className="font-semibold">
                            {getTypeLabel(transaction.type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-blue-kings font-semibold">
                          {transaction.team.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md">{transaction.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <Euro className="h-4 w-4 text-gold-kings" />
                          <span className="font-bold text-gold-kings">
                            {transaction.amount.toFixed(0)} €K
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {getStatusText(transaction.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(transaction.createdAt), "d MMM yyyy", { locale: es })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <TransactionActions transactionId={transaction.id} currentStatus={transaction.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mt-6">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No hay transacciones registradas
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

