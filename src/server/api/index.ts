import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";

export const app = new OpenAPIHono();

// OpenAPI documentation
app.doc("/doc", {
  openapi: "3.1.0",
  info: {
    title: "Agentic Boilerplate API",
    version: "1.0.0",
  },
});

// Scalar UI
app.get("/reference", Scalar({ url: "/api/doc", theme: "kepler" }));

// Health check
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});
