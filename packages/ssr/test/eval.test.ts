import { transform } from "../src/lib/eval.js";
import { test, describe } from "bun:test";
import assert from "node:assert/strict";

describe("evaluation", () => {
  test("preserve unary operator to the left of the expression", () => {
    const s = transform("typeof foo", "'");
    assert(s.includes("typeof $data['foo']"));
  });

  test("preserve update operator to the left of the expression", () => {
    const s = transform("++foo", "'");
    assert(s.includes("++$data['foo']"));
  });

  test("preserve update operator to the right of the expression", () => {
    const s = transform("foo--", "'");
    assert(s.includes("$data['foo']--"));
  });
});
