/** Validates the deliberately small, documented JSON Schema vocabulary used by this project. */
export function validateSchema(
  value,
  schema,
  definitions = schema,
  path = "$",
  errors = [],
) {
  if (schema.$ref) {
    const target = schema.$ref
      .split("/")
      .slice(1)
      .reduce((v, key) => v?.[key], definitions);
    if (!target) throw Error(`Unknown schema reference ${schema.$ref}`);
    return validateSchema(value, target, definitions, path, errors);
  }
  const error = (text) => errors.push(`${path}: ${text}`);
  const type = Array.isArray(value)
    ? "array"
    : value === null
      ? "null"
      : typeof value;
  if (schema.type && type !== schema.type) {
    error(`expected ${schema.type}`);
    return errors;
  }
  if (schema.enum && !schema.enum.includes(value)) error("value outside enum");
  if (Object.hasOwn(schema, "const") && value !== schema.const)
    error("incorrect constant");
  if (type === "string") {
    const length = [...value].length;
    if (schema.minLength && (length < schema.minLength || !value.trim()))
      error("empty or too short");
    if (schema.maxLength && length > schema.maxLength) error("too long");
    if (schema.pattern && !new RegExp(schema.pattern, "u").test(value))
      error("incorrect format");
  }
  if (type === "number") {
    if (
      !Number.isFinite(value) ||
      (schema.minimum !== undefined && value < schema.minimum) ||
      (schema.maximum !== undefined && value > schema.maximum)
    )
      error("number out of bounds");
  }
  if (type === "array") {
    if (schema.minItems !== undefined && value.length < schema.minItems)
      error("too few items");
    if (schema.maxItems !== undefined && value.length > schema.maxItems)
      error("too many items");
    if (
      schema.uniqueItems &&
      new Set(value.map((v) => JSON.stringify(v))).size !== value.length
    )
      error("duplicate items");
    value.forEach((item, i) =>
      validateSchema(item, schema.items, definitions, `${path}[${i}]`, errors),
    );
  }
  if (type === "object") {
    for (const key of schema.required ?? [])
      if (!Object.hasOwn(value, key)) error(`missing ${key}`);
    for (const [key, item] of Object.entries(value)) {
      if (schema.properties?.[key])
        validateSchema(
          item,
          schema.properties[key],
          definitions,
          `${path}.${key}`,
          errors,
        );
      else if (schema.additionalProperties === false) error(`unknown ${key}`);
    }
  }
  return errors;
}
