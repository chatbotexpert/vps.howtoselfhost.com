import { db } from "@/lib/db";
import OrderClient from "./OrderClient";

export const revalidate = 0;

export default async function OrderPage() {
  const plans = await db.vpsPlan.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return <OrderClient dbPlans={plans} />;
}
