const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de datos de prueba...\n");

  // Crear usuarios de prueba
  console.log("👥 Creando usuarios de prueba...");
  
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@kingsleague.com" },
    update: {},
    create: {
      email: "admin@kingsleague.com",
      name: "Administrador",
      password: hashedPassword,
      role: "admin",
      age: 30,
    },
  });

  const alumno = await prisma.user.upsert({
    where: { email: "alumno@test.com" },
    update: {},
    create: {
      email: "alumno@test.com",
      name: "Juan Alumno",
      password: hashedPassword,
      role: "alumno",
      age: 15,
    },
  });

  const jugador = await prisma.user.upsert({
    where: { email: "jugador@test.com" },
    update: {},
    create: {
      email: "jugador@test.com",
      name: "Carlos Jugador",
      password: hashedPassword,
      role: "jugador",
      age: 16,
    },
  });

  const presidente1 = await prisma.user.upsert({
    where: { email: "presidente1@test.com" },
    update: {},
    create: {
      email: "presidente1@test.com",
      name: "Pedro Presidente",
      password: hashedPassword,
      role: "presidente",
      age: 17,
    },
  });

  const presidente2 = await prisma.user.upsert({
    where: { email: "presidente2@test.com" },
    update: {},
    create: {
      email: "presidente2@test.com",
      name: "María Presidenta",
      password: hashedPassword,
      role: "presidente",
      age: 17,
    },
  });

  console.log("✅ Usuarios creados");

  // Crear equipos
  console.log("\n🏆 Creando equipos...");
  
  const equipo1 = await prisma.team.upsert({
    where: { ownerId: presidente1.id },
    update: {},
    create: {
      name: "Los Leones",
      ownerId: presidente1.id,
      eurosKings: 1500,
      points: 15,
      wins: 5,
      draws: 0,
      losses: 2,
      goalsFor: 18,
      goalsAgainst: 8,
    },
  });

  const equipo2 = await prisma.team.upsert({
    where: { ownerId: presidente2.id },
    update: {},
    create: {
      name: "Los Tigres",
      ownerId: presidente2.id,
      eurosKings: 1200,
      points: 12,
      wins: 4,
      draws: 0,
      losses: 3,
      goalsFor: 15,
      goalsAgainst: 10,
    },
  });

  console.log("✅ Equipos creados");

  // Crear jugadores
  console.log("\n⚽ Creando jugadores...");
  
  const positions = ["GK", "DEF", "DEF", "DEF", "MID", "MID", "MID", "FWD", "FWD"];
  const playerNames = [
    "Luis García", "Miguel Torres", "Sergio Ramos", "David Silva",
    "Andrés Iniesta", "Xavi Hernández", "Fernando Torres", "Diego Costa",
    "Iker Casillas", "Sergio Busquets", "Cesc Fàbregas", "Pedro Rodríguez",
    "Jordi Alba", "Gerard Piqué", "Carles Puyol", "Raúl González",
    "Fernando Morientes", "Iván Helguera", "Claude Makélélé", "Zinedine Zidane"
  ];

  const players = [];
  for (let i = 0; i < 20; i++) {
    const isInTeam1 = i < 9;
    const isInTeam2 = i >= 9 && i < 18;
    const teamId = isInTeam1 ? equipo1.id : isInTeam2 ? equipo2.id : null;
    const userId = i === 2 ? jugador.id : null; // El tercer jugador tiene cuenta de usuario

    const player = await prisma.player.create({
      data: {
        name: playerNames[i] || `Jugador ${i + 1}`,
        position: positions[i % positions.length],
        price: Math.floor(Math.random() * 500) + 100,
        marketValue: Math.floor(Math.random() * 600) + 150,
        teamId: teamId,
        userId: userId,
        isAvailable: !teamId,
        isOnMarket: !teamId && Math.random() > 0.5,
        age: Math.floor(Math.random() * 5) + 15,
      },
    });

    // Crear estadísticas para el jugador
    await prisma.playerStats.create({
      data: {
        playerId: player.id,
        goals: Math.floor(Math.random() * 10),
        assists: Math.floor(Math.random() * 8),
        matches: Math.floor(Math.random() * 10) + 1,
        points: Math.floor(Math.random() * 50) + 10,
        yellowCards: Math.floor(Math.random() * 3),
        redCards: Math.floor(Math.random() * 2),
        mvpCount: Math.floor(Math.random() * 3),
      },
    });

    players.push(player);
  }

  console.log("✅ Jugadores creados");

  // Crear partidos
  console.log("\n📅 Creando partidos...");
  
  const now = new Date();
  const pastMatch1 = await prisma.match.create({
    data: {
      homeTeamId: equipo1.id,
      awayTeamId: equipo2.id,
      homeScore: 3,
      awayScore: 1,
      matchDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // Hace 7 días
      status: "finished",
      mvpId: players[0].id,
    },
  });

  const pastMatch2 = await prisma.match.create({
    data: {
      homeTeamId: equipo2.id,
      awayTeamId: equipo1.id,
      homeScore: 2,
      awayScore: 2,
      matchDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // Hace 14 días
      status: "finished",
      mvpId: players[9].id,
    },
  });

  const futureMatch = await prisma.match.create({
    data: {
      homeTeamId: equipo1.id,
      awayTeamId: equipo2.id,
      matchDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // En 3 días
      status: "scheduled",
    },
  });

  console.log("✅ Partidos creados");

  // Crear noticias
  console.log("\n📰 Creando noticias...");
  
  await prisma.news.create({
    data: {
      title: "¡Comienza la Kings League!",
      content: "<p>La temporada de la Kings League ha comenzado con gran emoción. Los equipos están listos para competir.</p>",
      authorId: admin.id,
      published: true,
    },
  });

  await prisma.news.create({
    data: {
      title: "Los Leones ganan su primer partido",
      content: "<p>Los Leones lograron una victoria contundente en su debut, ganando 3-1 a Los Tigres.</p>",
      authorId: admin.id,
      published: true,
    },
  });

  console.log("✅ Noticias creadas");

  // Crear algunas inversiones
  console.log("\n💰 Creando inversiones...");
  
  await prisma.investment.create({
    data: {
      playerId: players[0].id,
      teamId: equipo1.id,
      amount: 200,
    },
  });

  await prisma.investment.create({
    data: {
      playerId: players[1].id,
      teamId: equipo1.id,
      amount: 150,
    },
  });

  await prisma.investment.create({
    data: {
      playerId: players[9].id,
      teamId: equipo2.id,
      amount: 180,
    },
  });

  console.log("✅ Inversiones creadas");

  // Crear transacciones
  console.log("\n💳 Creando transacciones...");
  
  await prisma.transaction.create({
    data: {
      teamId: equipo1.id,
      type: "transfer",
      amount: 300,
      description: "Compra de jugador",
      status: "approved",
    },
  });

  await prisma.transaction.create({
    data: {
      teamId: equipo2.id,
      type: "wildcard",
      amount: 100,
      description: "Compra de carta comodín",
      status: "pending",
    },
  });

  console.log("✅ Transacciones creadas");

  // Crear cartas comodín
  console.log("\n🃏 Creando cartas comodín...");
  
  await prisma.wildcard.create({
    data: {
      name: "Doble Puntos",
      description: "Duplica los puntos del próximo partido",
      effect: "Duplica puntos",
      price: 100,
      teamId: equipo1.id,
      used: false,
    },
  });

  console.log("✅ Cartas comodín creadas");

  console.log("\n✅ ¡Seed completado exitosamente!\n");
  console.log("📋 Credenciales de prueba:");
  console.log("   Admin: admin@kingsleague.com / password123");
  console.log("   Alumno: alumno@test.com / password123");
  console.log("   Jugador: jugador@test.com / password123");
  console.log("   Presidente 1: presidente1@test.com / password123");
  console.log("   Presidente 2: presidente2@test.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

