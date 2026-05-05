export interface AddressDTO {
  addressId: string
  postalCode: string
  streetName: string
  streetNumber: string
  city: string
  country: string
  floor: number
  doorNumber: string
}

export interface CreateAddressDTO {
  postalCode: string
  streetName: string
  streetNumber: string
  city: string
  country: string
  floor: number
  doorNumber: string
  userId: string
}

export interface UpdateAddressDTO {
  postalCode: string
  streetName: string
  streetNumber: string
  city: string
  country: string
  floor: number
  doorNumber: string
}

export interface AddressError {
  message: string
  statusCode?: number
}
