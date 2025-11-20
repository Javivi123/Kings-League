const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🎯 Añadiendo detalles a partidos...\n");

  // Obtener todos los partidos finalizados
  const finishedMatches = await prisma.match.findMany({
    where: { status: "finished" },
    include: {
      homeTeam: {
        include: {
          players: true,
        },
      },
      awayTeam: {
        include: {
          players: true,
        },
      },
      events: true,
      lineups: true,
      stats: true,
    },
  });

  console.log(`📊 Encontrados ${finishedMatches.length} partidos finalizados\n`);

  for (const match of finishedMatches) {
    console.log(`⚽ Procesando partido: ${match.homeTeam.name} vs ${match.awayTeam.name}`);

    // Si ya tiene eventos, skip
    if (match.events.length > 0) {
      console.log("  ⏭️  Ya tiene eventos, saltando...\n");
      continue;
    }

    const homePlayers = match.homeTeam.players;
    const awayPlayers = match.awayTeam.players;

    if (homePlayers.length === 0 || awayPlayers.length === 0) {
      console.log("  ⚠️  No hay jugadores suficientes, saltando...\n");
      continue;
    }

    // Crear estadísticas del partido
    if (!match.stats) {
      const homePossession = 45 + Math.floor(Math.random() * 15);
      const awayPossession = 100 - homePossession;

      await prisma.matchStats.create({
        data: {
          matchId: match.id,
          homePossession,
          awayPossession,
          homeShots: 8 + Math.floor(Math.random() * 10),
          awayShots: 6 + Math.floor(Math.random() * 10),
          homeShotsOnTarget: 4 + Math.floor(Math.random() * 6),
          awayShotsOnTarget: 3 + Math.floor(Math.random() * 5),
          homePasses: 300 + Math.floor(Math.random() * 200),
          awayPasses: 250 + Math.floor(Math.random() * 200),
          homePassAccuracy: 75 + Math.random() * 15,
          awayPassAccuracy: 70 + Math.random() * 15,
          homeFouls: 8 + Math.floor(Math.random() * 8),
          awayFouls: 7 + Math.floor(Math.random() * 8),
          homeCorners: 3 + Math.floor(Math.random() * 5),
          awayCorners: 2 + Math.floor(Math.random() * 5),
          homeOffsides: 1 + Math.floor(Math.random() * 3),
          awayOffsides: 1 + Math.floor(Math.random() * 3),
        },
      });
      console.log("  ✅ Estadísticas creadas");
    }

    // Crear alineaciones
    if (match.lineups.length === 0) {
      const positions = ["GK", "DEF", "DEF", "DEF", "MID", "MID", "MID", "FWD", "FWD"];
      const benchPositions = ["GK", "DEF", "DEF", "MID", "MID", "FWD"];

      // Alineación equipo local
      const homeStarters = homePlayers.slice(0, Math.min(9, homePlayers.length));
      for (let i = 0; i < homeStarters.length; i++) {
        await prisma.matchLineup.create({
          data: {
            matchId: match.id,
            teamId: match.homeTeamId,
            playerId: homeStarters[i].id,
            position: positions[i] || "MID",
            isStarter: true,
            shirtNumber: i + 1,
          },
        });
      }

      // Banquillo equipo local
      const homeBench = homePlayers.slice(9, Math.min(15, homePlayers.length));
      for (let i = 0; i < homeBench.length; i++) {
        await prisma.matchLineup.create({
          data: {
            matchId: match.id,
            teamId: match.homeTeamId,
            playerId: homeBench[i].id,
            position: benchPositions[i % benchPositions.length] || "MID",
            isStarter: false,
            shirtNumber: 10 + i,
          },
        });
      }

      // Alineación equipo visitante
      const awayStarters = awayPlayers.slice(0, Math.min(9, awayPlayers.length));
      for (let i = 0; i < awayStarters.length; i++) {
        await prisma.matchLineup.create({
          data: {
            matchId: match.id,
            teamId: match.awayTeamId,
            playerId: awayStarters[i].id,
            position: positions[i] || "MID",
            isStarter: true,
            shirtNumber: i + 1,
          },
        });
      }

      // Banquillo equipo visitante
      const awayBench = awayPlayers.slice(9, Math.min(15, awayPlayers.length));
      for (let i = 0; i < awayBench.length; i++) {
        await prisma.matchLineup.create({
          data: {
            matchId: match.id,
            teamId: match.awayTeamId,
            playerId: awayBench[i].id,
            position: benchPositions[i % benchPositions.length] || "MID",
            isStarter: false,
            shirtNumber: 10 + i,
          },
        });
      }
      console.log("  ✅ Alineaciones creadas");
    }

    // Crear eventos del partido
    const homeScore = match.homeScore || 0;
    const awayScore = match.awayScore || 0;
    const totalGoals = homeScore + awayScore;

    // Goles
    const goalMinutes = [];
    for (let i = 0; i < totalGoals; i++) {
      let minute;
      do {
        minute = 5 + Math.floor(Math.random() * 85);
      } while (goalMinutes.includes(minute));
      goalMinutes.push(minute);
    }
    goalMinutes.sort((a, b) => a - b);

    let homeGoalsScored = 0;
    let awayGoalsScored = 0;

    for (const minute of goalMinutes) {
      const isHomeGoal = homeGoalsScored < homeScore && (awayGoalsScored >= awayScore || Math.random() > 0.5);
      
      if (isHomeGoal && homeGoalsScored < homeScore) {
        const scorer = homePlayers[Math.floor(Math.random() * Math.min(9, homePlayers.length))];
        const assistPlayer = Math.random() > 0.3 ? homePlayers[Math.floor(Math.random() * Math.min(9, homePlayers.length))] : null;
        
        await prisma.matchEvent.create({
          data: {
            matchId: match.id,
            type: "goal",
            minute,
            playerId: scorer.id,
            teamId: match.homeTeamId,
            description: assistPlayer && assistPlayer.id !== scorer.id 
              ? `Asistencia: ${assistPlayer.name}` 
              : Math.random() > 0.7 ? "Penalty" : null,
          },
        });
        homeGoalsScored++;
      } else if (awayGoalsScored < awayScore) {
        const scorer = awayPlayers[Math.floor(Math.random() * Math.min(9, awayPlayers.length))];
        const assistPlayer = Math.random() > 0.3 ? awayPlayers[Math.floor(Math.random() * Math.min(9, awayPlayers.length))] : null;
        
        await prisma.matchEvent.create({
          data: {
            matchId: match.id,
            type: "goal",
            minute,
            playerId: scorer.id,
            teamId: match.awayTeamId,
            description: assistPlayer && assistPlayer.id !== scorer.id 
              ? `Asistencia: ${assistPlayer.name}` 
              : Math.random() > 0.7 ? "Penalty" : null,
          },
        });
        awayGoalsScored++;
      }
    }

    // Tarjetas amarillas (2-6 por partido)
    const yellowCardCount = 2 + Math.floor(Math.random() * 5);
    const yellowCardMinutes = [];
    for (let i = 0; i < yellowCardCount; i++) {
      let minute;
      do {
        minute = 10 + Math.floor(Math.random() * 80);
      } while (yellowCardMinutes.includes(minute));
      yellowCardMinutes.push(minute);
    }
    yellowCardMinutes.sort((a, b) => a - b);

    for (const minute of yellowCardMinutes) {
      const isHome = Math.random() > 0.5;
      const players = isHome ? homePlayers : awayPlayers;
      const teamId = isHome ? match.homeTeamId : match.awayTeamId;
      const player = players[Math.floor(Math.random() * Math.min(9, players.length))];

      await prisma.matchEvent.create({
        data: {
          matchId: match.id,
          type: "yellow_card",
          minute,
          playerId: player.id,
          teamId,
        },
      });
    }

    // Tarjetas rojas (0-2 por partido)
    const redCardCount = Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 1 : 0;
    for (let i = 0; i < redCardCount; i++) {
      const minute = 30 + Math.floor(Math.random() * 50);
      const isHome = Math.random() > 0.5;
      const players = isHome ? homePlayers : awayPlayers;
      const teamId = isHome ? match.homeTeamId : match.awayTeamId;
      const player = players[Math.floor(Math.random() * Math.min(9, players.length))];

      await prisma.matchEvent.create({
        data: {
          matchId: match.id,
          type: "red_card",
          minute,
          playerId: player.id,
          teamId,
        },
      });
    }

    // Sustituciones (3-5 por equipo)
    const substitutionCount = 3 + Math.floor(Math.random() * 3);
    const substitutionMinutes = [];
    for (let i = 0; i < substitutionCount * 2; i++) {
      let minute;
      do {
        minute = 45 + Math.floor(Math.random() * 45);
      } while (substitutionMinutes.includes(minute));
      substitutionMinutes.push(minute);
    }
    substitutionMinutes.sort((a, b) => a - b);

    for (let i = 0; i < substitutionCount; i++) {
      const minute = substitutionMinutes[i];
      const isHome = i % 2 === 0;
      const players = isHome ? homePlayers : awayPlayers;
      const teamId = isHome ? match.homeTeamId : match.awayTeamId;
      
      // Jugador que sale (de los titulares)
      const playerOut = players[Math.floor(Math.random() * Math.min(9, players.length))];
      // Jugador que entra (del banquillo o de los que no están en el 11 inicial)
      const playerIn = players[Math.min(9, players.length) + Math.floor(Math.random() * Math.max(1, players.length - 9))] || players[Math.floor(Math.random() * players.length)];

      await prisma.matchEvent.create({
        data: {
          matchId: match.id,
          type: "substitution",
          minute,
          playerId: playerIn.id,
          playerOutId: playerOut.id,
          teamId,
        },
      });
    }

    console.log("  ✅ Eventos creados");
    console.log(`  📈 Resultado: ${match.homeScore} - ${match.awayScore}\n`);
  }

  console.log("✅ ¡Detalles añadidos a todos los partidos!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

