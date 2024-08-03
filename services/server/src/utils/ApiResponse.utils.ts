/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StatusCodes } from "http-status-codes";

type StatusCodeType = (typeof StatusCodes)[keyof typeof StatusCodes];

export class ApiResponse {
  statusCode: StatusCodeType;
  data: any;
  message: string;
  success: boolean;

  constructor(statusCode: StatusCodeType, data: any, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
