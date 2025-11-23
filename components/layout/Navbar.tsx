"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown, Menu, X, Home, Users, Trophy, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Equipos", href: "/teams", icon: Users },
    { name: "Clasificación", href: "/standings", icon: Trophy },
    { name: "Hall of Fame", href: "/hall-of-fame", icon: Trophy },
  ];

  if (session?.user) {
    navigation.push({ name: "Dashboard", href: "/dashboard", icon: Trophy });
    if (session.user.role === "presidente") {
      navigation.push({ name: "Mi Equipo", href: "/my-team", icon: Crown });
    }
    if (session.user.role === "jugador") {
      navigation.push({ name: "Mi Perfil", href: "/my-profile", icon: Users });
    }
    if (session.user.role === "admin") {
      navigation.push({ name: "Admin", href: "/admin", icon: Crown });
    }
    navigation.push({ name: "Logros", href: "/achievements", icon: Trophy });
    navigation.push({ name: "Configuración", href: "/settings", icon: Settings });
  }

  return (
    <nav className="bg-black-kings text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-gold-kings" />
              <span className="text-xl font-bold">Kings League</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {session && <NotificationBell />}
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors whitespace-nowrap text-sm",
                    isActive
                      ? "bg-blue-kings text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors whitespace-nowrap text-sm"
              >
                <LogOut className="h-4 w-4" />
                <span>Salir</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="px-3 py-2 rounded-lg bg-blue-kings hover:bg-blue-dark transition-colors text-sm whitespace-nowrap"
              >
                Iniciar Sesión
              </Link>
            )}
            {/* Removed register link - only admin can create accounts */}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            {session && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:bg-gray-800"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-800">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg",
                    isActive
                      ? "bg-blue-kings text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            {session ? (
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/' });
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 w-full"
              >
                <LogOut className="h-5 w-5" />
                <span>Cerrar Sesión</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg bg-blue-kings text-center"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

