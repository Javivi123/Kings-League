import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Obtener notificaciones leídas del usuario desde cookies
    const cookieStore = await cookies();
    const readNotificationsCookie = cookieStore.get(`read_notifications_${session.user.id}`);
    
    let readNotifications: string[] = [];
    if (readNotificationsCookie) {
      try {
        readNotifications = JSON.parse(readNotificationsCookie.value);
      } catch (e) {
        readNotifications = [];
      }
    }
    
    const notifications: any[] = [];
    let unreadCount = 0;

    // Notificaciones para presidentes
    if (session.user.role === "presidente") {
      const team = await prisma.team.findFirst({
        where: { ownerId: session.user.id },
        include: {
          transfers: {
            where: { status: "pending" },
            include: { player: true },
          },
          transactions: {
            where: { status: "pending" },
          },
        },
      });

      if (team) {
        // Notificaciones de transferencias pendientes
        team.transfers.forEach((transfer) => {
          const isRead = readNotifications.includes(transfer.id);
          notifications.push({
            id: transfer.id,
            title: "Transferencia Pendiente",
            message: `Transferencia de ${transfer.player.name} está pendiente de revisión`,
            type: "info",
            read: isRead,
            createdAt: transfer.createdAt,
          });
          if (!isRead) unreadCount++;
        });

        // Notificaciones de transacciones pendientes
        team.transactions.forEach((transaction) => {
          const isRead = readNotifications.includes(transaction.id);
          notifications.push({
            id: transaction.id,
            title: "Transacción Pendiente",
            message: transaction.description,
            type: "warning",
            read: isRead,
            createdAt: transaction.createdAt,
          });
          if (!isRead) unreadCount++;
        });
      }
    }

    // Notificaciones para admin
    if (session.user.role === "admin") {
      const pendingRequests = await prisma.request.count({
        where: { status: "pending" },
      });
      const pendingTransactions = await prisma.transaction.count({
        where: { status: "pending" },
      });

      if (pendingRequests > 0) {
        const isRead = readNotifications.includes("admin-requests");
        notifications.push({
          id: "admin-requests",
          title: "Solicitudes Pendientes",
          message: `Tienes ${pendingRequests} solicitud(es) pendiente(s)`,
          type: "warning",
          read: isRead,
          createdAt: new Date().toISOString(),
        });
        if (!isRead) unreadCount++;
      }

      if (pendingTransactions > 0) {
        const isRead = readNotifications.includes("admin-transactions");
        notifications.push({
          id: "admin-transactions",
          title: "Transacciones Pendientes",
          message: `Tienes ${pendingTransactions} transacción(es) pendiente(s)`,
          type: "warning",
          read: isRead,
          createdAt: new Date().toISOString(),
        });
        if (!isRead) unreadCount++;
      }
    }

    return NextResponse.json({
      notifications: notifications.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

