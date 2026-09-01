export class BookingFactory {

  static createNameFilter(firstname = "John", lastname = "") {
    if (firstname && lastname) return { firstname, lastname }
    return lastname ? { lastname } : { firstname };
  }

  static createDateFilter(checkin = "2026-01-01", checkout = "") {
    if (checkin && checkout) return { checkin, checkout };
    return checkout ? { checkout } : { checkin };
  }

  static createCombinedFilter(
    firstname = "John",
    lastname = "Smith",
    checkin = "2026-01-01",
    checkout = "2026-12-31"
  ) {
    return {
      firstname,
      lastname,
      checkin,
      checkout
    };
  }

  static createBookingPayload(
    firstname = "Matew",
    lastname = "Ferrar",
    totalPrice = 420,
    depositPaid = true,
    checkin = "2026-01-01",
    checkout = "2026-01-15",
    additionalneeds = "Double coffee"
  ) {
    return {
      firstname: firstname,
      lastname: lastname,
      totalprice: totalPrice,
      depositpaid: depositPaid,
      bookingdates: {
        checkin: checkin,
        checkout: checkout
      },
      additionalneeds: additionalneeds
    };
  }
}