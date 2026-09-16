export const updateBookingSchema = {
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
          "format": "date"
        },
        "checkout": {
          "type": "string",
          "format": "date"
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
    "bookingdates",
    "additionalneeds"
  ]
}