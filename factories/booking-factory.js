export class BookingFactory {

  static createNameFilter(firstname = "John", lastname = "") {
    if (firstname && lastname) return { firstname, lastname }
    return lastname ? { lastname } : { firstname };
  }

  static createDateFilter(checkin = "2026-01-01", checkout = "2026-01-10") {
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
}