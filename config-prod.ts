
export const config = {
	httpServer: {
		protocol: "https",
		host: "nexus.games",
		local: "127.0.0.1",
		port: 3000,
	},
	local: false,
	environment: "prod",
	debug: {
		active: false,
		simulate: {
			ppm: 30,
			idle: 4,
			queued: 2,
		}
	},
	cookies: {
		password: "amFm3KdMdre_ns6teI2x4o4KjEvmsa0on",
	},
	crypto: {
		rounds: 5,		// Don't change; crypto would be invalid.
		gSalt: "by3VE9uALnZtd2U1t6adNC7XsneD5re0",
		hashKey: "1uEgfzXMYqLQ5X1Ji9DvslSVKhdp37oc",
	},
	ssl: {
		active: true,
		key: '/etc/letsencrypt/live/nexus.games/privkey.pem',
		cert: '/etc/letsencrypt/live/nexus.games/cert.pem',
	},
	ports: {
		Lobby: 8000,
		RoomServerStart: 8001,
		RoomServerEnd: 8010,
		RoomServers: {
			8001: "Malakai",
			8002: "Saiki",
			8003: "Kirito",
			8004: "Gannicus",
			8005: "Belthazor",
			// Jordan, Prairie, Doctress, Ye
		}
	},
	redis: {
		port: 6379,
		host: 'localhost',
	}
}
