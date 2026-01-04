import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";

export const app = new OpenAPIHono();

// OpenAPI documentation
app.doc("/doc", {
  info: {
    title: "Agentic Boilerplate API",
    version: "1.0.0",
  },
  openapi: "3.1.0",
});

// Scalar UI
app.get("/reference", Scalar({ theme: "kepler", url: "/api/doc" }));

// Health check
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});
