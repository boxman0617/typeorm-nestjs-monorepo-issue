export interface CreateCustomerDTO {
  readonly name: string;
}

export interface CreatedCustomerMessageDTO {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
