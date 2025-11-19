import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Obtener cookies para almacenar notificaciones leídas
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

    // Añadir esta notificación a la lista de leídas si no está ya
    if (!readNotifications.includes(params.id)) {
      readNotifications.push(params.id);
    }

    // Guardar en cookie (expira en 1 año)
    const response = NextResponse.json({ success: true });
    response.cookies.set(`read_notifications_${session.user.id}`, JSON.stringify(readNotifications), {
      maxAge: 60 * 60 * 24 * 365, // 1 año
      httpOnly: false, // Necesario para que el cliente pueda leerlo también
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json({ success: true }); // Retornar éxito aunque falle para no romper la UI
  }
}

