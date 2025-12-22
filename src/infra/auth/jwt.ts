import jwt from 'jsonwebtoken';

type Payload = {
  id: string;
  email: string;
};

const secret = `${process.env.JWT_SECRET}`;

export const jwtAuth = {
  generate(payload: Payload): string {
    return jwt.sign(payload, secret, {
      subject: payload.id,
      issuer: 'payments-backend',
      expiresIn: '1h',
    });
  },
};
