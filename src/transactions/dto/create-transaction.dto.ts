export class CreateTransactionDto {
  readonly amount: number;
  readonly description: string;
  readonly userId: number; // Este es el ID que usaremos
}
