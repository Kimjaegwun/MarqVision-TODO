import "@testing-library/jest-dom";
import "@/test/setup";
import { jest } from "@jest/globals";

Object.defineProperty(window, "confirm", {
  value: jest.fn(() => true),
  writable: true,
});
