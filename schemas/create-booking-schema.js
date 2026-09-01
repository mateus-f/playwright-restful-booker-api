export const createBookingSchema = {
	"type": "object",
	"properties": {
		"bookingid": {
			"type": "number"
		},
		"booking": {
			"type": "object",
			"properties": {
				"firstname": {
					"type": "string"
				},
				"lastname": {
					"type": "string"
				},
				"totalprice": {
					"type": "number"
				},
				"depositpaid": {
					"type": "boolean"
				},
				"bookingdates": {
					"type": "object",
					"properties": {
						"checkin": {
							"type": "string",
							"pattern": "^\\d{4}-\\d{2}-\\d{2}$"
						},
						"checkout": {
							"type": "string",
							"pattern": "^\\d{4}-\\d{2}-\\d{2}$"
						}
					},
					"required": ["checkin", "checkout"]
				},
				"additionalneeds": {
					"type": "string"
				}
			},
			"required": [
				"firstname",
				"lastname",
				"totalprice",
				"depositpaid",
				"bookingdates"
			]
		}
	},
	"required": ["bookingid", "booking"]
}
