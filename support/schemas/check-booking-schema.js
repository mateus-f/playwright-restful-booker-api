export const checkBookingSchema = {
  "type": "object",
  "additionalProperties": false,
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
      "additionalProperties": false,
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
      "required": [
        "checkin",
        "checkout"
      ]
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