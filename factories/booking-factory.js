import { fakerPT_BR as faker } from "@faker-js/faker";

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

  static createBookingPayload(customData = {}) {
    const checkinDate = faker.date.future();
    const checkoutDays = faker.number.int({ min: 1, max: 30 });
    const checkoutDate = faker.date.soon({ days: checkoutDays, refDate: checkinDate });

    const defaultPayload = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      totalprice: faker.number.int({ min: 100, max: 5000 }),
      depositpaid: faker.datatype.boolean(),
      bookingdates: {
        checkin: checkinDate.toISOString().split('T')[0],
        checkout: checkoutDate.toISOString().split('T')[0]
      },
      additionalneeds: faker.lorem.words(3)
    };

    return {
      ...defaultPayload,
      ...customData,
      bookingdates: {
        ...defaultPayload.bookingdates,
        ...(customData.bookingdates || {})
      }
    };
  }

  static createInvalidBookingPayload() {
    return {
      firstname: faker.number.int(),
      lastname: faker.datatype.boolean(),
      totalprice: faker.word.sample(),
      depositpaid: faker.word.verb(),
      bookingdates: faker.datatype.boolean(),
      additionalneeds: faker.datatype.boolean()
    }
  }

  static createPartialBookingPayload(customData = {}) {
    const defaultPayload = {
      firstname: faker.person.firstName(),
      totalprice: faker.number.int({ min: 100, max: 5000 })
    };

    return {
      ...defaultPayload,
      ...customData
    };
  }
}