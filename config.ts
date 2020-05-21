
export const config = {
	server: {
		protocol: "http",
		host: "127.0.0.1",
		local: "127.0.0.1",
		port: 3000,
	},
	local: true,
	environment: "local",
	debug: {
		active: true,
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
		active: false,
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
			8006: "Neo",
			8007: "Arya",
			8008: "Prairie",
			8009: "Collier",
			8010: "Shayla",
			8011: "Avalon",
			8012: "Doctress",
			// Ye
		}
	},
	redis: {
		port: 6379,
		host: 'localhost',
	}
}
