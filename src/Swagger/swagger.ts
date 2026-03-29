import swaggerJSDoc from "swagger-jsdoc";
import type { Options } from "swagger-jsdoc";


export const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Uzchess API",
      version: "1.0.0",
      description: "Uzchess darslari uchun API hujjatlari",
    },

    servers: [
      {
        url: "http://localhost:4000/api/v1",
        description: "Local server",
      },
    ],

    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "access_token",
          description: "JWT access_token cookie orqali yuboriladi",
        },
      },
    },

    security: [
      {
        cookieAuth: [],
      },
    ],
  },

  apis: ["./src/features/**/*.ts"],
};


export const swaggerSpec = swaggerJSDoc(options);
