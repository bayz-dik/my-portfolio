import assert from "node:assert/strict";
import test from "node:test";

import { getNextTabIndex } from "../app/tab-navigation.js";

test("capability tabs wrap with arrows and support Home and End", () => {
  assert.equal(getNextTabIndex("ArrowRight", 0, 4), 1);
  assert.equal(getNextTabIndex("ArrowRight", 3, 4), 0);
  assert.equal(getNextTabIndex("ArrowLeft", 0, 4), 3);
  assert.equal(getNextTabIndex("ArrowLeft", 2, 4), 1);
  assert.equal(getNextTabIndex("Home", 2, 4), 0);
  assert.equal(getNextTabIndex("End", 1, 4), 3);
  assert.equal(getNextTabIndex("Enter", 1, 4), null);
});

test("capability tab navigation safely rejects invalid groups", () => {
  assert.equal(getNextTabIndex("ArrowRight", 0, 0), null);
  assert.equal(getNextTabIndex("ArrowRight", -1, 4), null);
  assert.equal(getNextTabIndex("ArrowRight", 4, 4), null);
});
