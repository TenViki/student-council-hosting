import { object } from "zod";

export const createOrderBy = (keys: string[], order: "asc" | "desc") =>
  keys.reverse().reduce((obj, key) => {
    return { [key]: obj };
  }, order as any);

export const formatWhereWithCustomFields = (query: string) => {
  const querySearch = JSON.parse(query);
  let customFields = [];

  const customKeys = Object.keys(querySearch).filter((key) => key.startsWith("customFields"));
  for (const key of customKeys) {
    const accessor = key.split(".").slice(1).join(".");
    const value = querySearch[key];
    const currentObject = {
      path: accessor.split("."),
    } as any;

    if (typeof value === "string") {
      currentObject.string_contains = value;
      currentObject.mode = "insensitive";
    }

    customFields.push({
      customFields: currentObject,
    });

    delete querySearch[key];
  }

  const normalQuery = formatWhereQuery(JSON.stringify(querySearch));

  const result = {
    AND: [normalQuery, ...customFields],
  };

  return result;
};

export const formatWhereQuery = (query?: string) => {
  console.log("formatWhereQuery", query);

  if (!query) return {};
  const querySearch = JSON.parse(query);

  for (const key in querySearch) {
    const value = querySearch[key];
    let currentObject = querySearch;
    let accessor = key.split(".").at(-1);

    if (!accessor) continue;

    if (key.includes(".")) {
      const split = key.split(".");
      for (const keyPart of split.slice(0, split.length - 1)) {
        if (currentObject[keyPart] === undefined) {
          currentObject[keyPart] = {};
        }
        currentObject = currentObject[keyPart];
      }

      // querySearch[key] = currentObject;
      delete querySearch[key];
    }

    console.log(querySearch, currentObject, accessor);

    // if value is array
    if (Array.isArray(value)) {
      if (value.length === 0) {
        delete currentObject[accessor];
        continue;
      }
      currentObject[accessor] = {
        in: value,
      };
      continue;
    }

    if (typeof value === "boolean") {
      currentObject[accessor] = {
        equals: value,
      };
      continue;
    }

    if (typeof value === "object") {
      if (value.type && value.type === "number") {
        if (value.operation === "isnull") {
          currentObject[accessor] = null;
        } else {
          currentObject[accessor] = {
            [value.operation]: value.value,
          };
        }
        continue;
      }
    }

    if (typeof value !== "string") continue;

    if (value === "") {
      currentObject[accessor] = null;
      continue;
    }

    if (value.startsWith(">=")) {
      currentObject[accessor] = {
        gte: value.slice(2),
      };
    } else if (value.startsWith("<=")) {
      currentObject[accessor] = {
        lte: value.slice(2),
      };
    } else if (value.startsWith(">")) {
      currentObject[accessor] = {
        gt: value.slice(1),
      };
    } else if (value.startsWith("<")) {
      currentObject[accessor] = {
        lt: value.slice(1),
      };
    } else if (value.startsWith("between")) {
      const [start, end] = value.slice(8, -1).split(",");
      currentObject[accessor] = {
        gte: start,
        lte: end,
      };
    } else {
      // implement better number check
      // if (!isNaN(+value)) {
      //   querySearch[key] = {
      //     equals: +value,
      //   };
      //   continue;
      // }

      // case insensitive like query
      currentObject[accessor] = {
        contains: value,
        mode: "insensitive",
      };
    }
  }

  console.log("--------------------");
  console.log("formatWhereQuery", JSON.stringify(querySearch));
  console.log("--------------------");

  return querySearch;
};
