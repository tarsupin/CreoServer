
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
    lobby: {
        port: 8000,
    },
    roomServers: [
        {
            name: "Malakai",
            endpoint: null,
            port: 8001,
        },
        {
            name: "Saiki",
            endpoint: null,
            port: 8002,
        },
        {
            name: "Kirito",
            endpoint: null,
            port: 8003,
        },
        {
            name: "Gannicus",
            endpoint: null,
            port: 8004,
        },
        {
            name: "Belthazor",
            endpoint: null,
            port: 8005,
        },
        {
            name: "Neo",
            endpoint: null,
            port: 8006,
        },
        {
            name: "Arya",
            endpoint: null,
            port: 8007,
        },
        {
            name: "Prairie",
            endpoint: null,
            port: 8008,
        },
        {
            name: "Collier",
            endpoint: null,
            port: 8009,
        },
        {
            name: "Shayla",
            endpoint: null,
            port: 8010,
        },
        {
            name: "Avalon",
            endpoint: null,
            port: 8011,
        },
        {
            name: "Doctress",
            endpoint: null,
            port: 8012,
        },
    ],
	redis: {
		port: 6379,
		host: 'localhost',
	}
}
