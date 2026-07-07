import {
  BadRequestException,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';

export const globalValidationPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  exceptionFactory: (errors) => {
    const formattedErrors = errors.flatMap((error) =>
      Object.values(error.constraints || {}).map((message) => ({
        field: error.property,
        message,
      })),
    );
    return new BadRequestException({
      status: false,
      statusCode: 400,
      message: 'Bad Request',
      errors: formattedErrors,
    });
  },
});

interface CustomErrorDetail {
  field: string;
  message: string;
}

export function throwCustomErrors(
  message: string,
  errors: CustomErrorDetail[],
): never {
  throw new UnprocessableEntityException({
    status: false,
    statusCode: 422,
    message,
    errors,
  });
}
