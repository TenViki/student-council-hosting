"use server";

import { getAuth } from "@/lib/auth/dal";
import { createOrderBy, formatWhereQuery } from "@/lib/bulk";
import { AdminBulkDatatable } from "@/lib/def/admin";
import prisma from "@/lib/prisma";

export const bulkGetCouncils = async (params: AdminBulkDatatable) => {
  const { user } = await getAuth();
  if (!user || !user.admin) throw new Error("Unauthorized");

  const { limit, page, order, orderBy, query } = params;
  const sort = order === "ASC" ? "asc" : "desc";
  const take = limit;
  const skip = page ? (page - 1) * limit : 0;
  const orderByObject = createOrderBy(orderBy.split("."), sort);
  const where = query ? formatWhereQuery(query) : undefined;

  const count = await prisma.studentCouncil.count({
    where: where,
  });

  const users = await prisma.studentCouncil.findMany({
    orderBy: orderByObject,
    take,
    where: where,
    skip,
  });

  return {
    data: users,
    count,
  };
};