export interface PaymentDetail {
  projectId: number;
  hoursWorked: number;
  transportFee: number;
  totalAmount: number;
}

export interface Employee {
  employeeId: number;
  name: string;
}

export interface User {
  userId: number;
  name: string;
}

export interface Payment {
  paymentId: number;
  employee: Employee;
  status: string;
  details: PaymentDetail[];
  totalPayment: number;
  createdBy: User;

}

export interface PaymentsResponse {
  payments: Payment[];
}
