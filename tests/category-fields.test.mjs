import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

test("every partnership category has its own relevant questions", async () => {
  const source = await readFile(new URL("../app/kemitraan/category-fields.ts", import.meta.url), "utf8");
  const definitions = await readFile(new URL("../app/partnership-categories.ts", import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const context = { exports: {} };
  vm.runInNewContext(js, context);
  const schemas = context.exports.categoryFields;
  const categoryValues = [...definitions.matchAll(/\{ value: "([^"]+)", slug:/g)].map((match) => match[1]);

  assert.equal(categoryValues.length, 18);
  assert.deepEqual(Object.keys(schemas).sort(), [...categoryValues].sort());
  for (const [category, fields] of Object.entries(schemas)) {
    assert.equal(fields.length, 3, category);
    assert.equal(new Set(fields.map((field) => field.key)).size, fields.length, category);
    for (const field of fields) {
      assert.match(field.key, /^[a-z_]+$/);
      assert.ok(field.label && field.placeholder, category);
    }
  }
  assert.ok(schemas.independent_veterinarian.some((field) => field.key === "species_handled"));
  assert.ok(schemas.pet_shop.some((field) => field.key === "inventory_size"));
  assert.ok(schemas.pet_hotel_daycare.some((field) => field.key === "care_requirements"));
});
